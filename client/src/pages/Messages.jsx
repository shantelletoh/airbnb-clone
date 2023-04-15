import { useContext, useEffect, useRef, useState } from "react";
import Avatar from "./Avatar";
import Logo from "./Logo";
import { uniqBy } from "lodash";
import { UserContext } from "../UserContext";
import axios from "axios";

export default function Messages() {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessageText, setNewMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const { user } = useContext(UserContext);
  const divUnderMessages = useRef();

  useEffect(() => {
    connectToWs();
  }, [selectedUserId]);

  function connectToWs() {
    const ws = new WebSocket("ws://localhost:5000");
    setWs(ws);
    // things that should happen when we receive a message
    ws.addEventListener("message", handleMessage);
    ws.addEventListener("close", () => {
      setTimeout(() => {
        console.log("Disconnected. Trying to connect.");
        connectToWs(); // auto-reconnect
      }, 1000);
    });
  }

  function showOnlinePeople(peopleArray) {
    // get unique connections since one client can make multiple connections (reload, etc)
    const people = {};
    peopleArray.forEach(({ id, email }) => {
      people[id] = email;
    });
    // console.log(people);
    setOnlinePeople(people);
  }

  function handleMessage(e) {
    const messageData = JSON.parse(e.data);
    // console.log({ e, messageData });
    if ("online" in messageData) {
      showOnlinePeople(messageData.online);
    } else if ("text" in messageData) {
      // console.log("sender: ");
      // console.log(user._id);
      // display messages sent by other user
      setMessages((prev) => [...prev, { ...messageData }]);
    }
    // e.data.text().then((messageString) => {
    //   console.log(messageString);
    // });
  }

  // const onlinePeopleExcludingOurUser = onlinePeople.filter(p => p.username !== username) // can't use filter b/c it's an object, not array
  const onlinePeopleExclOurUser = { ...onlinePeople }; // make a copy of onlinePeople object
  delete onlinePeopleExclOurUser[user._id]; // delete our id from the array

  const messagesWithoutDuplicates = uniqBy(messages, "_id");

  // send message in real time via WebSockets
  function sendMessage(e) {
    e.preventDefault();
    ws.send(
      JSON.stringify({
        recipient: selectedUserId,
        text: newMessageText,
      })
    );
    setNewMessageText("");

    // display messages sent by our user
    setMessages((prev) => [
      ...prev,
      {
        text: newMessageText,
        sender: user._id,
        recipient: selectedUserId,
        _id: Date.now(),
      },
    ]);
  }

  // auto scroll the conversation window
  useEffect(() => {
    const div = divUnderMessages.current;
    if (div) {
      div.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  useEffect(() => {
    if (selectedUserId) {
      axios.get("/messages/" + selectedUserId).then((res) => {
        setMessages(res.data);
      });
    }
  }, [selectedUserId]);

  return (
    <div className="flex h-screen">
      <div className="bg-white w-1/3">
        <Logo />
        {Object.keys(onlinePeopleExclOurUser).map((userId) => (
          <div
            onClick={() => {
              setSelectedUserId(userId);
              // console.log(userId);
            }}
            className={
              "border-b border-gray-100 flex items-center gap-2 cursor-pointer " +
              (userId === selectedUserId ? "bg-blue-50" : "")
            }
          >
            {/* blue bar on left of selected user*/}
            {userId === selectedUserId && (
              <div className="w-1 bg-blue-500 h-12 rounded-r-md"></div>
            )}
            {/* avatar and username */}
            <div className="flex gap-2 py-2 pl-4 items-center">
              <Avatar username={onlinePeople[userId]} userId={userId} />
              <span className="text-gray-800">{onlinePeople[userId]}</span>
            </div>
          </div>
        ))}
      </div>

      {/* if no user is selected, display message to select a user*/}
      <div className="flex flex-col bg-blue-50 w-2/3 p-2">
        <div className="flex-grow">
          {!selectedUserId && (
            <div className="flex h-full flex-grow items-center justify-center">
              <div className="text-gray-400">
                &larr; Select a person from the sidebar
              </div>
            </div>
          )}

          {/* display all messages if a user is selected*/}
          {!!selectedUserId && (
            <div className="relative h-full">
              <div className="overflow-y-scroll absolute top-0 left-0 right-0 bottom-2">
                {messagesWithoutDuplicates.map((message) => (
                  <div
                    key={message._id}
                    className={
                      message.sender === user._id ? "text-right" : "text-left"
                    }
                  >
                    <div
                      className={
                        "text-left inline-block p-2 my-2 rounded-sm text-md " +
                        (message.sender === user._id
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-500")
                      }
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
                <div ref={divUnderMessages}></div>
              </div>
            </div>
          )}
        </div>

        {/* display send message form if a user is selected*/}
        {!!selectedUserId && (
          <form className="flex gap-2" onSubmit={sendMessage}>
            <input
              type="text"
              value={newMessageText}
              onChange={(e) => setNewMessageText(e.target.value)}
              placeholder="Type your message here"
              className="bg-white flex-grow border rounded-sm p-2"
            />
            <button
              type="submit"
              className="bg-blue-500 p-2 text-white rounded-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

import { useContext, useEffect, useRef, useState } from "react";
import Avatar from "./Avatar";
import Logo from "./Logo";
import { uniqBy } from "lodash";
import { UserContext } from "../../UserContext";
import axios from "axios";
import Contact from "./Contact";

export default function Messages() {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [offlinePeople, setOfflinePeople] = useState({});
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
      if (messageData.sender === selectedUserId) {
        // display messages sent by other user
        setMessages((prev) => [...prev, { ...messageData }]);
      }
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
  function sendMessage(e, file = null) {
    if (e) e.preventDefault();
    ws.send(
      JSON.stringify({
        recipient: selectedUserId,
        text: newMessageText,
        file,
      })
    );
    setNewMessageText("");

    if (file) {
      // need to reload messages if send file b/c latest message has url of the file
      axios.get("/messages/" + selectedUserId).then((res) => {
        setMessages(res.data);
      });
    } else {
      // display messages sent by our user
      setMessages((prev) => [
        ...prev,
        {
          text: newMessageText,
          sender: user._id,
          recipient: selectedUserId,
          _id: Date.now(), // give a sender id
        },
      ]);
    }
  }

  function sendFile(e) {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]); // return base 64 data, not binary data
    reader.onload = () => {
      sendMessage(null, {
        name: e.target.files[0].name,
        data: reader.result,
      });
    };
  }

  // auto scroll the conversation window
  useEffect(() => {
    const div = divUnderMessages.current;
    if (div) {
      div.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  // get offline people
  // this func runs every time onlinePeople changes, which changes every time we open the app
  useEffect(() => {
    axios.get("/people").then((res) => {
      const offlinePeopleArr = res.data
        .filter((p) => p._id !== user._id) // exclude our own user
        .filter((p) => !Object.keys(onlinePeople).includes(p._id)); // exclude ids of onlinePeople
      // .filter((p) => onlinePeople.map((op) => op._id).includes(p._id)); // can't do this b/c onlinePeople is an object

      // convert offlinePeopleArr to offlinePeople object (just to make it an object like onlinePeople)
      const offlinePeople = {};
      offlinePeopleArr.forEach((p) => {
        offlinePeople[p._id] = p;
      });
      // console.log({ offlinePeople, offlinePeopleArr });
      setOfflinePeople(offlinePeople);
    });
  }, [onlinePeople]);

  useEffect(() => {
    if (selectedUserId) {
      axios.get("/messages/" + selectedUserId).then((res) => {
        setMessages(res.data);
      });
    }
  }, [selectedUserId]);

  return (
    <div className="flex h-[85vh] mt-5">
      <div className="bg-white w-1/3 flex flex-col">
        <div className="flex-grow">
          <Logo />

          {/* display online contacts */}
          {Object.keys(onlinePeopleExclOurUser).map((userId) => (
            <Contact
              key={userId}
              id={userId}
              online={true}
              username={onlinePeopleExclOurUser[userId]}
              onClick={() => setSelectedUserId(userId)}
              selected={userId === selectedUserId}
            />
          ))}

          {/* display offline contacts */}
          {Object.keys(offlinePeople).map((userId) => (
            <Contact
              key={userId}
              id={userId}
              online={false}
              username={offlinePeople[userId].name} // offlinePeople[userId] is the full object so need to add .username
              onClick={() => setSelectedUserId(userId)}
              selected={userId === selectedUserId}
            />
          ))}
        </div>
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
                      {message.file && (
                        <div>
                          <a
                            target="_blank" // open link in new tab
                            className="flex items-center gap-1 border-b"
                            href={
                              axios.defaults.baseURL +
                              "/uploads/" +
                              message.file
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-4 h-4"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.94 10.94a3.75 3.75 0 105.304 5.303l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a5.25 5.25 0 11-7.424-7.424l10.939-10.94a3.75 3.75 0 115.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 015.91 15.66l7.81-7.81a.75.75 0 011.061 1.06l-7.81 7.81a.75.75 0 001.054 1.068L18.97 6.84a2.25 2.25 0 000-3.182z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {message.file}
                          </a>
                        </div>
                      )}
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

            {/* upload attachment */}
            <label className="bg-blue-200 p-2 text-gray-600 cursor-pointer rounded-sm border border-blue-200">
              <input type="file" className="hidden" onChange={sendFile} />
              <div className="mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.94 10.94a3.75 3.75 0 105.304 5.303l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a5.25 5.25 0 11-7.424-7.424l10.939-10.94a3.75 3.75 0 115.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 015.91 15.66l7.81-7.81a.75.75 0 011.061 1.06l-7.81 7.81a.75.75 0 001.054 1.068L18.97 6.84a2.25 2.25 0 000-3.182z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </label>

            {/* send message */}
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

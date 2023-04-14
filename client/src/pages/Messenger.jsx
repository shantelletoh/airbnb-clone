import { useContext, useEffect, useState } from "react";
import Avatar from "./Avatar";
import Logo from "./Logo";
import { UserContext } from "../UserContext";
import { Navigate } from "react-router-dom";

export default function Messenger() {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [redirect, setRedirect] = useState(null);
  const { ready, user } = useContext(UserContext);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5000");
    setWs(ws);
    // things that should happen when we receive a message
    ws.addEventListener("message", handleMessage);
  }, []);

  if (!ready) {
    return "Loading...";
  }

  if (ready && !user && !redirect) {
    return <Navigate to={"/login"} />;
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  function showOnlinePeople(peopleArray) {
    // get unique connections since one client can make multiple connections (reload, etc)
    const people = {};
    peopleArray.forEach(({ id, email }) => {
      people[id] = email;
    });
    console.log(people);
    setOnlinePeople(people);
  }

  function handleMessage(e) {
    const messageData = JSON.parse(e.data);
    console.log(messageData);
    if ("online" in messageData) {
      showOnlinePeople(messageData.online);
    }
    // e.data.text().then((messageString) => {
    //   console.log(messageString);
    // });
  }

  // const onlinePeopleExcludingOurUser = onlinePeople.filter(p => p.username !== username) // can't use filter b/c it's an object, not array
  const onlinePeopleExclOurUser = { ...onlinePeople }; // make a copy of onlinePeople object
  delete onlinePeopleExclOurUser[user._id]; // delete our id from the array

  return (
    <div className="flex h-screen">
      <div className="bg-white w-1/3">
        <Logo />
        {Object.keys(onlinePeopleExclOurUser).map((userId) => (
          <div
            onClick={() => {
              setSelectedUserId(userId);
              console.log(userId);
            }}
            className={
              "border-b border-gray-100 py-2 pl-4 flex items-center gap-2 cursor-pointer " +
              (userId === selectedUserId ? "bg-blue-50" : "")
            }
          >
            <Avatar username={onlinePeople[userId]} userId={userId} />
            <span className="text-gray-800">{onlinePeople[userId]}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col bg-blue-50 w-2/3 p-2">
        <div className="flex-grow">messages with selected person</div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type your message here"
            className="bg-white flex-grow border rounded-sm p-2"
          />
          <button className="bg-blue-500 p-2 text-white rounded-sm">
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
        </div>
      </div>
    </div>
  );
}

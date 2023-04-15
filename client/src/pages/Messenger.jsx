import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { Navigate } from "react-router-dom";
import Messages from "./Messages";

export default function Messenger() {
  const [redirect, setRedirect] = useState(null);
  const { ready, user } = useContext(UserContext);

  if (!ready) {
    return "Loading...";
  }

  if (ready && !user && !redirect) {
    return <Navigate to={"/login"} />;
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div>
      <Messages />
    </div>
  );
}

import React, { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";

function App() {
  const [user, setUser] = useState(null);

  if (!user) {
    return (
      <>
        <Login setUser={setUser} />
        <Register />
      </>
    );
  }

  return <Dashboard user={user} />;
}

export default App;
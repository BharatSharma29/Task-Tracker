import React, { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";

function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  if (!user) {
    return showRegister ? (
      <Register goToLogin={() => setShowRegister(false)} />
    ) : (
      <Login setUser={setUser} goToRegister={() => setShowRegister(true)} />
    );
  }

  return <Dashboard user={user} />;
}

export default App;
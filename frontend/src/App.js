import { useState } from "react";
import GoogleAuth from "./components/GoogleAuth";
import Dashboard from "./components/Dashboard";

function App() {
  const [user, setUser] = useState(null);

  return (
    <div className="App">
      {user ? <Dashboard user={user} /> : <GoogleAuth setUser={setUser} />}
    </div>
  );
}

export default App;

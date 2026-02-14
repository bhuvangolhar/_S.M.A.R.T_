import { useState } from "react";
import LoginPage from "./LoginPage";

const App: React.FC = () => {
  const [showLogin, setShowLogin] = useState(false);

  if (showLogin) {
    return <LoginPage onBack={() => setShowLogin(false)} />;
  }

  return (
    <div className="app">
      <h1>SMART 🤖</h1>
      <p>School Monitoring with AI for Real-time Tasks</p>

      <div className="smart-box">
        AI-powered school monitoring features will appear here
      </div>

      <button onClick={() => setShowLogin(true)}>Launch System</button>
    </div>
  );
};

export default App;

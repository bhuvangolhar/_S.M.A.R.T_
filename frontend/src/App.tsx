import { useState } from "react";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";

type PageType = "home" | "login" | "signup";

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>("home");

  if (currentPage === "login") {
    return (
      <LoginPage 
        onBack={() => setCurrentPage("home")}
        onGoToSignup={() => setCurrentPage("signup")}
      />
    );
  }

  if (currentPage === "signup") {
    return (
      <SignupPage 
        onBack={() => setCurrentPage("home")}
        onGoToLogin={() => setCurrentPage("login")}
      />
    );
  }

  return (
    <div className="app">
      <h1>SMART 🤖</h1>
      <p>School Monitoring with AI for Real-time Tasks</p>

      <div className="smart-box">
        AI-powered school monitoring features will appear here
      </div>

      <button onClick={() => setCurrentPage("login")}>Launch System</button>
    </div>
  );
};

export default App;

import { useState, useEffect } from "react";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import WelcomePage from "./WelcomePage";
import Dashboard from "./Dashboard";
import StudentModule from "./StudentModule";
import TeacherModule from "./TeacherModule";
import ClassModule from "./ClassModule";
import SubjectModule from "./SubjectModule";

type PageType = "home" | "login" | "signup" | "welcome" | "dashboard" | "students" | "teachers" | "classes" | "subjects" | "attendance" | "reports" | "settings";

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>("home");

  // Check for existing user session on app load
  useEffect(() => {
    const userSession = localStorage.getItem("userSession");
    const savedData = localStorage.getItem("userSignupData");
    
    console.log("🔄 App loaded - checking session...");
    console.log("📦 Session:", userSession);
    console.log("📦 Account data:", savedData);
    
    if (userSession && savedData) {
      const session = JSON.parse(userSession);
      if (session.loggedIn) {
        console.log("✅ User session found, restoring...");
        setCurrentPage("welcome");
      }
    }
  }, []);

  if (currentPage === "login") {
    return (
      <LoginPage 
        onBack={() => setCurrentPage("home")}
        onGoToSignup={() => setCurrentPage("signup")}
        onLoginSuccess={() => setCurrentPage("welcome")}
      />
    );
  }

  if (currentPage === "signup") {
    return (
      <SignupPage 
        onBack={() => setCurrentPage("home")}
        onGoToLogin={() => setCurrentPage("login")}
        onSignupSuccess={() => setCurrentPage("welcome")}
      />
    );
  }

  if (currentPage === "welcome") {
    return (
      <WelcomePage 
        onLogout={() => setCurrentPage("home")}
        onContinueToDashboard={() => setCurrentPage("dashboard")}
      />
    );
  }

  if (currentPage === "dashboard") {
    return (
      <Dashboard 
        onLogout={() => setCurrentPage("home")}
        onNavigate={(module) => setCurrentPage(module as PageType)}
      />
    );
  }

  if (currentPage === "students") {
    return (
      <StudentModule 
        onBack={() => setCurrentPage("dashboard")}
      />
    );
  }

  if (currentPage === "teachers") {
    return (
      <TeacherModule 
        onBack={() => setCurrentPage("dashboard")}
      />
    );
  }

  if (currentPage === "classes") {
    return (
      <ClassModule 
        onBack={() => setCurrentPage("dashboard")}
      />
    );
  }

  if (currentPage === "subjects") {
    return (
      <SubjectModule 
        onBack={() => setCurrentPage("dashboard")}
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

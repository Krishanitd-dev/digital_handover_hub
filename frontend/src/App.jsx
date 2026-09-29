import { useState } from "react";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import MyProjects from "./pages/myprojects";

function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState("dashboard");

  const handleLogin = (userData) => {
   setUser(userData);
  }; 
  const handleLogout = () => {
  setUser(null);
  setCurrentPage("dashboard");
};

  
  if (!user) {
    return <Login onLogin={handleLogin} />;
}
 return ( 
 <>
 {currentPage=== "dashboard" && (
  <Dashboard
      user={user}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      onLogout={handleLogout}
  />
 )}

  {currentPage === "myprojects" && (
  <MyProjects
    user={user}
    currentPage={currentPage}
    setCurrentPage={setCurrentPage}
    onLogout={handleLogout}
  />

      )}
    </>
  );
}
export default App;
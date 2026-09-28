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
  />
 )}

  {currentPage === "myprojects" && (
        <MyProjects />

      )}
    </>
  );
}
export default App;
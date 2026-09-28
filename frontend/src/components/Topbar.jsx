import "./components.css";

function Topbar({ user }) {
  return (
    <header className="topbar">

      <div className="topbar-title">Dashboard
      </div>
      <div className="topbar-user">{user?.displayName}
      </div>
    </header>
  );
}

export default Topbar;
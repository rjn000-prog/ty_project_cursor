import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./layout.css";

const ClubsLayout = () => {
  return (
    <div className="app-with-sidebar">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default ClubsLayout;

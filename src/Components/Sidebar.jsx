
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="bg-light border-end p-3" style={{ minHeight: "100vh" }}>
      <h5 className="mb-4">Dashboard</h5>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link className="nav-link" to="/leads">Leads</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/sales">Sales</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/sales-agents">Agents</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/reports">Reports</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/settings">Settings</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;

import { Link } from "react-router-dom";
import SalesAgentForm from "../Components/SalesAgentForm";
import { useState } from "react";
import { useAgentContext } from "../Contexts/AgentContext";
import Modal from "../Components/Modal"

const SalesAgentManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const { agents, loading, fetchAgents } = useAgentContext(); 

  return (
    <>
        <header className="bg-primary text-light text-center p-3 sticky-top">
        <h1>Sales Agent Management</h1>
      </header>

      <main>
         <div className="d-flex" style={{ minHeight: "100vh" }}>
  <aside
    className="bg-light p-3 border-end"
    style={{
      width: "200px",
      minWidth: "200px",
      flexShrink: 0,
    }}
  >
 <p>
  <i className="bi bi-arrow-left me-2"></i>
              <Link className="nav-link" to="/">Back to Dashboard</Link>
 </p>
  </aside>

        <div className="flex-grow-1 p-3 bg-light">
          <div className="container-fluid">
            <div className="mb-3 p-3 bg-white rounded shadow-sm border text-start">
              <h5 className="mb-3">Sales Agent List</h5>

              {loading ? (
                <div className=".py-5">
                <span >Loading...</span>
                </div>
              ) : (
                <>
                  {agents.length === 0 ? (
                    <p>No agents found.</p>
                  ) : (
                    <ul className="list-group mb-3">
                      {agents.map((agent) => (
                        <li key={agent._id} className="list-group-item">
                          <Link to={`/sales-agents/${agent._id}`} className="text-decoration-none text-dark">
      <strong>{agent.name}</strong> – {agent.email}
    </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}

              <button onClick={() => setShowForm(true)} className="btn btn-primary">
                + Add New Agent
              </button>

              {showForm && (
                <Modal title="Add Sales Agent" onClose={() => setShowForm(false)}>
                  <SalesAgentForm
                    onClose={() => setShowForm(false)}
                  />
                </Modal>
              )}
            </div>
          </div>
        </div>
        </div>
      </main>
    </>
  );
};

export default SalesAgentManagement;

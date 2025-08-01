import { Link } from "react-router-dom";
import Modal from "../Components/Modal";
import SalesAgentForm from "../Components/SalesAgentForm";
import { useState } from "react";
import { useAgentContext } from "../Contexts/AgentContext";

const SalesAgentManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const { agents, loading, fetchAgents } = useAgentContext(); 

  return (
    <>
      <header className="bg-primary text-light p-3 sticky-top">
        <h1 className="fs-4">Sales Agent Management</h1>
      </header>

      <main className="d-flex" style={{ height: "calc(100vh - 56px)" }}>
        {/* Sidebar */}
        <div className="bg-light p-3 border-end" style={{ width: "250px" }}>
          <p className="nav-item">
            <i className="bi bi-arrow-left me-2"></i>
            <Link className="nav-link" to="/">Back to Dashboard</Link>
          </p>
        </div>

        {/* Content */}
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
                          <strong>{agent.name}</strong> – {agent.email}
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
      </main>
    </>
  );
};

export default SalesAgentManagement;

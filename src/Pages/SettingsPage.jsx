import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useLeadContext } from "../contexts/LeadContext";
import { useAgentContext } from "../contexts/AgentContext";
import { toast } from "react-toastify";

const BASE_URL = "https://anvaya-backend-nine.vercel.app";

export default function SettingsPage() {
  const { allLeads, fetchAllLeads } = useLeadContext();
  const { agents, fetchAgents } = useAgentContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllLeads();
    fetchAgents();
  }, []);

  const handleDeleteLead = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this lead?");
    if (!confirmDelete) return;

    try {
      setLoading(true);
      await axios.delete(`${BASE_URL}/leads/${id}`);
      toast.success("Lead deleted successfully");
      fetchAllLeads();
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to delete lead";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAgent = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this sales agent?");
    if (!confirmDelete) return;

    try {
      setLoading(true);
      await axios.delete(`${BASE_URL}/sales-agents/${id}`);
      toast.success("Sales agent deleted successfully");
      fetchAgents();
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to delete agent";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="bg-primary text-light text-center p-3 sticky-top">
        <h1>Settings</h1>
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

          <div className="flex-grow-1 overflow-auto p-4 bg-light">
            <div className="container-fluid">

              <div className="accordion" id="settingsAccordion">
                {/* Leads Accordion */}
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingLeads">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseLeads"
                      aria-expanded="false"
                      aria-controls="collapseLeads"
                    >
                      Delete Leads
                    </button>
                  </h2>
                  <div
                    id="collapseLeads"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingLeads"
                    data-bs-parent="#settingsAccordion"
                  >
                    <div className="accordion-body">
                      {loading && <p className="text-muted">Processing...</p>}
                      <ul className="list-group">
                        {Array.isArray(allLeads) && allLeads.map((lead) => (
                          <li
                            key={lead._id}
                            className="list-group-item d-flex justify-content-between align-items-center"
                          >
                            <span>{lead.name}</span>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeleteLead(lead._id)}
                            >
                              Delete
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Sales Agents Accordion */}
                <div className="accordion-item mt-3">
                  <h2 className="accordion-header" id="headingAgents">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseAgents"
                      aria-expanded="false"
                      aria-controls="collapseAgents"
                    >
                      Delete Sales Agents
                    </button>
                  </h2>
                  <div
                    id="collapseAgents"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingAgents"
                    data-bs-parent="#settingsAccordion"
                  >
                    <div className="accordion-body">
                      <ul className="list-group">
                        {Array.isArray(agents) && agents.map((agent) => (
                          <li
                            key={agent._id}
                            className="list-group-item d-flex justify-content-between align-items-center"
                          >
                            <span>{agent.name}</span>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeleteAgent(agent._id)}
                            >
                              Delete
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </>
  );
}

import { useLeadContext } from "../Contexts/LeadContext";
import { useAgentContext } from "../Contexts/AgentContext";
import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Modal from "../Components/Modal";
import LeadForm from "../Components/LeadForm";

export default function LeadList() {
  const { filteredLeads, fetchFilteredLeads, loading, statusOptions } = useLeadContext();
  const { agentOptions } = useAgentContext();

  const [searchParams, setSearchParams] = useSearchParams();

  const statusFilter = searchParams.get("status") || "";
  const agentFilter = searchParams.get("agent") || "";
  const sortOption = searchParams.get("sort") || "";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");

  const navigate = useNavigate();

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const resetFilters = () => {
    setSearchParams({});
  };


  useEffect(() => {
    const filters = {};
    if (statusFilter) filters.status = statusFilter;
    if (agentFilter) filters.agent = agentFilter;

    if (statusFilter || agentFilter) {
      fetchFilteredLeads(filters);
    } else {
      fetchFilteredLeads(); 
    }
  }, [statusFilter, agentFilter]);

  
  const displayLeads = useMemo(() => {
    let leads = [...filteredLeads];
    if (agentFilter) {
  leads = leads.filter((l) =>
    Array.isArray(l.salesAgent)
      ? l.salesAgent.some((agent) => agent._id === agentFilter)
      : l.salesAgent?._id === agentFilter
  );
}


     if (sortOption === "priority") {
    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    leads.sort(
      (a, b) => (priorityOrder[a.priority] || 99) - (priorityOrder[b.priority] || 99)
    );
  } else if (sortOption === "timeToClose") {
      leads.sort((a, b) => a.timeToClose - b.timeToClose);
    }

    return leads;
  }, [filteredLeads, sortOption]);

  return (
    <>
      <header className="bg-primary text-light text-center p-3 sticky-top">
        <h1>Lead List</h1>
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

          <div className="flex-grow-1 p-4 overflow-auto bg-light">
            <div className="container-fluid">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex gap-3 flex-wrap">
                  <select
                    className="form-select w-auto"
                    value={statusFilter}
                    onChange={(e) => updateFilter("status", e.target.value)}
                  >
                    <option value="">Filter by Status</option>
                    {statusOptions?.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>

                  <select
                    className="form-select w-auto"
                    value={agentFilter}
                    onChange={(e) => updateFilter("agent", e.target.value)}
                  >
                    <option value="">Filter by Sales Agent</option>
                    {agentOptions?.map((agent) => (
                      <option key={agent.value} value={agent.value}>
                        {agent.label}
                      </option>
                    ))}
                  </select>

                  <select
                    className="form-select w-auto"
                    value={sortOption}
                    onChange={(e) => updateFilter("sort", e.target.value)}
                  >
                    <option value="">Sort By</option>
                    <option value="priority">Priority</option>
                    <option value="timeToClose">Time to Close(Ascending)</option>
                  </select>

                  <button
                    className="btn btn-outline-secondary"
                    onClick={resetFilters}
                  >
                    Reset Filters
                  </button>
                </div>

                <button
                  className="btn btn-success"
                  onClick={() => {
                    setModalMode("add");
                    setIsModalOpen(true);
                  }}
                >
                  Add New Lead
                </button>
              </div>

              <div className="bg-white p-3 rounded shadow-sm border">
                <h3>Lead Overview</h3>
                {loading ? (
                  <div className="text-center my-4">
                    <span>Loading Leads...</span>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Name</th>
                          <th>Status</th>
                          <th>Priority</th>
                          <th>Sales Agent</th>
                          <th>Time to Close</th>
                          <th>Tags</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayLeads.map((lead) => (
                          <tr
                            key={lead._id}
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate(`/lead/${lead._id}`)}
                          >
                            <td>{lead.name}</td>
                            <td>
                              <span className="badge bg-info text-dark">{lead.status}</span>
                            </td>
                            <td>
                              <span className={
                                lead.priority === "High"
                                  ? "badge bg-danger"
                                  : lead.priority === "Medium"
                                  ? "badge bg-warning text-dark"
                                  : "badge bg-success"
                              }>
                                {lead.priority}
                              </span>
                            </td>
                            <td>
                              {Array.isArray(lead.salesAgent) && lead.salesAgent.length > 0
                                ? lead.salesAgent.map((agent) => agent.name).join(", ")
                                : "Unassigned"}
                            </td>
                            <td>{lead.timeToClose} days</td>
                            <td>
                              {lead.tags?.map((tag, index) => (
                                <span key={index} className="badge bg-secondary me-1">
                                  {tag}
                                </span>
                              ))}
                            </td>
                          </tr>
                        ))}
                        {displayLeads.length === 0 && (
                          <tr>
                            <td colSpan="6" className="text-center text-muted">
                              No leads found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {isModalOpen && (
        <Modal title="Add New Lead" onClose={() => setIsModalOpen(false)}>
          <LeadForm
            mode={modalMode}
            initialValues={null}
            onClose={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </>
  );
}

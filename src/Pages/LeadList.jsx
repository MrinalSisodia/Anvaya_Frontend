import { useLeadContext } from "../Contexts/LeadContext";
import { useAgentContext } from "../Contexts/AgentContext";
import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Modal from "../Components/Modal";
import LeadForm from "../Components/LeadForm";

export default function LeadList() {
  const { allLeads, loading, statusOptions } = useLeadContext();
  const {agentOptions} = useAgentContext();
  const [statusFilter, setStatusFilter] = useState("");
  const [agentFilter, setAgentFilter] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");

  const navigate = useNavigate();

  const filteredLeads = useMemo(() => {
  let leads = [...allLeads];

  if (statusFilter) {
    leads = leads.filter((lead) => lead.status === statusFilter);
  }

if (agentFilter) {
  leads = leads.filter((lead) =>
    lead.salesAgent?.some((agent) => agent._id === agentFilter)
  );
}


  if (sortOption === "priority") {
    leads.sort((a, b) => a.priority.localeCompare(b.priority));
  } else if (sortOption === "timeToClose") {
    leads.sort((a, b) => a.timeToClose - b.timeToClose);
  }

  return leads;
}, [allLeads, statusFilter, agentFilter, sortOption]);



  return (
    <>
      <header className="bg-primary text-light text-center p-3 sticky-top">
        <h1>Lead List</h1>
      </header>
      <main>
        <div className="d-flex" style={{ height: "100%" }}>
       
          <div className="bg-light p-3 border-end" style={{ width: "250px" }}>
            <p className="nav-item">
                 <i className="bi bi-arrow-left me-2"></i>
              <Link className="nav-link" to="/">Back to Dashboard</Link>
            </p>
          </div>

       
          <div className="flex-grow-1 p-4 overflow-auto bg-light">
            <div className="container-fluid">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex gap-3">
                  <select
  className="form-select w-auto"
  value={statusFilter}
  onChange={(e) => setStatusFilter(e.target.value)}
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
  onChange={(e) => setAgentFilter(e.target.value)}
>
  <option value="">Filter by Sales Agent</option>
 {agentOptions?.map((agent) => (
  <option key={agent.value} value={agent.value}>
    {agent.label}
  </option>
))}
</select>


                  <select
                    className="form-select"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="">Sort By</option>
                    <option value="priority">Priority</option>
                    <option value="timeToClose">Time to Close</option>
                  </select>
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
  {loading ? (<div className="text-center my-4">
   <span >Loading Leads...</span>
    </div>)  :
 ( <div className="table-responsive">
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
        {filteredLeads?.map((lead) => (
          <tr
            key={lead._id}
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/leads/${lead._id}`)}
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
  {lead.salesAgent?.length > 0
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
        {filteredLeads.length === 0 && (
          <tr>
            <td colSpan="6" className="text-center text-muted">
              No leads found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>)}
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

import { useParams, Link } from "react-router-dom";
import { useAgentContext } from "../Contexts/AgentContext";
import { useLeadContext } from "../Contexts/LeadContext";
import { useMemo, useState } from "react";

const SalesAgentView = () => {
  const { agentId } = useParams();
  const { agents, loading: agentLoading } = useAgentContext();
  const {
    getLeadsByAgent,
    loading: leadLoading,
    statusOptions,
  } = useLeadContext();

  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const agent = useMemo(
    () => agents.find((a) => String(a._id) === String(agentId)),
    [agents, agentId]
  );

  const filteredAndSortedLeads = useMemo(() => {
    let leads = getLeadsByAgent(agentId) || [];

    if (statusFilter) {
      leads = leads.filter((lead) => lead.status === statusFilter);
    }

    if (priorityFilter) {
      leads = leads.filter((lead) => lead.priority === priorityFilter);
    }

    leads.sort((a, b) => {
      const timeA = a.timeToClose || Infinity;
      const timeB = b.timeToClose || Infinity;
      return sortOrder === "asc" ? timeA - timeB : timeB - timeA;
    });

    return leads;
  }, [getLeadsByAgent, agentId, statusFilter, priorityFilter, sortOrder]);

  return (
    <>
      <header className="bg-primary text-light text-center p-3 sticky-top">
        <h1>Sales Agent View</h1>
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

          {/* Content */}
          <div className="flex-grow-1 p-4 overflow-auto bg-light">
            <div className="container-fluid">
              <div className="bg-white rounded shadow-sm p-4 border">
                {/* Agent Info */}
                {agentLoading ? (
                  <p>Loading agent data...</p>
                ) : !agent ? (
                  <p className="text-danger">Sales agent not found.</p>
                ) : (
                  <>
                    <h4 className="mb-1">Sales Agent: {agent.name}</h4>
                    <p className="text-muted mb-4">{agent.email}</p>
                  </>
                )}

                {/* Filters & Sorting */}
                <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
                  <div>
                    <label className="form-label mb-1">Filter by Status:</label>
                    <select
                      className="form-select"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="">All</option>
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label mb-1">Filter by Priority:</label>
                    <select
                      className="form-select"
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                    >
                      <option value="">All</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label mb-1">Sort by Time to Close:</label>
                    <select
                      className="form-select"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                    >
                      <option value="asc">Ascending</option>
                      <option value="desc">Descending</option>
                    </select>
                  </div>
                </div>

                {/* Lead List */}
                {leadLoading ? (
                  <p>Loading leads...</p>
                ) : filteredAndSortedLeads.length === 0 ? (
                  <p>No matching leads for this agent.</p>
                ) : (
                  <ul className="list-group">
                    {/* Header Row */}
<li className="list-group-item d-flex fw-bold bg-light">
  <div className="col-4">Lead Name</div>
  <div className="col-2">Priority</div>
  <div className="col-2">Time to Close</div>
  <div className="col-2">Status</div>
  
</li>


                   {filteredAndSortedLeads.map((lead) => (
  <li
    key={lead._id}
    className="list-group-item d-flex align-items-center justify-content-between"
  >
    <div className="col-4">{lead.name}</div>
    <div className="col-2">{lead.priority || "N/A"}</div>
    <div className="col-2">{lead.timeToClose ?? "N/A"} days</div>
    <div className="col-2">
      <span className="badge bg-secondary">
        {lead.status || "Unknown"}
      </span>
    </div>
    <div className="col-2 text-end">
      <Link to={`/lead/${lead._id}`} className="btn btn-outline-primary btn-sm">
        Manage
      </Link>
    </div>
  </li>
))}

                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default SalesAgentView;

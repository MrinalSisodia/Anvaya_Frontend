import { Link, useSearchParams } from "react-router-dom";
import { useLeadContext } from "../Contexts/LeadContext";
import { useAgentContext } from "../Contexts/AgentContext";

import { useState, useMemo } from "react";

export default function LeadsByStatus() {
  const { allLeads, statusOptions } = useLeadContext();
  const { agentOptions } = useAgentContext();

  const [searchParams, setSearchParams] = useSearchParams();
  

  // Get URL-based filters
  const agentFilter = searchParams.get("agent") || "";
  const priorityFilter = searchParams.get("priority") || "";
  const sort = searchParams.get("sort") || "none";

  // Extract all agents and priorities

  const allPriorities = useMemo(() => {
    return Array.from(new Set(allLeads.map((lead) => lead.priority).filter(Boolean)));
  }, [allLeads]);

  const filterAndSortLeads = (leads) => {
    let filtered = leads;

   if (agentFilter) {
  filtered = filtered.filter((l) =>
    Array.isArray(l.salesAgent)
      ? l.salesAgent.some((agent) => agent._id === agentFilter)
      : l.salesAgent?._id === agentFilter
  );
}

    if (priorityFilter) {
      filtered = filtered.filter((l) => l.priority === priorityFilter);
    }

    if (sort === "timeToClose") {
      filtered = filtered.slice().sort((a, b) => (a.timeToClose || Infinity) - (b.timeToClose || Infinity));
    }

    return filtered;
  };

  const handleParamChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  return (
    <>
      <header className="bg-primary text-light text-center p-3 sticky-top">
        <h1>Lead List by Status</h1>
      </header>

      <main>
        <div className="d-flex" style={{ height: "100%" }}>
          <div className="bg-light p-3 border-end" style={{ width: "250px" }}>
            <p className="nav-item">
              <i className="bi bi-arrow-left me-2"></i>
              <Link className="nav-link" to="/">
                Back to Dashboard
              </Link>
            </p>
          </div>

          <div className="flex-grow-1 p-4 overflow-auto bg-light">
            <div className="container-fluid">
              <div className="accordion" id="statusAccordion">
                {statusOptions.map((status, index) => {
                  const leads = filterAndSortLeads(allLeads.filter((l) => l.status === status));
                  const headingId = `heading-${index}`;
                  const collapseId = `collapse-${index}`;

                  return (
                    <div className="accordion-item" key={status}>
                      <h2 className="accordion-header" id={headingId}>
                        <button
                          className={`accordion-button ${index !== 0 ? "collapsed" : ""}`}
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#${collapseId}`}
                          aria-expanded={index === 0 ? "true" : "false"}
                          aria-controls={collapseId}
                        >
                          {status} ({leads.length})
                        </button>
                      </h2>
                      <div
                        id={collapseId}
                        className={`accordion-collapse collapse ${index === 0 ? "show" : ""}`}
                        aria-labelledby={headingId}
                        data-bs-parent="#statusAccordion"
                      >
                        <div className="accordion-body">
                          <div className="d-flex flex-wrap gap-3 mb-3">
                            <select
                              className="form-select"
                              style={{ width: 200 }}
                              value={agentFilter}
                              onChange={(e) => handleParamChange("agent", e.target.value)}
                            >
                              <option value="">All Agents</option>
                              {agentOptions.map(({ value, label }) => (
  <option key={value} value={value}>
    {label}
  </option>
))}

                            </select>

                            <select
                              className="form-select"
                              style={{ width: 200 }}
                              value={priorityFilter}
                              onChange={(e) => handleParamChange("priority", e.target.value)}
                            >
                              <option value="">All Priorities</option>
                              {allPriorities.map((p) => (
                                <option key={p} value={p}>
                                  {p}
                                </option>
                              ))}
                            </select>

                            <select
                              className="form-select"
                              style={{ width: 200 }}
                              value={sort}
                              onChange={(e) => handleParamChange("sort", e.target.value)}
                            >
                              <option value="none">Sort: None</option>
                              <option value="timeToClose">Time to Close (asc)</option>
                            </select>
                          </div>

                          {leads.length === 0 ? (
                            <p>No leads under "{status}" with current filters.</p>
                          ) : (
                            <div className="d-flex flex-wrap gap-3">
                              {leads.map((lead) => (
                                <div
                                  key={lead._id}
                                  className="card p-3 shadow-sm"
                                  style={{ width: "250px" }}
                                >
                                  <h5 className="mb-1">{lead.name}</h5>
                                  <p className="mb-1">
  Sales Agent: {Array.isArray(lead.salesAgent) && lead.salesAgent.length > 0
    ? lead.salesAgent.map((agent) => agent.name).join(", ")
    : "Unassigned"}
</p>
                                  <p className="mb-1">Priority: {lead.priority || "-"}</p>
                                  <p className="mb-1">
                                    Time to Close: {lead.timeToClose ? `${lead.timeToClose} days` : "N/A"}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

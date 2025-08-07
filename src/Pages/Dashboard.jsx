
import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import LeadForm from "../Components/LeadForm";
import { useLeadContext } from '../Contexts/LeadContext';
import Sidebar from '../Components/Sidebar';
import Modal from "../Components/Modal"

export default function Dashboard() {
  const {
    filteredLeads,
    fetchFilteredLeads,
    loading,
    statusCounts,
    statusOptions,
  } = useLeadContext();

  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");

  const [searchParams, setSearchParams] = useSearchParams();
  const selectedStatus = searchParams.get("status") || "";

  const openAddLeadModal = () => {
    setModalMode("add");
    setIsLeadModalOpen(true);
  };

  useEffect(() => {
    const filters = {};
    const status = searchParams.get("status");
    if (status) filters.status = status;

    fetchFilteredLeads(filters);
  }, [searchParams]);

  const handleStatusChange = (statusValue) => {
    const newParams = new URLSearchParams(searchParams);
    if (statusValue) {
      newParams.set("status", statusValue);
    } else {
      newParams.delete("status");
    }
    setSearchParams(newParams);
  };

  return (
    <>
      <header className="bg-primary text-light text-center p-3 sticky-top">
        <h1>Anvaya CRM Dashboard</h1>
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
    <Sidebar />
  </aside>

          <div className="flex-grow-1 overflow-auto p-4 bg-light">
            <div className="container-fluid">
              <div
                className="mb-4 p-3 bg-white rounded shadow-sm border"
                style={{ height: "250px", overflowY: "auto" }}
              >
                <h2 className="h5 mb-3">All Leads</h2>
                <div className="d-flex flex-wrap gap-3">
                  {loading ? (
                    <div className="text-center my-4">
                      <span>Loading Leads...</span>
                    </div>
                  ) : (
                    filteredLeads.map((lead) => (
                      <div
                        key={lead._id}
                        className="border rounded p-2 shadow-sm bg-light"
                        style={{ width: "210px", fontSize: "0.9rem" }}
                      >
                        <Link to={`/lead/${lead._id}`} className="text-decoration-none text-dark">
                          <strong>{lead.name}</strong>
                          <br />
                          <small className="text-muted">{lead.status}</small>
                        </Link>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="mb-4 p-3 bg-white rounded shadow-sm border">
                <div className="d-flex justify-content-between align-items-center">
                  <h2 className="h5 mb-0">Leads By Status</h2>
                  {selectedStatus && (
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => handleStatusChange("")}
                    >
                      Clear Filter
                    </button>
                  )}
                </div>

                <p className="mt-3 mb-2 text-start">Quick Filters:</p>
                <div className="d-flex flex-wrap gap-5">
                  {statusOptions.map((status) => (
                    <div key={status.value} className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="statusFilter"
                        id={`${status}Filter`}
                        value={status}
                        checked={selectedStatus === status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                      />
                      <label className="form-check-label" htmlFor={`${status}Filter`}>
                        {status} ({statusCounts[status] || 0})
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3">
                <button className="btn btn-primary" onClick={openAddLeadModal}>
                  Add New Lead
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {isLeadModalOpen && (
        <Modal title={"Add New Lead"} onClose={() => setIsLeadModalOpen(false)}>
          <LeadForm mode={modalMode} onClose={() => setIsLeadModalOpen(false)} />
        </Modal>
      )}
    </>
  );
}

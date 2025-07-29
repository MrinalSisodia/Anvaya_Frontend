# Dashboard 

## Values from LeadContext 
```jsx
 const {filteredLeads, fetchLeadsByStatus, loading,  statusCounts } = useLeadContext();
```


## Sticky Header
```jsx
 <header className="bg-primary text-light text-center p-3 sticky-top">
        <h1>Anvaya CRM Dashboard</h1>
      </header>
```

## Main section divied into two parts
```jsx
 <div className="bg-light p-3 border-end" style={{ width: "250px" }}>
            <Sidebar />
          </div>
          <div className="flex-grow-1 p-4 overflow-auto bg-light">
            <div className="container-fluid">
            </div> </div>
```


## All Leads

```jsx
  <div
                className="mb-4 p-3 bg-white rounded shadow-sm border"
                style={{ height: "250px", overflowY: "auto" }}
              >
                <h2 className="h5 mb-3">All Leads</h2>
                <div className="d-flex flex-wrap gap-2">
                  {loading ? (
  <div className="text-center my-4"> 
      <span >Loading Leads...</span>
  </div>
): (filteredLeads && filteredLeads.map((lead) => (
                    <div
                      key={lead._id}
                      className="border rounded p-2 shadow-sm bg-light"
                      style={{ width: "180px", fontSize: "0.9rem" }}
                    >
                         <Link to={`/lead/${lead._id}`} className="text-decoration-none text-dark">
                      <strong>{lead.name}</strong><br />
                      <small className="text-muted">{lead.status}</small></Link>
                    </div>
                  )))}

                </div>
              </div>
```

## Leads By Status
```jsx       
<div className="mb-4 p-3 bg-white rounded shadow-sm border">
    <div className="d-flex justify-content-between align-items-center">
         <h2 className="h5 mb-0">Leads By Status</h2>
             {selectedStatus && (
                 <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => {
                        fetchLeadsByStatus("");
                        setSelectedStatus("");
                      }}
                    >
                      Clear Filter
                    </button>
                  )}
        </div>

             <p className="mt-3 mb-2 text-start">Quick Filters:</p>
                <div className="d-flex flex-wrap gap-3">
                  {["New", "Contacted", "Qualified", "Proposal Sent", "Closed"].map((status) => (
                    <div key={status} className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="statusFilter"
                        id={`${status}Filter`}
                        value={status}
                        checked={selectedStatus === status}
                        onChange={(e) => {
                          fetchLeadsByStatus(e.target.value);
                          setSelectedStatus(e.target.value);
                        }}
                      />
                      <label className="form-check-label" htmlFor={`${status}Filter`}>
                        {status} ({statusCounts[status] || 0})
                      </label>
                    </div>
                  ))}
                </div>
              </div>
```


## Add Lead Button 
```jsx
   <div className="mt-3">
                <button className="btn btn-primary" onClick={openAddLeadModal}>
                  Add New Lead
                </button>
              </div>


       const openAddLeadModal = () => {
        setModalMode("add");
    setIsLeadModalOpen(true);
  };         
```

## Modal for Lead Form
```jsx

  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");

{isLeadModalOpen && (
        <Modal
          title={"Add New Lead"}
          onClose={() => setIsLeadModalOpen(false)}
        >
          <LeadForm
            mode={modalMode}
            onClose={() => setIsLeadModalOpen(false)}
          />
        </Modal>
      )}
```
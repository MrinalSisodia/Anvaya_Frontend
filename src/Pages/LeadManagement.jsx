import { useParams, Link } from "react-router-dom";
import { useLeadContext } from "../contexts/LeadContext";
import Modal from "../Components/Modal";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import LeadForm from "../Components/LeadForm";

export default function LeadManagement() {
  const { id } = useParams();
  const {
    allLeads,
    fetchComments,
    submitComment,
    loading,
  } = useLeadContext();

  const [lead, setLead] = useState(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [modalMode, setModalMode] = useState("");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    if (allLeads?.length > 0 && id) {
      const found = allLeads.find((l) => l._id === id);
      setLead(found);
    }
  }, [allLeads, id]);


  const openEditLeadModal = () => {
    if (lead) {
      setSelectedLead(lead);
      setModalMode("edit");
      setIsLeadModalOpen(true);
    }
  };

  useEffect(() => {
    if (lead?._id) {
      fetchComments(lead._id).then((res) => {
        setComments(res || []);
      });
    }
  }, [lead]);



const handleCommentSubmit = async () => {
  if (!selectedAgentId) {
    toast.error("Please select an agent to post the comment.");
    return;
  }

  if (lead && newComment.trim()) {
    try {
        setIsSubmitting(true);
      await submitComment(lead._id, newComment.trim(), selectedAgentId);
      const updatedComments = await fetchComments(lead._id);  // refresh the list
      setComments(updatedComments || []);
      setNewComment("");
      setSelectedAgentId("");
      toast.success("Comment posted successfully!");
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast.error("Failed to post comment.");
    } finally{
        setIsSubmitting(false);
    }
  }
};


return(
<>
  <header className="bg-primary text-light p-3 sticky-top">
    <h1 className="fs-4">Lead Management: {lead?.name}</h1>
  </header>

  <main>
    {/* Sidebar */}
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
 

    {/* Content Area */}
    <div className="flex-grow-1 p-3 bg-light">
      <div className="container-fluid">

        {/* Lead Details Section */}
        <div className="mb-3 p-3 bg-white rounded shadow-sm border text-start">
          <h5 className="mb-3">Lead Details</h5>
          {loading ? (
            <p className="text-muted">Loading lead details...</p>
          ) : lead ? (
            <>
              <div className="row mb-2">
                <div className="col-md-6"><strong>Name:</strong> {lead.name}</div>
                <div className="col-md-6"><strong>Status:</strong> {lead.status}</div>
              </div>
              <div className="row mb-2">
                <div className="col-md-6"><strong>Sales Agent:</strong> {Array.isArray(lead.salesAgent) ? lead.salesAgent.map(agent => agent?.name).join(", ") : "N/A"}</div>
                <div className="col-md-6"><strong>Source:</strong> {lead.source}</div>
              </div>
              <div className="row mb-2">
                <div className="col-md-6"><strong>Priority:</strong> {lead.priority}</div>
                <div className="col-md-6"><strong>Time to Close:</strong> {lead.timeToClose}</div>
              </div>
              <button className="btn btn-sm btn-outline-primary mt-2" onClick={openEditLeadModal}>
                Edit Lead
              </button>
            </>
          ) : (
            <p className="text-muted">Lead not found.</p>
          )}
        </div>

        {/* Comments Section in Accordion */}
        <div className="accordion" id="commentsAccordion">
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingComments">
              <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseComments" aria-expanded="true" aria-controls="collapseComments">
                Comments
              </button>
            </h2>
            <div id="collapseComments" className="accordion-collapse collapse show" aria-labelledby="headingComments" data-bs-parent="#commentsAccordion">
              <div className="accordion-body">

                {/* Add Comment Form */}
                <div className="mb-3 p-3 bg-light border rounded">
                  <div className="row g-2">
                    {Array.isArray(lead?.salesAgent) && (
                      <div className="col-md-3">
                        <select
                          className="form-select h-45"
                          value={selectedAgentId}
                          onChange={(e) => setSelectedAgentId(e.target.value)}
                        >
                          <option value="">Select Sales Agent</option>
                          {lead.salesAgent.map((agent) => (
                            <option key={agent._id} value={agent._id}>
                              {agent.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="col-md-9">
                      <textarea
                        className="form-control"
                        rows={2}
                        maxLength={300}
                        style={{ resize: "none" }}
                        placeholder="Add a new comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                      />
                      <div className="d-flex justify-content-between align-items-center mt-2">
                        <small className="text-muted">{newComment.length} / 300 characters</small>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={handleCommentSubmit}
                          disabled={isSubmitting || !newComment.trim()}
                        >
                          {isSubmitting ? "Posting..." : "Post Comment"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comments List */}
                <div className="p-3 bg-white border rounded" style={{ maxHeight: "300px", overflowY: "auto" }}>
 {comments.length > 0 ? (
  <ul className="list-unstyled mb-0">
    {[...comments]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Newest first
      .map((comment) => (
        <li key={comment._id} className="mb-3 border-bottom pb-2">
          <div className="d-flex justify-content-between align-items-start">
            <div className="text-start">
              <div className="fw-normal">{comment.commentText}</div>
              <small className="text-muted">
                — {comment.author} • {new Date(comment.createdAt).toLocaleString()}
              </small>
            </div>
          </div>
        </li>
      ))}
  </ul>
) : (
  <p className="text-muted mb-0">No comments yet.</p>
)}

</div>

              </div>
            </div>
          </div>
        </div>
 </div>
      </div>
    </div>
  </main>

  {/* Lead Modal */}
  {isLeadModalOpen && (
    <Modal title={"Edit Lead"} onClose={() => setIsLeadModalOpen(false)}>
      <LeadForm
        mode={modalMode}
        initialValues={selectedLead}
        onClose={() => setIsLeadModalOpen(false)}
      />
    </Modal>
  )}
</>
);
}
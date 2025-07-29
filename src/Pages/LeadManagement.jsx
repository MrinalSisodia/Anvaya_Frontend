import { useParams, Link } from "react-router-dom";
import { useLeadContext } from "../Contexts/LeadContext";
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
  if (lead && newComment.trim()) {
    try {
      console.log("Sending comment:", newComment.trim());
      const updatedComments = await submitComment(lead._id, newComment.trim());
      setComments(updatedComments || []);
      setNewComment("");
      
      toast.success("Comment posted successfully!");
    } catch (error) {
      console.error("Error submitting comment:", error);
       toast.error("Failed to post comment.");
    }
  }
};


  return (
    <>
      <header className="bg-primary text-light p-3 sticky-top">
        <h1>Lead Management: {lead?.name || "Loading..."}</h1>
      </header>
      <main>
        <div className="d-flex" style={{ height: "100%" }}>
          <div className="bg-light p-3 border-end" style={{ width: "250px" }}>
            <p className="nav-item">
              <Link className="nav-link" to="/">
                Back to Dashboard
              </Link>
            </p>
          </div>

          <div className="flex-grow-1 p-4 overflow-auto bg-light">
            <div className="container-fluid">
              <div className="mb-4 p-3 bg-white rounded shadow-sm border text-start">
                <h2>Lead Details</h2>
                {loading ? (
                  <p className="text-muted">Loading lead details...</p>
                ) : lead ? (
                  <>
                    <div>
                      <p>Lead Name: {lead.name}</p>
                      <p>Sales Agent: {Array.isArray(lead.salesAgent) ? lead.salesAgent.map(agent => agent?.name).join(", ") : "N/A"}</p>
                      <p>Lead Source: {lead.source}</p>
                      <p>Lead Status: {lead.status}</p>
                      <p>Priority: {lead.priority}</p>
                      <p>Time to Close: {lead.timeToClose}</p>
                    </div>
                    <button className="btn btn-primary" onClick={openEditLeadModal}>
                      Edit Lead
                    </button>
                  </>
                ) : (
                  <p className="text-muted">Lead not found.</p>
                )}
              </div>

              <div className="mb-4 p-3 bg-white rounded shadow-sm border text-start">
                <h2>Comments Section</h2>
                {comments.length > 0 ? (
                  <ul className="list-unstyled">
                    {comments.map((comment) => (
                      <li key={comment._id} className="mb-3 border-bottom pb-2">
                        <div className="fw-bold">
                          {comment.author} -{" "}
                          <small className="text-muted">
                            {new Date(comment.createdAt).toLocaleString()}
                          </small>
                        </div>
                        <div>Comment: {comment.commentText}</div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted">No comments yet.</p>
                )}

                <div className="mt-3">
                  <textarea
                    className="form-control mb-2"
                    rows={3}
                    placeholder="Add a new comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <button className="btn btn-primary" onClick={handleCommentSubmit}>
                    Post Comment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

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

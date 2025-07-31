import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { useAgentContext } from "../Contexts/AgentContext";

const agentFields = [
  { name: "name", type: "text", placeholder: "Agent Name" },
  { name: "email", type: "email", placeholder: "Agent Email" },
];

const getEmptyAgent = () =>
  Object.fromEntries(agentFields.map(({ name }) => [name, ""]));

const SalesAgentForm = ({ onClose }) => {
  const [formState, setFormState] = useState(getEmptyAgent());
  const firstInputRef = useRef();
  const { addAgent } = useAgentContext();

  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  const handleChange = (name, value) => {
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const isValid = agentFields.every(({ name }) => formState[name].trim() !== "");

    if (!isValid) {
      toast.error("Please fill all fields.");
      return;
    }

    try {
      await addAgent(formState);
      toast.success("Agent added successfully.");
      setFormState(getEmptyAgent()); // Reset form
      onClose?.(); // Close modal
    } catch (err) {
      toast.error("Failed to add agent.");
      console.error("Agent creation error:", err);
    }
  };

  return (
    <div className="p-2">
      {agentFields.map(({ name, type, placeholder }, idx) => (
        <input
          key={name}
          type={type}
          className="form-control mb-2"
          placeholder={placeholder}
          value={formState[name]}
          onChange={(e) => handleChange(name, e.target.value)}
          ref={idx === 0 ? firstInputRef : null}
        />
      ))}

      <div className="d-flex justify-content-end">
        <button className="btn btn-secondary me-2" onClick={onClose}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={handleSubmit}>
          Add Agent
        </button>
      </div>
    </div>
  );
};

export default SalesAgentForm;

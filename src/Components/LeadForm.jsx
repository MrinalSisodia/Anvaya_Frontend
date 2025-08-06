import React, { useState, useEffect, useRef } from "react";
import { useLeadContext } from "../contexts/LeadContext";
import { useAgentContext } from "../contexts/AgentContext";
import { toast } from "react-toastify";
import Select from "react-select";

const leadFields = [
  { name: "name", type: "text", placeholder: "Lead Name" },
  { name: "source", type: "select", placeholder: "Source" },
  { name: "salesAgent", type: "multiselect", placeholder: "Sales Agent(s)" },
  { name: "status", type: "select", placeholder: "Status" },
  { name: "tags", type: "multiselect", placeholder: "Tags" },
  { name: "timeToClose", type: "number", placeholder: "Time to Close (in days)" },
  { name: "priority", type: "select", placeholder: "Priority" },
];

const getEmptyLead = () =>
  Object.fromEntries(leadFields.map(({ name }) => [name, ""]));

const LeadForm = ({ mode = "add", initialValues = null, onClose }) => {
  const { addLead, updateLead, tagOptions, statusOptions } = useLeadContext();
  const {agentOptions} = useAgentContext()
  const [formState, setFormState] = useState(getEmptyLead());
  const firstInputRef = useRef();

  useEffect(() => {
  if (mode === "edit" && initialValues) {
    setFormState({
      ...initialValues,
      salesAgent: Array.isArray(initialValues.salesAgent)
        ? initialValues.salesAgent.map(agent => ({
            value: agent._id,
            label: agent.name,
          }))
        : [],
      tags: Array.isArray(initialValues.tags)
        ? initialValues.tags.map(tag => ({
            value: tag,
            label: tag,
          }))
        : [],
    });
  } else {
    setFormState(getEmptyLead());
  }
}, [mode, initialValues]);


  useEffect(() => {
    if (firstInputRef.current) firstInputRef.current.focus();
  }, []);

  const handleChange = (name, value) => {
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const isValid = leadFields.every(({ name }) => formState[name] !== "");

    if (!isValid) {
      toast.error("Please fill all fields.");
      return;
    }

    const leadData = {
      ...formState,
      timeToClose: Number(formState.timeToClose),
      salesAgent: formState.salesAgent.map((agent) => agent.value),
      tags: formState.tags.map((tag) => tag.value),
    };

    try {
      if (mode === "edit") {
        await updateLead(initialValues._id, leadData);
        toast.success("Lead updated successfully.");
      } else {
        await addLead(leadData);
        toast.success("Lead added successfully.");
      }
      onClose?.();
    } catch (err) {
      toast.error("Failed to save lead.");
      console.error("Lead save error:", err);
    }
  };

  return (
    <div className="p-2">
      {leadFields.map(({ name, type, placeholder }, idx) =>
        type === "select" ? (
          <select
            key={name}
            className="form-control mb-2"
            name={name}
            value={formState[name]}
            onChange={(e) => handleChange(name, e.target.value)}
            ref={idx === 0 ? firstInputRef : null}
          >
            <option value="">{placeholder}</option>

            {name === "status" &&
              statusOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}

            {name === "source" &&
              ["Website", "Referral", "Cold Call", "Advertisement", "Email", "Other"].map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}

            {name === "priority" &&
              ["Low", "Medium", "High"].map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
          </select>
        ) : type === "multiselect" ? (
          <Select
            key={name}
            isMulti
            name={name}
            options={name === "salesAgent" ? agentOptions : tagOptions}
            value={formState[name]}
            onChange={(selected) => handleChange(name, selected)}
            className="mb-2"
            placeholder={placeholder}
          />
        ) : (
          <input
            key={name}
            type={type}
            className="form-control mb-2"
            placeholder={placeholder}
            value={formState[name]}
            onChange={(e) => handleChange(name, e.target.value)}
            ref={idx === 0 ? firstInputRef : null}
          />
        )
      )}

      <div className="d-flex justify-content-end">
        <button className="btn btn-secondary me-2" onClick={onClose}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={handleSubmit}>
          {mode === "edit" ? "Save Changes" : "Add Lead"}
        </button>
      </div>
    </div>
  );
};

export default LeadForm;

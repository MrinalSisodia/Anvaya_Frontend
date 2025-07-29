# Lead Form feature

## Declare the fields & create a Lead object
```jsx
const leadFields = [
  { name: "name", type: "text", placeholder: "Lead Name" },
  { name: "source", type: "select", placeholder: "Source" },
  { name: "salesAgent", type: "select", placeholder: "Sales Agent" }, 
  { name: "status", type: "select", placeholder: "Status" },
  { name: "tags", type: "text", placeholder: "Tags (comma-separated)" },
  { name: "timeToClose", type: "number", placeholder: "Time to Close (in days)" },
  { name: "priority", type: "select", placeholder: "Priority" },
];

const getEmptyLead = () =>
  Object.fromEntries(leadFields.map(({ name }) => [name, ""]));
```

## Form parameters & states
```jsx
const LeadForm = ({ mode = "add", initialValues = null, onClose }) =>{}
  const [formState, setFormState] = useState(getEmptyLead());
  const [salesAgents, setSalesAgents] = useState([]);

    useEffect(() => {
    if (mode === "edit" && initialValues) {
      setFormState(initialValues);
    } else {
      setFormState(getEmptyLead());
    }
  }, [mode, initialValues]);
```

## Get options for Sales Agent dropdown in form
```jsx
  useEffect(() => {
    const fetchSalesAgents = async () => {
      try {
        const res = await fetch("https://anvaya-backend-nine.vercel.app/sales-agents");
        const data = await res.json();
        if (!res.ok) throw new Error("Failed to fetch agents");
        setSalesAgents(data);
      } catch (err) {
        console.error("Error fetching agents:", err);
      }
    };
    fetchSalesAgents();
  }, []);
```

## Form submit action
```jsx
 const handleSubmit = async () => {
    const isValid = leadFields.every(({ name }) => formState[name] !== "");

    if (!isValid) {
      toast.error("Please fill all fields.");
      return;
    }

    const leadData = {
      ...formState,
        timeToClose: Number(formState.timeToClose),
     tags: typeof formState.tags === "string"
  ? formState.tags.split(",").map(tag => tag.trim()).filter(Boolean)
  : formState.tags,
    };

    try {
      if (mode === "edit") {
        await updateLead(formState._id, leadData);
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
```

### Add & Update Lead functions provided by LeadContext
```jsx
 const addLead = async (leadData) => {
    try {
      const res = await fetch(`${BASE_URL}/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(leadData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create lead");
      }

      setAllLeads((prev) => [...prev, data]);
      return data;
    } catch (err) {
      console.error("Add lead error:", err);
      throw err;
    }
  };



const updateLead = async (leadId, updatedData) => {
    try {
      const res = await fetch(`${BASE_URL}/leads/${leadId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update lead");
      }

      setAllLeads((prevLeads) =>
        prevLeads.map((lead) => (lead._id === data._id ? data : lead))
      );

      return data;
    } catch (err) {
      console.error("Update lead error:", err);
      throw err;
    }
  };
```


## Specific mapping based on the field type
```jsx
return (
    <div className="p-2">
      {leadFields.map(({ name, type, placeholder }, idx) => 
          (type === "select" ? (
            <select
              className="form-control mb-2"
              name={name}
              value={formState[name]}
              onChange={(e) =>
                setFormState({ ...formState, [name]: e.target.value })
              }
              ref={idx === 0 ? firstInputRef : null}
            >
              <option value="">{placeholder}</option>

              {name === "status" &&
                ["New", "Contacted", "Qualified", "Lost"].map((opt) => (
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

              {name === "salesAgent" &&
                salesAgents.map((agent) => (
                  <option key={agent._id} value={agent._id}>
                    {agent.name}
                  </option>
                ))}
            </select>
          ) : (
            <input
              type={type}
              className="form-control mb-2"
              placeholder={placeholder}
              value={formState[name]}
              onChange={(e) =>
                setFormState({ ...formState, [name]: e.target.value })
              }
              ref={idx === 0 ? firstInputRef : null}
            />
          ))
      )})

```


## Canvel & Save /Add buttons 
```jsx
<div className="d-flex justify-content-end">
        <button className="btn btn-secondary me-2" onClick={onClose}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={handleSubmit}>
          {mode === "edit" ? "Save Changes" : "Add Lead"}
        </button>
      </div>
```

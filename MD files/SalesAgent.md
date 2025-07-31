# Agent Context
## Provides fetching, adding agents functionality

```jsx

 const fetchAgents = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://anvaya-backend-nine.vercel.app/sales-agents");
      const data = await res.json();
      if (!res.ok) throw new Error("Failed to fetch agents");
      setAgents(data);
    } catch (err) {
      console.error("Error fetching sales agents:", err);
    } finally{
        setLoading(false);
    }
  };

 const addAgent = async (agentData) => {
    const res = await fetch("https://anvaya-backend-nine.vercel.app/sales-agents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(agentData),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "Failed to add agent");
    }

    await fetchAgents(); // Refresh list after adding
  };

```

# Backend Routes

- Create Sales Agents
```jsx
const createSalesAgent = async (data) => {
  const newAgent = new SalesAgent(data);
  return await newAgent.save();
};

app.post("/sales-agents", async (req, res) => {
  try {
    if (!req.body.name || !req.body.email) {
  return res.status(400).json({ error: "Name and Email are required." });
}
    const newAgent = await createSalesAgent(req.body);
    res.status(201).json({
      message: "Sales Agent added to database.",
      agent: newAgent,
    });
  } catch (error) {
    console.error("Error creating agent:", error);
    res.status(500).json({ error: "Failed to add Sales Agent." });
  }
});
```

- Get All Sales Agents
```jsx
app.get("/sales-agents", async (req, res) => {
  try {
    const agents = await SalesAgent.find({}, "_id name email");
    res.status(200).json(agents);
  } catch (err) {
    console.error("Error fetching sales agents:", err);
    res.status(500).json({ error: "Server error" });
  }
});
```

# SalesAgentManagement page
## Displays list of agents & Add agent button
### use States & context
```jsx
 const [showForm, setShowForm] = useState(false);
  const { agents, loading, fetchAgents } = useAgentContext();
```
### Return the content display
```jsx
        {/* Content */}
        <div className="flex-grow-1 p-3 bg-light">
          <div className="container-fluid">
            <div className="mb-3 p-3 bg-white rounded shadow-sm border text-start">
              <h5 className="mb-3">Sales Agent List</h5>

              {loading ? (
                <div className=".py-5">
                <span >Loading...</span>
                </div>
              ) : (
                <>
                  {agents.length === 0 ? (
                    <p>No agents found.</p>
                  ) : (
                    <ul className="list-group mb-3">
                      {agents.map((agent) => (
                        <li key={agent._id} className="list-group-item">
                          <strong>{agent.name}</strong> – {agent.email}
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}

              <button onClick={() => setShowForm(true)} className="btn btn-primary">
                + Add New Agent
              </button>

              {showForm && (
                <Modal title="Add Sales Agent" onClose={() => setShowForm(false)}>
                  <SalesAgentForm
                    onClose={() => setShowForm(false)}
                  />
                </Modal>
              )}
            </div>
          </div>
        </div>
```


# SalesAgentForm Component
## Form for adding agent opens in a modal
### Create empty Sales agent object
```jsx
const agentFields = [
  { name: "name", type: "text", placeholder: "Agent Name" },
  { name: "email", type: "email", placeholder: "Agent Email" },
];

const getEmptyAgent = () =>
  Object.fromEntries(agentFields.map(({ name }) => [name, ""]));
```

### Form
- Takes onClose callback as paramater
```jsx
const SalesAgentForm = ({ onClose }) => {}
```

- Use States & contect
```jsx
  const [formState, setFormState] = useState(getEmptyAgent());
  const { addAgent } = useAgentContext();
```


- Handle fomr input changes & submission
```jsx

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
```


- Display for Form
```jsx
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
```

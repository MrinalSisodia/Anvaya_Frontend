import { createContext, useContext, useState, useEffect, useMemo } from "react";

const AgentContext = createContext();

export const AgentProvider = ({ children }) => {
  const [agents, setAgents] = useState([]);
   const [loading, setLoading] = useState(true);

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

const agentOptions = useMemo(() => {
  return agents.map((agent) => ({
    value: agent._id,
    label: agent.name,
  }));
}, [agents]);

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

  
  useEffect(() => {
    fetchAgents();
  }, []);

  return (
    <AgentContext.Provider value={{ agents, loading, fetchAgents, addAgent, agentOptions }}>
      {children}
    </AgentContext.Provider>
  );
};

export const useAgentContext = () => useContext(AgentContext);

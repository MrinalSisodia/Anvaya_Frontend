import { useState, useEffect, useMemo, createContext, useContext } from 'react';

const LeadContext = createContext();
export const useLeadContext = () => useContext(LeadContext);

const LeadContextProvider = ({ children }) => {
const [allLeads, setAllLeads] = useState([]);
const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [salesAgents, setSalesAgents] = useState([]);
  const [tags, setTags] = useState([]);

  const BASE_URL = "https://anvaya-backend-nine.vercel.app";

  const fetchSalesAgents = async () => {
    try {
      const res = await fetch(`${BASE_URL}/sales-agents`);
      const data = await res.json();
      if (!res.ok) throw new Error("Failed to fetch agents");
      setSalesAgents(data);
    } catch (err) {
      console.error("Fetch sales agents error:", err);
    }
  };
  const fetchTags = async () => {
  try {
    const res = await fetch(`${BASE_URL}/tags`);
    const data = await res.json();
    if (!res.ok) throw new Error("Failed to fetch tags");
    setTags(data);
  } catch (err) {
    console.error("Fetch tags error:", err);
  }
};


  useEffect(() => {
    fetchSalesAgents();
     fetchTags();
  }, []);

  const fetchAllLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/leads`);
      const data = await res.json();
      if (!res.ok) throw new Error("Failed to fetch leads.");
      setAllLeads(data);
       setFilteredLeads(data)
    } catch (err) {
      console.error("All leads fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeadsByStatus = async (status) => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/leads?status=${encodeURIComponent(status)}`);
      const data = await res.json();
      if (!res.ok || !Array.isArray(data)) {
        throw new Error("Failed to fetch filtered leads.");
      }
      setFilteredLeads(data);
      console.log(`Fetched leads with status "${status}":`, data);
    } catch (err) {
      console.error("Filtered leads fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllLeads();
  }, []);

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

const statusCounts = useMemo(() => {
  const counts = {};
  allLeads.forEach((lead) => {
    const status = lead.status || "Unknown";
    counts[status] = (counts[status] || 0) + 1;
  });
  return counts;
}, [allLeads]);


const statusOptions = useMemo(() => [
  "New",
  "Contacted",
  "Qualified",
  "Proposal Sent",
  "Closed"
], []);


const tagOptions = useMemo(() => {
  return tags.map(tag => ({
    value: tag,
    label: tag,
  }));
}, [tags]);


const agentOptions = useMemo(() => {
  return salesAgents.map(agent => ({
    value: agent._id,
    label: agent.name,
  }));
}, [salesAgents]);




  const fetchComments = async (leadId) => {
    try {
      const res = await fetch(`${BASE_URL}/leads/${leadId}/comments`);
      const data = await res.json();
      if (!res.ok) throw new Error("Failed to fetch comments");
      return data;
    } catch (err) {
      console.error("Fetch comments error:", err);
      throw err;
    }
  };

const submitComment = async (leadId, commentText, agentId) => {
  try {
    const res = await fetch(`${BASE_URL}/leads/${leadId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ commentText, agentId }),
  
    });

    if (!res.ok) throw new Error("Failed to submit comment");

    const updatedComments = await res.json();
    return updatedComments;
  } catch (error) {
    console.error("Submit comment error:", error);
    throw error;
  }
};





  const getLeadsByStatus = (status) =>
    allLeads.filter((lead) => lead.status === status);

  const getLeadsByAgent = (agentName) =>
    allLeads.filter((lead) => lead.salesAgent?.name === agentName);


  const getLeadById = (id) => allLeads.find((lead) => lead._id === id);

  return (
    <LeadContext.Provider
      value={{
        allLeads,
        setAllLeads,
        fetchAllLeads,
        filteredLeads,
        fetchLeadsByStatus,
        loading,
        addLead,
        updateLead,
        salesAgents,
        statusCounts,
        statusOptions,
        tagOptions,
        agentOptions,
        fetchComments,
        submitComment,
        getLeadsByStatus,
        getLeadsByAgent,
        getLeadById,
      }}
    >
      {children}
    </LeadContext.Provider>
  );
};

export default LeadContextProvider;

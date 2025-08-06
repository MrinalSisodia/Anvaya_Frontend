import { useState, useEffect, useMemo, createContext, useContext } from "react";
import axios from "axios";

const LeadContext = createContext();
export const useLeadContext = () => useContext(LeadContext);

const LeadContextProvider = ({ children }) => {
  const [allLeads, setAllLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState([]);

  const BASE_URL = "https://anvaya-backend-nine.vercel.app";

  const fetchTags = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/tags`);
      setTags(res.data);
    } catch (err) {
      console.error("Fetch tags error:", err);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchAllLeads = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/leads`);
      setAllLeads(res.data);
      setFilteredLeads(res.data);
    } catch (err) {
      console.error("All leads fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredLeads = async (filters = {}) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => queryParams.append(key, v));
        } else if (value) {
          queryParams.append(key, value);
        }
      });

      const res = await axios.get(`${BASE_URL}/leads?${queryParams.toString()}`);
      setFilteredLeads(res.data);
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
      const res = await axios.post(`${BASE_URL}/leads`, leadData);
      setAllLeads((prev) => [...prev, res.data]);
      return res.data;
    } catch (err) {
      console.error("Add lead error:", err);
      throw err;
    }
  };

  const updateLead = async (leadId, updatedData) => {
    try {
      const res = await axios.put(`${BASE_URL}/leads/${leadId}`, updatedData);
      setAllLeads((prevLeads) =>
        prevLeads.map((lead) => (lead._id === res.data._id ? res.data : lead))
      );
      return res.data;
    } catch (err) {
      console.error("Update lead error:", err);
      throw err;
    }
  };

  const fetchComments = async (leadId) => {
    try {
      const res = await axios.get(`${BASE_URL}/leads/${leadId}/comments`);
      return res.data;
    } catch (err) {
      console.error("Fetch comments error:", err);
      throw err;
    }
  };

  const submitComment = async (leadId, commentText, agentId) => {
    try {
      const res = await axios.post(`${BASE_URL}/leads/${leadId}/comments`, {
        commentText,
        agentId,
      });
      return res.data;
    } catch (err) {
      console.error("Submit comment error!:", err);
      throw err;
    }
  };

  const getLeadsByStatus = (status) =>
    allLeads.filter((lead) => lead.status === status);

 const getLeadsByAgent = (agentId) =>
  allLeads.filter((lead) =>
    Array.isArray(lead.salesAgent) &&
    lead.salesAgent.some((agent) => String(agent._id) === String(agentId))
  );

  const getLeadById = (id) => allLeads.find((lead) => lead._id === id);

  const statusCounts = useMemo(() => {
    const counts = {};
    allLeads.forEach((lead) => {
      const status = lead.status || "Unknown";
      counts[status] = (counts[status] || 0) + 1;
    });
    return counts;
  }, [allLeads]);

  const statusOptions = useMemo(
    () => ["New", "Contacted", "Qualified", "Proposal Sent", "Closed"],
    []
  );

  const tagOptions = useMemo(
    () => tags.map((tag) => ({ value: tag, label: tag })),
    [tags]
  );

  return (
    <LeadContext.Provider
      value={{
        allLeads,
        setAllLeads,
        fetchAllLeads,
        filteredLeads,
        fetchFilteredLeads,
        loading,
        addLead,
        updateLead,
        statusCounts,
        statusOptions,
        tagOptions,
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

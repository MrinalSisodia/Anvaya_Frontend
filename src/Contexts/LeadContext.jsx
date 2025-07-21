import { Children, useState } from 'react'
import { createContext, useContext } from 'react';

const LeadContext = createContext();
export const useLeadContext = () => useContext(LeadContext);


const LeadContextProvider = ({children}) =>{
const [allLeads, setAllLeads] = useState([]); 

  const fetchAllLeads = async () => {
    try {
      const res = await fetch("https://anvaya-backend-nine.vercel.app/leads");
      const data = await res.json();
    
      if (!res.ok || !data.products) throw new Error(data.error || "Failed to fetch leads.");
      setAllLeads(data);
        console.log(data)
    } catch (err) {
      console.error("All leads fetch error:", err);
    }
  };
  fetchAllLeads()

    return (
    <LeadContext.Provider
      value={{
     allLeads,
     setAllLeads,
     fetchAllLeads,
      }}
    >
      {children}
    </LeadContext.Provider>
  );
}

export default LeadContextProvider;
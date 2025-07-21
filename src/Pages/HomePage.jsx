 import { useLeadContext } from '../Contexts/LeadContext';
export default function HomePage(){
   const {allLeads, setAllLeads} = useLeadContext;
console.log(allLeads)
    return(
        <>
      <main>
        <div className='col-md-3'>
      
      </div>
      <div className='col-md-9'>
<h1>All leads</h1>
<ul>
  {allLeads && allLeads.map((lead) => <li>{lead.name}</li>)}
</ul>


      </div>
      </main>
     
    </>
    )
}
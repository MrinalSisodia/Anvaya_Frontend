# Lead Management CRM

A full-stack lead management app where you can view, manage, add and edit leads.  
Built with a React frontend, Express/Node backend, MongoDB database.

---

## Demo Link

[Live Demo](https://anvaya-frontend-pi.vercel.app/)  

---


## Quick Start

```
git clone https://github.com/MrinalSisodia/Anvaya_Frontend.git
cd <Anvaya_Frontend>
npm install
npm run dev
```

## Technologies
- React JS
- React Router
- Node.js
- Express
- MongoDB

## Demo Video
Watch a walkthrough of all major features of this app:
[Youtube Video Link](https://youtu.be/wfA3g3_RW8Q)

## Features
**Dashboard**
- Displays a list of all leads
- Quick filters to view leads filtered by status

**Leads List**
- Leads list with all important details highlighted
- “Add New Lead” button opens a form
- Filter & sort leads by sales agent, status, priority, tags & time to close


**Lead Management**
- View full lead information (source, sales agent, status, priority)
- “Edit Lead” opens a form to update any field for the lead 
- Comments section to post comments & view posted comments

**Agents**
- View list of all agents
- Each agent can be clicked to view the sales agent view page- view all leads for the agent

**Leads By Status**
- View Leads organised by Status
-Filter & sort leads by sales agent, priority & time to close

**Settings**
- Delete leads & sales agents

**Reports** 
- Reporting charts for quick visualization of data
- Closed leads vs in pipeline (Pie chart)
- Leads closed by agents (Bar graph)
- Leads categorized by status (Pie Chart)


## API Reference 
- api - https://anvaya-backend-nine.vercel.app

### **GET	/api/leads**<br>	 
List all leads<br>	 
Sample Response:<br>
```[{_id, name, source, salesAgent:[{"_id","name"}, ...], status, tags:[], timeToClose, priority, createdAt, closedAt}, …]```

### **GET	/api/leads/:id/comments**<br>	 	
Get comments for one lead<br>		
Sample Response:<br>
```[{ id, commentText, author,}, ...]```

### **GET	/api/sales-agents**<br>	 
List all agents<br>	 
Sample Response:<br>
``` [{_id, name,email}, ...]```

### **POST	/api/leads**<br> 	
Create a new lead<br>	

### **POST	/api/sales-agents**<br>  	
Register a new agent<br> 	

### **GET	/api/report**<br>	 
List reports with /summary OR  /status-distribution OR /by-agents <br>	 
Sample Response:<br>
```{closedLastWeek, pipelineLeads} ```


## Contact
For bugs or feature requests, please reach out to mrinalsisoida28@gmail.com
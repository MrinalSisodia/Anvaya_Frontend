import { StrictMode } from 'react'
import React from 'react';
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import Dashboard from './Pages/Dashboard.jsx';
import LeadManagement from './Pages/LeadManagement.jsx';
import LeadList from './Pages/LeadList.jsx';
import SalesAgentManagement from "./Pages/SalesAgentsManagement.jsx";
import LeadsByStatus from './Pages/LeadsByStatus.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Dashboard /> },
       { path: '/lead/:id', element: <LeadManagement /> },
        { path: '/leads', element: <LeadList /> },
         { path: '/sales-agents', element: <SalesAgentManagement /> },
         { path: '/leads-by-status', element: <LeadsByStatus /> }
    ]
  }
]);




createRoot(document.getElementById('root')).render(
  <React.StrictMode>
        <RouterProvider router={router} />
  </React.StrictMode>
);

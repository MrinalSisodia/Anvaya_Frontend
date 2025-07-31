
import { Outlet } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

import LeadContextProvider from './Contexts/LeadContext';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AgentProvider } from './Contexts/AgentContext';

function App() {
  return (
    <div>
      <AgentProvider>
      <LeadContextProvider>
      
      
                <ToastContainer
                  position="top-right"
                  autoClose={2000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="colored"
                />
                
        
                <main>
                  <Outlet />
                </main>
                </LeadContextProvider>
                </AgentProvider>
              
    </div>
  );
}

export default App;

import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

export default function ReportsScreen() {
  const [summary, setSummary] = useState(null);
  const [byAgent, setByAgent] = useState(null);
  const [statusDistribution, setStatusDistribution] = useState(null);

  const BASE_URL = "https://anvaya-backend-nine.vercel.app";

useEffect(() => {
  const fetchReportData = async () => {
    try {
      const [summaryRes, byAgentRes, statusDistRes] = await Promise.all([
        axios.get(`${BASE_URL}/report/summary`),
        axios.get(`${BASE_URL}/report/by-agent`),
        axios.get(`${BASE_URL}/report/status-distribution`)
      ]);

      setSummary(summaryRes.data);
      setByAgent(byAgentRes.data);
      setStatusDistribution(statusDistRes.data);
    } catch (err) {
      console.error("Report fetch error:", err);
    }
  };

  fetchReportData();
}, []);


  const summaryChartData =
    summary && {
      labels: ["Closed Last Week", "In Pipeline"],
      datasets: [
        {
          data: [summary.closedLastWeek, summary.pipelineLeads],
          backgroundColor: ["#36A2EB", "#FFCE56"],
          borderWidth: 1,
        },
      ],
    };

  const agentChartData =
    byAgent && {
      labels: byAgent.map((item) => item.salesAgent),
      datasets: [
        {
          label: "Closed Leads",
          data: byAgent.map((item) => item.count),
          backgroundColor: "#4BC0C0",
        },
      ],
    };

  const statusChartData =
    statusDistribution && {
      labels: statusDistribution.map((item) => item.status),
      datasets: [
        {
          data: statusDistribution.map((item) => item.count),
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#9966FF",
            "#4BC0C0",
          ],
        },
      ],
    };

  return (
    <>
      {/* Header */}
      <header className="bg-primary text-light p-3 sticky-top">
        <h1>Anvaya CRM Reports</h1>
      </header>

      <main>
        {/* Sidebar */}
         <div className="d-flex" style={{ minHeight: "100vh" }}>
  <aside
    className="bg-light p-3 border-end"
    style={{
      width: "200px",
      minWidth: "200px",
      flexShrink: 0,
    }}
  >
 <p>
  <i className="bi bi-arrow-left me-2"></i>
              <Link className="nav-link" to="/">Back to Dashboard</Link>
 </p>
  </aside>

  
        <div className="flex-grow-1 p-4 overflow-auto">
          <div className="container">

        
            <div
              className="d-flex align-items-center justify-content-start gap-4 shadow-sm p-4 mb-4 bg-white rounded"
              style={{ minHeight: "300px" }}
            >
              <div style={{ maxWidth: "280px" }}>
                <h5 className="mb-1">Leads Closed vs in Pipeline</h5>
                <small className="text-muted">
                  Leads closed in the past 7 days vs active pipeline.
                </small>
              </div>
              <div style={{ width: "250px", height: "250px" }}>
                {summaryChartData ? <Pie data={summaryChartData} /> : <p>Loading...</p>}
              </div>
            </div>

            <div
              className="d-flex align-items-center justify-content-start gap-4 shadow-sm p-4 mb-4 bg-white rounded"
              style={{ minHeight: "300px" }}
            >
              <div style={{ maxWidth: "280px" }}>
                <h5 className="mb-1">Leads Closed by Sales Agent</h5>
                <small className="text-muted">
                  Total leads closed by each sales agent.
                </small>
              </div>
              <div style={{ width: "400px", height: "250px" }}>
                {agentChartData ? (
                  <Bar
                    data={agentChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            precision: 0,
                            stepSize: 1,
                          },
                        },
                      },
                    }}
                  />
                ) : (
                  <p>Loading...</p>
                )}
              </div>
            </div>

            <div
              className="d-flex align-items-center justify-content-start gap-4 shadow-sm p-4 mb-4 bg-white rounded"
              style={{ minHeight: "300px" }}
            >
              <div style={{ maxWidth: "280px" }}>
                <h5 className="mb-1">Open Lead Status Distribution</h5>
                <small className="text-muted">
                  Breakdown of all open leads by status.
                </small>
              </div>
              <div style={{ width: "250px", height: "250px" }}>
                {statusChartData ? <Pie data={statusChartData} /> : <p>Loading...</p>}
              </div>
            </div>
          </div>
        </div>
        </div>
      </main>
    </>
  );
}

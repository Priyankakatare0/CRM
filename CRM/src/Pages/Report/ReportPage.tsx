import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import axios from 'axios';

interface Report {
  _id: string;
  title: string;
  content: string;
  createdBy: string;
  createdAt: string;
  sharedWith: string[];
}

const ReportPage: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [createdBy, setCreatedBy] = useState('admin@example.com');
  const [shareEmail, setShareEmail] = useState('');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isAdmin, setIsAdmin] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      fetchReports();
    }
  }, [isAdmin]);

  const fetchReports = async () => {
    try {
      const response = await axios.get<Report[]>('http://localhost:5000/api/reports', {
        headers: { 'x-admin': 'true' },
      });
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const createReport = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post<Report>(
        'http://localhost:5000/api/reports',
        { title, content, createdBy },
        { headers: { 'x-admin': 'true' } }
      );
      setReports([...reports, response.data]);
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Error creating report:', error);
    }
  };

  const shareReport = async (reportId: string) => {
    if (!shareEmail) return;
    try {
      await axios.put(
        `http://localhost:5000/api/reports/${reportId}/share`,
        { email: shareEmail },
        { headers: { 'x-admin': 'true' } }
      );
      setShareEmail('');
      fetchReports();
    } catch (error) {
      console.error('Error sharing report:', error);
    }
  };

  return (
    <div className="ReportPage" style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>Admin Report Management</h1>

      {!isAdmin ? (
        <p>You need to be an admin to access this page.</p>
      ) : (
        <>
          <div style={{ display: 'flex', gap: '20px' }}>
            {/* Create Report Form */}
            <div style={{ flex: 1 }}>
              <h2>Create New Report</h2>
              <form onSubmit={createReport}>
                <div style={{ marginBottom: '10px' }}>
                  <label>Title:</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px' }}
                  />
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <label>Content:</label>
                  <textarea
                    value={content}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px', minHeight: '150px' }}
                  />
                </div>
                <button type="submit" style={{ padding: '8px 16px' }}>
                  Save Report
                </button>
              </form>
            </div>

            {/* Report List */}
            <div style={{ flex: 1 }}>
              <h2>Your Reports</h2>
              {reports.length === 0 ? (
                <p>No reports yet. Create one!</p>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {reports.map((report) => (
                    <li
                      key={report._id}
                      style={{
                        marginBottom: '10px',
                        padding: '10px',
                        border: '1px solid #ddd',
                        cursor: 'pointer',
                        backgroundColor:
                          selectedReport?._id === report._id ? '#f0f0f0' : 'white',
                      }}
                      onClick={() => setSelectedReport(report)}
                    >
                      <h3>{report.title}</h3>
                      <p>Created: {new Date(report.createdAt).toLocaleDateString()}</p>
                      {report.sharedWith.length > 0 && (
                        <p>Shared with: {report.sharedWith.join(', ')}</p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Report Details */}
          {selectedReport && (
            <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ddd' }}>
              <h2>{selectedReport.title}</h2>
              <p>Created by: {selectedReport.createdBy}</p>
              <p>Created on: {new Date(selectedReport.createdAt).toLocaleString()}</p>
              <div style={{ margin: '20px 0', padding: '10px', backgroundColor: '#f9f9f9' }}>
                {selectedReport.content}
              </div>

              <div>
                <h3>Share this report</h3>
                <input
                  type="email"
                  placeholder="Enter email to share with"
                  value={shareEmail}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setShareEmail(e.target.value)}
                  style={{ padding: '8px', marginRight: '10px' }}
                />
                <button
                  onClick={() => shareReport(selectedReport._id)}
                  style={{ padding: '8px 16px' }}
                >
                  Share
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReportPage;

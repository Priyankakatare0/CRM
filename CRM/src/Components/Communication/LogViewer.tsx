import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, Phone, Search, Calendar, Clock, User, X, Plus, Trash2 } from 'lucide-react';
import { Communication } from './types';
import { format } from 'date-fns';

function LogViewer() {
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedComm, setSelectedComm] = useState<Communication | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newComm, setNewComm] = useState<Partial<Communication>>({
    type: 'email',
    subject: '',
    content: '',
    status: 'sent'
  });

  useEffect(() => {
    fetchCommunications();
  }, []);

  const fetchCommunications = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/communications');
      setCommunications(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch communications');
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      await axios.post('http://localhost:3000/api/communications', newComm);
      setIsCreating(false);
      setNewComm({
        type: 'email',
        subject: '',
        content: '',
        status: 'sent'
      });
      fetchCommunications();
    } catch (err) {
      setError('Failed to create communication');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/api/communications/${id}`);
      setSelectedComm(null);
      fetchCommunications();
    } catch (err) {
      setError('Failed to delete communication');
    }
  };

  const filteredCommunications = communications.filter(comm =>
    comm.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comm.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (comm.sender?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (comm.recipient?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (comm.participant?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="w-5 h-5 text-blue-500" />;
      case 'call':
        return <Phone className="w-5 h-5 text-green-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Communication Log</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search communications..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => setIsCreating(true)}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Communication
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          {filteredCommunications.map((comm) => (
            <div
              key={comm.id}
              className="border-b border-gray-200 last:border-0 p-6 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => setSelectedComm(comm)}
            >
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  {getIcon(comm.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">{comm.subject}</h2>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      comm.status === 'sent' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {comm.status}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-600 line-clamp-2">{comm.content}</p>
                  <div className="mt-4 flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {format(new Date(comm.timestamp), 'MMM d, yyyy')}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {format(new Date(comm.timestamp), 'h:mm a')}
                    </div>
                    {comm.type === 'email' ? (
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        {comm.sender} → {comm.recipient}
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        {comm.participant} ({comm.duration})
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {filteredCommunications.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No communications found matching your search.
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedComm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {getIcon(selectedComm.type)}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedComm.subject}</h2>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDelete(selectedComm.id)}
                    className="text-red-500 hover:text-red-600 p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectedComm(null)}
                    className="text-gray-400 hover:text-gray-500 p-2"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    selectedComm.status === 'sent' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {selectedComm.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Date & Time</h3>
                  <p className="text-gray-900">
                    {format(new Date(selectedComm.timestamp), 'MMMM d, yyyy')} at{' '}
                    {format(new Date(selectedComm.timestamp), 'h:mm a')}
                  </p>
                </div>

                {selectedComm.type === 'email' ? (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Participants</h3>
                    <p className="text-gray-900">
                      From: {selectedComm.sender}<br />
                      To: {selectedComm.recipient}
                    </p>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Call Details</h3>
                    <p className="text-gray-900">
                      Participant: {selectedComm.participant}<br />
                      Duration: {selectedComm.duration}
                    </p>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Content</h3>
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedComm.content}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">New Communication</h2>
                <button
                  onClick={() => setIsCreating(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={newComm.type}
                    onChange={(e) => setNewComm({ ...newComm, type: e.target.value as 'email' | 'call' })}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="email">Email</option>
                    <option value="call">Call</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={newComm.subject}
                    onChange={(e) => setNewComm({ ...newComm, subject: e.target.value })}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {newComm.type === 'email' ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        From
                      </label>
                      <input
                        type="email"
                        value={newComm.sender || ''}
                        onChange={(e) => setNewComm({ ...newComm, sender: e.target.value })}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        To
                      </label>
                      <input
                        type="email"
                        value={newComm.recipient || ''}
                        onChange={(e) => setNewComm({ ...newComm, recipient: e.target.value })}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Participant
                      </label>
                      <input
                        type="text"
                        value={newComm.participant || ''}
                        onChange={(e) => setNewComm({ ...newComm, participant: e.target.value })}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Duration
                      </label>
                      <input
                        type="text"
                        value={newComm.duration || ''}
                        onChange={(e) => setNewComm({ ...newComm, duration: e.target.value })}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <textarea
                    value={newComm.content}
                    onChange={(e) => setNewComm({ ...newComm, content: e.target.value })}
                    rows={4}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setIsCreating(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreate}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LogViewer;
import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';
import { formatDateTime } from '../utils/formatDate';

export default function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  const fetchTicket = useCallback(async () => {
    try {
      const response = await api.getTicket(id);
      setTicket(response.data.ticket);
      setNewStatus(response.data.ticket.status);
      // In real app, fetch comments too
      // const commentsRes = await api.getComments(id);
      // setComments(commentsRes.data.comments);
    } catch (error) {
      console.error('Error:', error);
      alert('Ticket not found');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      // In real app: await api.addComment(id, { message: newComment });
      setComments([...comments, {
        _id: Date.now(),
        message: newComment,
        senderId: { name: user?.name },
        createdAt: new Date(),
      }]);
      setNewComment('');
      alert('Comment added!');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUpdateStatus = async () => {
    try {
      await api.updateTicket(id, { status: newStatus });
      setTicket({ ...ticket, status: newStatus });
      setShowStatusUpdate(false);
      alert('Status updated!');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to update status');
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!ticket) return <div className="text-center py-12">Ticket not found</div>;

  const getStatusColor = (status) => {
    const colors = {
      'Open': 'bg-blue-100 text-blue-800',
      'In Progress': 'bg-yellow-100 text-yellow-800',
      'Resolved': 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-6 text-blue-500 hover:underline"
        >
          ← Back to Dashboard
        </button>

        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{ticket.title}</h1>
                <p className="text-gray-600 mt-2">Ticket ID: {ticket.ticketId}</p>
              </div>
              <span className={`px-4 py-2 rounded-full font-bold ${getStatusColor(ticket.status)}`}>
                {ticket.status}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
              <div>
                <p className="text-gray-600 text-sm">Category</p>
                <p className="font-semibold text-gray-800">{ticket.category}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Priority</p>
                <p className="font-semibold text-gray-800">{ticket.priority}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Created</p>
                <p className="font-semibold text-gray-800">{formatDateTime(ticket.createdAt)}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Customer</p>
                <p className="font-semibold text-gray-800">{ticket.customerId?.name}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8 pb-8 border-b">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
          </div>

          {/* Status Update */}
          {user?.role === 'agent' && (
            <div className="mb-8 pb-8 border-b">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">Update Status</h2>
                {!showStatusUpdate && (
                  <button
                    onClick={() => setShowStatusUpdate(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Change Status
                  </button>
                )}
              </div>

              {showStatusUpdate && (
                <div className="flex gap-2">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="flex-1 px-4 py-2 border rounded"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Pending">Pending</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                  <button
                    onClick={handleUpdateStatus}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => setShowStatusUpdate(false)}
                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Comments Section */}
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-4">Comments</h2>

            {/* Comments List */}
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
              {comments.length === 0 ? (
                <p className="text-gray-600">No comments yet</p>
              ) : (
                comments.map(comment => (
                  <div key={comment._id} className="bg-gray-50 p-4 rounded">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-semibold text-gray-800">
                        {comment.senderId?.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {formatDateTime(comment.createdAt)}
                      </p>
                    </div>
                    <p className="text-gray-700">{comment.message}</p>
                  </div>
                ))
              )}
            </div>

            {/* Add Comment */}
            <div className="border-t pt-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                rows="4"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="mt-3 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
              >
                Add Comment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

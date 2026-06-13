import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  // Fetch notifications and unread count
  const fetchNotifications = async () => {
    if (!userId || !token) return;
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/notifications/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Fetched notifications:', response.data);
      setNotifications(response.data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    if (!userId || !token) return;
    try {
      const response = await axios.get(`http://localhost:5000/api/notifications/unread/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Unread count:', response.data.count);
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  // Initial fetch and polling every 15 seconds
  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
    const interval = setInterval(() => {
      fetchUnreadCount();
      // Optionally refresh list when unread count changes
      fetchNotifications();
    }, 15000);
    return () => clearInterval(interval);
  }, [userId, token]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh after marking as read
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/read-all/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  return (
    <div className="position-relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        className="btn btn-outline-light position-relative"
        onClick={() => setIsOpen(!isOpen)}
        style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0 }}
      >
        🔔
        {unreadCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="position-absolute end-0 mt-2 bg-white border rounded-3 shadow-lg" style={{ width: '350px', maxHeight: '500px', overflowY: 'auto', zIndex: 1050 }}>
          <div className="p-3 border-bottom bg-light rounded-top">
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="mb-0">Notifications</h6>
              {notifications.length > 0 && (
                <button className="btn btn-sm btn-link text-decoration-none" onClick={markAllAsRead}>
                  Mark all as read
                </button>
              )}
            </div>
          </div>
          <div className="list-group list-group-flush">
            {loading && (
              <div className="p-4 text-center text-muted">
                <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                <p className="mt-2">Loading...</p>
              </div>
            )}
            {!loading && notifications.length === 0 && (
              <div className="p-4 text-center text-muted">
                <p className="mb-0">No new notifications</p>
              </div>
            )}
            {!loading && notifications.map((notif) => (
              <div
                key={notif._id}
                className={`list-group-item ${!notif.isRead ? 'bg-light' : ''}`}
                onClick={() => markAsRead(notif._id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="d-flex justify-content-between">
                  <div>
                    <div className="fw-bold">{notif.title}</div>
                    <div className="text-muted small">{notif.message}</div>
                    <div className="text-muted small mt-1">
                      {new Date(notif.createdAt).toLocaleString()}
                    </div>
                  </div>
                  {!notif.isRead && (
                    <div className="ms-2">
                      <span className="badge bg-primary rounded-pill">New</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
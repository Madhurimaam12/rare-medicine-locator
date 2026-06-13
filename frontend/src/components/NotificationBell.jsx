import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (userId && token) {
      fetchNotifications();
      fetchUnreadCount();
      const interval = setInterval(() => {
        fetchUnreadCount();
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [userId, token]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/notifications/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(response.data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/notifications/unread/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
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
      <button
        className="btn btn-outline-light position-relative"
        onClick={() => setIsOpen(!isOpen)}
        style={{ padding: '6px 16px', fontWeight: '500' }}
      >
        Notifications
        {unreadCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="position-absolute end-0 mt-2 bg-white border rounded-3 shadow-lg" style={{ width: '380px', maxHeight: '500px', overflowY: 'auto', zIndex: 1050 }}>
          <div className="p-3 border-bottom bg-light rounded-top">
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="mb-0 fw-bold">Notifications</h6>
              {notifications.length > 0 && (
                <button className="btn btn-sm btn-link text-decoration-none" onClick={markAllAsRead}>
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          <div className="list-group list-group-flush">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-muted">
                <p className="mb-0">No notifications</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif._id}
                  className={`list-group-item ${!notif.isRead ? 'bg-light' : ''}`}
                  onClick={() => markAsRead(notif._id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="d-flex">
                    <div className="flex-grow-1">
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
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
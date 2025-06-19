import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../StoreContext/StoreContext";

const NavBar = () => {
  const { user, setUser } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const fullName = user?.fullName || "Guest";
  const role = user?.role || "Guest";

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const token = user?.token;

  const submitPageRedirect = () => {
    navigate("/submit-sample");
  };

  const goToHomepage = () => {
    navigate("/home");
  };

  const goToMySamples = () => {
    navigate("/my-samples");
  };

  const goToPendingSamples = () => {
    navigate("/pending-samples");
  };

  const goToFinishedSamples = () => {
    navigate("/finished-samples");
  };

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Do you really wish to log out?");
    if (confirmLogout) {
      localStorage.clear();
      setUser(null);
      navigate("/login-choice");
    }
  };

  const fetchNotifications = async () => {
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/api/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch notifications");

      const data = await res.json();
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.read).length);
    } catch (e) {
      console.error("Error fetching notifications", e);
    }
  };

  useEffect(() => {
    if (token) {
      fetchNotifications();
    }
  }, [token]);

  return (
    <div className="navbar">
      <div className="navbar-left">
        <img
          className="logo"
          onClick={goToHomepage}
          src={assets.logo}
          alt="logo"
        />
        <h1>PCL</h1>
      </div>

      <ul className="navbar-menu">
        <li onClick={submitPageRedirect}>Submit Sample</li>
        <div className="navbar-divider" />
        <li className="dropdown">
          My Samples
          <ul className="dropdown-menu">
            <li onClick={() => navigate("/my-samples")}>All Samples</li>
            <li onClick={() => navigate("/my-finished-samples")}>
              Finished Samples
            </li>
          </ul>
        </li>
        <div className="navbar-divider" />

        {role === "Scientist" || role === "Admin" ? (
          <>
            <li onClick={goToPendingSamples}>Pending Reviews</li>
            <div className="navbar-divider" />
            <li onClick={goToFinishedSamples}>Finished Samples</li>
            <div className="navbar-divider" />
            <li onClick={goToDashboard}>Dashboard</li>
          </>
        ) : (
          <>
            <li className="dropdown">
              Explore Lab
              <ul className="dropdown-menu">
                <li>Lab Equipment</li>
                <li>Sample Analysis</li>
                <li>Lab Reports</li>
                <li>Safety Guidelines</li>
              </ul>
            </li>
            <div className="navbar-divider" />
            <li>Contact Us/Help</li>
          </>
        )}
      </ul>

      <div className="navbar-right">
        {user && (
          <>
            <ul onClick={handleLogout} style={{ cursor: "pointer" }}>
              Log out
            </ul>
            <div className="navbar-divider" />
          </>
        )}
        <span className="navbar-welcome">
          Welcome, {role} {fullName}
        </span>

        <div
          className="notification-wrapper"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <img
            src={assets.notification_icon}
            alt="Notifications"
            className="notification-icon"
          />
          {unreadCount > 0 && (
            <span className="notification-badge">{unreadCount}</span>
          )}
          {showNotifications && (
            <div className="notification-menu">
              {notifications.length === 0 ? (
                <p className="notification-empty">No notifications</p>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif._id}
                    className={`notification-item ${
                      notif.read ? "notification-read" : "notification-unread"
                    }`}
                    onMouseLeave={async () => {
                      if (!notif.read) {
                        try {
                          await fetch(
                            `http://localhost:5000/api/notifications/${notif._id}/read`,
                            {
                              method: "PUT",
                              headers: {
                                Authorization: `Bearer ${token}`,
                              },
                            }
                          );
                          fetchNotifications();
                        } catch (e) {
                          console.error(
                            "Error marking notification as read",
                            e
                          );
                        }
                      }
                    }}
                    onClick={() => {
                      navigate("/my-finished-samples");
                      setShowNotifications(false);
                    }}
                  >
                    {notif.message}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <img src={assets.profile_icon} alt="profile" />
      </div>
    </div>
  );
};

export default NavBar;

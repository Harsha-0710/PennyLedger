import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "../styles/SettingsPage.css";

export default function SettingsPage() {

  const [user, setUser] = useState({
    name: "",
    email: ""
  });

  const [loading, setLoading] = useState(true); // ✅ local loader

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const res = await fetch("https://pennylegder.onrender.com/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setUser(data);

    } catch (err) {
      toast.error(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");

    window.location.href = "/";
  };

  return (
    <main className="dashboard-main">
      {/* HEADER */}
      <header className="dashboard-header">
        <div>
          <h1>Settings</h1>
          <p className="dashboard-subtitle">
            Manage your account information
          </p>
        </div>
      </header>

      {/* LOADING */}
      {loading ? (
        <p className="status">Loading profile...</p>
      ) : (
        <section className="settings-panel">

          {/* PROFILE CARD */}
          <div className="profile-card">
            <div className="avatar">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>

            <div className="profile-info">
              <h2>{user.name || "User"}</h2>
              <p>{user.email || "No email available"}</p>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="settings-actions">
            <button className="btn logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>

        </section>
      )}
    </main>
  );
}
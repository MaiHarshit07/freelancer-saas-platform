import { useEffect, useState } from "react";
import {
  FaBell,
  FaCheckDouble,
  FaCommentAlt,
  FaSpinner,
} from "react-icons/fa";

import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../../services/notificationService";

const formatTime = (dateString) => {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Just now";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getNotifications();
      setNotifications(response.data || []);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to load notifications.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      await fetchNotifications();
    } catch (err) {
      setError(
        err?.response?.data?.message || "Could not mark notifications as read.",
      );
    }
  };

  const handleMarkOneRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      await fetchNotifications();
    } catch (err) {
      setError(
        err?.response?.data?.message || "Could not update this notification.",
      );
    }
  };

  const unreadCount = notifications.filter((item) => !item.read).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-[#22362B] bg-[#0F1D18] p-6 shadow-lg shadow-[#07140E]/30 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D4AF37] text-black">
            <FaBell size={22} />
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[#8CA096]">
              Updates
            </p>
            <h1 className="text-2xl font-bold text-white">Notifications</h1>
          </div>
        </div>

        <button
          type="button"
          onClick={handleMarkAllRead}
          disabled={unreadCount === 0 || loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D4AF37] px-4 py-2 text-sm font-medium text-[#F6E7B2] transition hover:bg-[#D4AF37] hover:text-[#07140E] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <FaCheckDouble size={16} />
          Mark all as read
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex min-h-[180px] items-center justify-center rounded-2xl border border-[#22362B] bg-[#0F1D18] text-[#C7D2CC]">
          <div className="flex items-center gap-3">
            <FaSpinner className="animate-spin" size={18} />
            Loading notifications...
          </div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#22362B] bg-[#0F1D18] px-6 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#1A3023] text-[#D4AF37]">
            <FaCommentAlt size={22} />
          </div>
          <h2 className="text-xl font-semibold text-white">No notifications yet</h2>
          <p className="mt-2 max-w-md text-sm text-[#8CA096]">
            You’ll see project updates, proposal feedback, and message alerts here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`rounded-2xl border p-4 transition ${
                notification.read
                  ? "border-[#22362B] bg-[#0F1D18]"
                  : "border-[#D4AF37]/40 bg-[#12261D] shadow-lg shadow-[#07140E]/20"
              }`}
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="flex gap-3">
                  <div
                    className={`mt-1 flex h-10 w-10 items-center justify-center rounded-full ${
                      notification.read ? "bg-[#1A3023] text-[#C7D2CC]" : "bg-[#D4AF37] text-black"
                    }`}
                  >
                    <FaBell size={16} />
                  </div>

                  <div>
                    <p className="font-medium text-white">{notification.message}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[#8CA096]">
                      <span>{notification.type?.replace(/_/g, " ") || "System"}</span>
                      <span>•</span>
                      <span>{formatTime(notification.createdAt)}</span>
                      {notification.project?.title && (
                        <>
                          <span>•</span>
                          <span>{notification.project.title}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {!notification.read && (
                  <button
                    type="button"
                    onClick={() => handleMarkOneRead(notification._id)}
                    className="rounded-lg border border-[#D4AF37] px-3 py-1.5 text-xs font-medium text-[#F6E7B2] transition hover:bg-[#D4AF37] hover:text-[#07140E]"
                  >
                    Mark read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;

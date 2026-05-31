import { useState, useRef, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
    const { user } = useAuth();
    const token = localStorage.getItem("access-token");
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: notifications = [] } = useQuery({
        queryKey: ["notifications", user?.email],
        enabled: !!user?.email,
        refetchInterval: 30000,
        queryFn: async () => {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/notifications/${user.email}`,
                { headers: { authorization: `Bearer ${token}` } }
            );
            return res.data;
        },
    });

    const unreadCount = notifications.filter((n) => !n.read).length;

    const handleOpen = async () => {
        setOpen(!open);
        if (!open && unreadCount > 0) {
            await axios.patch(
                `${import.meta.env.VITE_API_URL}/notifications/read/${user.email}`,
                {},
                { headers: { authorization: `Bearer ${token}` } }
            );
            queryClient.invalidateQueries(["notifications"]);
        }
    };

    const handleClick = (notification) => {
        setOpen(false);
        navigate(notification.actionRoute);
    };

    // Close on outside click
    useEffect(() => {
        const handleOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleOutside);
        return () => document.removeEventListener("mousedown", handleOutside);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={handleOpen}
                className="relative p-2 rounded-full hover:bg-violet-100 transition"
            >
                <span className="text-xl">🔔</span>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl z-50 border border-gray-100 max-h-96 overflow-y-auto">
                    <div className="p-3 border-b font-semibold text-violet-900">
                        Notifications
                    </div>
                    {notifications.length === 0 ? (
                        <p className="text-center text-gray-400 py-6 text-sm">No notifications</p>
                    ) : (
                        notifications.map((n) => (
                            <div
                                key={n._id}
                                onClick={() => handleClick(n)}
                                className={`p-3 border-b cursor-pointer hover:bg-violet-50 transition text-sm ${!n.read ? "bg-violet-50" : ""}`}
                            >
                                <p className="text-gray-700">{n.message}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {new Date(n.time).toLocaleString()}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Notifications;
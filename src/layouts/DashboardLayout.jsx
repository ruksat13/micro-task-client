import { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useUserRole from "../hooks/useUserRole";
import toast from "react-hot-toast";

const DashboardLayout = () => {
    const { user, logOut } = useAuth();
    const { userInfo, role } = useUserRole();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logOut();
        toast.success("Logged out!");
        navigate("/login");
    };

    const workerLinks = [
        { to: "/dashboard/worker-home", label: "🏠 Home" },
        { to: "/dashboard/task-list", label: "📋 Task List" },
        { to: "/dashboard/my-submissions", label: "📝 My Submissions" },
        { to: "/dashboard/withdrawals", label: "💰 Withdrawals" },
    ];

    const buyerLinks = [
        { to: "/dashboard/buyer-home", label: "🏠 Home" },
        { to: "/dashboard/add-task", label: "➕ Add New Task" },
        { to: "/dashboard/my-tasks", label: "📋 My Tasks" },
        { to: "/dashboard/task-to-review", label: "👀 Task To Review" },
        { to: "/dashboard/purchase-coin", label: "🪙 Purchase Coin" },
        { to: "/dashboard/payment-history", label: "💳 Payment History" },
    ];

    const adminLinks = [
        { to: "/dashboard/admin-home", label: "🏠 Home" },
        { to: "/dashboard/manage-users", label: "👥 Manage Users" },
        { to: "/dashboard/manage-tasks", label: "📋 Manage Tasks" },
        { to: "/dashboard/withdraw-requests", label: "💰 Withdraw Requests" },
    ];

    const links = role === "admin" ? adminLinks : role === "buyer" ? buyerLinks : workerLinks;

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-violet-900 text-white transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:relative lg:translate-x-0`}>
                <div className="p-4 border-b border-violet-700">
                    <Link to="/" className="text-2xl font-bold">Micro<span className="text-yellow-400">Task</span></Link>
                </div>
                <div className="p-4 border-b border-violet-700 flex items-center gap-3">
                    <img src={user?.photoURL || "https://i.ibb.co/5GzXkwq/user.png"} alt="user" className="w-10 h-10 rounded-full object-cover border-2 border-yellow-400" />
                    <div>
                        <p className="font-semibold text-sm truncate">{user?.displayName}</p>
                        <p className="text-xs text-violet-300 capitalize">{role}</p>
                        <p className="text-xs text-yellow-400">🪙 {userInfo?.coins || 0}</p>
                    </div>
                </div>
                <nav className="p-4 space-y-2">
                    {links.map((link) => (
                        <Link key={link.to} to={link.to} onClick={() => setSidebarOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-violet-700 transition text-sm">
                            {link.label}
                        </Link>
                    ))}
                    <Link to="/" className="block px-3 py-2 rounded-lg hover:bg-violet-700 transition text-sm">🌐 Home</Link>
                </nav>
            </div>

            {/* Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 bg-black opacity-50 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <header className="bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-30">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-gray-600 text-2xl">☰</button>
                    <div className="flex items-center gap-3 ml-auto">
                        <span className="bg-violet-100 text-violet-800 px-3 py-1 rounded-full text-sm font-semibold">🪙 {userInfo?.coins || 0}</span>
                        <img src={user?.photoURL || "https://i.ibb.co/5GzXkwq/user.png"} alt="user" className="w-9 h-9 rounded-full object-cover border-2 border-violet-400" />
                        <button onClick={handleLogout} className="bg-violet-900 text-white px-3 py-1 rounded text-sm hover:bg-violet-700 transition">Logout</button>
                    </div>
                </header>
                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
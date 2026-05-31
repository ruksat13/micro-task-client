import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DashboardLayout = () => {
    const { user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-violet-900 text-white transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } lg:relative lg:translate-x-0`}
            >
                <div className="p-4 border-b border-violet-700">
                    <h1 className="text-xl font-bold">MicroTask</h1>
                </div>
                <div className="p-4">
                    <p className="text-sm text-violet-300">Welcome,</p>
                    <p className="font-semibold truncate">{user?.displayName}</p>
                </div>
                <nav className="p-4">
                    {/* Navigation links will be added later */}
                </nav>
            </div>

            {/* Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black opacity-50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <header className="bg-white shadow-sm p-4 flex items-center justify-between">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="lg:hidden text-gray-600"
                    >
                        ☰
                    </button>
                    <div className="flex items-center gap-3 ml-auto">
                        <img
                            src={user?.photoURL || "https://i.ibb.co/5GzXkwq/user.png"}
                            alt="user"
                            className="w-9 h-9 rounded-full object-cover"
                        />
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
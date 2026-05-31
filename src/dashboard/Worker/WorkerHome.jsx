import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const WorkerHome = () => {
    const { user } = useAuth();
    const token = localStorage.getItem("access-token");

    const { data: submissions = [] } = useQuery({
        queryKey: ["workerSubmissions", user?.email],
        queryFn: async () => {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/submissions/worker/${user.email}?limit=100`,
                { headers: { authorization: `Bearer ${token}` } }
            );
            return res.data.submissions || [];
        },
    });

    const totalSubmissions = submissions.length;
    const totalPending = submissions.filter((s) => s.status === "pending").length;
    const totalEarning = submissions
        .filter((s) => s.status === "approved")
        .reduce((sum, s) => sum + (s.payable_amount || 0), 0);

    const stats = [
        { label: "Total Submissions", value: totalSubmissions, icon: "📝", color: "bg-blue-100 text-blue-800" },
        { label: "Pending Submissions", value: totalPending, icon: "⏳", color: "bg-yellow-100 text-yellow-800" },
        { label: "Total Earnings", value: `🪙 ${totalEarning}`, icon: "💰", color: "bg-green-100 text-green-800" },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold text-violet-900 mb-6">Worker Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className={`rounded-xl p-6 shadow ${stat.color}`}>
                        <div className="text-4xl mb-2">{stat.icon}</div>
                        <p className="text-3xl font-bold">{stat.value}</p>
                        <p className="text-sm font-medium mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="mt-8 bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-bold text-violet-900 mb-4">Recent Approved Submissions</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-violet-50">
                            <tr>
                                <th className="px-4 py-2 text-left">Task Title</th>
                                <th className="px-4 py-2 text-left">Buyer</th>
                                <th className="px-4 py-2 text-left">Amount</th>
                                <th className="px-4 py-2 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {submissions.filter((s) => s.status === "approved").slice(0, 5).map((s, i) => (
                                <tr key={i} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-2">{s.task_title}</td>
                                    <td className="px-4 py-2">{s.buyer_name}</td>
                                    <td className="px-4 py-2">🪙 {s.payable_amount}</td>
                                    <td className="px-4 py-2">
                                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">Approved</span>
                                    </td>
                                </tr>
                            ))}
                            {submissions.filter((s) => s.status === "approved").length === 0 && (
                                <tr><td colSpan="4" className="text-center py-4 text-gray-400">No approved submissions yet</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default WorkerHome;
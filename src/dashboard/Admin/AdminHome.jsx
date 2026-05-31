import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const AdminHome = () => {
    const token = localStorage.getItem("access-token");

    const { data: stats = {} } = useQuery({
        queryKey: ["adminStats"],
        queryFn: async () => {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/admin-stats`,
                { headers: { authorization: `Bearer ${token}` } }
            );
            return res.data;
        },
    });

    const cards = [
        { label: "Total Workers", value: stats.totalWorkers || 0, icon: "👷", color: "bg-blue-100 text-blue-800" },
        { label: "Total Buyers", value: stats.totalBuyers || 0, icon: "🛒", color: "bg-purple-100 text-purple-800" },
        { label: "Total Coins", value: `🪙 ${stats.totalCoins || 0}`, icon: "💰", color: "bg-yellow-100 text-yellow-800" },
        { label: "Total Payments", value: `$${(stats.totalPayments || 0).toFixed(2)}`, icon: "💳", color: "bg-green-100 text-green-800" },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold text-violet-900 mb-6">Admin Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <div key={i} className={`rounded-xl p-6 shadow ${card.color}`}>
                        <div className="text-4xl mb-2">{card.icon}</div>
                        <p className="text-3xl font-bold">{card.value}</p>
                        <p className="text-sm font-medium mt-1">{card.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminHome;
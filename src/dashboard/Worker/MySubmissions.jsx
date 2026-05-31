import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const MySubmissions = () => {
    const { user } = useAuth();
    const token = localStorage.getItem("access-token");
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data = {} } = useQuery({
        queryKey: ["mySubmissions", user?.email, page],
        queryFn: async () => {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/submissions/worker/${user.email}?page=${page}&limit=${limit}`,
                { headers: { authorization: `Bearer ${token}` } }
            );
            return res.data;
        },
    });

    const { submissions = [], totalPages = 1 } = data;

    const statusColor = (status) => {
        if (status === "approved") return "bg-green-100 text-green-700";
        if (status === "rejected") return "bg-red-100 text-red-700";
        return "bg-yellow-100 text-yellow-700";
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-violet-900 mb-6">My Submissions</h1>
            <div className="bg-white rounded-xl shadow overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-violet-50">
                        <tr>
                            <th className="px-4 py-3 text-left">#</th>
                            <th className="px-4 py-3 text-left">Task Title</th>
                            <th className="px-4 py-3 text-left">Buyer</th>
                            <th className="px-4 py-3 text-left">Amount</th>
                            <th className="px-4 py-3 text-left">Date</th>
                            <th className="px-4 py-3 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {submissions.length === 0 ? (
                            <tr><td colSpan="6" className="text-center py-8 text-gray-400">No submissions yet</td></tr>
                        ) : (
                            submissions.map((s, i) => (
                                <tr key={s._id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3">{(page - 1) * limit + i + 1}</td>
                                    <td className="px-4 py-3">{s.task_title}</td>
                                    <td className="px-4 py-3">{s.buyer_name}</td>
                                    <td className="px-4 py-3">🪙 {s.payable_amount}</td>
                                    <td className="px-4 py-3">{new Date(s.current_date).toLocaleDateString()}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor(s.status)}`}>
                                            {s.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold ${page === p ? "bg-violet-900 text-white" : "bg-white text-violet-900 border border-violet-900 hover:bg-violet-50"}`}
                    >
                        {p}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MySubmissions;
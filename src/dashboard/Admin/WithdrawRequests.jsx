import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const WithdrawRequests = () => {
    const token = localStorage.getItem("access-token");
    const queryClient = useQueryClient();

    const { data: withdrawals = [] } = useQuery({
        queryKey: ["withdrawals"],
        queryFn: async () => {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/withdrawals`,
                { headers: { authorization: `Bearer ${token}` } }
            );
            return res.data;
        },
    });

    const handleApprove = async (withdrawal) => {
        try {
            await axios.patch(
                `${import.meta.env.VITE_API_URL}/withdrawals/${withdrawal._id}`,
                { status: "approved" },
                { headers: { authorization: `Bearer ${token}` } }
            );
            toast.success("Payment approved!");
            queryClient.invalidateQueries(["withdrawals"]);
        } catch {
            toast.error("Failed to approve!");
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-violet-900 mb-6">Withdraw Requests</h1>
            <div className="bg-white rounded-xl shadow overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-violet-50">
                        <tr>
                            <th className="px-4 py-3 text-left">Worker</th>
                            <th className="px-4 py-3 text-left">Email</th>
                            <th className="px-4 py-3 text-left">Coins</th>
                            <th className="px-4 py-3 text-left">Amount</th>
                            <th className="px-4 py-3 text-left">Payment</th>
                            <th className="px-4 py-3 text-left">Account</th>
                            <th className="px-4 py-3 text-left">Date</th>
                            <th className="px-4 py-3 text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {withdrawals.length === 0 ? (
                            <tr><td colSpan="8" className="text-center py-8 text-gray-400">No pending withdrawal requests</td></tr>
                        ) : (
                            withdrawals.map((w) => (
                                <tr key={w._id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium">{w.worker_name}</td>
                                    <td className="px-4 py-3 text-gray-500">{w.worker_email}</td>
                                    <td className="px-4 py-3">🪙 {w.withdrawal_coin}</td>
                                    <td className="px-4 py-3 text-green-600 font-semibold">${w.withdrawal_amount}</td>
                                    <td className="px-4 py-3 capitalize">{w.payment_system}</td>
                                    <td className="px-4 py-3">{w.account_number}</td>
                                    <td className="px-4 py-3">{new Date(w.withdraw_date).toLocaleDateString()}</td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => handleApprove(w)}
                                            className="bg-green-100 text-green-700 px-3 py-1 rounded text-xs font-semibold hover:bg-green-200"
                                        >
                                            Payment Success
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default WithdrawRequests;
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const PaymentHistory = () => {
    const { user } = useAuth();
    const token = localStorage.getItem("access-token");

    const { data: payments = [] } = useQuery({
        queryKey: ["buyerPayments", user?.email],
        queryFn: async () => {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/payments/${user.email}`,
                { headers: { authorization: `Bearer ${token}` } }
            );
            return res.data;
        },
    });

    return (
        <div>
            <h1 className="text-2xl font-bold text-violet-900 mb-6">Payment History</h1>
            <div className="bg-white rounded-xl shadow overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-violet-50">
                        <tr>
                            <th className="px-4 py-3 text-left">#</th>
                            <th className="px-4 py-3 text-left">Coins</th>
                            <th className="px-4 py-3 text-left">Amount</th>
                            <th className="px-4 py-3 text-left">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.length === 0 ? (
                            <tr><td colSpan="4" className="text-center py-8 text-gray-400">No payments yet</td></tr>
                        ) : (
                            payments.map((p, i) => (
                                <tr key={p._id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3">{i + 1}</td>
                                    <td className="px-4 py-3">🪙 {p.coins}</td>
                                    <td className="px-4 py-3 text-green-600 font-semibold">${p.amount}</td>
                                    <td className="px-4 py-3">{new Date(p.date).toLocaleDateString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PaymentHistory;
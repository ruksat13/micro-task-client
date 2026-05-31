import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const TaskToReview = () => {
    const { user } = useAuth();
    const token = localStorage.getItem("access-token");
    const queryClient = useQueryClient();
    const [viewSubmission, setViewSubmission] = useState(null);

    const { data: submissions = [] } = useQuery({
        queryKey: ["buyerSubmissions", user?.email],
        queryFn: async () => {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/submissions/buyer/${user.email}`,
                { headers: { authorization: `Bearer ${token}` } }
            );
            return res.data;
        },
    });

    const handleApprove = async (submission) => {
        try {
            await axios.patch(
                `${import.meta.env.VITE_API_URL}/submissions/${submission._id}`,
                {
                    status: "approved",
                    payable_amount: submission.payable_amount,
                    worker_email: submission.worker_email,
                    task_id: submission.task_id,
                },
                { headers: { authorization: `Bearer ${token}` } }
            );
            toast.success("Submission approved!");
            queryClient.invalidateQueries(["buyerSubmissions"]);
        } catch {
            toast.error("Failed to approve!");
        }
    };

    const handleReject = async (submission) => {
        try {
            await axios.patch(
                `${import.meta.env.VITE_API_URL}/submissions/${submission._id}`,
                {
                    status: "rejected",
                    task_id: submission.task_id,
                    worker_email: submission.worker_email,
                    payable_amount: submission.payable_amount,
                },
                { headers: { authorization: `Bearer ${token}` } }
            );
            toast.success("Submission rejected!");
            queryClient.invalidateQueries(["buyerSubmissions"]);
        } catch {
            toast.error("Failed to reject!");
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-violet-900 mb-6">Task To Review</h1>
            <div className="bg-white rounded-xl shadow overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-violet-50">
                        <tr>
                            <th className="px-4 py-3 text-left">Worker</th>
                            <th className="px-4 py-3 text-left">Task Title</th>
                            <th className="px-4 py-3 text-left">Amount</th>
                            <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {submissions.length === 0 ? (
                            <tr><td colSpan="4" className="text-center py-8 text-gray-400">No pending submissions</td></tr>
                        ) : (
                            submissions.map((s) => (
                                <tr key={s._id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3">{s.worker_name}</td>
                                    <td className="px-4 py-3">{s.task_title}</td>
                                    <td className="px-4 py-3">🪙 {s.payable_amount}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setViewSubmission(s)}
                                                className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs font-semibold hover:bg-blue-200"
                                            >
                                                View
                                            </button>
                                            <button
                                                onClick={() => handleApprove(s)}
                                                className="bg-green-100 text-green-700 px-3 py-1 rounded text-xs font-semibold hover:bg-green-200"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleReject(s)}
                                                className="bg-red-100 text-red-700 px-3 py-1 rounded text-xs font-semibold hover:bg-red-200"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* View Modal */}
            {viewSubmission && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold text-violet-900 mb-4">Submission Details</h2>
                        <div className="space-y-3 text-sm">
                            <p><span className="font-semibold">Worker:</span> {viewSubmission.worker_name}</p>
                            <p><span className="font-semibold">Task:</span> {viewSubmission.task_title}</p>
                            <p><span className="font-semibold">Amount:</span> 🪙 {viewSubmission.payable_amount}</p>
                            <p><span className="font-semibold">Date:</span> {new Date(viewSubmission.current_date).toLocaleDateString()}</p>
                            <div>
                                <p className="font-semibold mb-1">Submission Details:</p>
                                <p className="bg-gray-50 rounded-lg p-3 text-gray-700">{viewSubmission.submission_details}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setViewSubmission(null)}
                            className="mt-4 w-full bg-violet-900 text-white py-2 rounded-lg font-semibold hover:bg-violet-700 transition"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskToReview;
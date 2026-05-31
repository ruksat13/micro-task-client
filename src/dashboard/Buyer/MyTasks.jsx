import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const MyTasks = () => {
    const { user } = useAuth();
    const token = localStorage.getItem("access-token");
    const queryClient = useQueryClient();
    const [editTask, setEditTask] = useState(null);
    const { register, handleSubmit, reset } = useForm();

    const { data: tasks = [] } = useQuery({
        queryKey: ["buyerTasks", user?.email],
        queryFn: async () => {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/tasks/buyer/${user.email}`,
                { headers: { authorization: `Bearer ${token}` } }
            );
            return res.data;
        },
    });

    const { data: userInfo = {} } = useQuery({
        queryKey: ["userInfo", user?.email],
        queryFn: async () => {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/users/${user.email}`,
                { headers: { authorization: `Bearer ${token}` } }
            );
            return res.data;
        },
    });

    const handleDelete = async (task) => {
        const refill = task.required_workers * task.payable_amount;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/tasks/${task._id}`, {
                headers: { authorization: `Bearer ${token}` },
            });
            await axios.patch(
                `${import.meta.env.VITE_API_URL}/users/${user.email}`,
                { coins: (userInfo.coins || 0) + refill },
                { headers: { authorization: `Bearer ${token}` } }
            );
            toast.success("Task deleted! Coins refunded.");
            queryClient.invalidateQueries(["buyerTasks"]);
            queryClient.invalidateQueries(["userInfo"]);
        } catch {
            toast.error("Failed to delete task!");
        }
    };

    const handleEdit = (task) => {
        setEditTask(task);
        reset({
            task_title: task.task_title,
            task_detail: task.task_detail,
            submission_info: task.submission_info,
        });
    };

    const onUpdate = async (data) => {
        try {
            await axios.put(
                `${import.meta.env.VITE_API_URL}/tasks/${editTask._id}`,
                {
                    task_title: data.task_title,
                    task_detail: data.task_detail,
                    submission_info: data.submission_info,
                },
                { headers: { authorization: `Bearer ${token}` } }
            );
            toast.success("Task updated!");
            setEditTask(null);
            queryClient.invalidateQueries(["buyerTasks"]);
        } catch {
            toast.error("Update failed!");
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-violet-900 mb-6">My Tasks</h1>
            <div className="bg-white rounded-xl shadow overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-violet-50">
                        <tr>
                            <th className="px-4 py-3 text-left">Title</th>
                            <th className="px-4 py-3 text-left">Workers</th>
                            <th className="px-4 py-3 text-left">Amount</th>
                            <th className="px-4 py-3 text-left">Deadline</th>
                            <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.length === 0 ? (
                            <tr><td colSpan="5" className="text-center py-8 text-gray-400">No tasks added yet</td></tr>
                        ) : (
                            tasks.map((task) => (
                                <tr key={task._id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium">{task.task_title}</td>
                                    <td className="px-4 py-3">{task.required_workers}</td>
                                    <td className="px-4 py-3">🪙 {task.payable_amount}</td>
                                    <td className="px-4 py-3">{task.completion_date}</td>
                                    <td className="px-4 py-3 flex gap-2">
                                        <button
                                            onClick={() => handleEdit(task)}
                                            className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs font-semibold hover:bg-blue-200"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(task)}
                                            className="bg-red-100 text-red-700 px-3 py-1 rounded text-xs font-semibold hover:bg-red-200"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {editTask && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold text-violet-900 mb-4">Edit Task</h2>
                        <form onSubmit={handleSubmit(onUpdate)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                                <input
                                    {...register("task_title", { required: true })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Task Detail</label>
                                <textarea
                                    {...register("task_detail", { required: true })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 min-h-20"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Submission Info</label>
                                <input
                                    {...register("submission_info", { required: true })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button type="submit" className="flex-1 bg-violet-900 text-white py-2 rounded-lg font-semibold hover:bg-violet-700 transition">
                                    Update
                                </button>
                                <button type="button" onClick={() => setEditTask(null)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyTasks;
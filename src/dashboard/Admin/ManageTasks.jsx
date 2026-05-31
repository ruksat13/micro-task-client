import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const ManageTasks = () => {
    const token = localStorage.getItem("access-token");
    const queryClient = useQueryClient();

    const { data: tasks = [] } = useQuery({
        queryKey: ["adminTasks"],
        queryFn: async () => {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/tasks/all`,
                { headers: { authorization: `Bearer ${token}` } }
            );
            return res.data;
        },
    });

    const handleDelete = async (id) => {
        try {
            await axios.delete(
                `${import.meta.env.VITE_API_URL}/tasks/${id}`,
                { headers: { authorization: `Bearer ${token}` } }
            );
            toast.success("Task deleted!");
            queryClient.invalidateQueries(["adminTasks"]);
        } catch {
            toast.error("Failed to delete task!");
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-violet-900 mb-6">Manage Tasks</h1>
            <div className="bg-white rounded-xl shadow overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-violet-50">
                        <tr>
                            <th className="px-4 py-3 text-left">Title</th>
                            <th className="px-4 py-3 text-left">Buyer</th>
                            <th className="px-4 py-3 text-left">Workers</th>
                            <th className="px-4 py-3 text-left">Amount</th>
                            <th className="px-4 py-3 text-left">Deadline</th>
                            <th className="px-4 py-3 text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.length === 0 ? (
                            <tr><td colSpan="6" className="text-center py-8 text-gray-400">No tasks found</td></tr>
                        ) : (
                            tasks.map((task) => (
                                <tr key={task._id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium">{task.task_title}</td>
                                    <td className="px-4 py-3">{task.buyer_name}</td>
                                    <td className="px-4 py-3">{task.required_workers}</td>
                                    <td className="px-4 py-3">🪙 {task.payable_amount}</td>
                                    <td className="px-4 py-3">{task.completion_date}</td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => handleDelete(task._id)}
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
        </div>
    );
};

export default ManageTasks;
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TaskList = () => {
    const token = localStorage.getItem("access-token");
    const navigate = useNavigate();

    const { data: tasks = [] } = useQuery({
        queryKey: ["tasks"],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/tasks`, {
                headers: { authorization: `Bearer ${token}` },
            });
            return res.data;
        },
    });

    return (
        <div>
            <h1 className="text-2xl font-bold text-violet-900 mb-6">Available Tasks</h1>
            {tasks.length === 0 ? (
                <p className="text-center text-gray-400 py-10">No tasks available</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tasks.map((task) => (
                        <div key={task._id} className="bg-white rounded-xl shadow p-5 hover:shadow-lg transition">
                            <img
                                src={task.task_image_url || "https://i.ibb.co/5GzXkwq/user.png"}
                                alt={task.task_title}
                                className="w-full h-40 object-cover rounded-lg mb-3"
                            />
                            <h3 className="font-bold text-violet-900 text-lg mb-1 truncate">{task.task_title}</h3>
                            <p className="text-sm text-gray-500 mb-1">👤 {task.buyer_name}</p>
                            <p className="text-sm text-gray-500 mb-1">📅 {task.completion_date}</p>
                            <p className="text-sm text-gray-500 mb-1">👥 Workers needed: {task.required_workers}</p>
                            <p className="text-sm font-semibold text-violet-700 mb-3">🪙 {task.payable_amount} coins/task</p>
                            <button
                                onClick={() => navigate(`/dashboard/task-details/${task._id}`)}
                                className="w-full bg-violet-900 text-white py-2 rounded-lg hover:bg-violet-700 transition text-sm font-semibold"
                            >
                                View Details
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TaskList;
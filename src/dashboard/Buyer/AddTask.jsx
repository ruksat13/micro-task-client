import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const AddTask = () => {
    const { user } = useAuth();
    const token = localStorage.getItem("access-token");
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

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

    const requiredWorkers = parseInt(watch("required_workers")) || 0;
    const payableAmount = parseInt(watch("payable_amount")) || 0;
    const totalCost = requiredWorkers * payableAmount;

    const onSubmit = async (data) => {
        const total = parseInt(data.required_workers) * parseInt(data.payable_amount);
        if (total > userInfo.coins) {
            toast.error("Not enough coins! Purchase more coins.");
            navigate("/dashboard/purchase-coin");
            return;
        }
        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/tasks`,
                {
                    task_title: data.task_title,
                    task_detail: data.task_detail,
                    required_workers: parseInt(data.required_workers),
                    payable_amount: parseInt(data.payable_amount),
                    completion_date: data.completion_date,
                    submission_info: data.submission_info,
                    task_image_url: data.task_image_url,
                    buyer_name: user.displayName,
                    buyer_email: user.email,
                    created_at: new Date(),
                },
                { headers: { authorization: `Bearer ${token}` } }
            );
            await axios.patch(
                `${import.meta.env.VITE_API_URL}/users/${user.email}`,
                { coins: userInfo.coins - total },
                { headers: { authorization: `Bearer ${token}` } }
            );
            toast.success("Task added successfully!");
            queryClient.invalidateQueries(["userInfo"]);
            navigate("/dashboard/my-tasks");
        } catch (err) {
            toast.error("Failed to add task!");
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-violet-900 mb-6">Add New Task</h1>
            <div className="bg-white rounded-xl shadow p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                        <input
                            {...register("task_title", { required: "Required" })}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                            placeholder="e.g. Watch my YouTube video and comment"
                        />
                        {errors.task_title && <p className="text-red-500 text-xs mt-1">{errors.task_title.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Task Detail</label>
                        <textarea
                            {...register("task_detail", { required: "Required" })}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 min-h-24"
                            placeholder="Describe the task in detail"
                        />
                        {errors.task_detail && <p className="text-red-500 text-xs mt-1">{errors.task_detail.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Required Workers</label>
                            <input
                                {...register("required_workers", { required: "Required", min: { value: 1, message: "Min 1" } })}
                                type="number"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                                placeholder="e.g. 100"
                            />
                            {errors.required_workers && <p className="text-red-500 text-xs mt-1">{errors.required_workers.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Payable Amount (coins)</label>
                            <input
                                {...register("payable_amount", { required: "Required", min: { value: 1, message: "Min 1" } })}
                                type="number"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                                placeholder="e.g. 10"
                            />
                            {errors.payable_amount && <p className="text-red-500 text-xs mt-1">{errors.payable_amount.message}</p>}
                        </div>
                    </div>

                    {totalCost > 0 && (
                        <div className={`p-3 rounded-lg text-sm font-semibold ${totalCost > (userInfo?.coins || 0) ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                            Total Cost: 🪙 {totalCost} | Your Balance: 🪙 {userInfo?.coins || 0}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Completion Date</label>
                        <input
                            {...register("completion_date", { required: "Required" })}
                            type="date"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        />
                        {errors.completion_date && <p className="text-red-500 text-xs mt-1">{errors.completion_date.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Submission Info</label>
                        <input
                            {...register("submission_info", { required: "Required" })}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                            placeholder="e.g. Screenshot of comment"
                        />
                        {errors.submission_info && <p className="text-red-500 text-xs mt-1">{errors.submission_info.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Task Image URL</label>
                        <input
                            {...register("task_image_url")}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-violet-900 text-white py-2 rounded-lg font-semibold hover:bg-violet-700 transition"
                    >
                        Add Task
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddTask;
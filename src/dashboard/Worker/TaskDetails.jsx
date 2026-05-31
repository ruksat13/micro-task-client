import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const TaskDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const token = localStorage.getItem("access-token");
    const { register, handleSubmit, formState: { errors } } = useForm();

    const { data: task = {} } = useQuery({
        queryKey: ["task", id],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/tasks/${id}`, {
                headers: { authorization: `Bearer ${token}` },
            });
            return res.data;
        },
    });

    const onSubmit = async (data) => {
        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/submissions`,
                {
                    task_id: task._id,
                    task_title: task.task_title,
                    payable_amount: task.payable_amount,
                    worker_email: user.email,
                    worker_name: user.displayName,
                    buyer_name: task.buyer_name,
                    buyer_email: task.buyer_email,
                    submission_details: data.submission_details,
                    current_date: new Date(),
                    status: "pending",
                },
                { headers: { authorization: `Bearer ${token}` } }
            );
            toast.success("Submission successful!");
            navigate("/dashboard/task-list");
        } catch (err) {
            toast.error("Submission failed!");
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow p-6 mb-6">
                <img src={task.task_image_url} alt={task.task_title} className="w-full h-48 object-cover rounded-lg mb-4" />
                <h1 className="text-2xl font-bold text-violet-900 mb-2">{task.task_title}</h1>
                <p className="text-gray-600 mb-4">{task.task_detail}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <p><span className="font-semibold">Buyer:</span> {task.buyer_name}</p>
                    <p><span className="font-semibold">Deadline:</span> {task.completion_date}</p>
                    <p><span className="font-semibold">Workers Needed:</span> {task.required_workers}</p>
                    <p><span className="font-semibold">Reward:</span> 🪙 {task.payable_amount}</p>
                    <p className="col-span-2"><span className="font-semibold">Submission Info:</span> {task.submission_info}</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-bold text-violet-900 mb-4">Submit Your Work</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <textarea
                        {...register("submission_details", { required: "Submission details required" })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 min-h-32"
                        placeholder="Enter your submission details, proof link, screenshot URL, etc."
                    />
                    {errors.submission_details && <p className="text-red-500 text-xs mt-1">{errors.submission_details.message}</p>}
                    <button type="submit" className="mt-4 w-full bg-violet-900 text-white py-2 rounded-lg hover:bg-violet-700 transition font-semibold">
                        Submit Task
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TaskDetails;
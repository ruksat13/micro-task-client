import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const ManageUsers = () => {
    const token = localStorage.getItem("access-token");
    const queryClient = useQueryClient();

    const { data: users = [] } = useQuery({
        queryKey: ["allUsers"],
        queryFn: async () => {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/users`,
                { headers: { authorization: `Bearer ${token}` } }
            );
            return res.data;
        },
    });

    const handleRoleChange = async (email, role) => {
        try {
            await axios.patch(
                `${import.meta.env.VITE_API_URL}/users/${email}`,
                { role },
                { headers: { authorization: `Bearer ${token}` } }
            );
            toast.success("Role updated!");
            queryClient.invalidateQueries(["allUsers"]);
        } catch {
            toast.error("Failed to update role!");
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(
                `${import.meta.env.VITE_API_URL}/users/${id}`,
                { headers: { authorization: `Bearer ${token}` } }
            );
            toast.success("User deleted!");
            queryClient.invalidateQueries(["allUsers"]);
        } catch {
            toast.error("Failed to delete user!");
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-violet-900 mb-6">Manage Users</h1>
            <div className="bg-white rounded-xl shadow overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-violet-50">
                        <tr>
                            <th className="px-4 py-3 text-left">User</th>
                            <th className="px-4 py-3 text-left">Email</th>
                            <th className="px-4 py-3 text-left">Role</th>
                            <th className="px-4 py-3 text-left">Coins</th>
                            <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr><td colSpan="5" className="text-center py-8 text-gray-400">No users found</td></tr>
                        ) : (
                            users.map((u) => (
                                <tr key={u._id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={u.photo || "https://i.ibb.co/5GzXkwq/user.png"}
                                                alt={u.name}
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                            <span className="font-medium">{u.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500">{u.email}</td>
                                    <td className="px-4 py-3">
                                        <select
                                            defaultValue={u.role}
                                            onChange={(e) => handleRoleChange(u.email, e.target.value)}
                                            className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-violet-500"
                                        >
                                            <option value="worker">Worker</option>
                                            <option value="buyer">Buyer</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-3">🪙 {u.coins || 0}</td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => handleDelete(u._id)}
                                            className="bg-red-100 text-red-700 px-3 py-1 rounded text-xs font-semibold hover:bg-red-200"
                                        >
                                            Remove
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

export default ManageUsers;
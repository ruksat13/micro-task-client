import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import axios from "axios";

const Register = () => {
    const { createUser, googleSignIn, updateUserProfile } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm();

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const result = await createUser(data.email, data.password);
            await updateUserProfile(data.name, data.photoURL);
            const coins = data.role === "worker" ? 10 : 50;
            await axios.post(`${import.meta.env.VITE_API_URL}/users`, {
                name: data.name,
                email: data.email,
                photo: data.photoURL,
                role: data.role,
                coins,
            });
            toast.success("Registration successful!");
            navigate("/dashboard");
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = async () => {
        try {
            const result = await googleSignIn();
            const user = result.user;
            await axios.post(`${import.meta.env.VITE_API_URL}/users`, {
                name: user.displayName,
                email: user.email,
                photo: user.photoURL,
                role: "worker",
                coins: 10,
            });
            toast.success("Login successful!");
            navigate("/dashboard");
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-violet-900 mb-6">Create Account</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            {...register("name", { required: "Name is required" })}
                            type="text"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                            placeholder="Your full name"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            {...register("email", {
                                required: "Email is required",
                                pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                            })}
                            type="email"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                            placeholder="your@email.com"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture URL</label>
                        <input
                            {...register("photoURL", { required: "Photo URL is required" })}
                            type="text"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                            placeholder="https://example.com/photo.jpg"
                        />
                        {errors.photoURL && <p className="text-red-500 text-xs mt-1">{errors.photoURL.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select
                            {...register("role", { required: "Role is required" })}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        >
                            <option value="">Select role</option>
                            <option value="worker">Worker (10 coins)</option>
                            <option value="buyer">Buyer (50 coins)</option>
                        </select>
                        {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            {...register("password", {
                                required: "Password is required",
                                minLength: { value: 6, message: "Min 6 characters" },
                                pattern: {
                                    value: /^(?=.*[A-Z])(?=.*[0-9])/,
                                    message: "Must have uppercase and number",
                                },
                            })}
                            type="password"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-violet-900 text-white py-2 rounded-lg font-semibold hover:bg-violet-700 transition disabled:opacity-50"
                    >
                        {loading ? "Creating..." : "Register"}
                    </button>
                </form>

                <div className="divider my-4 text-center text-gray-400">OR</div>

                <button
                    onClick={handleGoogle}
                    className="w-full border border-gray-300 py-2 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2"
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="google" />
                    Continue with Google
                </button>

                <p className="text-center text-sm text-gray-600 mt-4">
                    Already have an account?{" "}
                    <Link to="/login" className="text-violet-700 font-semibold hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
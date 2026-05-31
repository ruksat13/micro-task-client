import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import axios from "axios";

const Login = () => {
    const { signIn, googleSignIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/dashboard";
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await signIn(data.email, data.password);
            toast.success("Login successful!");
            navigate(from, { replace: true });
        } catch (err) {
            toast.error("Invalid email or password");
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
            navigate(from, { replace: true });
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-violet-900 mb-6">Welcome Back</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            {...register("password", { required: "Password is required" })}
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
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <div className="my-4 text-center text-gray-400">OR</div>

                <button
                    onClick={handleGoogle}
                    className="w-full border border-gray-300 py-2 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2"
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="google" />
                    Continue with Google
                </button>

                <p className="text-center text-sm text-gray-600 mt-4">
                    Do not have an account?{" "}
                    <Link to="/register" className="text-violet-700 font-semibold hover:underline">Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
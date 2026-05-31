import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  return (
    <nav className="bg-violet-900 text-white px-4 py-3 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold tracking-wide">
          Micro<span className="text-yellow-400">Task</span>
        </Link>
        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <Link to="/login" className="hover:text-yellow-400 transition">Login</Link>
              <Link to="/register" className="hover:text-yellow-400 transition">Register</Link>
              <a href="https://github.com/ruksat13/micro-task-client" target="_blank" rel="noreferrer" className="bg-yellow-400 text-violet-900 px-3 py-1 rounded font-semibold text-sm">
                Join as Developer
              </a>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="hover:text-yellow-400 transition">Dashboard</Link>
              <span className="bg-violet-700 px-3 py-1 rounded-full text-sm">🪙 0</span>
              <a href="https://github.com/ruksat13/micro-task-client" target="_blank" rel="noreferrer" className="bg-yellow-400 text-violet-900 px-3 py-1 rounded font-semibold text-sm">
                Join as Developer
              </a>
              <div className="relative group">
                <img
                  src={user?.photoURL || "https://i.ibb.co/5GzXkwq/user.png"}
                  alt="user"
                  className="w-9 h-9 rounded-full object-cover cursor-pointer border-2 border-yellow-400"
                />
                <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded shadow-lg hidden group-hover:block z-50">
                  <p className="px-4 py-2 text-sm font-semibold border-b truncate">{user?.displayName}</p>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm hover:bg-violet-100 transition">
                    Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoadingSpinner = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 8000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen gap-4">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-violet-600"></div>
      <p className="text-gray-500 text-sm">Loading... please wait</p>
    </div>
  );
};

export default LoadingSpinner;
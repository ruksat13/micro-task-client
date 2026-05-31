import { Link } from "react-router-dom";

const ErrorPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-9xl font-bold text-violet-900">404</h1>
            <p className="text-2xl font-semibold text-gray-600 mt-4">Page Not Found</p>
            <Link to="/" className="mt-6 bg-violet-900 text-white px-6 py-2 rounded hover:bg-violet-700 transition">
                Go Home
            </Link>
        </div>
    );
};

export default ErrorPage;
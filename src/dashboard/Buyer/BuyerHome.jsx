import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const BuyerHome = () => {
  const { user } = useAuth();
  const token = localStorage.getItem("access-token");

  const { data: tasks = [] } = useQuery({
    queryKey: ["buyerTasks", user?.email],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/tasks/buyer/${user.email}`,
        { headers: { authorization: `Bearer ${token}` } }
      );
      return res.data;
    },
  });

  const { data: payments = [] } = useQuery({
    queryKey: ["buyerPayments", user?.email],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/payments/${user.email}`,
        { headers: { authorization: `Bearer ${token}` } }
      );
      return res.data;
    },
  });

  const totalTasks = tasks.length;
  const pendingWorkers = tasks.reduce((sum, t) => sum + (t.required_workers || 0), 0);
  const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  const stats = [
    { label: "Total Tasks", value: totalTasks, icon: "📋", color: "bg-blue-100 text-blue-800" },
    { label: "Pending Workers", value: pendingWorkers, icon: "⏳", color: "bg-yellow-100 text-yellow-800" },
    { label: "Total Paid", value: `$${totalPaid.toFixed(2)}`, icon: "💳", color: "bg-green-100 text-green-800" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-violet-900 mb-6">Buyer Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className={`rounded-xl p-6 shadow ${stat.color}`}>
            <div className="text-4xl mb-2">{stat.icon}</div>
            <p className="text-3xl font-bold">{stat.value}</p>
            <p className="text-sm font-medium mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuyerHome;
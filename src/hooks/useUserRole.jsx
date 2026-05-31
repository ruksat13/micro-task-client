import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const useUserRole = () => {
  const { user, loading } = useAuth();

  const { data: userInfo = {}, isLoading } = useQuery({
    queryKey: ["userRole", user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const token = localStorage.getItem("access-token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${user.email}`,
        { headers: { authorization: `Bearer ${token}` } }
      );
      return res.data;
    },
  });

  return { userInfo, isLoading, role: userInfo?.role };
};

export default useUserRole;
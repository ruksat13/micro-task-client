import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const useUserRole = () => {
  const { user, loading } = useAuth();

  const { data: userInfo = {}, isLoading } = useQuery({
    queryKey: ["userRole", user?.email],
    enabled: !loading && !!user?.email,
    retry: 3,
    queryFn: async () => {
      const token = localStorage.getItem("access-token");
      if (!token) return {};
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/${user.email}`,
          { headers: { authorization: `Bearer ${token}` } }
        );
        return res.data;
      } catch (err) {
        return {};
      }
    },
  });

  return { userInfo, isLoading, role: userInfo?.role };
};

export default useUserRole;
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const coinPackages = [
    { coins: 10, price: 1 },
    { coins: 150, price: 10 },
    { coins: 500, price: 20 },
    { coins: 1000, price: 35 },
];

const PurchaseCoin = () => {
    const { user } = useAuth();
    const token = localStorage.getItem("access-token");
    const queryClient = useQueryClient();

    const handlePurchase = async (pkg) => {
        try {
            // Dummy payment - direct coin add
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/users/${user.email}`,
                { headers: { authorization: `Bearer ${token}` } }
            );
            const currentCoins = res.data.coins || 0;

            await axios.patch(
                `${import.meta.env.VITE_API_URL}/users/${user.email}`,
                { coins: currentCoins + pkg.coins },
                { headers: { authorization: `Bearer ${token}` } }
            );

            await axios.post(
                `${import.meta.env.VITE_API_URL}/payments`,
                {
                    buyer_email: user.email,
                    buyer_name: user.displayName,
                    coins: pkg.coins,
                    amount: pkg.price,
                    date: new Date(),
                },
                { headers: { authorization: `Bearer ${token}` } }
            );

            toast.success(`🪙 ${pkg.coins} coins added successfully!`);
            queryClient.invalidateQueries(["userInfo"]);
        } catch {
            toast.error("Purchase failed!");
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-violet-900 mb-2">Purchase Coins</h1>
            <p className="text-gray-500 mb-8">Select a package to add coins to your account</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {coinPackages.map((pkg, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition hover:-translate-y-1 border-2 border-transparent hover:border-violet-400"
                    >
                        <div className="text-5xl mb-3">🪙</div>
                        <p className="text-3xl font-bold text-violet-900 mb-1">{pkg.coins}</p>
                        <p className="text-gray-400 text-sm mb-1">coins</p>
                        <div className="my-4 border-t border-gray-100" />
                        <p className="text-2xl font-bold text-green-600 mb-4">${pkg.price}</p>
                        <button
                            onClick={() => handlePurchase(pkg)}
                            className="w-full bg-violet-900 text-white py-2 rounded-lg font-semibold hover:bg-violet-700 transition"
                        >
                            Purchase
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-8 bg-violet-50 rounded-xl p-4 text-center text-sm text-violet-700">
                💡 10 coins = $1 | Coins are added instantly after purchase
            </div>
        </div>
    );
};

export default PurchaseCoin;
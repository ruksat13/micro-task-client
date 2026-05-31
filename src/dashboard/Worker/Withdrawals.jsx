import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const Withdrawals = () => {
    const { user } = useAuth();
    const token = localStorage.getItem("access-token");
    const queryClient = useQueryClient();

    const { data: userInfo = {} } = useQuery({
        queryKey: ["userInfo", user?.email],
        queryFn: async () => {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/users/${user.email}`,
                { headers: { authorization: `Bearer ${token}` } }
            );
            return res.data;
        },
    });

    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const coinToWithdraw = watch("withdrawal_coin", 0);
    const withdrawAmount = (coinToWithdraw / 20).toFixed(2);
    const hasEnoughCoins = userInfo?.coins >= 200;

    const onSubmit = async (data) => {
        if (data.withdrawal_coin > userInfo.coins) {
            toast.error("Insufficient coins!");
            return;
        }
        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/withdrawals`,
                {
                    worker_email: user.email,
                    worker_name: user.displayName,
                    withdrawal_coin: parseInt(data.withdrawal_coin),
                    withdrawal_amount: parseFloat(withdrawAmount),
                    payment_system: data.payment_system,
                    account_number: data.account_number,
                    withdraw_date: new Date(),
                    status: "pending",
                },
                { headers: { authorization: `Bearer ${token}` } }
            );
            toast.success("Withdrawal request submitted!");
            queryClient.invalidateQueries(["userInfo"]);
        } catch (err) {
            toast.error("Failed to submit withdrawal!");
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-violet-900 mb-6">Withdrawals</h1>

            <div className="bg-white rounded-xl shadow p-6 mb-6">
                <h2 className="text-lg font-bold text-violet-900 mb-4">Your Earnings</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-violet-50 rounded-lg p-4 text-center">
                        <p className="text-3xl font-bold text-violet-900">🪙 {userInfo?.coins || 0}</p>
                        <p className="text-sm text-gray-500 mt-1">Available Coins</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                        <p className="text-3xl font-bold text-green-700">${((userInfo?.coins || 0) / 20).toFixed(2)}</p>
                        <p className="text-sm text-gray-500 mt-1">Withdrawal Amount</p>
                    </div>
                </div>
                <p className="text-xs text-gray-400 mt-3 text-center">20 coins = $1 | Minimum withdrawal: 200 coins ($10)</p>
            </div>

            {!hasEnoughCoins ? (
                <div className="bg-red-50 rounded-xl p-6 text-center">
                    <p className="text-red-600 font-semibold text-lg">Insufficient Coins</p>
                    <p className="text-gray-500 text-sm mt-1">You need at least 200 coins to withdraw</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-lg font-bold text-violet-900 mb-4">Withdrawal Form</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Coins to Withdraw</label>
                            <input
                                {...register("withdrawal_coin", {
                                    required: "Required",
                                    min: { value: 200, message: "Minimum 200 coins" },
                                    max: { value: userInfo?.coins, message: "Cannot exceed available coins" },
                                })}
                                type="number"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                                placeholder="Enter coins to withdraw"
                            />
                            {errors.withdrawal_coin && <p className="text-red-500 text-xs mt-1">{errors.withdrawal_coin.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Withdrawal Amount ($)</label>
                            <input
                                type="text"
                                value={`$${withdrawAmount}`}
                                readOnly
                                className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-50 text-gray-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Payment System</label>
                            <select
                                {...register("payment_system", { required: "Required" })}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                            >
                                <option value="">Select payment system</option>
                                <option value="bkash">Bkash</option>
                                <option value="nagad">Nagad</option>
                                <option value="rocket">Rocket</option>
                                <option value="bank">Bank Transfer</option>
                            </select>
                            {errors.payment_system && <p className="text-red-500 text-xs mt-1">{errors.payment_system.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                            <input
                                {...register("account_number", { required: "Required" })}
                                type="text"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                                placeholder="Enter your account number"
                            />
                            {errors.account_number && <p className="text-red-500 text-xs mt-1">{errors.account_number.message}</p>}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-violet-900 text-white py-2 rounded-lg font-semibold hover:bg-violet-700 transition"
                        >
                            Withdraw
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Withdrawals;
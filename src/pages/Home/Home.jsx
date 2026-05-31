import { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const slides = [
    {
        title: "Complete Tasks & Earn Money",
        subtitle: "Join thousands of workers earning daily by completing simple micro tasks",
        bg: "from-violet-900 to-violet-700",
    },
    {
        title: "Post Tasks & Get Results Fast",
        subtitle: "Buyers can post tasks and get them completed by skilled workers worldwide",
        bg: "from-indigo-900 to-indigo-700",
    },
    {
        title: "Safe & Secure Payments",
        subtitle: "Your earnings are protected. Withdraw anytime with our secure payment system",
        bg: "from-purple-900 to-purple-700",
    },
];

const Home = () => {
    const { data: topWorkers = [] } = useQuery({
        queryKey: ["topWorkers"],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/top-workers`);
            return res.data;
        },
    });

    return (
        <div>
            {/* Hero Slider */}
            <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                autoplay={{ delay: 3000 }}
                pagination={{ clickable: true }}
                navigation
                loop
                className="w-full"
            >
                {slides.map((slide, i) => (
                    <SwiperSlide key={i}>
                        <div className={`bg-gradient-to-r ${slide.bg} text-white flex flex-col items-center justify-center text-center px-6 py-32 min-h-[500px]`}>
                            <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-bounce">{slide.title}</h1>
                            <p className="text-lg md:text-xl max-w-2xl text-violet-200">{slide.subtitle}</p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Top Workers */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-violet-900 mb-10">Top Workers</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {topWorkers.length === 0 ? (
                            <p className="text-center col-span-6 text-gray-500">No workers yet</p>
                        ) : (
                            topWorkers.map((worker, i) => (
                                <div key={i} className="bg-white rounded-xl shadow p-4 flex flex-col items-center text-center">
                                    <img src={worker.photo} alt={worker.name} className="w-16 h-16 rounded-full object-cover mb-2 border-2 border-violet-400" />
                                    <p className="font-semibold text-sm text-gray-800 truncate w-full">{worker.name}</p>
                                    <p className="text-violet-600 font-bold text-sm">🪙 {worker.coins}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-violet-900 mb-10">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: "📝", title: "Register", desc: "Create your account as a Worker or Buyer in seconds" },
                            { icon: "✅", title: "Complete Tasks", desc: "Workers complete tasks posted by Buyers and earn coins" },
                            { icon: "💰", title: "Earn & Withdraw", desc: "Convert your coins to real money and withdraw anytime" },
                        ].map((item, i) => (
                            <div key={i} className="bg-violet-50 rounded-xl p-8 shadow hover:shadow-lg transition">
                                <div className="text-5xl mb-4">{item.icon}</div>
                                <h3 className="text-xl font-bold text-violet-900 mb-2">{item.title}</h3>
                                <p className="text-gray-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 bg-violet-900 text-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { number: "10K+", label: "Active Workers" },
                            { number: "5K+", label: "Tasks Completed" },
                            { number: "500+", label: "Buyers" },
                            { number: "$50K+", label: "Paid Out" },
                        ].map((stat, i) => (
                            <div key={i}>
                                <p className="text-4xl font-bold text-yellow-400">{stat.number}</p>
                                <p className="text-violet-200 mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-violet-900 mb-10">What Our Users Say</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { name: "Rahman K.", role: "Worker", quote: "I earn extra income every day completing simple tasks. MicroTask changed my life!", img: "https://i.pravatar.cc/100?img=1" },
                            { name: "Sarah M.", role: "Buyer", quote: "I get my tasks done quickly and efficiently. The workers are amazing!", img: "https://i.pravatar.cc/100?img=5" },
                            { name: "James T.", role: "Worker", quote: "Withdrawals are fast and the platform is very easy to use. Highly recommended!", img: "https://i.pravatar.cc/100?img=3" },
                        ].map((t, i) => (
                            <div key={i} className="bg-white rounded-xl shadow p-6">
                                <p className="text-gray-600 italic mb-4">{t.quote}</p>
                                <div className="flex items-center gap-3">
                                    <img src={t.img} alt={t.name} className="w-12 h-12 rounded-full" />
                                    <div>
                                        <p className="font-bold text-violet-900">{t.name}</p>
                                        <p className="text-sm text-gray-500">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
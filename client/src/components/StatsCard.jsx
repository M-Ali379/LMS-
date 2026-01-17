import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon: Icon, color = "blue", subtext }) => {
    // Map color names to Tailwind classes
    const colorClasses = {
        blue: "bg-blue-100 text-blue-600",
        green: "bg-green-100 text-green-600",
        purple: "bg-purple-100 text-purple-600",
        yellow: "bg-yellow-100 text-yellow-600",
        red: "bg-red-100 text-red-600",
        indigo: "bg-indigo-100 text-indigo-600"
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4"
        >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${colorClasses[color] || colorClasses.blue}`}>
                {Icon && <Icon size={28} />}
            </div>
            <div>
                <p className="text-gray-500 font-medium text-sm">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
                {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
            </div>
        </motion.div>
    );
};

export default StatsCard;

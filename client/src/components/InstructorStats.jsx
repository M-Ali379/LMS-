import { Users, BookOpen, DollarSign, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, trend, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: delay * 0.1 }}
        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group"
    >
        <div className="flex justify-between items-start mb-4">
            <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-white shadow-lg`}>
                <Icon size={24} />
            </div>
            {trend && (
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
                    {trend}
                </span>
            )}
        </div>
        <div>
            <h4 className="text-3xl font-bold text-gray-900 mb-1">{value}</h4>
            <p className="text-gray-500 font-medium text-sm">{label}</p>
        </div>
    </motion.div>
);

const InstructorStats = ({ totalCourses }) => {
    // Mock data for prototype
    const stats = [
        {
            icon: Users,
            label: 'Total Students',
            value: '1,234',
            color: 'bg-indigo-500',
            trend: '+12% this month'
        },
        {
            icon: BookOpen,
            label: 'Active Courses',
            value: totalCourses || '0',
            color: 'bg-blue-500',
            trend: '2 Pending'
        },
        {
            icon: DollarSign,
            label: 'Total Revenue',
            value: '$45,200',
            color: 'bg-emerald-500',
            trend: '+8%'
        },
        {
            icon: Star,
            label: 'Course Rating',
            value: '4.8',
            color: 'bg-amber-500',
            trend: 'Top Rated'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
                <StatCard
                    key={idx}
                    {...stat}
                    delay={idx}
                />
            ))}
        </div>
    );
};

export default InstructorStats;

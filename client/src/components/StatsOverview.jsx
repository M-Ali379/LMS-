import { BookOpen, Award, Clock, Flame } from 'lucide-react';
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

const StatsOverview = ({ coursesEnrolled, completed }) => {
    // Determine stats based on props or mock data for demo
    const stats = [
        {
            icon: BookOpen,
            label: 'Courses in Progress',
            value: coursesEnrolled || '0',
            color: 'bg-blue-500',
            trend: '+2 this week'
        },
        {
            icon: CheckCircle => <Award size={24} />, // Use simple icon for now
            label: 'Ceritficates Earned',
            value: completed || '0',
            color: 'bg-purple-500',
            trend: ''
        },
        {
            icon: Clock,
            label: 'Hours Learned',
            value: '12.5',
            color: 'bg-orange-500',
            trend: '+5%'
        },
        {
            icon: Flame,
            label: 'Day Streak',
            value: '4',
            color: 'bg-rose-500',
            trend: 'Keep it up!'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
                <StatCard
                    key={idx}
                    {...stat}
                    icon={stat.icon === BookOpen || stat.icon === Clock || stat.icon === Flame ? stat.icon : Award} // Quick fix for icon prop
                    delay={idx}
                />
            ))}
        </div>
    );
};

export default StatsOverview;

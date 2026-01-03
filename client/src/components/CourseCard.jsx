import { Share2, Clock, Users, PlayCircle, CheckCircle } from 'lucide-react';
import { getYouTubeThumbnail } from '../lib/utils';
import { motion } from 'framer-motion';

const CourseCard = ({ course, isEnrolled, onAction }) => {
    // Generate random stats for demo if missing
    const duration = course.duration || '4h 30m';
    const students = course.studentCount || Math.floor(Math.random() * 500) + 50;

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
        >
            <div className="relative aspect-video overflow-hidden">
                <img
                    src={getYouTubeThumbnail(course.image) || course.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80'}
                    alt={course.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80';
                    }}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button
                        onClick={() => onAction(course._id)}
                        className="bg-white/20 backdrop-blur-md border border-white/50 text-white rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-100 hover:bg-white hover:text-blue-600"
                    >
                        <PlayCircle size={32} strokeWidth={1.5} />
                    </button>
                </div>
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm text-gray-900 uppercase tracking-wide">
                    {course.category}
                </div>
            </div>

            <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3 text-xs text-gray-500 font-medium">
                    <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">
                        <Clock size={12} /> {duration}
                    </span>
                    <span className="flex items-center gap-1">
                        <Users size={12} /> {students} Students
                    </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                    {course.title}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">
                    {course.description}
                </p>

                <div className="pt-4 border-t border-dashed border-gray-100 flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                            {course.instructor?.name?.[0] || 'I'}
                        </div>
                        <div className="text-xs">
                            <p className="text-gray-900 font-semibold">{course.instructor?.name || 'Instructor'}</p>
                            <p className="text-gray-400">Author</p>
                        </div>
                    </div>

                    <button
                        onClick={() => onAction(course._id)}
                        className={`text-xs font-bold px-4 py-2 rounded-lg transition-all ${isEnrolled
                            ? 'bg-green-100 text-green-700 hover:bg-green-200 flex items-center gap-2'
                            : 'bg-gray-900 text-white hover:bg-blue-600 shadow-lg shadow-gray-900/20 hover:shadow-blue-600/30'
                            }`}
                    >
                        {isEnrolled ? (
                            <>
                                <CheckCircle size={14} /> Continue
                            </>
                        ) : 'Enroll Now'}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default CourseCard;

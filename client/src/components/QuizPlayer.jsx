import { useState } from 'react';
import axios from 'axios';
import { CheckCircle, XCircle } from 'lucide-react';

const QuizPlayer = ({ lesson, onComplete }) => {
    const [answers, setAnswers] = useState(new Array(lesson.questions.length).fill(null));
    const [result, setResult] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleSelect = (qIndex, optionIndex) => {
        if (result) return; // Disable changing after submission
        const newAnswers = [...answers];
        newAnswers[qIndex] = optionIndex;
        setAnswers(newAnswers);
    };

    const handleSubmit = async () => {
        if (answers.some(a => a === null)) {
            setError("Please answer all questions");
            return;
        }

        setSubmitting(true);
        try {
            const res = await axios.post(`/api/lessons/${lesson._id}/submit`, { answers });
            setResult(res.data);
            if (res.data.isPassed && onComplete) {
                onComplete();
            }
        } catch (error) {
            console.error(error);
            setError("Failed to submit quiz");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                Quiz: <span className="text-blue-600">{lesson.title}</span>
            </h2>

            {result ? (
                <div className={`p-6 rounded-xl text-center mb-8 ${result.isPassed ? 'bg-green-50' : 'bg-red-50'}`}>
                    <div className="flex justify-center mb-4">
                        {result.isPassed ?
                            <CheckCircle className="text-green-600 w-16 h-16" /> :
                            <XCircle className="text-red-600 w-16 h-16" />
                        }
                    </div>
                    <h3 className={`text-2xl font-bold mb-2 ${result.isPassed ? 'text-green-800' : 'text-red-800'}`}>
                        {result.isPassed ? 'Passed!' : 'Failed'}
                    </h3>
                    <p className="text-lg font-medium">
                        Score: {result.score} / {result.totalPoints} ({Math.round(result.percentage)}%)
                    </p>
                    {!result.isPassed && (
                        <button
                            onClick={() => { setResult(null); setAnswers(new Array(lesson.questions.length).fill(null)); }}
                            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        >
                            Try Again
                        </button>
                    )}
                </div>
            ) : null}

            <div className="space-y-8">
                {lesson.questions.map((q, qIndex) => (
                    <div key={qIndex} className="p-4 border-b border-gray-100 last:border-0">
                        <p className="font-semibold text-lg text-gray-800 mb-4">{qIndex + 1}. {q.questionText}</p>
                        <div className="space-y-3">
                            {q.options.map((opt, oIndex) => (
                                <button
                                    key={oIndex}
                                    onClick={() => handleSelect(qIndex, oIndex)}
                                    disabled={!!result}
                                    className={`w-full text-left p-3 rounded-xl border transition-all ${answers[qIndex] === oIndex
                                            ? 'border-blue-500 bg-blue-50 text-blue-800 font-medium'
                                            : 'border-gray-200 hover:bg-gray-50'
                                        } ${result && q.correctOptionIndex === oIndex ? 'border-green-500 bg-green-50 !opacity-100' : ''}
                                       ${result && answers[qIndex] === oIndex && answers[qIndex] !== q.correctOptionIndex ? 'border-red-500 bg-red-50' : ''}
                                    `}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {error && <p className="text-red-500 mt-4 font-medium">{error}</p>}

            {!result && (
                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30"
                    >
                        {submitting ? 'Submitting...' : 'Submit Quiz'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default QuizPlayer;

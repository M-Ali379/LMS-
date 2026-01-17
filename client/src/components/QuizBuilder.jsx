import { useState } from 'react';
import { Plus, Trash2, CheckCircle } from 'lucide-react';

const QuizBuilder = ({ questions = [], onChange }) => {

    const addQuestion = () => {
        onChange([
            ...questions,
            { questionText: '', options: ['', '', '', ''], correctOptionIndex: 0 }
        ]);
    };

    const updateQuestion = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index] = { ...newQuestions[index], [field]: value };
        onChange(newQuestions);
    };

    const updateOption = (qIndex, oIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex] = value;
        onChange(newQuestions);
    };

    const removeQuestion = (index) => {
        const newQuestions = questions.filter((_, i) => i !== index);
        onChange(newQuestions);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-gray-700">Quiz Questions</h3>
                <button
                    type="button"
                    onClick={addQuestion}
                    className="flex items-center gap-2 text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-medium hover:bg-blue-100 transition"
                >
                    <Plus size={16} /> Add Question
                </button>
            </div>

            {questions.map((q, qIndex) => (
                <div key={qIndex} className="bg-gray-50 p-4 rounded-xl border border-gray-200 relative group">
                    <button
                        type="button"
                        onClick={() => removeQuestion(qIndex)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                    >
                        <Trash2 size={18} />
                    </button>

                    <div className="mb-3 pr-8">
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Question {qIndex + 1}</label>
                        <input
                            className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="Enter question text..."
                            value={q.questionText}
                            onChange={(e) => updateQuestion(qIndex, 'questionText', e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        {q.options.map((opt, oIndex) => (
                            <div key={oIndex} className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name={`correct-${qIndex}`}
                                    checked={q.correctOptionIndex === oIndex}
                                    onChange={() => updateQuestion(qIndex, 'correctOptionIndex', oIndex)}
                                    className="accent-green-600 cursor-pointer"
                                />
                                <input
                                    className={`w-full p-2 border rounded-lg text-sm ${q.correctOptionIndex === oIndex ? 'border-green-500 bg-green-50/50' : 'border-gray-300'}`}
                                    placeholder={`Option ${oIndex + 1}`}
                                    value={opt}
                                    onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default QuizBuilder;

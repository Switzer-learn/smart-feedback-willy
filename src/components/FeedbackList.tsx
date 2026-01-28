"use client";

interface Feedback {
    id: string;
    title: string;
    description: string;
    status: string;
    created_at: string;
}

interface FeedbackListProps {
    feedbacks: Feedback[];
    loading: boolean;
}

export default function FeedbackList({ feedbacks, loading }: FeedbackListProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-md min-h-[500px] max-h-[500px] flex flex-col">
            <div className="p-6 pb-0">
                <h2 className="text-2xl font-bold text-gray-800">Past Feedback</h2>
            </div>

            <div className="overflow-y-auto p-6 pt-4 space-y-4">
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-200 border-t-transparent"></div>
                    </div>
                ) : feedbacks.length === 0 ? (
                    <div className="text-center py-12 text-gray-800">
                        No feedback yet. Submit your first feedback!
                    </div>
                ) : (
                    feedbacks.map((feedback) => (
                        <div
                            key={feedback.id}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {feedback.title}
                                </h3>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                    {feedback.status}
                                </span>
                            </div>
                            <p className="text-gray-700 mb-3 line-clamp-3">
                                {feedback.description}
                            </p>
                            <div className="text-sm text-gray-600">
                                {formatDate(feedback.created_at)}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

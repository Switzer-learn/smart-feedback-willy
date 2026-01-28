"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import NewFeedbackForm from "@/components/NewFeedbackForm";
import FeedbackList from "@/components/FeedbackList";

interface Feedback {
    id: string;
    title: string;
    description: string;
    status: string;
    created_at: string;
}

export default function DashboardPage() {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();
    const supabase = createClient();

    const fetchFeedbacks = useCallback(async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                // If checking auth in checkAuth didn't redirect fast enough, or session invalid here
                return;
            }

            const { data, error } = await supabase
                .from("feedback")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            console.log("data", data);

            if (error) {
                setError("Failed to load feedbacks");
                console.log("error", error);
            } else {
                setFeedbacks(data || []);
            }
        } catch {
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    }, [supabase]);

    useEffect(() => {
        const init = async () => {
            await fetchFeedbacks();
        };
        init();

        const channel = supabase
            .channel('realtime feedback')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'feedback'
            }, (payload) => {
                if (payload.eventType === 'INSERT') {
                    // Add new feedback to the beginning
                    setFeedbacks((currentFeedbacks) => [payload.new as Feedback, ...currentFeedbacks]);
                } else if (payload.eventType === 'UPDATE') {
                    // Replace the existing feedback with the updated one
                    setFeedbacks((currentFeedbacks) =>
                        currentFeedbacks.map((feedback) =>
                            feedback.id === payload.new.id ? (payload.new as Feedback) : feedback
                        )
                    );
                } else if (payload.eventType === 'DELETE') {
                    // Remove the deleted feedback from the list
                    setFeedbacks((currentFeedbacks) =>
                        currentFeedbacks.filter((feedback) => feedback.id !== payload.old.id)
                    );
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchFeedbacks, supabase]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    // This is optional if we rely purely on realtime, but good to have a manual refresh trigger
    const handleFeedbackSubmit = () => {
        // With realtime, we might not need to re-fetch, but it ensures consistency
        // If we strictly rely on realtime, this could be empty or just a loading check.
        // For robustness, let's re-fetch to be sure we have the latest server state including any triggers.
        fetchFeedbacks();
    };

    return (
        <div className="min-h-screen max-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-amber-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors"
                    >
                        Logout
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <NewFeedbackForm onFeedbackSubmit={handleFeedbackSubmit} />
                    <FeedbackList feedbacks={feedbacks} loading={loading} />
                </div>
            </div>
        </div>
    );
}

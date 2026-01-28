"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface NewFeedbackFormProps {
    onFeedbackSubmit: () => void;
}

export default function NewFeedbackForm({ onFeedbackSubmit }: NewFeedbackFormProps) {
    const supabase = createClient();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        if (!formData.title.trim() || !formData.description.trim()) {
            setError("Please fill in all fields");
            setSubmitting(false);
            return;
        }

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setError("You must be logged in to submit feedback");
                return;
            }

            const { error } = await supabase
                .from("feedback")
                .insert([
                    {
                        user_id: user.id,
                        title: formData.title.trim(),
                        description: formData.description.trim(),
                        status: "Pending",
                    },
                ]);

            if (error) {
                setError(error.message);
            } else {
                setFormData({ title: "", description: "" });
                onFeedbackSubmit();
            }
        } catch {
            setError("An unexpected error occurred");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 h-[500px] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">New Feedback</h2>
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-800 mb-2">
                        Title
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-800"
                        placeholder="Enter feedback title"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-800 mb-2">
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-800 resize-none"
                        placeholder="Enter feedback description"
                    />
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-amber-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {submitting ? "Submitting..." : "Submit Feedback"}
                </button>
            </form>
        </div>
    );
}

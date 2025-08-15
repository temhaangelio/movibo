import React, { useState, useEffect } from "react";
import { Trash, User } from "@phosphor-icons/react";
import TimeAgo from "/ui/TimeAgo";
import Buton from "/ui/Buton";
import Alert from "/ui/Alert";
import Confirm from "/ui/Confirm";
import Loading from "/ui/Loading";

const CommentDropdown = ({ open, onClose, post, user }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);

    // Yorumları yükle
    const loadComments = async () => {
        if (!post) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/posts/${post.id}/comments`, {
                credentials: "same-origin",
            });
            const data = await response.json();
            setComments(data.comments);
        } catch (error) {
            console.error("Yorumlar yüklenirken hata:", error);
            setAlertMessage("Yorumlar yüklenirken bir hata oluştu.");
            setAlertOpen(true);
        } finally {
            setLoading(false);
        }
    };

    // Yeni yorum ekle
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            const csrfMeta = document.querySelector('meta[name="csrf-token"]');
            const csrfToken = csrfMeta ? csrfMeta.getAttribute("content") : "";
            const response = await fetch("/comments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                },
                credentials: "same-origin",
                body: JSON.stringify({
                    post_id: post.id,
                    content: newComment.trim(),
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setComments((prev) => [data.comment, ...prev]);
                setNewComment("");
                // Post'un yorum sayısını güncelle
                if (post.onCommentCountUpdate) {
                    post.onCommentCountUpdate(data.comments_count);
                }
            } else {
                setAlertMessage("Yorum eklenirken bir hata oluştu.");
                setAlertOpen(true);
            }
        } catch (error) {
            console.error("Yorum eklenirken hata:", error);
            setAlertMessage("Yorum eklenirken bir hata oluştu.");
            setAlertOpen(true);
        } finally {
            setSubmitting(false);
        }
    };

    // Yorum silme onayı
    const handleDeleteComment = (commentId) => {
        setCommentToDelete(commentId);
        setConfirmOpen(true);
    };

    // Yorum silme işlemi
    const confirmDeleteComment = async () => {
        if (!commentToDelete) return;

        try {
            const csrfMeta = document.querySelector('meta[name="csrf-token"]');
            const csrfToken = csrfMeta ? csrfMeta.getAttribute("content") : "";
            const response = await fetch(`/comments/${commentToDelete}`, {
                method: "DELETE",
                headers: {
                    "X-CSRF-TOKEN": csrfToken,
                },
                credentials: "same-origin",
            });

            if (response.ok) {
                setComments((prev) =>
                    prev.filter((c) => c.id !== commentToDelete)
                );
                const data = await response.json();
                // Post'un yorum sayısını güncelle
                if (post.onCommentCountUpdate) {
                    post.onCommentCountUpdate(data.comments_count);
                }
            } else {
                setAlertMessage("Yorum silinirken bir hata oluştu.");
                setAlertOpen(true);
            }
        } catch (error) {
            console.error("Yorum silinirken hata:", error);
            setAlertMessage("Yorum silinirken bir hata oluştu.");
            setAlertOpen(true);
        } finally {
            setCommentToDelete(null);
            setConfirmOpen(false);
        }
    };

    useEffect(() => {
        if (open && post) {
            loadComments();
        }
    }, [open, post]);

    if (!open) return null;

    return (
        <>
            <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                {/* Comments List */}
                <div className="max-h-64 overflow-y-auto p-4">
                    {loading ? (
                        <div className="text-center py-4">
                            <Loading size="sm" />
                        </div>
                    ) : comments.length === 0 ? (
                        <div className="text-center py-4">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Henüz yorum yok.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {comments.map((comment) => (
                                <div
                                    key={comment.id}
                                    className="flex space-x-3 border-b border-gray-200 dark:border-gray-700 pb-3"
                                >
                                    <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                                        {comment.user?.name ? (
                                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                                {comment.user.name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2)}
                                            </span>
                                        ) : (
                                            <User className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-xs text-gray-900 dark:text-white">
                                                {comment.user?.name}
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                <TimeAgo
                                                    date={comment.created_at}
                                                />
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                                            {comment.content}
                                        </p>
                                    </div>
                                    {user && comment.user_id === user.id && (
                                        <button
                                            onClick={() =>
                                                handleDeleteComment(comment.id)
                                            }
                                            className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1 rounded"
                                            title="Yorumu Sil"
                                        >
                                            <Trash className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Comment Form */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <textarea
                            value={newComment}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value.length <= 250) {
                                    setNewComment(value);
                                }
                            }}
                            placeholder="Yorumunuzu yazın..."
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 resize-none"
                            rows={2}
                            maxLength={250}
                        />
                        <div className="flex justify-between items-center">
                            <span
                                className={`text-xs ${
                                    newComment.length > 200
                                        ? "text-red-500"
                                        : "text-gray-500 dark:text-gray-400"
                                }`}
                            >
                                {newComment.length}/250
                            </span>
                            <Buton
                                type="submit"
                                disabled={submitting || !newComment.trim()}
                                size="sm"
                            >
                                {submitting ? "Gönderiliyor..." : "Gönder"}
                            </Buton>
                        </div>
                    </form>
                </div>
            </div>

            <Alert
                open={alertOpen}
                type="error"
                message={alertMessage}
                onClose={() => setAlertOpen(false)}
            />
            <Confirm
                open={confirmOpen}
                onClose={() => {
                    setConfirmOpen(false);
                    setCommentToDelete(null);
                }}
                onConfirm={confirmDeleteComment}
                title="Yorumu Sil"
                message="Bu yorumu silmek istediğinizden emin misiniz?"
                confirmText="Sil"
                cancelText="Vazgeç"
            />
        </>
    );
};

export default CommentDropdown;

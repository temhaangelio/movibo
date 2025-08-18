import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import AdminLayout from "/Layouts/AdminLayout";
import Buton from "/ui/Buton";
import Card from "/ui/Card";
import Confirm from "/ui/Confirm";
import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableHeader,
    TableCell,
} from "/ui/Table";
import Pagination from "/ui/Pagination";
import Header from "/ui/Header";
import {
    ChatCircle,
    Trash,
    Eye,
    User,
    MagnifyingGlass,
} from "@phosphor-icons/react";

const Index = ({ comments }) => {
    const { t } = useTranslation();
    const [deleteCommentId, setDeleteCommentId] = useState(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredComments =
        comments.data?.filter((comment) => {
            if (!searchTerm) return true;

            const searchLower = searchTerm.toLowerCase();
            return (
                comment.user?.name?.toLowerCase().includes(searchLower) ||
                comment.content?.toLowerCase().includes(searchLower) ||
                comment.post?.id?.toString().includes(searchLower)
            );
        }) || [];

    const handleDelete = (commentId) => {
        setDeleteCommentId(commentId);
        setIsConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (deleteCommentId) {
            router.delete(`/panel/comments/${deleteCommentId}`, {
                onSuccess: () => {
                    setIsConfirmOpen(false);
                    setDeleteCommentId(null);
                },
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Yorum Yönetimi" />

            <Card className="p-6">
                <Header
                    title="Yorum Yönetimi"
                    searchTerm={searchTerm}
                    onSearchChange={(e) => setSearchTerm(e.target.value)}
                    searchPlaceholder="Kullanıcı, yorum veya paylaşım ID ara..."
                />

                <Table>
                    <TableHead>
                        <tr>
                            <TableHeader>Yorum</TableHeader>
                            <TableHeader>Kullanıcı</TableHeader>
                            <TableHeader>Paylaşım</TableHeader>
                            <TableHeader>Tarih</TableHeader>
                            <TableHeader align="right">İşlemler</TableHeader>
                        </tr>
                    </TableHead>
                    <TableBody>
                        {filteredComments.map((comment) => (
                            <TableRow key={comment.id}>
                                <TableCell>
                                    <div className="text-sm text-gray-900 max-w-xs truncate">
                                        {comment.content?.substring(0, 100)}
                                        {comment.content?.length > 100 && "..."}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-8 w-8">
                                            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                                                <span className="text-white text-xs font-semibold">
                                                    {comment.user?.name
                                                        ?.charAt(0)
                                                        .toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-sm font-medium text-gray-900">
                                                {comment.user?.name ||
                                                    "Bilinmeyen Kullanıcı"}
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm text-gray-900">
                                        Paylaşım #{comment.post?.id || "N/A"}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {new Date(
                                        comment.created_at
                                    ).toLocaleDateString("tr-TR")}
                                </TableCell>
                                <TableCell align="right">
                                    <div className="flex items-center justify-end space-x-2">
                                        <Link
                                            href={`/panel/posts/${comment.post?.id}`}
                                            className="inline-flex items-center justify-center w-8 h-8 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                            title="Paylaşımı Görüntüle"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() =>
                                                handleDelete(comment.id)
                                            }
                                            className="inline-flex items-center justify-center w-8 h-8 border border-red-300 text-xs font-medium rounded-md text-red-700 bg-white hover:bg-red-50 transition-colors"
                                            title="Sil"
                                        >
                                            <Trash className="w-4 h-4" />
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Pagination */}
                <Pagination
                    links={comments.links}
                    total={comments.total}
                    from={comments.from}
                    to={comments.to}
                />
            </Card>

            <Confirm
                open={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmDelete}
                title="Yorumu Sil"
                message="Bu yorumu silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
                confirmText="Sil"
                cancelText="İptal"
            />
        </AdminLayout>
    );
};

export default Index;

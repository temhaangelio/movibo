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
    Article,
    Trash,
    Eye,
    User,
    MagnifyingGlass,
    Heart,
    ChatCircle,
} from "@phosphor-icons/react";

const Index = ({ posts }) => {
    const { t } = useTranslation();
    const [deletePostId, setDeletePostId] = useState(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const handleDelete = (postId) => {
        setDeletePostId(postId);
        setIsConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (deletePostId) {
            router.delete(`/panel/posts/${deletePostId}`, {
                onSuccess: () => {
                    setIsConfirmOpen(false);
                    setDeletePostId(null);
                },
            });
        }
    };

    const filteredPosts =
        posts.data?.filter(
            (post) =>
                post.content
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                post.user?.name
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase())
        ) || [];

    return (
        <AdminLayout>
            <Head title="Paylaşım Yönetimi" />

            <Card className="p-6">
                <Header
                    title="Paylaşım Yönetimi"
                    searchTerm={searchTerm}
                    onSearchChange={(e) => setSearchTerm(e.target.value)}
                    searchPlaceholder="Kullanıcı veya paylaşım içeriği ara..."
                />

                <Table>
                    <TableHead>
                        <tr>
                            <TableHeader>Paylaşım</TableHeader>
                            <TableHeader>Kullanıcı</TableHeader>
                            <TableHeader>Tarih</TableHeader>
                            <TableHeader>Beğeni</TableHeader>
                            <TableHeader>Yorum</TableHeader>
                            <TableHeader align="right">İşlemler</TableHeader>
                        </tr>
                    </TableHead>
                    <TableBody>
                        {filteredPosts.map((post) => (
                            <TableRow key={post.id}>
                                <TableCell>
                                    <div className="text-sm text-gray-900 max-w-xs truncate">
                                        {post.content?.substring(0, 100)}
                                        {post.content?.length > 100 && "..."}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-8 w-8">
                                            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                                                <span className="text-white text-xs font-semibold">
                                                    {post.user?.name
                                                        ?.charAt(0)
                                                        .toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-sm font-medium text-gray-900">
                                                {post.user?.name ||
                                                    "Bilinmeyen Kullanıcı"}
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {new Date(
                                        post.created_at
                                    ).toLocaleDateString("tr-TR")}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center">
                                        <Heart className="w-4 h-4 text-red-500 mr-1" />
                                        <span className="text-sm text-gray-900">
                                            {post.likes_count || 0}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center">
                                        <ChatCircle className="w-4 h-4 text-blue-500 mr-1" />
                                        <span className="text-sm text-gray-900">
                                            {post.comments_count || 0}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell align="right">
                                    <div className="flex items-center justify-end space-x-2">
                                        <Link
                                            href={`/panel/posts/${post.id}`}
                                            className="inline-flex items-center justify-center w-8 h-8 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                            title="Görüntüle"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() =>
                                                handleDelete(post.id)
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
                    links={posts.links}
                    total={posts.total}
                    from={posts.from}
                    to={posts.to}
                />
            </Card>

            <Confirm
                open={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmDelete}
                title="Paylaşımı Sil"
                message="Bu paylaşımı silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
                confirmText="Sil"
                cancelText="İptal"
            />
        </AdminLayout>
    );
};

export default Index;

import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import AdminLayout from "/Layouts/AdminLayout";
import Buton from "/ui/Buton";
import Card from "/ui/Card";
import Confirm from "/ui/Confirm";
import { User, Trash, Eye, Plus, MagnifyingGlass } from "@phosphor-icons/react";

const Index = ({ users }) => {
    const { t } = useTranslation();
    const [deleteUserId, setDeleteUserId] = useState(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const handleDelete = (userId) => {
        setDeleteUserId(userId);
        setIsConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (deleteUserId) {
            router.delete(`/panel/users/${deleteUserId}`, {
                onSuccess: () => {
                    setIsConfirmOpen(false);
                    setDeleteUserId(null);
                },
            });
        }
    };

    const filteredUsers =
        users.data?.filter(
            (user) =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.username?.toLowerCase().includes(searchTerm.toLowerCase())
        ) || [];

    return (
        <AdminLayout>
            <Head title="Kullanıcı Yönetimi" />

            <Card className="p-6">
                {/* Header with Search */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Kullanıcı Yönetimi
                    </h2>
                    <div className="flex items-center space-x-4">
                        {/* Search */}
                        <div className="relative">
                            <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Kullanıcı adı, e-posta veya kullanıcı adı ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                            />
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Toplam: {filteredUsers.length}
                        </span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Kullanıcı
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Kayıt Tarihi
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Durum
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    İşlemler
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredUsers.map((user) => (
                                <tr
                                    key={user.id}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                                                    <span className="text-white font-semibold text-sm">
                                                        {user.name
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {user.name}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    @{user.username}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(
                                            user.created_at
                                        ).toLocaleDateString("tr-TR")}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                user.is_admin
                                                    ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                                                    : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                            }`}
                                        >
                                            {user.is_admin
                                                ? "Admin"
                                                : "Kullanıcı"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-2">
                                            <Link
                                                href={`/panel/users/${user.id}`}
                                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-xs font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                <Eye className="w-4 h-4 mr-1" />
                                                Görüntüle
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    handleDelete(user.id)
                                                }
                                                className="inline-flex items-center px-3 py-1.5 border border-red-300 dark:border-red-600 text-xs font-medium rounded-md text-red-700 dark:text-red-400 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                            >
                                                <Trash className="w-4 h-4 mr-1" />
                                                Sil
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {users.links && (
                    <div className="mt-6">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700 dark:text-gray-300">
                                Toplam {users.total} kullanıcıdan {users.from}-
                                {users.to} arası gösteriliyor
                            </div>
                            <div className="flex space-x-2">
                                {users.links.map((link, index) =>
                                    link.url ? (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            className={`px-3 py-2 text-sm font-medium rounded-md ${
                                                link.active
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
                                            }`}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ) : (
                                        <span
                                            key={index}
                                            className="px-3 py-2 text-sm font-medium rounded-md bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </Card>

            <Confirm
                open={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmDelete}
                title="Kullanıcıyı Sil"
                message="Bu kullanıcıyı silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
                confirmText="Sil"
                cancelText="İptal"
            />
        </AdminLayout>
    );
};

export default Index;

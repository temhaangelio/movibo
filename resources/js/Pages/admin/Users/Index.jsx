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
import Dropdown from "/ui/Dropdown";
import {
    User,
    Trash,
    Eye,
    Plus,
    MagnifyingGlass,
    Prohibit,
    Lock,
    LockOpen,
    Clock,
} from "@phosphor-icons/react";

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
                onError: (errors) => {
                    console.error("User deletion failed:", errors);
                    alert(
                        "Kullanıcı silinirken bir hata oluştu. Lütfen tekrar deneyin."
                    );
                    setIsConfirmOpen(false);
                    setDeleteUserId(null);
                },
                onFinish: () => {
                    // İşlem tamamlandığında loading state'i temizle
                },
            });
        }
    };

    const toggleBlock = (userId, currentBlockStatus) => {
        router.patch(
            `/panel/users/${userId}/toggle-block`,
            {},
            {
                onSuccess: () => {
                    // Sayfa yeniden yüklenecek ve güncel durum gösterilecek
                },
                onError: (errors) => {
                    console.error("User block toggle failed:", errors);
                    alert(
                        "Kullanıcı bloklama durumu değiştirilirken bir hata oluştu!"
                    );
                },
            }
        );
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

            <Card className="p-6" style={{ overflow: "visible" }}>
                <Header
                    title="Kullanıcı Yönetimi"
                    searchTerm={searchTerm}
                    onSearchChange={(e) => setSearchTerm(e.target.value)}
                    searchPlaceholder="Ad, e-posta veya kullanıcı adı ara..."
                />

                <div className="overflow-visible">
                    <Table>
                        <TableHead>
                            <tr>
                                <TableHeader>Kullanıcı</TableHeader>
                                <TableHeader>Email</TableHeader>
                                <TableHeader>Durum</TableHeader>
                                <TableHeader>Blok Durumu</TableHeader>
                                <TableHeader align="right">
                                    İşlemler
                                </TableHeader>
                            </tr>
                        </TableHead>
                        <TableBody>
                            {filteredUsers.map((user, index) => (
                                <TableRow
                                    key={user.id}
                                    style={{ overflow: "visible" }}
                                >
                                    <TableCell>
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <div
                                                    className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                                        user.is_blocked
                                                            ? "bg-gray-400"
                                                            : "bg-blue-600"
                                                    }`}
                                                >
                                                    <span className="text-white font-semibold text-sm">
                                                        {user.name
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div
                                                    className={`text-sm font-medium ${
                                                        user.is_blocked
                                                            ? "text-gray-500 line-through"
                                                            : "text-gray-900"
                                                    }`}
                                                >
                                                    {user.name}
                                                </div>
                                                <div
                                                    className={`text-sm ${
                                                        user.is_blocked
                                                            ? "text-gray-400 line-through"
                                                            : "text-gray-500"
                                                    }`}
                                                >
                                                    @{user.username}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={
                                                user.is_blocked
                                                    ? "line-through text-gray-500"
                                                    : ""
                                            }
                                        >
                                            {user.email}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                user.is_admin
                                                    ? "bg-purple-100 text-purple-800"
                                                    : "bg-green-100 text-green-800"
                                            }`}
                                        >
                                            {user.is_admin
                                                ? "Admin"
                                                : "Kullanıcı"}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                user.is_blocked
                                                    ? "bg-red-100 text-red-800"
                                                    : "bg-green-100 text-green-800"
                                            }`}
                                        >
                                            {user.is_blocked
                                                ? "Bloklu"
                                                : "Aktif"}
                                        </span>
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        className="relative"
                                        style={{
                                            position: "relative",
                                            zIndex: 50,
                                            overflow: "visible",
                                        }}
                                    >
                                        <div className="flex space-x-2 justify-end">
                                            <Link
                                                href={`/panel/users/${user.id}`}
                                                className="inline-flex items-center justify-center w-8 h-8 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                                title="Görüntüle"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                            <Link
                                                href={`/panel/users/${user.id}/activities`}
                                                className="inline-flex items-center justify-center w-8 h-8 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                                title="Aktiviteler"
                                            >
                                                <Clock className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    toggleBlock(
                                                        user.id,
                                                        user.is_blocked
                                                    )
                                                }
                                                className="inline-flex items-center justify-center w-8 h-8 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                                title={
                                                    user.is_blocked
                                                        ? "Bloktan Çıkar"
                                                        : "Blokla"
                                                }
                                            >
                                                {user.is_blocked ? (
                                                    <LockOpen className="w-4 h-4" />
                                                ) : (
                                                    <Lock className="w-4 h-4" />
                                                )}
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(user.id)
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
                </div>

                {/* Pagination */}
                <Pagination
                    links={users.links}
                    total={users.total}
                    from={users.from}
                    to={users.to}
                />
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

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
    Question,
    User,
    Calendar,
    ChatCircle,
    Eye,
    Trash,
    Clock,
    CheckCircle,
    XCircle,
} from "@phosphor-icons/react";

const Index = ({
    tickets = { data: [], links: [], total: 0, from: 0, to: 0 },
}) => {
    const { t } = useTranslation();
    const [deleteTicketId, setDeleteTicketId] = useState(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("");

    const filteredTickets = (tickets?.data || []).filter((ticket) => {
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch =
                ticket.user?.name?.toLowerCase().includes(searchLower) ||
                ticket.user?.email?.toLowerCase().includes(searchLower) ||
                ticket.subject?.toLowerCase().includes(searchLower) ||
                ticket.message?.toLowerCase().includes(searchLower);

            if (!matchesSearch) return false;
        }

        if (filterStatus && ticket.status !== filterStatus) {
            return false;
        }

        return true;
    });

    const handleDelete = (ticketId) => {
        setDeleteTicketId(ticketId);
        setIsConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (deleteTicketId) {
            router.delete(`/panel/support/${deleteTicketId}`, {
                onSuccess: () => {
                    setIsConfirmOpen(false);
                    setDeleteTicketId(null);
                },
            });
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "open":
                return <Clock className="w-4 h-4 text-yellow-500" />;
            case "closed":
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case "pending":
                return <XCircle className="w-4 h-4 text-red-500" />;
            default:
                return <Clock className="w-4 h-4 text-gray-500" />;
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "open":
                return "Açık";
            case "closed":
                return "Kapalı";
            case "pending":
                return "Beklemede";
            default:
                return "Bilinmiyor";
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "open":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
            case "closed":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
            case "pending":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
        }
    };

    return (
        <AdminLayout>
            <Head title="Destek Yönetimi" />

            <Card className="p-6">
                <Header
                    title="Destek Yönetimi"
                    searchTerm={searchTerm}
                    onSearchChange={(e) => setSearchTerm(e.target.value)}
                    searchPlaceholder="Kullanıcı, konu veya mesaj ara..."
                />

                {/* Filtreler */}
                <div className="mb-4 flex flex-wrap gap-2">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Tüm Durumlar</option>
                        <option value="open">Açık</option>
                        <option value="pending">Beklemede</option>
                        <option value="closed">Kapalı</option>
                    </select>
                </div>

                <Table>
                    <TableHead>
                        <tr>
                            <TableHeader>Kullanıcı</TableHeader>
                            <TableHeader>Konu</TableHeader>
                            <TableHeader>Durum</TableHeader>
                            <TableHeader>Tarih</TableHeader>
                            <TableHeader>Yanıt</TableHeader>
                            <TableHeader align="right">İşlemler</TableHeader>
                        </tr>
                    </TableHead>
                    <TableBody>
                        {filteredTickets.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="text-center py-8"
                                >
                                    <Question className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Henüz destek talebi bulunmuyor.
                                    </p>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredTickets.map((ticket) => (
                                <TableRow key={ticket.id}>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-8 w-8">
                                                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                                                    <span className="text-white text-xs font-semibold">
                                                        {ticket.user?.name
                                                            ?.charAt(0)
                                                            .toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {ticket.user?.name ||
                                                        "Bilinmeyen Kullanıcı"}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {ticket.user?.email}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm text-gray-900 dark:text-white max-w-xs truncate">
                                            {ticket.subject}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            {getStatusIcon(ticket.status)}
                                            <span
                                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                                    ticket.status
                                                )}`}
                                            >
                                                {getStatusText(ticket.status)}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(
                                            ticket.created_at
                                        ).toLocaleDateString("tr-TR")}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-1">
                                            {ticket.admin_reply ? (
                                                <>
                                                    <ChatCircle className="w-4 h-4 text-green-500" />
                                                    <span className="text-sm text-green-600 dark:text-green-400">
                                                        Yanıtlandı
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <Clock className="w-4 h-4 text-yellow-500" />
                                                    <span className="text-sm text-yellow-600 dark:text-yellow-400">
                                                        Bekliyor
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell align="right">
                                        <div className="flex items-center justify-end space-x-2">
                                            <Link
                                                href={`/panel/support/${ticket.id}`}
                                                className="inline-flex items-center justify-center w-8 h-8 border border-gray-300 dark:border-gray-600 text-xs font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                                title="Görüntüle"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    handleDelete(ticket.id)
                                                }
                                                className="inline-flex items-center justify-center w-8 h-8 border border-red-300 dark:border-red-600 text-xs font-medium rounded-md text-red-700 dark:text-red-400 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                title="Sil"
                                            >
                                                <Trash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                {/* Pagination */}
                {tickets?.links && (
                    <Pagination
                        links={tickets.links}
                        total={tickets.total || 0}
                        from={tickets.from || 0}
                        to={tickets.to || 0}
                    />
                )}
            </Card>

            <Confirm
                open={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmDelete}
                title="Destek İsteğini Sil"
                message="Bu destek isteğini silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
                confirmText="Sil"
                cancelText="İptal"
            />
        </AdminLayout>
    );
};

export default Index;

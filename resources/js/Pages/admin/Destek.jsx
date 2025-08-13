import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import AdminLayout from "/Layouts/AdminLayout";
import Card from "/ui/Card";
import Buton from "/ui/Buton";
import {
    Headphones,
    Envelope,
    Clock,
    CheckCircle,
    Warning,
    User,
    Calendar,
    ChatCircle,
    Eye,
    ArrowClockwise,
} from "@phosphor-icons/react";

const Destek = ({ supportTickets = [] }) => {
    const [selectedStatus, setSelectedStatus] = useState("all");

    const supportStats = [
        {
            title: "Açık Talepler",
            value: supportTickets.filter((ticket) => ticket.status === "open")
                .length,
            icon: Warning,
            color: "bg-yellow-100 dark:bg-yellow-900/20",
            textColor: "text-yellow-600 dark:text-yellow-400",
        },
        {
            title: "Çözülen Talepler",
            value: supportTickets.filter(
                (ticket) => ticket.status === "resolved"
            ).length,
            icon: CheckCircle,
            color: "bg-green-100 dark:bg-green-900/20",
            textColor: "text-green-600 dark:text-green-400",
        },
        {
            title: "Toplam Talep",
            value: supportTickets.length,
            icon: Envelope,
            color: "bg-blue-100 dark:bg-blue-900/20",
            textColor: "text-blue-600 dark:text-blue-400",
        },
    ];

    const statusFilters = [
        { id: "all", name: "Tümü", count: supportTickets.length },
        {
            id: "open",
            name: "Açık",
            count: supportTickets.filter((t) => t.status === "open").length,
        },
        {
            id: "in_progress",
            name: "İşlemde",
            count: supportTickets.filter((t) => t.status === "in_progress")
                .length,
        },
        {
            id: "resolved",
            name: "Çözüldü",
            count: supportTickets.filter((t) => t.status === "resolved").length,
        },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case "open":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
            case "in_progress":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
            case "resolved":
                return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "open":
                return "Açık";
            case "in_progress":
                return "İşlemde";
            case "resolved":
                return "Çözüldü";
            default:
                return "Bilinmiyor";
        }
    };

    const filteredTickets =
        selectedStatus === "all"
            ? supportTickets
            : supportTickets.filter(
                  (ticket) => ticket.status === selectedStatus
              );

    return (
        <AdminLayout>
            <Head title="Destek - Admin Panel" />

            {/* Support Tickets */}
            <Card className="p-6">
                {/* Status Filters */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {statusFilters.map((filter) => (
                        <button
                            key={filter.id}
                            onClick={() => setSelectedStatus(filter.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                selectedStatus === filter.id
                                    ? "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                            }`}
                        >
                            {filter.name} ({filter.count})
                        </button>
                    ))}
                </div>

                {/* Tickets List */}
                <div className="space-y-4">
                    {filteredTickets.length === 0 ? (
                        <div className="text-center py-8">
                            <Envelope className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 dark:text-gray-400">
                                Henüz destek talebi bulunmuyor.
                            </p>
                        </div>
                    ) : (
                        filteredTickets.map((ticket) => (
                            <div
                                key={ticket.id}
                                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                                <User className="w-4 h-4 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {ticket.user?.name ||
                                                        "Anonim Kullanıcı"}
                                                </h3>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {ticket.user?.email ||
                                                        "E-posta yok"}
                                                </p>
                                            </div>
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                    ticket.status
                                                )}`}
                                            >
                                                {getStatusText(ticket.status)}
                                            </span>
                                        </div>
                                        <div className="ml-11">
                                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                                {ticket.subject}
                                            </h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                                {ticket.message}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                                                    <div className="flex items-center space-x-1">
                                                        <Calendar className="w-3 h-3" />
                                                        <span>
                                                            {new Date(
                                                                ticket.created_at
                                                            ).toLocaleDateString(
                                                                "tr-TR"
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <ChatCircle className="w-3 h-3" />
                                                        <span>
                                                            {ticket.replies_count ||
                                                                0}{" "}
                                                            yanıt
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Buton
                                                        size="sm"
                                                        variant="outline"
                                                        className="flex items-center space-x-1"
                                                    >
                                                        <Eye className="w-3 h-3" />
                                                        <span>Görüntüle</span>
                                                    </Buton>
                                                    {ticket.status ===
                                                        "open" && (
                                                        <Buton
                                                            size="sm"
                                                            className="flex items-center space-x-1"
                                                        >
                                                            <ArrowClockwise className="w-3 h-3" />
                                                            <span>Yanıtla</span>
                                                        </Buton>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Card>
        </AdminLayout>
    );
};

export default Destek;

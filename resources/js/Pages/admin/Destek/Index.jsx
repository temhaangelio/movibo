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
    MagnifyingGlass,
} from "@phosphor-icons/react";

const Index = ({ supportTickets = [] }) => {
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

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

    const filteredTickets = supportTickets.filter((ticket) => {
        // Status filter
        if (selectedStatus !== "all" && ticket.status !== selectedStatus) {
            return false;
        }

        // Search filter
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            return (
                ticket.user?.name?.toLowerCase().includes(searchLower) ||
                ticket.user?.email?.toLowerCase().includes(searchLower) ||
                ticket.subject?.toLowerCase().includes(searchLower) ||
                ticket.message?.toLowerCase().includes(searchLower)
            );
        }

        return true;
    });

    return (
        <AdminLayout>
            <Head title="Destek - Admin Panel" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Destek Merkezi
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Kullanıcılarımıza en iyi desteği sağlamak için buradayız
                        </p>
                    </div>
                    <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                        <Headphones className="w-6 h-6" />
                        <span className="font-medium">7/24 Destek</span>
                    </div>
                </div>

                {/* Support Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {supportStats.map((stat, index) => (
                        <Card key={index} className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        {stat.title}
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                                        {stat.value}
                                    </p>
                                </div>
                                <div className={`p-3 rounded-lg ${stat.color}`}>
                                    <stat.icon
                                        className={`w-6 h-6 ${stat.textColor}`}
                                    />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Support Tickets */}
                <Card className="p-6">
                    {/* Header with Search */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Destek Talepleri
                        </h2>
                        <div className="flex items-center space-x-4">
                            {/* Search */}
                            <div className="relative">
                                <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Kullanıcı, konu veya mesaj ara..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                                />
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                Toplam: {filteredTickets.length}
                            </span>
                        </div>
                    </div>

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
                                                    {getStatusText(
                                                        ticket.status
                                                    )}
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
                                                            <span>
                                                                Görüntüle
                                                            </span>
                                                        </Buton>
                                                        {ticket.status ===
                                                            "open" && (
                                                            <Buton
                                                                size="sm"
                                                                className="flex items-center space-x-1"
                                                            >
                                                                <ArrowClockwise className="w-3 h-3" />
                                                                <span>
                                                                    Yanıtla
                                                                </span>
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
            </div>
        </AdminLayout>
    );
};

export default Index;

import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import AdminLayout from "/Layouts/AdminLayout";
import Buton from "/ui/Buton";
import Card from "/ui/Card";
import TextInput from "/ui/TextInput";
import {
    ArrowLeft,
    User,
    Calendar,
    ChatCircle,
    Clock,
    CheckCircle,
    XCircle,
} from "@phosphor-icons/react";

const Show = ({ ticket }) => {
    const { t } = useTranslation();
    const [replyData, setReplyData] = useState({
        admin_reply: ticket.admin_reply || "",
        status: ticket.status,
    });
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);

        router.patch(`/panel/support/${ticket.id}`, replyData, {
            onSuccess: () => {
                setProcessing(false);
            },
            onError: (errors) => {
                console.error("Güncelleme hatası:", errors);
                setProcessing(false);
            },
        });
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
            <Head title={`Destek İsteği - ${ticket.subject}`} />

            <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
                <Link
                    href="/panel/support"
                    className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Geri Dön
                </Link>
            </div>
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Destek İsteği Detayı
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                #{ticket.id} - {ticket.subject}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        {getStatusIcon(ticket.status)}
                        <span
                            className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                                ticket.status
                            )}`}
                        >
                            {getStatusText(ticket.status)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {/* Ana İçerik */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Kullanıcı Bilgileri */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Kullanıcı Bilgileri
                        </h3>
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold text-xl">
                                    {ticket.user?.name?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <div className="font-medium text-gray-900 dark:text-white">
                                    {ticket.user?.name ||
                                        "Bilinmeyen Kullanıcı"}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {ticket.user?.email}
                                </div>
                                <div className="text-xs text-gray-400 dark:text-gray-500">
                                    Kayıt:{" "}
                                    {new Date(
                                        ticket.user?.created_at
                                    ).toLocaleDateString("tr-TR")}
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Destek İsteği */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Destek İsteği
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                    Konu
                                </h4>
                                <p className="text-gray-700 dark:text-gray-300">
                                    {ticket.subject}
                                </p>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                    Mesaj
                                </h4>
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                        {ticket.message}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                                <div className="flex items-center space-x-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                        {new Date(
                                            ticket.created_at
                                        ).toLocaleString("tr-TR")}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Admin Yanıtı */}
                    {ticket.admin_reply && (
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Admin Yanıtı
                            </h3>
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                    {ticket.admin_reply}
                                </p>
                            </div>
                            {ticket.replied_at && (
                                <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 mt-3">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                        Yanıtlandı:{" "}
                                        {new Date(
                                            ticket.replied_at
                                        ).toLocaleString("tr-TR")}
                                    </span>
                                </div>
                            )}
                        </Card>
                    )}
                </div>

                {/* Yan Panel */}
                <div className="space-y-6">
                    {/* Yanıt Formu */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Yanıt Ver
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Durum
                                </label>
                                <select
                                    value={replyData.status}
                                    onChange={(e) =>
                                        setReplyData({
                                            ...replyData,
                                            status: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="open">Açık</option>
                                    <option value="pending">Beklemede</option>
                                    <option value="closed">Kapalı</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Yanıt
                                </label>
                                <textarea
                                    value={replyData.admin_reply}
                                    onChange={(e) =>
                                        setReplyData({
                                            ...replyData,
                                            admin_reply: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                    rows={6}
                                    placeholder="Kullanıcıya yanıtınızı yazın..."
                                    required
                                />
                            </div>
                            <Buton
                                type="submit"
                                disabled={processing}
                                className="w-full"
                            >
                                {processing
                                    ? "Gönderiliyor..."
                                    : "Yanıtı Gönder"}
                            </Buton>
                        </form>
                    </Card>


                </div>
            </div>
        </AdminLayout>
    );
};

export default Show;

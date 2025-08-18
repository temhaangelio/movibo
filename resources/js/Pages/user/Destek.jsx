import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import UserLayout from "/Layouts/UserLayout";
import TextInput from "/ui/TextInput";
import Buton from "/ui/Buton";
import BottomSheet from "/ui/BottomSheet";
import Card from "/ui/Card";
import Loading from "/ui/Loading";
import {
    Question,
    Plus,
    Clock,
    CheckCircle,
    XCircle,
    ChatCircle,
} from "@phosphor-icons/react";

const Destek = ({ auth }) => {
    const { t } = useTranslation();
    const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    const [ticketData, setTicketData] = useState({
        subject: "",
        message: "",
    });
    const [ticketProcessing, setTicketProcessing] = useState(false);
    const [ticketErrors, setTicketErrors] = useState({});

    const resetTicket = () => {
        setTicketData({ subject: "", message: "" });
        setTicketErrors({});
    };

    // Destek isteklerini yükle
    const loadTickets = async () => {
        try {
            const response = await fetch("/api/support/tickets", {
                credentials: "same-origin",
            });
            const data = await response.json();
            if (data.success) {
                setTickets(data.tickets);
            }
        } catch (error) {
            console.error("Destek istekleri yüklenirken hata:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTickets();
    }, []);

    const handleTicketSubmit = (e) => {
        e.preventDefault();
        setTicketProcessing(true);

        // CSRF token'ı al
        const csrfMeta = document.querySelector('meta[name="csrf-token"]');
        const csrfToken = csrfMeta ? csrfMeta.getAttribute("content") : "";

        // Fetch ile gönder
        fetch("/support", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken,
            },
            credentials: "same-origin",
            body: JSON.stringify({
                subject: ticketData.subject,
                message: ticketData.message,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setIsNewTicketModalOpen(false);
                    resetTicket();
                    loadTickets(); // Listeyi yenile
                    alert("Destek isteğiniz başarıyla gönderildi!");
                } else {
                    console.error("Destek isteği gönderilirken hata:", data);
                    setTicketErrors(data.errors || {});
                }
            })
            .catch((error) => {
                console.error("Destek isteği gönderilirken hata:", error);
            })
            .finally(() => {
                setTicketProcessing(false);
            });
    };

    const openNewTicketModal = () => {
        resetTicket();
        setIsNewTicketModalOpen(true);
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
                return "bg-yellow-100 text-yellow-800
            case "closed":
                return "bg-green-100 text-green-800
            case "pending":
                return "bg-red-100 text-red-800
            default:
                return "bg-gray-100 text-gray-800
        }
    };

    return (
        <UserLayout auth={auth}>
            <Head title="Destek" />

            <div className="px-4 py-6">
                {/* Header */}
                <div className="mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900
                            Destek
                        </h1>
                        <p className="text-gray-600
                            Sorun yaşıyorsanız destek ekibimizle iletişime
                            geçin.
                        </p>
                    </div>
                    <Buton
                        className="w-full md:w-auto mt-4"
                        onClick={openNewTicketModal}
                        variant="primary"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Yeni Destek İsteği
                    </Buton>
                </div>

                {/* Destek İstekleri Listesi */}
                <Card>
                    <div className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Destek İstekleriniz
                        </h2>

                        {loading ? (
                            <div className="text-center py-8">
                                <Loading size="lg" />
                            </div>
                        ) : tickets.length === 0 ? (
                            <div className="text-center py-8">
                                <Question className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500 mb-4">
                                    Henüz destek isteğiniz bulunmuyor.
                                </p>
                                <Buton
                                    onClick={openNewTicketModal}
                                    variant="primary"
                                >
                                    İlk Destek İsteğinizi Gönderin
                                </Buton>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {tickets.map((ticket) => (
                                    <div
                                        key={ticket.id}
                                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <div className="flex items-center space-x-2">
                                                        {getStatusIcon(
                                                            ticket.status
                                                        )}
                                                        <h3 className="font-medium text-gray-900
                                                            {ticket.subject}
                                                        </h3>
                                                    </div>
                                                    <span
                                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                                            ticket.status
                                                        )}`}
                                                    >
                                                        {getStatusText(
                                                            ticket.status
                                                        )}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                                    {ticket.message}
                                                </p>
                                                <div className="flex items-center space-x-4 text-xs text-gray-500
                                                    <div className="flex items-center space-x-1">
                                                        <Clock className="w-3 h-3" />
                                                        <span>
                                                            {new Date(
                                                                ticket.created_at
                                                            ).toLocaleDateString(
                                                                "tr-TR"
                                                            )}
                                                        </span>
                                                    </div>
                                                    {ticket.admin_reply && (
                                                        <div className="flex items-center space-x-1">
                                                            <ChatCircle className="w-3 h-3" />
                                                            <span>
                                                                Yanıtlandı
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Admin Yanıtı */}
                                        {ticket.admin_reply && (
                                            <div className="mt-3 pt-3 border-t border-gray-200
                                                <div className="bg-blue-50 rounded-lg p-3">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <ChatCircle className="w-4 h-4 text-blue-500" />
                                                        <span className="text-sm font-medium text-blue-900
                                                            Admin Yanıtı
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-blue-800
                                                        {ticket.admin_reply}
                                                    </p>
                                                    {ticket.replied_at && (
                                                        <p className="text-xs text-blue-600 mt-2">
                                                            {new Date(
                                                                ticket.replied_at
                                                            ).toLocaleDateString(
                                                                "tr-TR"
                                                            )}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </Card>
            </div>

            {/* Yeni Destek İsteği BottomSheet */}
            <BottomSheet
                isOpen={isNewTicketModalOpen}
                onClose={() => setIsNewTicketModalOpen(false)}
                title="Yeni Destek İsteği"
                maxHeight="max-h-[80vh]"
            >
                <form onSubmit={handleTicketSubmit} className="space-y-4">
                    <TextInput
                        label="Konu"
                        value={ticketData.subject}
                        onChange={(e) =>
                            setTicketData({
                                ...ticketData,
                                subject: e.target.value,
                            })
                        }
                        error={ticketErrors.subject}
                        placeholder="Sorununuzun kısa açıklaması"
                        required
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mesaj
                        </label>
                        <textarea
                            value={ticketData.message}
                            onChange={(e) =>
                                setTicketData({
                                    ...ticketData,
                                    message: e.target.value,
                                })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            rows={5}
                            placeholder="Sorununuzu detaylı bir şekilde açıklayın..."
                            required
                        />
                        {ticketErrors.message && (
                            <p className="mt-1 text-sm text-red-600
                                {ticketErrors.message}
                            </p>
                        )}
                    </div>
                    <div className="flex justify-end space-x-3 pt-4 sticky bottom-0 bg-white py-2">
                        <Buton
                            type="button"
                            variant="secondary"
                            onClick={() => setIsNewTicketModalOpen(false)}
                        >
                            İptal
                        </Buton>
                        <Buton type="submit" disabled={ticketProcessing}>
                            {ticketProcessing ? "Gönderiliyor..." : "Gönder"}
                        </Buton>
                    </div>
                </form>
            </BottomSheet>
        </UserLayout>
    );
};

export default Destek;

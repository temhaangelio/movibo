import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import AdminLayout from "/Layouts/AdminLayout";
import Card from "/ui/Card";
import Header from "/ui/Header";
import {
    ArrowLeft,
    Clock,
    MapPin,
    Monitor,
    User,
    MagnifyingGlass,
    Funnel,
    Download,
} from "@phosphor-icons/react";

const Index = ({ activities }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterAction, setFilterAction] = useState("");

    const getActionIcon = (action) => {
        switch (action) {
            case "login":
                return "🔐";
            case "logout":
                return "🚪";
            case "post_create":
                return "📝";
            case "post_delete":
                return "🗑️";
            case "user_delete":
                return "❌";
            case "user_block":
                return "🚫";
            case "user_unblock":
                return "✅";
            case "profile_update":
                return "✏️";
            case "comment_create":
                return "💬";
            case "comment_delete":
                return "🗑️💬";
            case "like_create":
                return "❤️";
            case "like_delete":
                return "💔";
            case "follow_create":
                return "👥";
            case "follow_delete":
                return "👤";
            case "search":
                return "🔍";
            case "page_visit":
                return "🌐";
            default:
                return "📋";
        }
    };

    const getActionColor = (action) => {
        switch (action) {
            case "login":
            case "post_create":
            case "profile_update":
            case "comment_create":
            case "like_create":
            case "follow_create":
                return "text-green-600 bg-green-100";
            case "logout":
                return "text-blue-600 bg-blue-100";
            case "post_delete":
            case "user_delete":
            case "comment_delete":
            case "like_delete":
            case "follow_delete":
                return "text-red-600 bg-red-100";
            case "user_block":
                return "text-orange-600 bg-orange-100";
            case "user_unblock":
                return "text-green-600 bg-green-100";
            case "search":
            case "page_visit":
                return "text-purple-600 bg-purple-100";
            default:
                return "text-gray-600 bg-gray-100";
        }
    };

    const filteredActivities =
        activities.data?.filter((activity) => {
            const matchesSearch =
                activity.user?.name
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                activity.user?.username
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                activity.description
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                activity.action
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase());

            const matchesFilter =
                !filterAction || activity.action === filterAction;

            return matchesSearch && matchesFilter;
        }) || [];

    const uniqueActions = [
        ...new Set(activities.data?.map((a) => a.action) || []),
    ];

    return (
        <AdminLayout>
            <Head title="Tüm Aktiviteler - Admin Panel" />

            <Card className="p-6">
                <Header
                    title="Aktiviteler"
                    searchTerm={searchTerm}
                    onSearchChange={(e) => setSearchTerm(e.target.value)}
                    searchPlaceholder="Kullanıcı adı, açıklama veya işlem ara..."
                    searchWidth="w-64"
                />

                {/* Filters */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                        {/* Search */}
                        <div className="relative">
                            <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Kullanıcı adı, açıklama veya işlem ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                            />
                        </div>

                        {/* Action Filter */}
                        <div className="relative">
                            <Funnel className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <select
                                value={filterAction}
                                onChange={(e) =>
                                    setFilterAction(e.target.value)
                                }
                                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Tüm İşlemler</option>
                                {uniqueActions.map((action) => (
                                    <option key={action} value={action}>
                                        {action.replace("_", " ").toUpperCase()}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="text-sm text-gray-500">
                        {filteredActivities.length} sonuç
                    </div>
                </div>

                {/* Activities List */}
                <div className="space-y-4">
                    {filteredActivities.map((activity) => (
                        <div
                            key={activity.id}
                            className="bg-white border border-gray-200 rounded-lg p-4"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-3">
                                    <div className="text-2xl">
                                        {getActionIcon(activity.action)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <span
                                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActionColor(
                                                    activity.action
                                                )}`}
                                            >
                                                {activity.action
                                                    .replace("_", " ")
                                                    .toUpperCase()}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {activity.description}
                                            </span>
                                        </div>

                                        {/* User Info */}
                                        <div className="flex items-center space-x-2 mb-2">
                                            <User className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm font-medium text-gray-900">
                                                {activity.user?.name}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                @{activity.user?.username}
                                            </span>
                                        </div>

                                        {activity.metadata &&
                                            Object.keys(activity.metadata)
                                                .length > 0 && (
                                                <div className="text-sm text-gray-600 mb-2">
                                                    {Object.entries(
                                                        activity.metadata
                                                    ).map(([key, value]) => (
                                                        <span
                                                            key={key}
                                                            className="inline-block mr-3"
                                                        >
                                                            <span className="font-medium">
                                                                {key}:
                                                            </span>{" "}
                                                            {String(value)}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                                            <div className="flex items-center space-x-1">
                                                <Clock className="w-3 h-3" />
                                                <span>
                                                    {new Date(
                                                        activity.created_at
                                                    ).toLocaleString("tr-TR")}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <MapPin className="w-3 h-3" />
                                                <span>
                                                    {activity.masked_ip_address}
                                                </span>
                                            </div>
                                            {activity.url && (
                                                <div className="flex items-center space-x-1">
                                                    <Monitor className="w-3 h-3" />
                                                    <span className="truncate max-w-xs">
                                                        {activity.url}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {activities.links && (
                    <div className="mt-6">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Toplam {activities.total} aktiviteden{" "}
                                {activities.from}-{activities.to} arası
                                gösteriliyor
                            </div>
                            <div className="flex space-x-2">
                                {activities.links.map((link, index) =>
                                    link.url ? (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            className={`px-3 py-2 text-sm font-medium rounded-md ${
                                                link.active
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                                            }`}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ) : (
                                        <span
                                            key={index}
                                            className="px-3 py-2 text-sm font-medium rounded-md bg-gray-100 text-gray-400 cursor-not-allowed"
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
        </AdminLayout>
    );
};

export default Index;

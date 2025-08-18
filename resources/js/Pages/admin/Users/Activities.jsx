import React from "react";
import { Head, Link } from "@inertiajs/react";
import AdminLayout from "/Layouts/AdminLayout";
import Card from "/ui/Card";
import { ArrowLeft, Clock, MapPin, Monitor, User } from "@phosphor-icons/react";

const Activities = ({ user, activities }) => {
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
            default:
                return "📋";
        }
    };

    const getActionColor = (action) => {
        switch (action) {
            case "login":
            case "post_create":
            case "profile_update":
                return "text-green-600 bg-green-100";
            case "logout":
                return "text-blue-600 bg-blue-100";
            case "post_delete":
            case "user_delete":
                return "text-red-600 bg-red-100";
            case "user_block":
                return "text-orange-600 bg-orange-100";
            case "user_unblock":
                return "text-green-600 bg-green-100";
            default:
                return "text-gray-600 bg-gray-100";
        }
    };

    return (
        <AdminLayout>
            <Head title={`${user.name} - Kullanıcı Aktiviteleri`} />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                    <Link
                        href="/panel/users"
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Geri Dön</span>
                    </Link>
                </div>
            </div>

            <Card className="p-6">
                {/* User Info */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-lg">
                                {user.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-900">
                                {user.name}
                            </div>
                            <div className="text-sm text-gray-500">
                                {user.email}
                            </div>
                            <div className="text-xs text-gray-400">
                                Kayıt:{" "}
                                {new Date(user.created_at).toLocaleDateString(
                                    "tr-TR"
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Activities List */}
                <div className="space-y-4">
                    {activities.data?.map((activity) => (
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

export default Activities;

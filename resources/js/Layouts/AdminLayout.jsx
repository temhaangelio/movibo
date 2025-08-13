import Logo from "/ui/Logo";
import Dropdown from "/ui/Dropdown";

import { Link, usePage, router } from "@inertiajs/react";
import { useState } from "react";
import {
    House,
    Users,
    Article,
    ChatCircle,
    Bell,
    MagnifyingGlass,
    Headphones,
    Globe,
    SignOut,
} from "@phosphor-icons/react";

export default function AdminLayout({ children }) {
    const { auth } = usePage().props;
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Sidebar */}
            <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg">
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <Link
                            href="/panel"
                            className="flex items-center space-x-2"
                        >
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">
                                    M
                                </span>
                            </div>
                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                                Movibo
                            </span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-2">
                        <Link
                            href="/panel"
                            className="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
                        >
                            <House className="w-5 h-5 mr-3" />
                            Dashboard
                        </Link>
                        <Link
                            href="/panel/users"
                            className="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
                        >
                            <Users className="w-5 h-5 mr-3" />
                            Kullanıcılar
                        </Link>
                        <Link
                            href="/panel/posts"
                            className="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
                        >
                            <Article className="w-5 h-5 mr-3" />
                            Paylaşımlar
                        </Link>
                        <Link
                            href="/panel/comments"
                            className="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
                        >
                            <ChatCircle className="w-5 h-5 mr-3" />
                            Yorumlar
                        </Link>
                        <Link
                            href="/panel/destek"
                            className="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
                        >
                            <Headphones className="w-5 h-5 mr-3" />
                            Destek
                        </Link>
                    </nav>

                    {/* Bottom Links */}
                    <div className="py-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                        <div className="flex items-center space-x-3 px-4 border-b border-gray-200 dark:border-gray-700 pb-4">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold">
                                    {auth.user.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {auth.user.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {auth.user.email}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => router.post("/logout")}
                            className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                            <SignOut className="w-5 h-5 mr-3" />
                            Çıkış Yap
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="ml-64">
                {/* Top Header */}
                <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                    <div className="px-6 py-3">
                        <div className="relative">
                            <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Ara..."
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">{children}</main>
            </div>

            {/* Mobile Menu Overlay */}
            {showingNavigationDropdown && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div
                        className="fixed inset-0 bg-gray-600 bg-opacity-75"
                        onClick={() => setShowingNavigationDropdown(false)}
                    ></div>
                </div>
            )}

            {/* Mobile Navigation */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden ${
                    showingNavigationDropdown
                        ? "translate-x-0"
                        : "-translate-x-full"
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Mobile Logo */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <Link
                            href="/panel"
                            className="flex items-center space-x-2"
                        >
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">
                                    M
                                </span>
                            </div>
                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                                Movibo
                            </span>
                        </Link>
                        <button
                            onClick={() => setShowingNavigationDropdown(false)}
                            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Mobile User Profile */}
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold">
                                    {auth.user.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {auth.user.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {auth.user.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-2">
                        <Link
                            href="/panel"
                            onClick={() => setShowingNavigationDropdown(false)}
                            className="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
                        >
                            <House className="w-5 h-5 mr-3" />
                            Dashboard
                        </Link>
                        <Link
                            href="/panel/users"
                            onClick={() => setShowingNavigationDropdown(false)}
                            className="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
                        >
                            <Users className="w-5 h-5 mr-3" />
                            Kullanıcılar
                        </Link>
                        <Link
                            href="/panel/posts"
                            onClick={() => setShowingNavigationDropdown(false)}
                            className="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
                        >
                            <Article className="w-5 h-5 mr-3" />
                            Paylaşımlar
                        </Link>
                        <Link
                            href="/panel/comments"
                            onClick={() => setShowingNavigationDropdown(false)}
                            className="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
                        >
                            <ChatCircle className="w-5 h-5 mr-3" />
                            Yorumlar
                        </Link>
                        <Link
                            href="/panel/destek"
                            onClick={() => setShowingNavigationDropdown(false)}
                            className="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
                        >
                            <Headphones className="w-5 h-5 mr-3" />
                            Destek
                        </Link>
                    </nav>

                    {/* Mobile Bottom Links */}
                    <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                        <button className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                            <Globe className="w-5 h-5 mr-3" />
                            Topluluk
                        </button>
                        <div className="px-3 py-2">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {auth.user.name}
                            </p>
                        </div>
                        <button
                            onClick={() => router.post("/logout")}
                            className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                            <SignOut className="w-5 h-5 mr-3" />
                            Çıkış Yap
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="fixed top-4 left-4 z-50 lg:hidden">
                <button
                    onClick={() => setShowingNavigationDropdown(true)}
                    className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
}

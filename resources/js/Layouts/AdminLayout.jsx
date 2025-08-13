import ApplicationLogo from "/ui/Logo";
import Dropdown from "/ui/Dropdown";

import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function AdminLayout({ children }) {
    const { auth } = usePage().props;
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Navigation */}
            <nav className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            {/* Logo */}
                            <div className="shrink-0 flex items-center">
                                <Link href="/admin">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800 dark:text-gray-200" />
                                </Link>
                            </div>

                            {/* Navigation Links */}
                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <Link
                                    href="/admin"
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out ${
                                        route().current("admin.dashboard")
                                            ? "border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-gray-700 dark:focus:border-gray-300"
                                            : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 focus:outline-none focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-700"
                                    }`}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/admin/users"
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out ${
                                        route().current("admin.users.*")
                                            ? "border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-gray-700 dark:focus:border-gray-300"
                                            : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 focus:outline-none focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-700"
                                    }`}
                                >
                                    Kullanıcılar
                                </Link>
                                <Link
                                    href="/admin/posts"
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out ${
                                        route().current("admin.posts.*")
                                            ? "border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-gray-700 dark:focus:border-gray-300"
                                            : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 focus:outline-none focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-700"
                                    }`}
                                >
                                    Paylaşımlar
                                </Link>
                                <Link
                                    href="/admin/comments"
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out ${
                                        route().current("admin.comments.*")
                                            ? "border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-gray-700 dark:focus:border-gray-300"
                                            : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 focus:outline-none focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-700"
                                    }`}
                                >
                                    Yorumlar
                                </Link>
                            </div>
                        </div>

                        {/* Settings Dropdown */}
                        <div className="hidden sm:flex sm:items-center sm:ms-6">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <span className="inline-flex rounded-md">
                                        <button
                                            type="button"
                                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150"
                                        >
                                            {auth.user.name} (Admin)
                                            <svg
                                                className="ms-2 -me-0.5 h-4 w-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </span>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <Dropdown.Link href="/home">
                                        Ana Sayfaya Git
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                    >
                                        Çıkış Yap
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>

                        {/* Hamburger */}
                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState
                                    )
                                }
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-900 focus:text-gray-500 dark:focus:text-gray-400 transition duration-150 ease-in-out"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Responsive Navigation Menu */}
                <div
                    className={
                        (showingNavigationDropdown ? "block" : "hidden") +
                        " sm:hidden"
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        <Link
                            href="/admin"
                            className={`block px-3 py-2 rounded-md text-base font-medium transition duration-150 ease-in-out ${
                                route().current("admin.dashboard")
                                    ? "text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-900"
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"
                            }`}
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/admin/users"
                            className={`block px-3 py-2 rounded-md text-base font-medium transition duration-150 ease-in-out ${
                                route().current("admin.users.*")
                                    ? "text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-900"
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"
                            }`}
                        >
                            Kullanıcılar
                        </Link>
                        <Link
                            href="/admin/posts"
                            className={`block px-3 py-2 rounded-md text-base font-medium transition duration-150 ease-in-out ${
                                route().current("admin.posts.*")
                                    ? "text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-900"
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"
                            }`}
                        >
                            Paylaşımlar
                        </Link>
                        <Link
                            href="/admin/comments"
                            className={`block px-3 py-2 rounded-md text-base font-medium transition duration-150 ease-in-out ${
                                route().current("admin.comments.*")
                                    ? "text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-900"
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"
                            }`}
                        >
                            Yorumlar
                        </Link>
                    </div>

                    <div className="mt-3 space-y-1">
                        <Link
                            href="/home"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-150 ease-in-out"
                        >
                            Ana Sayfaya Git
                        </Link>
                        <Link
                            method="post"
                            href="/logout"
                            as="button"
                            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-150 ease-in-out"
                        >
                            Çıkış Yap
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Page Content */}
            <main className="py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

import Logo from "/ui/Logo";
import { Link } from "@inertiajs/react";

export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen py-12 px-6 bg-gray-100 dark:bg-gray-900">
            <div className="flex flex-col justify-center items-center min-h-screen">
                <Link href="/">
                    <Logo className="text-4xl" />
                </Link>
                <div className="mt-6 w-full overflow-hidden bg-white dark:bg-gray-800 p-6 shadow-md rounded-xl">
                    {children}
                </div>
            </div>
        </div>
    );
}

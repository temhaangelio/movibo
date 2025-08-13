import React from "react";
import { Head, Link } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import ApplicationLogo from "/ui/Logo";
import Buton from "/ui/Buton";

const Welcome = () => {
    const { t } = useTranslation();
    return (
        <>
            <Head title="Movibo - Film ve Kitap Paylaşım Platformu" />

            <div className="min-h-screen py-24 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 ">
                {/* Hero Section */}
                <main className="flex-1 flex items-center justify-center min-h-screen px-4">
                    <div className="w-full max-w-md mx-auto text-center">
                        {/* Logo */}
                        <div className="animate-fade-in">
                            <ApplicationLogo className="w-auto text-5xl font-black" />
                        </div>

                        {/* Görsel */}
                        <div className="mb-8 animate-slide-in-up">
                            <div className="relative border-b border-black">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-3xl blur-3xl"></div>
                                <img
                                    src="/gorsel1.png"
                                    alt="Movibo Görsel"
                                    className="relative w-full h-auto"
                                />
                            </div>
                        </div>

                        {/* Başlık ve Açıklama */}
                        <div className="animate-slide-in-up">
                            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
                                <span className="text-blue-600 dark:text-blue-400">
                                    {t("cinema", "Sinemanın")}
                                </span>
                                <br />
                                <span className="text-gray-800 dark:text-gray-200">
                                    {t("social_media", "Sosyal Medyası")}
                                </span>
                            </h1>

                            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                                {t(
                                    "welcome_description",
                                    "İzlediğin filmleri paylaş, listeni oluştur, puan ver, yorum yap diğer kullanıcılarla etkileşime geç ve yeni keşifler yap."
                                )}
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col gap-4">
                                <Link href="/register">
                                    <Buton
                                        variant="primary"
                                        size="lg"
                                        className="w-full font-bold bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg shadow-lg"
                                    >
                                        {t("get_started", "Hemen Başla")}
                                    </Buton>
                                </Link>
                                <Link href="/login">
                                    <Buton
                                        variant="outline"
                                        size="lg"
                                        className="w-full font-bold border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 py-4 text-lg"
                                    >
                                        {t("login")}
                                    </Buton>
                                </Link>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default Welcome;

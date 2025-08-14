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

            <div
                className="min-h-screen h-full bg-white py-24"
                style={{
                    backgroundImage: "url(/bg.png)",
                    backgroundSize: "30%",
                }}
            >
                {/* Hero Section */}
                <main className="flex-1 flex items-center justify-center min-h-screen h-screen px-4 relative">
                    {/* Overlay */}

                    <div className="w-full max-w-md mx-auto text-center relative z-10">
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
                            <h1 className="flex flex-col text-4xl font-black mb-6 leading-tight">
                                <span className="text-blue-600">
                                    {t("cinema", "Sinemanın")}
                                </span>

                                <span>
                                    {t("social_media", "Sosyal Medyası")}
                                </span>
                            </h1>

                            <p className="text-md mb-8 leading-relaxed">
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
                                        className="w-full font-bold  py-4 text-lg bg-blue-600 text-white"
                                    >
                                        {t("get_started", "Hemen Başla")}
                                    </Buton>
                                </Link>
                                <Link href="/login">
                                    <Buton
                                        variant="primary"
                                        size="lg"
                                        className="w-full font-bold  py-4 text-lg text-white"
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

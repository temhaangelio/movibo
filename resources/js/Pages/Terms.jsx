import { Head, Link } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { X } from "@phosphor-icons/react";
import AuthLayout from "@/Layouts/AuthLayout";

export default function Terms() {
    const { t } = useTranslation();

    return (
        <AuthLayout>
            <Head title="Kullanım Şartları" />

            <div className="flex justify-end items-center  w-full">
                <Link
                    href="/register"
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                    <X size={24} weight="bold" />
                </Link>
            </div>

            <div className="max-w-4xl mx-auto pt-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Kullanım Şartları
                </h1>

                <div className="prose prose-lg max-w-none">
                    <h2 className="text-2xl font-semibold mb-4">
                        1. Genel Hükümler
                    </h2>
                    <p className="mb-4">
                        Bu kullanım şartları, Movibo platformunu kullanırken
                        uymanız gereken kuralları ve koşulları belirler.
                        Platformu kullanarak bu şartları kabul etmiş
                        sayılırsınız.
                    </p>

                    <h2 className="text-2xl font-semibold mb-4">
                        2. Hizmet Kullanımı
                    </h2>
                    <p className="mb-4">
                        Movibo, film ve kitap paylaşımları yapabileceğiniz,
                        diğer kullanıcılarla etkileşime geçebileceğiniz sosyal
                        bir platformdur. Hizmeti yasal amaçlar için
                        kullanmalısınız.
                    </p>

                    <h2 className="text-2xl font-semibold mb-4">
                        3. Kullanıcı Sorumlulukları
                    </h2>
                    <ul className="list-disc pl-6 mb-4">
                        <li>Doğru ve güncel bilgiler sağlamak</li>
                        <li>Telif hakkı ihlali yapmamak</li>
                        <li>Diğer kullanıcılara saygılı olmak</li>
                        <li>
                            Platform güvenliğini tehdit edecek davranışlarda
                            bulunmamak
                        </li>
                    </ul>

                    <h2 className="text-2xl font-semibold mb-4">
                        4. İçerik Kuralları
                    </h2>
                    <p className="mb-4">
                        Paylaştığınız içerikler uygunsuz, zararlı veya yasa dışı
                        olmamalıdır. Platform yönetimi uygun olmayan içerikleri
                        kaldırma hakkını saklı tutar.
                    </p>

                    <h2 className="text-2xl font-semibold mb-4">5. Gizlilik</h2>
                    <p className="mb-4">
                        Kişisel verileriniz gizlilik politikamıza uygun olarak
                        işlenir. Detaylı bilgi için gizlilik politikamızı
                        inceleyebilirsiniz.
                    </p>

                    <h2 className="text-2xl font-semibold mb-4">
                        6. Hesap Güvenliği
                    </h2>
                    <p className="mb-4">
                        Hesap bilgilerinizi güvenli tutmak sizin
                        sorumluluğunuzdadır. Şüpheli aktiviteler fark
                        ettiğinizde bizi bilgilendirin.
                    </p>

                    <h2 className="text-2xl font-semibold mb-4">
                        7. Değişiklikler
                    </h2>
                    <p className="mb-4">
                        Bu kullanım şartları önceden haber verilmeksizin
                        değiştirilebilir. Güncel şartları takip etmek sizin
                        sorumluluğunuzdadır.
                    </p>

                    <h2 className="text-2xl font-semibold mb-4">8. İletişim</h2>
                    <p className="mb-4">
                        Sorularınız için support@movibo.com adresinden bizimle
                        iletişime geçebilirsiniz.
                    </p>

                    <div className="mt-8 p-4 bg-gray-100 rounded-lg">
                        <p className="text-sm text-gray-600
                            <strong>Son güncelleme:</strong> 12 Ağustos 2025
                        </p>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}

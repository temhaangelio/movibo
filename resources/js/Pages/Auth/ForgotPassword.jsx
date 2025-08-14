import InputError from "/ui/InputError";
import Buton from "/ui/Buton";
import TextInput from "/ui/TextInput";
import AuthLayout from "@/Layouts/AuthLayout";
import { Head, useForm } from "@inertiajs/react";
import Card from "/ui/Card";
import InputLabel from "/ui/InputLabel";
import { useTranslation } from "react-i18next";

export default function ForgotPassword({ status }) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("password.email"));
    };

    return (
        <AuthLayout>
            <Head title="Forgot Password" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
            <Card className="p-6 w-full">
                <form onSubmit={submit}>
                    <InputLabel htmlFor="email" value={t("email")} />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        isFocused={true}
                        onChange={(e) => setData("email", e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />

                    <div className="mt-4 flex items-center justify-end">
                        <Buton
                            type="submit"
                            variant="primary"
                            className="w-full"
                            disabled={processing}
                        >
                            Şifre Sıfırlama Linki Gönder
                        </Buton>
                    </div>
                </form>
            </Card>
        </AuthLayout>
    );
}

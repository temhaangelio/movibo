import InputError from "/ui/InputError";
import InputLabel from "/ui/InputLabel";
import Buton from "/ui/Buton";
import TextInput from "/ui/TextInput";
import Checkbox from "/ui/Checkbox";
import Card from "/ui/Card";
import AuthLayout from "@/Layouts/AuthLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useTranslation } from "react-i18next";

export default function Register() {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        username: "",
        email: "",
        password: "",
        password_confirmation: "",
        terms_accepted: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post("/register", {
            onFinish: () => reset("password", "password_confirmation"),
            onError: (errors) => {
                console.error("Register errors:", errors);
            },
        });
    };

    return (
        <AuthLayout>
            <Head title={t("register_title")} />

            <Card className="p-6 max-w-md w-full">
                <form onSubmit={submit}>
                    <div>
                        <InputLabel htmlFor="name" value={t("name")} />

                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="mt-1 block w-full"
                            autoComplete="name"
                            isFocused={true}
                            onChange={(e) => setData("name", e.target.value)}
                            required
                        />

                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="username" value={t("username")} />

                        <TextInput
                            id="username"
                            name="username"
                            value={data.username}
                            className="mt-1 block w-full"
                            autoComplete="username"
                            onChange={(e) =>
                                setData("username", e.target.value)
                            }
                            required
                        />

                        <InputError
                            message={errors.username}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="email" value={t("email")} />

                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            autoComplete="username"
                            onChange={(e) => setData("email", e.target.value)}
                            required
                        />

                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="password" value={t("password")} />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            required
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-4">
                        <InputLabel
                            htmlFor="password_confirmation"
                            value={t("confirm_password_label")}
                        />

                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                            required
                        />

                        <InputError
                            message={errors.password_confirmation}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-4">
                        <div className="flex items-center">
                            <Checkbox
                                id="terms_accepted"
                                name="terms_accepted"
                                checked={data.terms_accepted}
                                onChange={(e) =>
                                    setData("terms_accepted", e.target.checked)
                                }
                                required
                            />
                            <label
                                htmlFor="terms_accepted"
                                className="ms-2 text-sm text-gray-600"
                            >
                                {t("terms_acceptance_text")}{" "}
                                <Link
                                    href="/terms"
                                    className="text-blue-600 hover:underline"
                                    target="_blank"
                                >
                                    {t("terms_of_service")}
                                </Link>
                            </label>
                        </div>
                        <InputError
                            message={errors.terms_accepted}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-4 flex items-center justify-end">
                        <Buton
                            type="submit"
                            variant="primary"
                            disabled={processing}
                        >
                            {t("register")}
                        </Buton>
                    </div>
                </form>
            </Card>
            <div className="mt-6 text-center">
                <Link
                    href="/login"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
                >
                    {t("already_registered")}
                </Link>
            </div>
        </AuthLayout>
    );
}

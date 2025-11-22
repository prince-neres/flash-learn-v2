import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "../components/Button";
import Input from "../components/Input";
import { useSignup } from "../hooks/useSignup";

const Signup: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const { t } = useTranslation();
    const { signup, loading } = useSignup();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await signup(name, email, password);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
                        {t("auth.signup")}
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="-space-y-px rounded-md shadow-sm flex flex-col gap-4">
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            required
                            label={t("auth.fullName")}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Input
                            id="email-address"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            label={t("auth.email")}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            required
                            label={t("auth.password")}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full"
                        >
                            {loading ? t("common.loading") : t("auth.signup")}
                        </Button>
                    </div>

                    <div className="text-center text-sm">
                        <span className="text-gray-400">
                            {t("auth.alreadyHaveAccount")}
                        </span>
                        <Link
                            to="/login"
                            className="font-medium text-blue-500 hover:text-blue-400"
                        >
                            {t("auth.login")}
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;

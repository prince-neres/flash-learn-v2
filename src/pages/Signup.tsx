import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useSignup } from "../hooks/useSignup";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "../components/ui/label";

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
        <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
            <div className="absolute inset-x-0 top-0 -z-10 h-80 bg-gradient-to-b from-violet-500/20 to-transparent" />
            <Card className="w-full max-w-md border-border/60 bg-card/95 shadow-2xl">
                <CardHeader className="space-y-4 text-center py-4">
                    <CardTitle className="text-3xl">{t("auth.signup")}</CardTitle>
                    <CardDescription>{t("auth.signupSubtitle")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">{t("auth.fullName")}</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email-address">{t("auth.email")}</Label>
                                <Input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">{t("auth.password")}</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? t("common.loading") : t("auth.signup")}
                        </Button>

                        <div className="text-center text-sm">
                            <span className="text-muted-foreground">
                                {t("auth.alreadyHaveAccount")}
                            </span>
                            <Link
                                to="/login"
                                className="font-semibold text-primary transition hover:text-primary/80"
                            >
                                {t("auth.login")}
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Signup;

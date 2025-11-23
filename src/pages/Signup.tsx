import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Github, Layers, Trophy } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useSignup } from "../hooks/useSignup";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { useGithubAuth } from "../hooks/useGithubAuth";

const Signup: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const { t } = useTranslation();
    const { signup, loading } = useSignup();
    const { loginWithGithub, loading: githubLoading } = useGithubAuth();
    const currentYear = new Date().getFullYear();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await signup(name, email, password);
    };

    return (
        <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(147,51,234,0.2),_transparent_55%)]" />
            <div className="relative z-10 mx-auto grid w-full max-w-6xl flex-1 items-center gap-12 px-4 py-12 lg:grid-cols-2">
                <div className="order-last space-y-8 text-center lg:order-first lg:text-left">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-semibold leading-tight text-pretty lg:text-5xl">
                            {t("auth.signup")}
                        </h1>
                        <p className="text-base text-muted-foreground lg:text-lg">
                            {t("auth.signupSubtitle")}
                        </p>
                    </div>
                    <div className="grid gap-4 text-left sm:grid-cols-2">
                        {[{ icon: Layers, label: t("auth.featureCommunity") }, { icon: Trophy, label: t("leaderboard.title") }].map(({ icon: Icon, label }) => (
                            <div key={label} className="rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm">
                                <Icon className="h-5 w-5 text-primary" />
                                <p className="mt-3 text-sm text-muted-foreground">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <Card className="border-border/60 bg-card/95 shadow-2xl">
                    <CardHeader className="space-y-2 text-center py-4">
                        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{t("auth.signup")}</p>
                        <CardTitle className="text-3xl">{t("auth.signup")}</CardTitle>
                        <CardDescription>{t("auth.signupSubtitle")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full gap-2"
                                onClick={loginWithGithub}
                                disabled={githubLoading}
                            >
                                <Github className="h-4 w-4" />
                                {githubLoading ? t("common.loading") : t("auth.githubCta")}
                            </Button>
                            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                                <span className="h-px flex-1 bg-border" />
                                {t("auth.orContinue")}
                                <span className="h-px flex-1 bg-border" />
                            </div>
                        </div>

                        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
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
                                <span className="text-muted-foreground">{t("auth.alreadyHaveAccount")}</span>
                                <Link to="/login" className="font-semibold text-primary transition hover:text-primary/80">
                                    {t("auth.login")}
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
            <footer className="relative z-10 px-4 pb-8 text-center text-sm text-muted-foreground">
                <p>
                    © {currentYear} Flash Learn. Built by{" "}
                    <a
                        href="https://github.com/prince-neres"
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-primary underline-offset-4 hover:underline"
                    >
                        Prince Neres
                    </a>
                    .
                </p>
            </footer>
        </div>
    );
};

export default Signup;

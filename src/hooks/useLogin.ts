import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import { auth } from "../lib/firebase";
import { useTranslation } from "react-i18next";

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const login = async (email: string, password: string) => {
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success(t("auth.welcomeBack"));
            navigate("/");
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || t("auth.loginFailed"));
        } finally {
            setLoading(false);
        }
    };

    return { login, loading };
};

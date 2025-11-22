import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AVAILABLE_LANGUAGES } from "../i18n";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  const handleChange = (value: string) => {
    void i18n.changeLanguage(value);
  };

  const currentLanguage = AVAILABLE_LANGUAGES.some((lang) => lang.value === i18n.language)
    ? i18n.language
    : i18n.language.split('-')[0];

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select value={currentLanguage} onValueChange={handleChange}>
        <SelectTrigger className="w-[140px] bg-background/80 backdrop-blur">
          <SelectValue placeholder={t('profile.languageLabel')} />
        </SelectTrigger>
        <SelectContent>
          {AVAILABLE_LANGUAGES.map((lang) => (
            <SelectItem key={lang.value} value={lang.value}>
              {lang.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

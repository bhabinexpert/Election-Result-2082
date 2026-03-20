import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { translations } from "../i18n/translations";

const AppSettingsContext = createContext(null);

export const AppSettingsProvider = ({ children }) => {
  const [language, setLanguage] = useState(
    localStorage.getItem("app_language") || "en"
  );
  const [theme, setTheme] = useState(localStorage.getItem("app_theme") || "light");

  useEffect(() => {
    localStorage.setItem("app_language", language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem("app_theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const t = useMemo(() => translations[language] || translations.en, [language]);

  const value = {
    language,
    setLanguage,
    theme,
    setTheme,
    t,
  };

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
};

export const useAppSettings = () => {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error("useAppSettings must be used within AppSettingsProvider");
  }
  return context;
};


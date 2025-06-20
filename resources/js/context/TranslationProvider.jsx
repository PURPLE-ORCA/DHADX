import { createContext, useEffect, useState } from "react";
import ar from "../lang/ar.json";
import en from "../lang/en.json";
import fr from "../lang/fr.json";

export const TranslationContext = createContext();

export default function TranslationProvider({ children }) {
    const [language, setLanguage] = useState(
        () => localStorage.getItem("lang") || "en"
    );
    // New state for text direction
    const [direction, setDirection] = useState('ltr');

    const getTranslations = (lang) => {
        switch (lang) {
            case "en":
                return en;
            case "ar":
                return ar;
            case "fr":
                return fr;
            default:
                return en;
        }
    };

    const [translations, setTranslations] = useState(getTranslations(language));

    useEffect(() => {
        setTranslations(getTranslations(language));

        // Update direction based on the selected language
        const newDirection = language === 'ar' ? 'rtl' : 'ltr';
        setDirection(newDirection);

        // Directly manipulate the root HTML element. This is the master switch.
        document.documentElement.lang = language;
        document.documentElement.dir = newDirection;

    }, [language]);

    const switchLanguage = (lang) => {
        if (!["ar","en", "fr"].includes(lang)) return;
        setLanguage(lang);
        localStorage.setItem("lang", lang);
    };

    return (
        <TranslationContext.Provider value={{ translations, language, direction, switchLanguage }}>
            {children}
        </TranslationContext.Provider>
    );
}

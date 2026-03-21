import { useContext } from "react";
import { AppSettingsContext } from "./AppSettingsContextValue";

export const useAppSettings = () => {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error("useAppSettings must be used within AppSettingsProvider");
  }
  return context;
};


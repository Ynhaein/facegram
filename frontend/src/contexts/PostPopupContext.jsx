/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

const PostPopupContext = createContext();

export const PostPopupProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openPopup = () => setIsOpen(true);
  const closePopup = () => setIsOpen(false);

  return (
    <PostPopupContext.Provider value={{ isOpen, openPopup, closePopup }}>
      {children}
    </PostPopupContext.Provider>
  );
};

export const usePostPopup = () => {
  const ctx = useContext(PostPopupContext);
  if (!ctx) throw new Error("usePostPopup must be inside PostPopupProvider");
  return ctx;
};

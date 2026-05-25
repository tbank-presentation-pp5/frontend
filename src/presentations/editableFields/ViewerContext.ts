import { createContext, useContext } from "react";

export const ViewerContext = createContext(false);
export const useIsViewer = () => useContext(ViewerContext);

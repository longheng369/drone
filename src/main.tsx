import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { DataProvider } from "./Context.tsx";
import { BrowserRouter } from "react-router-dom";
import { HomeProvider } from "./contexts/HomeContext.tsx";
import { StartProvider } from "./contexts/StartContext.tsx";

createRoot(document.getElementById("root")!).render(
   <StrictMode>
      <BrowserRouter>
         <HomeProvider>
            <DataProvider>
               <StartProvider>
                  <App />
               </StartProvider>
            </DataProvider>
         </HomeProvider>
      </BrowserRouter>
   </StrictMode>
);

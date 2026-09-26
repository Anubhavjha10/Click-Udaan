import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./styles/global.css";
import "./styles/admin.css";
import "./styles/verify.css";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
    <App/>
    </BrowserRouter>

);

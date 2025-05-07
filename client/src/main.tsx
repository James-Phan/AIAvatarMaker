import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add custom styles to match the design
document.documentElement.style.setProperty('--primary', '207 90% 54%');
document.documentElement.style.setProperty('--secondary', '138 59% 45%');
document.documentElement.style.setProperty('--accent', '44 96% 50%');
document.documentElement.style.setProperty('--destructive', '0 84% 60%');
document.documentElement.style.setProperty('--background', '0 0% 98%');

createRoot(document.getElementById("root")!).render(<App />);

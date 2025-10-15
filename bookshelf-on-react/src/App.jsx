import { useState } from "react";
import Header from "./components/Header";
import ScrollUpButton from "./components/ScrollUpButton";
import Home from "./pages/Home";
import "./assets/css/style.css";

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const toggleTheme = () => setIsDark((p) => !p);

  return (
    <div className={isDark ? "dark" : "light"}>
      <Header isDark={isDark} toggleTheme={toggleTheme} />
      <Home />
      <ScrollUpButton />
    </div>
  );
}

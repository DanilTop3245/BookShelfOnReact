import { useState } from "react";
import Header from "./components/Header";
import ScrollUpButton from "./components/ScrollUpButton";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ShoppingCart from "./pages/shoppingCart";
import "./assets/css/style.css";

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const toggleTheme = () => setIsDark((p) => !p);

  return (
    <div className={isDark ? "dark" : "light"}>
      <Header isDark={isDark} toggleTheme={toggleTheme} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<ShoppingCart />} />
      </Routes>
      <ScrollUpButton />
    </div>
  );
}

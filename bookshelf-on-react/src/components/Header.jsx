import { useState } from "react";
import "../assets/css/style.css";
import logo from "../assets/img/icons.png";

export default function Header({ isDark, toggleTheme }) {
  return (
    <header className={isDark ? "dark" : "light"} id="main-header">
      <div className="logo">
        <a href="/">
          <img src={logo} alt="logo" className="ico" />
        </a>
        <h4>Bookshelf</h4>
        <a href="/" className="home-link hl">Home</a>
        <a href="/cart" className="cart-link cl">Shopping Cart</a>
      </div>

      <div className="container">
        <label className="switch">
          <input type="checkbox" checked={isDark} onChange={toggleTheme} />
          <span className="slider"></span>
        </label>

        <div className="container-btn">
          <button id="btnRegistr" className="registr">Sign Up</button>
          <button id="btnLogout" className="logout hidden">Log Out</button>
        </div>
      </div>
    </header>
  );
}

import "../assets/css/style.css";
import logo from "../assets/img/icons.png";
import { Link } from "react-router-dom";
import Home from "../pages/Home";
import ShoppingCart from "../pages/shoppingCart";

export default function Header({ isDark, toggleTheme }) {
  return (
    <header className={isDark ? "dark" : "light"} id="main-header">
      <div className="logo">
        <a href="/">
          <img src={logo} alt="logo" className="ico" />
        </a>
        <h4>Bookshelf</h4>
        {/* <Routes>
        <Route path="/" className="home-link hl" element={<Home />} />
        <Route path="/cart" className="cart-link cl" element={<ShoppingCart />} />
      </Routes> */}
        <Link to="/" className="home-link hl">
          Home
        </Link>
        <Link to="/cart" className="cart-link cl">
          Cart
        </Link>
      </div>

      <div className="container-register-theme">
        <label className="switch">
          <input type="checkbox" checked={isDark} onChange={toggleTheme} />
          <span className="slider"></span>
        </label>

        <div className="container-btn">
          <button id="btnRegistr" className="registr">
            Sign Up
          </button>
          <button id="btnLogout" className="logout hidden">
            Log Out
          </button>
        </div>
      </div>
    </header>
    
  );
}

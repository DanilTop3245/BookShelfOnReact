import "../assets/css/style.css";
import logo from "../assets/img/icons.png";
import { NavLink } from "react-router-dom";

export default function Header({
  isDark,
  toggleTheme,
  openAuthModal,
  user,
  onLogout,
}) {
  return (
    <header className={isDark ? "dark" : "light"} id="main-header">
      <div className="logo">
        <a href="/">
          <img src={logo} alt="logo" className="ico" />
        </a>
        <h4>Bookshelf</h4>
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `home-link hl ${isActive ? "active" : ""}`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/favorites"
          className={({ isActive }) =>
            `cart-link cl ${isActive ? "active" : ""}`
          }
        >
          Favorites
        </NavLink>
      </div>

      <div className="container-register-theme">
        <label className="switch">
          <input type="checkbox" checked={isDark} onChange={toggleTheme} />
          <span className="slider"></span>
        </label>

        <div className="container-btn">
          {!user ? (
            <button
              id="btnRegistr"
              className="registr"
              onClick={() => openAuthModal && openAuthModal("signup")}
            >
              Sign Up
            </button>
          ) : (
            <>
              <span style={{ marginRight: 12 }}>Hi, {user.email}</span>
              <button
                id="btnLogout"
                className="registr"
                onClick={() => onLogout && onLogout()}
              >
                Log Out
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

import "../assets/css/style.css";
import logo from "../assets/img/icons.png";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Header({
  isDark,
  toggleTheme,
  openAuthModal,
  user,
  onLogout,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // derive display name from profile or email prefix
  const displayName = user
    ? user.displayName || (user.email ? user.email.split("@")[0] : "User")
    : "";

  // disable body scroll when mobile menu open (use modalLock)
  useEffect(() => {
    if (mobileOpen) import("../utils/modalLock").then(({ lock }) => lock());
    else import("../utils/modalLock").then(({ unlock }) => unlock());
    return () => {
      import("../utils/modalLock").then(({ unlock }) => unlock());
    };
  }, [mobileOpen]);

  // close dropdown when clicking outside
  useEffect(() => {
    const onDoc = (e) => {
      if (!e.target.closest || !e.target.closest(".header-user")) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, [dropdownOpen]);
  return (
    <header className={isDark ? "dark" : "light"} id="main-header">
      <button
        className="mobile-burger"
        aria-label="Menu"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        ☰
      </button>
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
        {user && (
          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              `cart-link cl ${isActive ? "active" : ""}`
            }
          >
            Favorites
          </NavLink>
        )}
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
              <div className="header-user" tabIndex={0}>
                <span className="desktop-username">Hi, {displayName}</span>
                <button
                  className={`user-arrow ${dropdownOpen ? "open" : ""}`}
                  aria-label="User menu"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  ▾
                </button>
                {dropdownOpen && (
                  <div className={`user-dropdown ${isDark ? "dark" : "light"}`}>
                    <div className="user-dropdown-name">{displayName}</div>
                    <button
                      className="modal-book-btn"
                      onClick={() => {
                        setDropdownOpen(false);
                        onLogout && onLogout();
                      }}
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {mobileOpen && (
        <div className={`mobile-nav-wrapper ${isDark ? "dark" : "light"}`}>
          <div
            className="mobile-nav-overlay"
            onClick={() => setMobileOpen(false)}
          />
          <div className="mobile-nav">
            <NavLink to="/" onClick={() => setMobileOpen(false)}>
              Home
            </NavLink>
            {user && (
              <NavLink to="/favorites" onClick={() => setMobileOpen(false)}>
                Favorites
              </NavLink>
            )}
            <div className="mobile-auth-actions">
              {!user ? (
                <button
                  className="modal-book-btn"
                  onClick={() => {
                    setMobileOpen(false);
                    openAuthModal && openAuthModal("signup");
                  }}
                  style={{ position: "absolute", bottom: "100px" }}
                >
                  Sign Up / Log In
                </button>
              ) : (
                <div className="mobile-logged-in">
                  <div className="mobile-user-name">{displayName}</div>
                  <button
                    className="modal-book-btn"
                    onClick={() => {
                      setMobileOpen(false);
                      onLogout && onLogout();
                    }}
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

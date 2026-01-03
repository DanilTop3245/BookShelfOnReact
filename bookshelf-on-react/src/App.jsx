import { useState, useEffect } from "react";
import Header from "./components/Header";
import ScrollUpButton from "./components/ScrollUpButton";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ShoppingCart from "./pages/shoppingCart";
import "./assets/css/style.css";
import "./assets/css/form.css";
import "./assets/css/btnLO.css";
import { auth } from "./firebase";
import {
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

export default function App() {
  const [isDark, setIsDark] = useState(() =>
    localStorage.getItem("theme") === "dark" ? true : false
  );

  const toggleTheme = () => setIsDark((p) => !p);

  // auth state
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  // auth modal showing via basicLightbox (to match non-React project exactly)
  const openAuthModal = (mode = "login") => {
    if (!window || !window.basicLightbox) {
      console.warn("basicLightbox not loaded");
      return;
    }

    const html = `
      <div class="modal-main ${isDark ? "dark" : "light"}">
        <div class="container-cross"><button class="close-btn-2" id="modalClose">✖</button></div>
        <h3 class="form-reg-heading">${
          mode === "signup" ? "Sign Up" : "Log In"
        }</h3>
        <form id="auth-form" class="form-reg ${isDark ? "dark" : "light"}">
          ${
            mode === "signup"
              ? '<input id="auth-name" placeholder="Name" required />'
              : ""
          }
          <input id="auth-email" placeholder="Email" required />
          <input id="auth-password" placeholder="Password" type="password" required />
          <div id="auth-error" style="color:red"></div>
          <p style="margin-top:8px;">${
            mode === "signup"
              ? 'Already have an account? <a href="#" id="switch-to-login">Sign In</a>'
              : 'Don\'t have an account? <a href="#" id="switch-to-signup">Sign Up</a>'
          }</p>
          <div style="display:flex;gap:8px;">
            <button type="submit" class="modal-book-btn">${
              mode === "signup" ? "Create account" : "Log in"
            }</button>
            <button type="button" class="modal-book-btn" id="auth-cancel">Cancel</button>
          </div>
        </form>
        
      </div>
    `;

    // remove any previously left basicLightbox instances/placeholders to avoid duplicate containers
    document.querySelectorAll(".basicLightbox").forEach((el) => el.remove());

    const instance = window.basicLightbox.create(html, {
      onShow: (inst) => {
        // lock body scroll
        document.body.style.overflow = "hidden";

        const root = inst.element();
        const closeBtn = root.querySelector(".close-btn-2");
        const cancelBtn = root.querySelector("#auth-cancel");
        const form = root.querySelector("#auth-form");
        const err = root.querySelector("#auth-error");

        const cleanup = () => {
          closeBtn && closeBtn.removeEventListener("click", closeHandler);
          cancelBtn && cancelBtn.removeEventListener("click", closeHandler);
          form && form.removeEventListener("submit", submitHandler);
        };

        const closeHandler = () => {
          cleanup();
          inst.close();
        };

        const submitHandler = async (e) => {
          e.preventDefault();
          err.textContent = "";
          const email = root.querySelector("#auth-email").value;
          const password = root.querySelector("#auth-password").value;
          try {
            if (mode === "signup") {
              const userCred = await createUserWithEmailAndPassword(
                auth,
                email,
                password
              );
              const name = root.querySelector("#auth-name")
                ? root.querySelector("#auth-name").value.trim()
                : "";
              if (name && userCred && userCred.user) {
                await updateProfile(userCred.user, { displayName: name });
              }
            } else {
              await signInWithEmailAndPassword(auth, email, password);
            }
            cleanup();
            inst.close();
          } catch (error) {
            err.textContent = error.message || "Auth error";
          }
        };

        closeBtn && closeBtn.addEventListener("click", closeHandler);
        cancelBtn && cancelBtn.addEventListener("click", closeHandler);
        form && form.addEventListener("submit", submitHandler);

        // toggle between modes
        const switchToSignup = root.querySelector("#switch-to-signup");
        const switchToLogin = root.querySelector("#switch-to-login");
        if (switchToSignup)
          switchToSignup.addEventListener("click", (e) => {
            e.preventDefault();
            cleanup();
            inst.close();
            openAuthModal("signup");
          });
        if (switchToLogin)
          switchToLogin.addEventListener("click", (e) => {
            e.preventDefault();
            cleanup();
            inst.close();
            openAuthModal("login");
          });
      },
      onClose: () => {
        document.body.style.overflow = "";
      },
    });

    instance.show();
  };

  // apply theme to document.body and persist
  useEffect(() => {
    document.body.classList.toggle("dark", isDark);
    document.body.classList.toggle("light", !isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <div className={isDark ? "dark" : "light"}>
      <Header
        isDark={isDark}
        toggleTheme={toggleTheme}
        openAuthModal={openAuthModal}
        user={user}
        onLogout={handleLogout}
      />
      <Routes>
        <Route path="/" element={<Home isDark={isDark} />} />
        <Route path="/favorites" element={<ShoppingCart />} />
      </Routes>
      <ScrollUpButton />
    </div>
  );
}

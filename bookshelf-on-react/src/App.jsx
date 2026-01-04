import { useState, useEffect } from "react";
import Header from "./components/Header";
import ScrollUpButton from "./components/ScrollUpButton";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
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
  const [authReady, setAuthReady] = useState(false);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  // Debug instrumentation: trace unexpected modal removals and clicks
  useEffect(() => {
    const origRemove = Element.prototype.remove;
    const origRemoveChild = Node.prototype.removeChild;

    Element.prototype.remove = function () {
      try {
        if (
          this &&
          this.classList &&
          (this.classList.contains("custom-prompt-overlay") ||
            this.classList.contains("custom-auth-overlay") ||
            this.classList.contains("custom-book-overlay") ||
            this.classList.contains("basicLightbox"))
        ) {
          console.warn(
            "DEBUG: Element.remove() called on modal overlay:",
            this
          );
          console.warn(new Error().stack);
        }
      } catch (e) {}
      return origRemove.apply(this, arguments);
    };

    Node.prototype.removeChild = function (child) {
      try {
        if (
          child &&
          child.classList &&
          (child.classList.contains("custom-prompt-overlay") ||
            child.classList.contains("custom-auth-overlay") ||
            child.classList.contains("custom-book-overlay") ||
            child.classList.contains("basicLightbox"))
        ) {
          console.warn("DEBUG: removeChild called for modal overlay:", child);
          console.warn(new Error().stack);
        }
      } catch (e) {}
      return origRemoveChild.apply(this, arguments);
    };

    const clickLogger = (e) => {
      try {
        const t = e.target;
        // log clicks on likely modal triggers
        if (
          t &&
          ((t.classList &&
            (t.classList.contains("heart-icon") ||
              t.classList.contains("favorite-btn"))) ||
            (t.closest &&
              (t.closest(".book-card") || t.closest(".favorite-btn"))))
        ) {
          console.info("DEBUG: click on", t, "at", Date.now());
          console.trace();
        }
      } catch (ex) {}
    };

    document.addEventListener("click", clickLogger, true);

    const onErr = (err) => {
      console.error("DEBUG: window error", err);
    };
    window.addEventListener("error", onErr);

    return () => {
      Element.prototype.remove = origRemove;
      Node.prototype.removeChild = origRemoveChild;
      document.removeEventListener("click", clickLogger, true);
      window.removeEventListener("error", onErr);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  // auth modal showing via basicLightbox (to match non-React project exactly)
  // fallback auth overlay using DOM (used when basicLightbox is blocked)
  const customAuthOverlay = (mode = "login") => {
    // remove any existing overlays
    document
      .querySelectorAll(".custom-auth-overlay")
      .forEach((el) => el.remove());

    const overlay = document.createElement("div");
    overlay.className = "custom-auth-overlay";
    overlay.innerHTML = `
      <div class="custom-modal-box ${isDark ? "dark" : "light"}">
        <div class="container-cross"><button class="custom-close" id="authClose">✖</button></div>
        <div class="auth-modal-content">
          <h3 class="form-reg-heading">${
            mode === "signup" ? "Sign Up" : "Log In"
          }</h3>
          <form id="custom-auth-form" class="form-reg ${
            isDark ? "dark" : "light"
          }">
            ${
              mode === "signup"
                ? '<input id="auth-name" placeholder="Name" required />'
                : ""
            }
            <input id="auth-email" placeholder="Email" required />
            <input id="auth-password" placeholder="Password" type="password" required />
            <div id="auth-error" class="auth-error"></div>
            <div class="auth-actions">
              <button type="submit" class="modal-book-btn">${
                mode === "signup" ? "Create account" : "Log in"
              }</button>
              <button type="button" class="modal-book-btn" id="auth-cancel">Cancel</button>
            </div>
          </form>
          <p class="auth-switch">${
            mode === "signup"
              ? 'Already have an account? <button id="switch-to-login" class="link-button">Log in</button>'
              : 'No account? <button id="switch-to-signup" class="link-button">Sign up</button>'
          }</p>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    console.info("DEBUG: created custom-auth-overlay", { mode, isDark });

    // animate & focus the modal box to ensure it appears and receives focus
    const box = overlay.querySelector(".custom-modal-box");
    requestAnimationFrame(() => {
      box && box.classList.add("show");
      const focusable =
        box && box.querySelector("input, button, [tabindex], a");
      focusable && focusable.focus();
    });

    // swallow immediate clicks that could close the overlay right after opening
    const swallow = (e) => {
      e.stopPropagation();
      e.preventDefault();
    };
    document.addEventListener("click", swallow, true);
    setTimeout(() => document.removeEventListener("click", swallow, true), 220);

    // prevent background scroll using modalLock
    import("./utils/modalLock").then(({ lock }) => lock());

    const close = () => {
      const box = overlay.querySelector(".custom-modal-box");
      if (box) {
        box.classList.remove("show");
        setTimeout(() => {
          overlay.remove();
          import("./utils/modalLock").then(({ unlock }) => unlock());
        }, 180);
      } else {
        overlay.remove();
        import("./utils/modalLock").then(({ unlock }) => unlock());
      }
    };

    // ignore overlay background clicks that might close the overlay
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) e.stopPropagation();
    });
    // prevent touch scrolling on the overlay backdrop to avoid background scroll on mobile
    overlay.addEventListener(
      "touchmove",
      (e) => {
        if (e.target === overlay) e.preventDefault();
      },
      { passive: false }
    );

    const closeBtn = overlay.querySelector("#authClose");
    const cancelBtn = overlay.querySelector("#auth-cancel");
    const form = overlay.querySelector("#custom-auth-form");
    const err = overlay.querySelector("#auth-error");

    const submitHandler = async (e) => {
      e.preventDefault();
      err.textContent = "";
      const email = overlay.querySelector("#auth-email").value;
      const password = overlay.querySelector("#auth-password").value;
      try {
        if (mode === "signup") {
          const userCred = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          const name = overlay.querySelector("#auth-name")
            ? overlay.querySelector("#auth-name").value.trim()
            : "";
          if (name && userCred && userCred.user) {
            await updateProfile(userCred.user, { displayName: name });
          }
        } else {
          await signInWithEmailAndPassword(auth, email, password);
        }
        close();
      } catch (error) {
        err.textContent = error.message || "Auth error";
      }
    };

    closeBtn && closeBtn.addEventListener("click", close);
    cancelBtn && cancelBtn.addEventListener("click", close);
    form && form.addEventListener("submit", submitHandler);

    const switchToSignup = overlay.querySelector("#switch-to-signup");
    const switchToLogin = overlay.querySelector("#switch-to-login");
    if (switchToSignup)
      switchToSignup.addEventListener("click", () => {
        close();
        customAuthOverlay("signup");
      });
    if (switchToLogin)
      switchToLogin.addEventListener("click", () => {
        close();
        customAuthOverlay("login");
      });
  };

  const openAuthModal = (mode = "login") => {
    // Use local overlay to avoid basicLightbox instability under Tracking Prevention
    customAuthOverlay(mode);
    return;
  };

  // lightweight prompt modal (used when unauthenticated user clicks the heart)
  // Implemented without basicLightbox to avoid overlay race conditions
  const openAuthPrompt = (message) => {
    const txt = message || "Please sign in to add this book to your favorites.";

    // remove previous custom prompts
    document
      .querySelectorAll(".custom-prompt-overlay")
      .forEach((el) => el.remove());

    // remove leftover basicLightbox containers as a precaution
    document.querySelectorAll(".basicLightbox").forEach((el) => el.remove());

    const overlay = document.createElement("div");
    overlay.className = "custom-prompt-overlay";
    overlay.innerHTML = `
      <div class="custom-modal-box ${isDark ? "dark" : "light"}">
        <div class="container-cross"><button class="custom-close" id="promptClose">✖</button></div>
        <div class="prompt-content">
          <h3 class="prompt-title">Sign in required</h3>
          <p class="prompt-text">${txt}</p>
          <div class="prompt-actions">
            <button class="modal-book-btn" id="promptLogin">Sign in</button>
            <button class="modal-book-btn" id="promptOk">OK</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    // animate & focus modal box to ensure it is visible and interactive
    const box = overlay.querySelector(".custom-modal-box");
    requestAnimationFrame(() => {
      box && box.classList.add("show");
      const focusable = box && box.querySelector("button, a, input");
      focusable && focusable.focus();
    });

    // prevent background scroll using modalLock
    import("./utils/modalLock").then(({ lock }) => lock());

    const close = () => {
      const box = overlay.querySelector(".custom-modal-box");
      if (box) {
        box.classList.remove("show");
        setTimeout(() => {
          overlay.remove();
          import("./utils/modalLock").then(({ unlock }) => unlock());
        }, 180);
      } else {
        overlay.remove();
        import("./utils/modalLock").then(({ unlock }) => unlock());
      }
    };

    const closeBtn = overlay.querySelector("#promptClose");
    const okBtn = overlay.querySelector("#promptOk");
    const loginBtn = overlay.querySelector("#promptLogin");
    closeBtn && closeBtn.addEventListener("click", close);
    okBtn && okBtn.addEventListener("click", close);
    loginBtn &&
      loginBtn.addEventListener("click", () => {
        close();
        openAuthModal && openAuthModal("login");
      });

    // prevent overlay click from closing — ignore background clicks
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        e.stopPropagation();
      }
    });

    // prevent touch scrolling on the backdrop to avoid background scroll on mobile
    overlay.addEventListener(
      "touchmove",
      (e) => {
        if (e.target === overlay) e.preventDefault();
      },
      { passive: false }
    );

    // temporarily swallow click events that may close newly opened overlays (fixes immediate close on some browsers)
    const swallow = (e) => {
      e.stopPropagation();
      e.preventDefault();
    };
    document.addEventListener("click", swallow, true);
    setTimeout(() => document.removeEventListener("click", swallow, true), 220);
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
        <Route
          path="/"
          element={
            <Home
              isDark={isDark}
              user={user}
              openAuthModal={openAuthModal}
              openAuthPrompt={openAuthPrompt}
            />
          }
        />
        <Route
          path="/favorites"
          element={
            <Favorites
              user={user}
              isDark={isDark}
              openAuthModal={openAuthModal}
              authReady={authReady}
            />
          }
        />
      </Routes>
      <ScrollUpButton />
    </div>
  );
}

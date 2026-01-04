import React, { useEffect, useState } from "react";
import "../assets/css/style.css";
import "../assets/css/favorite.css";
import Sidebar from "../components/Sidebar";
import { ReactComponent as HeartIcon } from "../assets/img/heart.svg";

export default function Favorites({ user, openAuthModal, authReady, isDark }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("favorites") || "[]");
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    const onStorage = () => {
      try {
        setFavorites(JSON.parse(localStorage.getItem("favorites") || "[]"));
      } catch (e) {
        setFavorites([]);
      }
    };
    const onFavoritesChanged = (e) => onStorage();
    window.addEventListener("storage", onStorage);
    window.addEventListener("favoritesChanged", onFavoritesChanged);

    // guard: if auth state finished checking and no user, open auth modal and redirect to home
    if (authReady && !user) {
      openAuthModal && openAuthModal("login");
      try {
        // navigate to home using location (Favorites is protected)
        window.history.pushState({}, "", "/");
        // optionally trigger a popstate to let router know
        window.dispatchEvent(new PopStateEvent("popstate"));
      } catch (e) {
        // ignore
      }
    }

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("favoritesChanged", onFavoritesChanged);
    };
  }, [user, openAuthModal, authReady]);

  const removeFav = (id) => {
    // remove only this user's favorite entry for the book
    const next = favorites.filter(
      (f) => !(f._id === id && user && f._favUser === user.uid)
    );
    setFavorites(next);
    localStorage.setItem("favorites", JSON.stringify(next));
    window.dispatchEvent(new Event("favoritesChanged"));
  };

  // only show favorites for current user
  const userFavorites = favorites.filter((f) =>
    user ? f._favUser === user.uid : false
  );

  // group by _favCategory
  const grouped = userFavorites.reduce((acc, b) => {
    const key = b._favCategory || "Uncategorized";
    if (!acc[key]) acc[key] = [];
    acc[key].push(b);
    return acc;
  }, {});

  const categories = Object.keys(grouped);

  // selected category state controlled by local sidebar
  const [selectedCategory, setSelectedCategory] = useState(null);

  // show book detail modal (same layout as Home's customBookOverlay)
  const showBookLightbox = (book) => {
    document
      .querySelectorAll(".custom-book-overlay")
      .forEach((el) => el.remove());
    const overlay = document.createElement("div");
    overlay.className = "custom-prompt-overlay custom-book-overlay";
    overlay.innerHTML = `
      <div class="custom-modal-box custom-book-modal ${
        isDark ? "dark" : "light"
      }">
        <div class="container-cross"><button class="custom-close" id="bookClose">✖</button></div>
        <div class="modal-content">
          <div class="book-thumb">
            <img class="book-thumb-img" src="${
              book.book_image || "./img/book.jpg"
            }" alt="${(book.title || "").replace(/"/g, "&quot;")}" />
          </div>
          <div class="book-details">
            <h3 class="book-title">${book.title}</h3>
            <span><i>${book.author || ""}</i></span>
            <p class="book-description">${book.description || ""}</p>
            <div class="buy-links">
              ${
                Array.isArray(book.buy_links)
                  ? book.buy_links
                      .map(
                        (link) =>
                          `<a href="${link.url}" target="_blank" rel="noreferrer"><button class="modal-book-btn">${link.name}</button></a>`
                      )
                      .join("")
                  : ""
              }
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    const box = overlay.querySelector(".custom-modal-box");
    requestAnimationFrame(() => {
      box && box.classList.add("show");
      const focusable = box && box.querySelector("button, a, input");
      focusable && focusable.focus();
    });

    import("../utils/modalLock").then(({ lock }) => lock());

    const close = () => {
      const box = overlay.querySelector(".custom-modal-box");
      if (box) {
        box.classList.remove("show");
        setTimeout(() => {
          overlay.remove();
          import("../utils/modalLock").then(({ unlock }) => unlock());
        }, 180);
      } else {
        overlay.remove();
        import("../utils/modalLock").then(({ unlock }) => unlock());
      }
    };
    const closeBtn = overlay.querySelector("#bookClose");
    closeBtn && closeBtn.addEventListener("click", close);

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) e.stopPropagation();
    });
    overlay.addEventListener(
      "touchmove",
      (e) => {
        if (e.target === overlay) e.preventDefault();
      },
      { passive: false }
    );

    const swallow = (e) => {
      e.stopPropagation();
      e.preventDefault();
    };
    document.addEventListener("click", swallow, true);
    setTimeout(() => document.removeEventListener("click", swallow, true), 220);
  };

  return (
    <div className="main-container">
      <div className="favorites-container">
        <h2>Favorites</h2>
        {userFavorites.length === 0 && (
          <p className="favorite-empty-msg">
            No favorites yet. Click the heart on a book to add it (you must be
            signed in).
          </p>
        )}

        {userFavorites.length > 0 && (
          <div className="favorites-layout">
            <div className="favorites-sidebar">
              <Sidebar
                isDark={isDark}
                categories={categories}
                onCategorySelect={(c) => setSelectedCategory(c)}
                selectedCategory={selectedCategory}
                showUkMenu={false}
              />
            </div>

            <div className="favorites-list">
              {categories.map((cat) => {
                if (selectedCategory && selectedCategory !== cat) return null;
                return (
                  <section key={cat} className="favorite-section">
                    <h4 className="category-title">{cat}</h4>
                    <div className="books-container">
                      {grouped[cat].map((book) => (
                        <div
                          key={book._id}
                          className="book-card js-product-item favorite-book-card"
                          onClick={() => showBookLightbox(book)}
                        >
                          <button
                            className="favorite-btn favorited favorite-remove-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFav(book._id);
                            }}
                            aria-label="Remove from favorites"
                          >
                            <HeartIcon className="heart-icon favorited" />
                          </button>
                          <img
                            src={
                              book.book_image
                                ? book.book_image
                                : "./img/book.jpg"
                            }
                            alt={book.title}
                            className="favorite-book-image"
                          />
                          <h4>{book.title}</h4>
                          <span>
                            <i>{book.author}</i>
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

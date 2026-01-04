import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import BookList from "../components/BookList";
import ScrollUpButton from "../components/ScrollUpButton";

export default function Home({ isDark, user, openAuthModal, openAuthPrompt }) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Scroll to top when category changes (covers SEE MORE and sidebar clicks)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedCategory]);

  const customBookOverlay = (book) => {
    // remove existing custom book overlays
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
    console.info("DEBUG: created custom-book-overlay for", book && book.title);
    // animate & focus the modal box to ensure it appears correctly
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

    // ignore overlay clicks and prevent touchmove on the backdrop (avoid background scroll)
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) e.stopPropagation();
    });
    // prevent touch scroll on backdrop specifically; use passive:false so preventDefault works
    overlay.addEventListener(
      "touchmove",
      (e) => {
        if (e.target === overlay) e.preventDefault();
      },
      { passive: false }
    );

    // temporarily swallow stray clicks that might close this overlay immediately
    const swallow = (e) => {
      e.stopPropagation();
      e.preventDefault();
    };
    document.addEventListener("click", swallow, true);
    setTimeout(() => document.removeEventListener("click", swallow, true), 220);
  };

  const showBookLightbox = (book) => {
    // Use the reliable local overlay to avoid intermittent basicLightbox removals
    customBookOverlay(book);
  };

  return (
    <div className="main-container">
      <Sidebar
        isDark={isDark}
        onCategorySelect={setSelectedCategory}
        selectedCategory={selectedCategory}
      />
      <BookList
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onOpenBook={showBookLightbox}
        user={user}
        openAuthPrompt={openAuthPrompt}
      />
      <ScrollUpButton />
    </div>
  );
}

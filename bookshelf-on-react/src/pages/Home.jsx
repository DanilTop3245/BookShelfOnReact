import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import BookList from "../components/BookList";
import ScrollUpButton from "../components/ScrollUpButton";

export default function Home({ isDark }) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Scroll to top when category changes (covers SEE MORE and sidebar clicks)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedCategory]);

  const showBookLightbox = (book) => {
    if (!window || !window.basicLightbox) {
      console.warn("basicLightbox not loaded");
      return;
    }

    const html = `
      <div class="modal-main ${isDark ? "dark" : "light"}">
        <div class="container-cross">
          <button class="close-btn-2" id="bookClose">✖</button>
        </div>
        <div class="cont-modal">
          <div class="img-in-modal">
            <img src="${book.book_image || "./img/book.jpg"}" alt="${(
      book.title || ""
    ).replace(/"/g, "&quot;")}" />
          </div>
          <div class="desc-in-modal">
            <h3>${book.title}</h3>
            <span><i>${book.author || ""}</i></span>
            <p style="margin-top:12px">${book.description || ""}</p>
            <div class="book-site-container">
              ${
                Array.isArray(book.buy_links)
                  ? book.buy_links
                      .map(
                        (link) =>
                          `<a key="${link.name}" href="${link.url}" target="_blank" rel="noreferrer"><button class="modal-book-btn">${link.name}</button></a>`
                      )
                      .join("")
                  : ""
              }
            </div>
          </div>
        </div>
      </div>
    `;

    const instance = window.basicLightbox.create(html, {
      onShow: (inst) => {
        document.body.style.overflow = "hidden";
        const root = inst.element();
        const closeBtn = root.querySelector("#bookClose");
        closeBtn && closeBtn.addEventListener("click", () => inst.close());
      },
      onClose: () => {
        document.body.style.overflow = "";
      },
    });

    instance.show();
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
      />
      <ScrollUpButton />
    </div>
  );
}

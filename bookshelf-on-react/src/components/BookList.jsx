import { useEffect, useState } from "react";
import "../assets/css/style.css";
import { ReactComponent as HeartIcon } from "../assets/img/heart.svg";

export default function BookList({
  selectedCategory,
  onSelectCategory,
  onOpenBook,
  user,
  openAuthPrompt,
}) {
  // categories: array of { list_name, books }
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (selectedCategory && selectedCategory !== "__TOP__") {
      // Fetch books for a single category and wrap into categories array
      fetch(
        `https://books-backend.p.goit.global/books/category?category=${encodeURIComponent(
          selectedCategory
        )}`
      )
        .then((res) => res.json())
        .then((data) => {
          setCategories([{ list_name: selectedCategory, books: data || [] }]);
        })
        .catch((err) => console.error(err));
    } else if (selectedCategory === "__TOP__") {
      // special: show full Top Books list (first item(s) with empty list_name)
      fetch("https://books-backend.p.goit.global/books/top-books")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            // find first item with empty list_name OR combine all top-book items
            const topEntry = data.find(
              (d) => (d.list_name || "").trim() === ""
            );
            if (topEntry) {
              setCategories([
                { list_name: "Top Books", books: topEntry.books || [] },
              ]);
            } else {
              // fallback: flatten everything
              const allBooks = data.flatMap((d) =>
                Array.isArray(d.books) ? d.books : []
              );
              setCategories([{ list_name: "Top Books", books: allBooks }]);
            }
          }
        })
        .catch((err) => console.error(err));
    } else {
      // Fetch top-books (array of categories) for the All categories view
      fetch("https://books-backend.p.goit.global/books/top-books")
        .then((res) => res.json())
        .then((data) => {
          // data is expected to be array of { list_name, books }
          if (Array.isArray(data)) {
            setCategories(data);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [selectedCategory]);

  // favorites management (persisted in localStorage)
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("favorites") || "[]");
    } catch (e) {
      return [];
    }
  });

  // only consider favorites that belong to the signed-in user for UI
  const userFavorites = user
    ? favorites.filter((f) => f._favUser === user.uid)
    : [];
  // map id -> favorite item for quick lookup
  const favoritesMap = userFavorites.reduce((acc, f) => {
    acc[f._id] = f;
    return acc;
  }, {});

  const persistFavorites = (next) => {
    setFavorites(next);
    localStorage.setItem("favorites", JSON.stringify(next));
    try {
      window.dispatchEvent(
        new CustomEvent("favoritesChanged", { detail: next })
      );
    } catch (e) {
      // ignore
    }
  };

  const toggleFavorite = (book, category, btnEl) => {
    // only allow adding/removing favorites when signed in
    if (!user) {
      // schedule the prompt after the current click event to avoid it being
      // closed by other click handlers that run during the same event loop
      openAuthPrompt &&
        setTimeout(
          () => openAuthPrompt("Please sign in to add this book to favorites."),
          60
        );
      return;
    }

    const exists = favoritesMap[book._id];
    let next;
    if (exists) {
      // remove only this user's favorite for this book
      next = favorites.filter(
        (f) => !(f._id === book._id && f._favUser === user.uid)
      );
    } else {
      const toStore = { ...book, _favCategory: category, _favUser: user.uid };
      next = [toStore, ...favorites];
    }
    persistFavorites(next);

    // button animation (if element provided)
    if (btnEl) {
      btnEl.classList.add("anim");
      setTimeout(() => btnEl.classList.remove("anim"), 300);
    }
  };

  // expose favorites via window for quick debugging (optional)
  useEffect(() => {
    window.__favorites = favorites;
  }, [favorites]);

  return (
    <div className="js-book-list book-list">
      {categories.map((cat, idx) => {
        // ensure stable, human-friendly title for empty names
        const rawName =
          typeof cat.list_name === "string" ? cat.list_name.trim() : "";
        const displayTitle = rawName.length ? rawName : "Top Books";
        const keyName = rawName.length ? rawName : `__top__${idx}`;

        const books = Array.isArray(cat.books) ? cat.books : [];

        // If we're in All categories (selectedCategory === null) show just 4 items + 'SEE MORE'
        const isAllView = selectedCategory === null;
        const booksToShow = isAllView ? books.slice(0, 5) : books;

        return (
          <section className="category-section" key={`${keyName}-${idx}`}>
            <h4 className="category-title">{displayTitle}</h4>

            <div className="books-container">
              {booksToShow.map((book) => {
                const isFav = favoritesMap.hasOwnProperty(book._id);
                return (
                  <div
                    className="book-card js-product-item listing-book-card"
                    data-id={book._id}
                    key={book._id}
                    onClick={() => onOpenBook && onOpenBook(book)}
                  >
                    <button
                      className={`favorite-btn ${isFav ? "favorited" : ""}`}
                      data-book-id={book._id}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(book, displayTitle, e.currentTarget);
                      }}
                      aria-pressed={isFav}
                      aria-label={
                        isFav ? "Remove from favorites" : "Add to favorites"
                      }
                    >
                      <HeartIcon
                        className={`heart-icon ${isFav ? "favorited" : ""}`}
                      />
                    </button>

                    <img
                      src={book.book_image ? book.book_image : "./img/book.jpg"}
                      alt={book.title}
                      width="190"
                    />
                    <h4>{book.title}</h4>
                    <span>
                      <i>{book.author}</i>
                    </span>
                  </div>
                );
              })}
            </div>

            {isAllView && books.length > 4 && (
              <div className="see-more-container">
                <button
                  className="see-more"
                  onClick={() =>
                    onSelectCategory(rawName.length ? rawName : "__TOP__")
                  }
                >
                  SEE MORE
                </button>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

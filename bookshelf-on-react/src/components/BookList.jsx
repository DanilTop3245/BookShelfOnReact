import { useEffect, useState } from "react";
import "../assets/css/style.css";

export default function BookList({
  selectedCategory,
  onSelectCategory,
  onOpenBook,
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
              {booksToShow.map((book) => (
                <div
                  className="book-card js-product-item"
                  data-id={book._id}
                  key={book._id}
                  onClick={() => onOpenBook && onOpenBook(book)}
                >
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
              ))}
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

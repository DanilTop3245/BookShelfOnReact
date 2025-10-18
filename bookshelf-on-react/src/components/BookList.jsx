import { useEffect, useState } from "react";
import "../assets/css/style.css";

export default function BookList({ selectedCategory }) {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch(
      selectedCategory
        ? `https://books-backend.p.goit.global/books/category?category=${selectedCategory}`
        : "https://books-backend.p.goit.global/books/top-books"
    )
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // top-books возвращает массив массивов
          const normalized =
            !selectedCategory && Array.isArray(data)
              ? data.flatMap((category) => category.books)
              : data;

          setBooks(normalized);
        }
      })
      .catch((err) => console.error(err));
  }, [selectedCategory]);

  return (
    <ul className="js-book-list book-list">
      {books.map(({ _id, book_image, title, author }) => (
        <div
          className="book-card js-product-item"
          data-id={_id}
          key={_id} // ✅ key обязателен в React
        >
          <img
            src={book_image ? book_image : "./img/book.jpg"}
            alt={title}
            width="190"
          />
          <h4>{title}</h4>
          <span>
            <i>{author}</i>
          </span>
        </div>
      ))}
    </ul>
  );
}

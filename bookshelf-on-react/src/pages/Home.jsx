import { useState } from "react";
import Sidebar from "../components/Sidebar";
import BookList from "../components/BookList";
import ScrollUpButton from "../components/ScrollUpButton";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="main-container">
      <Sidebar onCategorySelect={setSelectedCategory} />
      <BookList selectedCategory={selectedCategory} />
      <ScrollUpButton />
    </div>
  );
}

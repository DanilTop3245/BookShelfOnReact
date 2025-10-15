import Sidebar from "../components/Sidebar";
import ScrollUpButton from "../components/ScrollUpButton";

export default function Home() {
  return (
    <div className="main-container">
      <Sidebar />
      <ul className="js-book-list book-list"></ul>
      <ScrollUpButton />
    </div>
  );
}

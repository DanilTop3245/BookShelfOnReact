import { useEffect, useState } from "react";
import "../assets/css/style.css"; // или нужный тебе путь
import upArrow from "../assets/img/up-arrow.svg"; // или нужный тебе путь

export default function ScrollUpButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <a
      href="#"
      className={`btn-scroll-up ${visible ? "show" : ""}`}
      onClick={scrollToTop}
    >
      <div className="container-sroll-up">
        <img
          src={upArrow}
          className="scroll-up"
        />
      </div>
    </a>
  );
}

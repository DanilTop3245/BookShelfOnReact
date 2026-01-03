import "../assets/css/style.css";
import React, { useEffect, useState, useRef } from "react";
import STC from "../assets/img/saveTheChildren.png";
import Gerb from "../assets/img/Vector.svg";
import ProjectHope from "../assets/img/projectHope.png";
import MedicalCorps from "../assets/img/medicalCorps.png";
import Razom from "../assets/img/razom.png";
import Action from "../assets/img/action.png";
import Prytula from "../assets/img/prytula.png";
import Save from "../assets/img/save.png";
import WorldVision from "../assets/img/worldVision.png";
import United24 from "../assets/img/united24.png";
import arrowDown from "../assets/img/uk-menu-down-arrow.svg";
import arrowUp from "../assets/img/uk-menu-up-arrow.svg";

export default function Sidebar({
  onCategorySelect,
  selectedCategory,
  isDark,
}) {
  const [categories, setCategories] = useState(["All categories"]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const menuRef = useRef(null);

  const handleToggle = () => {
    setIsExpanded((prev) => {
      const nextState = !prev;

      // прокрутка после смены состояния
      setTimeout(() => {
        if (menuRef.current) {
          menuRef.current.scrollTop = nextState
            ? menuRef.current.scrollHeight
            : 0;
        }
      }, 0);

      return nextState;
    });
  };

  useEffect(() => {
    let canceled = false;
    setLoading(true);

    fetch("https://books-backend.p.goit.global/books/category-list")
      .then((res) => res.json())
      .then((data) => {
        if (canceled) return;
        if (Array.isArray(data)) {
          const names = data.map((d) => (d.list_name || "").trim());
          const unique = [...new Set(names)];
          // sort by display label (empty => "Top Books"), alphabetically
          const labeled = unique
            .map((raw) => ({ raw, label: raw === "" ? "Top Books" : raw }))
            .sort((a, b) =>
              a.label.localeCompare(b.label, undefined, { sensitivity: "base" })
            );
          setCategories(["All categories", ...labeled.map((i) => i.raw)]);
        } else {
          setCategories(["All categories"]);
        }
      })
      .catch(() => setCategories(["All categories"]))
      .finally(() => !canceled && setLoading(false));

    return () => {
      canceled = true;
    };
  }, []);

  return (
    <div className={`container-left-panel ${isDark ? "dark" : "light"}`}>
      <div className="container-left-panel-chapter" ref={menuRef}>
        {loading ? (
          <p style={{ paddingLeft: 20 }}>Loading...</p>
        ) : (
          categories.map((cat, idx) => {
            const raw = typeof cat === "string" ? cat : String(cat || "");
            const isTop = raw === "";
            const label = isTop ? "Top Books" : raw;

            const isActive =
              (raw === "All categories" && selectedCategory === null) ||
              (isTop && selectedCategory === "__TOP__") ||
              (selectedCategory && selectedCategory === raw);

            const themeClass = isDark ? "dark" : "light";

            return (
              <a
                key={idx}
                href="#"
                className={`chapters chapt ${themeClass} ${
                  isActive ? "active" : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  if (raw === "All categories") onCategorySelect(null);
                  else if (isTop) onCategorySelect("__TOP__");
                  else onCategorySelect(raw);
                }}
              >
                {label}
              </a>
            );
          })
        )}
      </div>

      <div className={`uk-menu ${isExpanded ? "expanded" : ""}`} ref={menuRef}>
        <div className="cont-supp">
          <h2 className="supp-title">Support Ukraine</h2>
          <img src={Gerb} alt="gerb" className="vc-gerb" />
        </div>

        <div className="save-children">
          <p>
            01{" "}
            <a
              href="https://www.savethechildren.net/what-we-do/emergencies/war-ukraine"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={STC} alt="" />
            </a>
          </p>
        </div>

        <div className="hope">
          <p>
            02{" "}
            <a
              href="https://www.projecthope.org/region/europe/ukraine/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={ProjectHope} alt="" />
            </a>
          </p>
        </div>

        <div className="m-corps">
          <p>
            03{" "}
            <a
              href="https://internationalmedicalcorps.org/country/ukraine/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={MedicalCorps} alt="" />
            </a>
          </p>
        </div>

        <div className="razom">
          <p>
            04{" "}
            <a
              href="https://www.razomforukraine.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={Razom} alt="" />
            </a>
          </p>
        </div>

        <div className="action">
          <p>
            05{" "}
            <a
              href="https://www.msf.org/ukraine"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={Action} alt="" />
            </a>
          </p>
        </div>

        <div className="prytula">
          <p>
            06{" "}
            <a
              href="https://prytulafoundation.org/en"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={Prytula} alt="" />
            </a>
          </p>
        </div>

        {/* скрытые пункты */}
        <div className="hidden-items">
          <div className="sans">
            <p>
              07{" "}
              <a
                href="https://www.actionagainsthunger.org/location/europe/ukraine/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={Save} alt="" />
              </a>
            </p>
          </div>

          <div className="world-vision">
            <p>
              08{" "}
              <a
                href="https://www.wvi.org/emergencies/ukraine"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={WorldVision} alt="" />
              </a>
            </p>
          </div>

          <div className="united24">
            <p>
              09{" "}
              <a
                href="https://u24.gov.ua/uk"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={United24} alt="" />
              </a>
            </p>
          </div>
        </div>

        <div className="cont-show-more-btn">
          <button
            onClick={handleToggle}
            id="show-more-btn"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "Hide more" : "Show more"}
          >
            <img
              src={isExpanded ? arrowUp : arrowDown}
              alt=""
              className="img-btn"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

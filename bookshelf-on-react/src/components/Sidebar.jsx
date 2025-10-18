import "../assets/css/style.css";
import React from "react";
import STC from "../assets/img/saveTheChildren.png";
import Gerb from "../assets/img/Vector.svg"
import ProjectHope from "../assets/img/projectHope.png";
import MedicalCorps from "../assets/img/medicalCorps.png";
import Razom from "../assets/img/razom.png";
import Action from "../assets/img/action.png";
import Prytula from "../assets/img/prytula.png";
import Save from "../assets/img/save.png";
import WorldVision from "../assets/img/worldVision.png";
import United24 from "../assets/img/united24.png";
import menuArrow from "../assets/img/uk-menu-down-arrow.svg";


export default function Sidebar({ onCategorySelect }) {
  const categories = [
    "All categories",
    "Advice How-To and Miscellaneous",
    "Audio Fiction",
    "Audio Nonfiction",
    "Business Books",
    "Children's Middle Grade Hardcover",
    "Combined Print and E-Book Fiction",
    "Combined Print and E-Book Nonfiction",
    "Graphic Books and Manga",
    "Hardcover Fiction",
    "Hardcover Nonfiction",
    "Mass Market Monthly",
    "Middle Grade Paperback Monthly",
    "Paperback Nonfiction",
    "Picture Books",
    "Series Books",
    "Trade Fiction Paperback",
    "Young Adult Hardcover",
    "Young Adult Paperback Monthly"
  ];

  return (
    <div className="container-left-panel">
      <div className="container-left-panel-chapter">
        {categories.map((cat, idx) => (
          <a
            key={idx}
            href="#"
            className="chapters chapt light"
            onClick={(e) => {
              e.preventDefault();
              onCategorySelect(cat === "All categories" ? null : cat);
            }}
          >
            {cat}
          </a>
        ))}
      </div>

      <div className="uk-menu">
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
            <a href="https://www.msf.org/ukraine" target="_blank" rel="noopener noreferrer">
              <img src={Action} alt="" />
            </a>
          </p>
        </div>

        <div className="prytula">
          <p>
            06{" "}
            <a href="https://prytulafoundation.org/en" target="_blank" rel="noopener noreferrer">
              <img src={Prytula} alt="" />
            </a>
          </p>
        </div>

        {/* скрытые пункты */}
        <div className="hidden-items">
          <div className="cont-supp">
            <h2 className="supp-title">Support Ukraine</h2>
            <img src="./img/Vector.svg" alt="gerb" className="vc-gerb" />
          </div>

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
              <a href="https://u24.gov.ua/uk" target="_blank" rel="noopener noreferrer">
                <img src={United24} alt="" />
              </a>
            </p>
          </div>
        </div>

        <div className="cont-show-more-btn">
          <button id="show-more-btn">
            <img src={menuArrow} alt="" className="img-btn" />
          </button>
        </div>
      </div>
    </div>
  );
}

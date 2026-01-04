let count = 0;
let _saved = {
  overflow: "",
  position: "",
  top: "",
  width: "",
  scrollY: 0,
};

export function lock() {
  count += 1;
  if (count === 1) {
    try {
      // save previous inline styles
      _saved.overflow = document.body.style.overflow || "";
      _saved.position = document.body.style.position || "";
      _saved.top = document.body.style.top || "";
      _saved.width = document.body.style.width || "";
      _saved.scrollY = window.scrollY || window.pageYOffset || 0;

      // apply fixed-position lock to prevent background touch scrolling (mobile-safe)
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${_saved.scrollY}px`;
      document.body.style.width = "100%";
    } catch (e) {
      // defensive: ignore in non-DOM environments
      console.warn("modalLock: could not lock scroll", e);
    }
  }
}

export function unlock() {
  if (count <= 0) {
    count = 0;
    return;
  }
  count -= 1;
  if (count === 0) {
    try {
      // restore previous inline styles and scroll position
      document.body.style.overflow = _saved.overflow || "";
      document.body.style.position = _saved.position || "";
      document.body.style.top = _saved.top || "";
      document.body.style.width = _saved.width || "";
      const y = _saved.scrollY || 0;
      window.scrollTo(0, y);

      _saved = { overflow: "", position: "", top: "", width: "", scrollY: 0 };
    } catch (e) {
      console.warn("modalLock: could not restore scroll", e);
    }
  }
}

export function reset() {
  count = 0;
  try {
    document.body.style.overflow = _saved.overflow || "";
    document.body.style.position = _saved.position || "";
    document.body.style.top = _saved.top || "";
    document.body.style.width = _saved.width || "";
    const y = _saved.scrollY || 0;
    window.scrollTo(0, y);
    _saved = { overflow: "", position: "", top: "", width: "", scrollY: 0 };
  } catch (e) {
    // ignore
  }
}

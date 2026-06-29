const cursor = document.querySelector(".cursor");
const loader = document.querySelector("[data-loader]");
const nav = document.querySelector("[data-nav]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const interactiveSelector = "a, button, .poster-card, .org-tile, .system-row, .timeline article, .credential-grid a";
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

function hideLoader() {
  loader?.classList.add("is-hidden");
}

if (loader) {
  window.addEventListener("load", () => {
    window.setTimeout(hideLoader, prefersReducedMotion ? 250 : 1450);
  });

  loader.addEventListener("click", hideLoader);

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" || event.key === "Enter" || event.key === " ") {
      hideLoader();
    }
  });
}

if (finePointer && cursor) {
  window.addEventListener("pointermove", (event) => {
    document.body.classList.add("cursor-ready");
    document.documentElement.style.setProperty("--cursor-x", `${event.clientX}px`);
    document.documentElement.style.setProperty("--cursor-y", `${event.clientY}px`);
    const target = event.target instanceof Element ? event.target : null;
    document.body.classList.toggle("cursor-hover", Boolean(target?.closest(interactiveSelector)));
  });

  window.addEventListener("pointerleave", () => {
    document.body.classList.remove("cursor-ready", "cursor-hover");
  });
}

menuToggle?.addEventListener("click", () => {
  nav?.classList.toggle("is-open");
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const id = link.getAttribute("href");
    const target = id ? document.querySelector(id) : null;
    if (!target) return;

    event.preventDefault();
    nav?.classList.remove("is-open");
    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  });
});

const revealItems = [
  ...document.querySelectorAll(
    ".poster-card, .letter-grid article, .org-tile, .system-row, .timeline article, .credential-grid article, .credential-grid a, .contact-links a"
  ),
];

revealItems.forEach((item) => item.classList.add("reveal"));

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

"use strict";
const settings = window.artistContent || {};
const toggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("nav");
toggle.hidden = false;
navigation.classList.add("collapsed");
toggle.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") !== "true";
  toggle.setAttribute("aria-expanded", String(open));
  navigation.classList.toggle("collapsed", !open);
});
navigation.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  navigation.classList.add("collapsed");
  toggle.setAttribute("aria-expanded", "false");
}));
document.querySelector("#year").textContent = new Date().getFullYear();
if (settings.hero?.src) {
  const frame = document.querySelector("#hero-image");
  const photo = new Image();
  photo.alt = settings.hero.alt || "Hasse Kangas";
  photo.style.objectPosition = settings.hero.position || "center";
  photo.addEventListener("load", () => {
    frame.querySelector(".placeholder-inner")?.remove();
    frame.querySelector("img")?.remove();
    frame.classList.remove("placeholder");
    frame.prepend(photo);
  }, { once: true });
  photo.src = settings.hero.src;
}
if (settings.teaser?.src) {
  const player = document.createElement("audio");
  player.controls = true;
  player.preload = "none";
  player.setAttribute("aria-label", "In Late July — audio teaser");
  const source = document.createElement("source");
  source.src = settings.teaser.src;
  source.type = settings.teaser.type || "audio/mpeg";
  player.append(source);
  const label = document.createElement("p");
  label.textContent = "In Late July — a first listen";
  label.className = "small";
  const fallback = document.createElement("a");
  fallback.href = settings.teaser.src;
  fallback.textContent = "Open audio file ↗";
  fallback.className = "text-link";
  const status = document.createElement("p");
  status.className = "small muted";
  status.setAttribute("role", "status");
  player.addEventListener("error", () => { status.textContent = "The teaser is unavailable. Please try again later."; }, true);
  document.querySelector("#teaser").replaceChildren(label, player, fallback, status);
}
(settings.gallery || []).forEach(item => {
  if (!item.src) return;
  const figure = document.createElement("figure");
  const link = document.createElement("a");
  link.href = item.src; link.target = "_blank"; link.rel = "noopener";
  const photo = document.createElement("img");
  photo.src = item.src; photo.alt = item.alt || ""; photo.loading = "lazy";
  const caption = document.createElement("figcaption");
  caption.textContent = item.caption || "Hasse Kangas";
  link.append(photo); figure.append(link, caption);
  document.querySelector("#gallery-grid").append(figure);
  document.querySelector("#gallery-grid").classList.add("multiple");
});
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navigation.querySelectorAll("a").forEach(link => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-15% 0px -60% 0px", threshold: 0 });
  document.querySelectorAll("main section[id]").forEach(section => observer.observe(section));
}

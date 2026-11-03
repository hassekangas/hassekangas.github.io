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
const teaserPlayers = [];
function addTeaser(config, title, buttonText, id) {
  const card = document.createElement("div");
  card.className = "teaser-card";
  const player = document.createElement("audio");
  player.id = id;
  player.controls = true;
  player.preload = "none";
  player.setAttribute("aria-label", `In Late July — ${title}`);
  const source = document.createElement("source");
  source.src = config.src;
  source.type = config.type || "audio/mpeg";
  player.append(source);
  const label = document.createElement("p");
  label.textContent = title;
  label.className = "small";
  const fallback = document.createElement("a");
  fallback.href = config.src;
  fallback.textContent = "Open audio file ↗";
  fallback.className = "text-link";
  const status = document.createElement("p");
  status.className = "small muted";
  status.setAttribute("role", "status");
  const button = document.createElement("button");
  button.type = "button";
  button.className = "text-link teaser-button";
  button.textContent = buttonText;
  button.setAttribute("aria-controls", id);
  function start() {
    teaserPlayers.forEach(other => { if (other !== player) other.pause(); });
    const attempt = player.play();
    if (attempt) attempt.catch(() => { status.textContent = "Press play below to listen, or open the audio file."; });
  }
  button.addEventListener("click", start);
  player.addEventListener("play", () => {
    status.textContent = "";
    teaserPlayers.forEach(other => { if (other !== player) other.pause(); });
  });
  player.addEventListener("error", () => { status.textContent = "The teaser is unavailable. Please try again later."; }, true);
  card.append(label, button, player, fallback, status);
  document.querySelector("#teaser").append(card);
  teaserPlayers.push(player);
  return start;
}
if (settings.teaser?.src) {
  document.querySelector("#teaser").replaceChildren();
  const startIntro = addTeaser(settings.teaser, "Intro · 31 seconds", "Listen — intro", "intro-player");
  document.querySelectorAll("[data-play-intro]").forEach(link => link.addEventListener("click", event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button > 0) return;
    startIntro();
  }));
  if (settings.secondTeaser?.src) {
    addTeaser(settings.secondTeaser, "Verse & chorus · 31 seconds", "Listen — verse & chorus", "verse-chorus-player");
  }
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

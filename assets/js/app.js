import { E as EmblaCarousel, R } from "./vendor.js";
const base = "";
const components = "";
const Social = "";
const Footer = "";
const Nav = "";
const Button = "";
const Search = "";
function script$6() {
  const el = document.querySelector(".search");
  if (!el)
    return;
  const inputEl = el.querySelector(".search__input");
  const closeEl = el.querySelector(".search__close");
  window.addEventListener("open-search", (e) => {
    el.classList.add("search_open");
    inputEl.focus();
  });
  closeEl.addEventListener("click", (e) => {
    el.classList.remove("search_open");
  });
}
{
  script$6();
}
const Hamburger = "";
function script$5() {
  const el = document.querySelector(".hamburger");
  if (!el)
    return;
  let active = false;
  el.addEventListener("click", (e) => {
    window.dispatchEvent(new CustomEvent("toggle-nav", {
      detail: !active
    }));
  });
  window.addEventListener("toggle-nav", (e) => {
    active = e.detail;
    el.classList.toggle("hamburger_active", e.detail);
  });
}
{
  script$5();
}
const Header = "";
const Drawer = "";
function script$4() {
  const el = document.querySelector(".drawer");
  if (!el)
    return;
  const linkEls = Array.from(el.querySelectorAll(".drawer__link"));
  window.addEventListener("toggle-nav", (e) => {
    el.classList.toggle("drawer_open", e.detail);
  });
  linkEls.forEach((linkEl) => {
    linkEl.addEventListener("click", (e) => {
      window.dispatchEvent(new CustomEvent("toggle-nav", {
        detail: false
      }));
    });
  });
}
{
  script$4();
}
function script$3() {
  const el = document.querySelector(".header");
  if (!el)
    return;
  const searchBtnEl = document.querySelector(".header__search-button");
  searchBtnEl.addEventListener("click", (e) => {
    window.dispatchEvent(new CustomEvent("open-search"));
  });
}
{
  script$3();
}
const About = "";
function script$2() {
  const el = document.querySelector(".about");
  if (!el)
    return;
  const sliderEl = el.querySelector(".about__slider");
  const prevEl = el.querySelector(".about__slider-prev");
  const nextEl = el.querySelector(".about__slider-next");
  const embla = EmblaCarousel(sliderEl, {
    loop: false,
    containScroll: "trimSnaps",
    align: "start",
    slidesToScroll: 1,
    speed: 20,
    skipSnaps: true
  });
  function update() {
    prevEl.disabled = !embla.canScrollPrev();
    nextEl.disabled = !embla.canScrollNext();
  }
  embla.on("select", update);
  embla.on("init", update);
  prevEl.addEventListener("click", (e) => embla.scrollPrev());
  nextEl.addEventListener("click", (e) => embla.scrollNext());
}
{
  script$2();
}
const Awards = "";
function script$1() {
  const el = document.querySelector(".awards");
  if (!el)
    return;
  const sliderEl = el.querySelector(".awards__slider");
  const prevEl = el.querySelector(".awards__slider-prev");
  const nextEl = el.querySelector(".awards__slider-next");
  const embla = EmblaCarousel(sliderEl, {
    loop: false,
    containScroll: "trimSnaps",
    align: "start",
    slidesToScroll: 1,
    speed: 20,
    skipSnaps: true
  });
  function update() {
    prevEl.disabled = !embla.canScrollPrev();
    nextEl.disabled = !embla.canScrollNext();
  }
  embla.on("select", update);
  embla.on("init", update);
  prevEl.addEventListener("click", (e) => embla.scrollPrev());
  nextEl.addEventListener("click", (e) => embla.scrollNext());
}
{
  script$1();
}
const Features = "";
const Intro = "";
const Persons = "";
const Input = "";
const Request = "";
const Service = "";
const Services = "";
function script() {
  const els = Array.from(document.querySelectorAll(".service"));
  if (!els.length)
    return;
  els.forEach((el) => {
    const buttonEl = el.querySelector(".service__button");
    buttonEl.addEventListener("click", (e) => {
      if (el.classList.contains("service_open")) {
        el.classList.remove("service_open");
      } else {
        els.forEach((node) => node.classList.remove("service_open"));
        el.classList.add("service_open");
      }
    });
  });
}
{
  script();
}
const utilities = "";
const fancybox = "";
window.Fancybox = R;

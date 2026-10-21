"use strict";
/* Each gallery contains its own supplied artwork. Edit the arrays to change order or contents. */
const galleries = {
  "preview": [
    "preview-images/page-01.jpg",
    "preview-images/page-02.jpg",
    "preview-images/page-06.jpg",
    "preview-images/page-08.jpg",
    "preview-images/page-10.jpg",
    "preview-images/page-13.jpg",
    "preview-images/page-15.jpg"
  ],
  "demons": [
    "the-demons-images/demons-1-wretch-gretzhell-front.jpg",
    "the-demons-images/demons-1-wretch-gretzhell-back.jpg",
    "the-demons-images/demons-2-vixen-van-hell-front.jpg",
    "the-demons-images/demons-2-vixen-van-hell-back.jpg",
    "the-demons-images/demons-3-axegrinder-doom-front.jpg",
    "the-demons-images/demons-3-axegrinder-doom-back.jpg",
    "the-demons-images/demons-4-slyfly-shadowfang-front.jpg",
    "the-demons-images/demons-4-slyfly-shadowfang-back.jpg",
    "the-demons-images/demons-5-bruiser-hellfrost-front.jpg",
    "the-demons-images/demons-5-bruiser-hellfrost-back.jpg",
    "the-demons-images/demons-6-chomper-mcpuck-front.jpg",
    "the-demons-images/demons-6-chomper-mcpuck-back.jpg"
  ],
  "chuck-al": [
    "chuck-al-images/happy-chuck.jpg",
    "chuck-al-images/sad-chuck.jpg",
    "chuck-al-images/scared-chuck.jpg",
    "chuck-al-images/angry-chuck.jpg",
    "chuck-al-images/sleepy-chuck.jpg"
  ],
  "making-magic": [
    "roughs-images/page-01-rough.jpg",
    "roughs-images/page-02-rough.jpg",
    "roughs-images/page-06-rough.jpg",
    "roughs-images/page-08-rough.jpg",
    "roughs-images/page-10-chuck-rough.jpg",
    "roughs-images/page-10-demons-rough.jpg",
    "roughs-images/page-13-crowd-rough.jpg",
    "roughs-images/page-13-demon-rough.jpg",
    "roughs-images/page-13-rough.jpg",
    "roughs-images/page-15-chuck.jpg",
    "roughs-images/page-15-rough.jpg",
    "roughs-images/page-18-rough.jpg"
  ]
};
const galleryNames = { preview: "Sneak Preview", demons: "The Demons", "chuck-al": "Chuck & Al", "making-magic": "Making Magic" };
const dialog = document.getElementById("gallery-dialog");
const image = document.getElementById("gallery-image");
const caption = document.getElementById("gallery-caption");
const stage = document.getElementById("gallery-stage");
let activeGallery = null;
let activeIndex = 0;
// Size the gallery around the actual visible image, not the browser window.
function fitSlide() {
  if (!dialog.open || !image.naturalWidth || !image.naturalHeight) return;
  const compact = window.innerWidth < 480;
  const horizontalSpace = compact ? 72 : 110;
  const maxWidth = Math.max(1, window.innerWidth - horizontalSpace);
  const maxHeight = Math.max(1, window.innerHeight - 100);
  const scale = Math.min(1, maxWidth / image.naturalWidth, maxHeight / image.naturalHeight);
  const displayWidth = Math.max(1, Math.floor(image.naturalWidth * scale));
  const displayHeight = Math.max(1, Math.floor(image.naturalHeight * scale));
  stage.style.width = displayWidth + "px";
  stage.style.setProperty("--image-midpoint", (displayHeight / 2) + "px");
}
image.addEventListener("load", fitSlide);
window.addEventListener("resize", fitSlide);
function renderSlide() {
  const entries = galleries[activeGallery];
  const entry = entries[activeIndex];
  stage.style.width = "1px";
  image.src = "assets/images/" + entry;
  image.alt = galleryNames[activeGallery] + ", gallery image " + (activeIndex + 1);
  caption.textContent = galleryNames[activeGallery] + "  •  " + (activeIndex + 1) + " / " + entries.length;
}
function changeSlide(offset) {
  if (!activeGallery) return;
  const count = galleries[activeGallery].length;
  activeIndex = (activeIndex + offset + count) % count;
  renderSlide();
}
document.querySelectorAll("[data-gallery]").forEach(button => {
  button.addEventListener("click", () => {
    activeGallery = button.dataset.gallery;
    activeIndex = Number(button.dataset.slide || 0);
renderSlide();
dialog.showModal();

// Focus the dialog instead of the close button
dialog.setAttribute("tabindex", "-1");
dialog.focus({ preventScroll: true });

if (image.complete) fitSlide();
  });
});
document.getElementById("gallery-close").addEventListener("click", () => dialog.close());
document.getElementById("gallery-prev").addEventListener("click", () => changeSlide(-1));
document.getElementById("gallery-next").addEventListener("click", () => changeSlide(1));
dialog.addEventListener("keydown", event => {
  if (event.key === "ArrowLeft") { event.preventDefault(); changeSlide(-1); }
  if (event.key === "ArrowRight") { event.preventDefault(); changeSlide(1); }
});
dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
dialog.addEventListener("close", () => { activeGallery = null; image.removeAttribute("src"); });
// Basic mobile swipe navigation within the image view.
let startX = null;
image.addEventListener("touchstart", e => { startX = e.changedTouches[0].clientX; }, { passive: true });
image.addEventListener("touchend", e => {
  if (startX === null) return;
  const dx = e.changedTouches[0].clientX - startX;
  if (Math.abs(dx) > 55) changeSlide(dx < 0 ? 1 : -1);
  startX = null;
}, { passive: true });

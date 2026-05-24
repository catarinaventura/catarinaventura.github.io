/* --------------------------------------------------------------------
POP-UP ANIMATION
-------------------------------------------------------------------- */
const hiddenElements = document.querySelectorAll(".hidden");

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
});

hiddenElements.forEach((el) => observer.observe(el));

/* --------------------------------------------------------------------
TYPING ANIMATION
-------------------------------------------------------------------- */
const text = "Catarina Ventura";
const typingText = document.getElementById("typing-text");

let index = 0;

function typeWriter() {
  if (index < text.length) {
    typingText.innerHTML += text.charAt(index);
    index++;
    setTimeout(typeWriter, 100);
  }
}

typeWriter();

/* --------------------------------------------------------------------
LIGHTBOX
-------------------------------------------------------------------- */
document.querySelectorAll(".react-card").forEach((card) => {
  const mainImg = card.querySelector(".main-preview");
  const thumbs = card.querySelectorAll(".thumb");

  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      mainImg.src = thumb.src;
    });
  });
});

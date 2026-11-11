document.querySelectorAll("[data-page-header]").forEach(header => {
  let cartCount = 0;
  try { cartCount = Object.values(JSON.parse(localStorage.getItem("seoul-glow-cart") || "{}")).reduce((sum, quantity) => sum + Number(quantity), 0); } catch {}
  header.innerHTML = `<nav class="page-nav" aria-label="Main navigation">
    <button class="page-menu" aria-label="Open menu" aria-expanded="false">☰</button>
    <a class="page-brand" href="index.html" aria-label="Seoul Glow home"><span><img src="assets/seoul-glow-logo-cropped.jpeg" alt="Seoul Glow" /></span></a>
    <div class="page-links"><a href="index.html">Home</a><a href="products.html">Products</a><a href="combos.html">Combos</a><a href="story.html">Story</a><a href="contact.html">Contact</a></div>
    <div class="page-nav-actions"><a class="page-bag" href="products.html">Shop now</a><a class="page-cart-link" href="index.html#bag" aria-label="Open shopping bag"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6.5 8.5h11l1 11h-13l1-11Z"/><path d="M9 9V6.5a3 3 0 0 1 6 0V9"/></svg><b class="page-cart-count">${cartCount}</b></a></div>
  </nav>
  <div class="mobile-links" hidden><a href="index.html">Home</a><a href="products.html">Products</a><a href="combos.html">Combos</a><a href="story.html">Story</a><a href="contact.html">Contact</a></div>`;
});

const pageMenuButton = document.querySelector(".page-menu");
const mobilePageLinks = document.querySelector(".mobile-links");

pageMenuButton?.addEventListener("click", () => {
  mobilePageLinks.hidden = !mobilePageLinks.hidden;
  pageMenuButton.setAttribute("aria-expanded", String(!mobilePageLinks.hidden));
});

mobilePageLinks?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  mobilePageLinks.hidden = true;
  pageMenuButton.setAttribute("aria-expanded", "false");
}));

document.querySelectorAll("[data-year]").forEach(element => { element.textContent = new Date().getFullYear(); });

document.querySelectorAll("[data-demo-form]").forEach(form => form.addEventListener("submit", event => {
  event.preventDefault();
  const message = form.querySelector(".form-message");
  if (message) message.textContent = form.dataset.success || "Thank you. We received your request.";
  form.reset();
}));

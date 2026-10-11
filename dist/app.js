const products = window.STORE_PRODUCTS || [];
const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const state = { category: "all", search: "", cart: JSON.parse(localStorage.getItem("mira-cart") || "{}") };

const grid = document.querySelector("#product-grid");
const emptyState = document.querySelector("#empty-state");
const productDialog = document.querySelector("#product-dialog");
const checkoutDialog = document.querySelector("#checkout-dialog");
const drawer = document.querySelector(".cart-drawer");
const backdrop = document.querySelector(".backdrop");
const toast = document.querySelector(".toast");

function productCard(product) {
  return `<article class="product-card" data-id="${product.id}">
    <button class="product-visual" data-view="${product.id}" aria-label="View ${product.name}" style="--product-color:${product.color}">
      <span class="product-label">${product.label}</span>
      <img src="${product.image}" alt="${product.name}" loading="lazy" />
      <span class="view-cue">View details <b>↗</b></span>
    </button>
    <div class="product-info">
      <button class="product-name" data-view="${product.id}">${product.name}</button>
      <p>${product.short} · ${product.size}</p>
      <div class="price-row"><div><strong>${money.format(product.price)}</strong><del>${money.format(product.compareAt)}</del></div><button class="quick-add" data-add="${product.id}" aria-label="Add ${product.name} to bag">+</button></div>
    </div>
  </article>`;
}

function renderProducts() {
  const term = state.search.toLowerCase();
  const filtered = products.filter(p => (state.category === "all" || p.category === state.category) && (`${p.name} ${p.short} ${p.category}`).toLowerCase().includes(term));
  grid.innerHTML = filtered.map(productCard).join("");
  emptyState.hidden = filtered.length > 0;
}

function saveCart() { localStorage.setItem("mira-cart", JSON.stringify(state.cart)); }
function cartQuantity() { return Object.values(state.cart).reduce((sum, qty) => sum + qty, 0); }
function cartSubtotal() { return products.reduce((sum, p) => sum + p.price * (state.cart[p.id] || 0), 0); }

function addToCart(id, quantity = 1) {
  state.cart[id] = (state.cart[id] || 0) + quantity;
  saveCart(); renderCart(); showToast("Added to your bag");
}

function updateQuantity(id, amount) {
  state.cart[id] = Math.max(0, (state.cart[id] || 0) + amount);
  if (!state.cart[id]) delete state.cart[id];
  saveCart(); renderCart();
}

function renderCart() {
  const count = cartQuantity();
  document.querySelectorAll(".cart-count").forEach(el => el.textContent = count);
  const cartItems = document.querySelector("#cart-items");
  const selected = products.filter(p => state.cart[p.id]);
  cartItems.innerHTML = selected.map(p => `<article class="cart-item">
    <div class="cart-thumb" style="--product-color:${p.color}"><img src="${p.image}" alt="" /></div>
    <div><h3>${p.name}</h3><p>${p.size}</p><strong>${money.format(p.price)}</strong><div class="quantity"><button data-qty="-1" data-id="${p.id}" aria-label="Remove one">−</button><span>${state.cart[p.id]}</span><button data-qty="1" data-id="${p.id}" aria-label="Add one">+</button></div></div>
  </article>`).join("");
  document.querySelector(".cart-empty").hidden = count > 0;
  document.querySelector(".cart-footer").hidden = count === 0;
  const subtotal = cartSubtotal();
  document.querySelector("#cart-total").textContent = money.format(subtotal);
  const target = 1499;
  const percent = Math.min(100, Math.round(subtotal / target * 100));
  document.querySelector("[data-progress-bar]").style.width = `${percent}%`;
  document.querySelector("[data-progress-label]").textContent = `${percent}%`;
  document.querySelector("[data-shipping-message]").textContent = subtotal >= target ? "You unlocked free shipping" : `Add ${money.format(target - subtotal)} for free shipping`;
}

function openCart() { drawer.classList.add("is-open"); drawer.setAttribute("aria-hidden", "false"); backdrop.hidden = false; document.body.classList.add("no-scroll"); setTimeout(() => drawer.querySelector(".drawer-close").focus(), 100); }
function closeCart() { drawer.classList.remove("is-open"); drawer.setAttribute("aria-hidden", "true"); backdrop.hidden = true; document.body.classList.remove("no-scroll"); }

function showProduct(id) {
  const p = products.find(item => item.id === id); if (!p) return;
  document.querySelector("#dialog-content").innerHTML = `<div class="dialog-product-visual" style="--product-color:${p.color}"><span>${p.label}</span><img src="${p.image}" alt="${p.name}" /></div><div class="dialog-product-copy"><p class="eyebrow">${p.category} care · ${p.size}</p><h2>${p.name}</h2><p class="dialog-lede">${p.description}</p><div class="dialog-price"><strong>${money.format(p.price)}</strong><del>${money.format(p.compareAt)}</del><span>Save ${money.format(p.compareAt - p.price)}</span></div><ul><li>Easy to add to your daily routine</li><li>Carefully packed for delivery</li><li>Simple, clear product information</li></ul><button class="button button-dark" data-dialog-add="${p.id}">Add to bag <span>+</span></button></div>`;
  productDialog.showModal();
}

function showToast(message) { toast.textContent = message; toast.classList.add("is-visible"); clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove("is-visible"), 2400); }

document.addEventListener("click", event => {
  const add = event.target.closest("[data-add]"); if (add) addToCart(add.dataset.add);
  const view = event.target.closest("[data-view]"); if (view) showProduct(view.dataset.view);
  const dialogAdd = event.target.closest("[data-dialog-add]"); if (dialogAdd) { addToCart(dialogAdd.dataset.dialogAdd); productDialog.close(); openCart(); }
  const qty = event.target.closest("[data-qty]"); if (qty) updateQuantity(qty.dataset.id, Number(qty.dataset.qty));
});

document.querySelectorAll(".category-chip").forEach(button => button.addEventListener("click", () => {
  document.querySelectorAll(".category-chip").forEach(b => b.classList.remove("is-active")); button.classList.add("is-active"); state.category = button.dataset.category; renderProducts(); document.querySelector("#products").scrollIntoView({ behavior: "smooth", block: "start" });
}));

document.querySelectorAll(".cart-button, .dock-cart").forEach(button => button.addEventListener("click", openCart));
document.querySelectorAll(".drawer-close, [data-close-cart]").forEach(button => button.addEventListener("click", closeCart));
backdrop.addEventListener("click", closeCart);
document.querySelector(".product-dialog .dialog-close").addEventListener("click", () => productDialog.close());
document.querySelector(".checkout-dialog .dialog-close").addEventListener("click", () => checkoutDialog.close());

const menuButton = document.querySelector(".menu-button");
const mobileMenu = document.querySelector(".mobile-menu");
menuButton.addEventListener("click", () => { mobileMenu.hidden = !mobileMenu.hidden; menuButton.setAttribute("aria-expanded", String(!mobileMenu.hidden)); });
mobileMenu.querySelectorAll("a").forEach(link => link.addEventListener("click", () => { mobileMenu.hidden = true; menuButton.setAttribute("aria-expanded", "false"); }));

const searchPanel = document.querySelector(".search-panel");
const searchInput = document.querySelector("#site-search");
document.querySelector(".search-button").addEventListener("click", () => { searchPanel.hidden = !searchPanel.hidden; if (!searchPanel.hidden) searchInput.focus(); });
searchInput.addEventListener("input", () => { state.search = searchInput.value; renderProducts(); });
document.querySelector("[data-clear-search]").addEventListener("click", () => { searchInput.value = ""; state.search = ""; renderProducts(); searchInput.focus(); });
document.querySelector("[data-close-announcement]").addEventListener("click", event => event.currentTarget.closest(".announcement").remove());

document.querySelector(".checkout-button").addEventListener("click", () => { closeCart(); checkoutDialog.showModal(); });
document.querySelector("#checkout-form").addEventListener("submit", event => { event.preventDefault(); const order = `MM-${Date.now().toString().slice(-6)}`; state.cart = {}; saveCart(); renderCart(); checkoutDialog.close(); showToast(`Demo order ${order} created`); event.currentTarget.reset(); });
document.querySelector("#newsletter-form").addEventListener("submit", event => { event.preventDefault(); showToast("Welcome to the good note"); event.currentTarget.reset(); });
document.addEventListener("keydown", event => { if (event.key === "Escape" && drawer.classList.contains("is-open")) closeCart(); });

document.querySelector("#year").textContent = new Date().getFullYear();
renderProducts(); renderCart();

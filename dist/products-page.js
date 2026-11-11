const shopProducts = window.STORE_PRODUCTS || [];
const shopGrid = document.querySelector("[data-catalog-grid]");
const shopMoney = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
let shopCategory = "all";

function renderShopProducts() {
  const visible = shopProducts.filter(product => shopCategory === "all" || product.category === shopCategory);
  shopGrid.innerHTML = visible.map(product => `<article class="catalog-card">
    <div class="catalog-visual" style="background:color-mix(in srgb,${product.color} 35%,#fff7f2)"><img src="${product.image}" alt="${product.name}" /></div>
    <div class="catalog-copy"><small>${product.label}</small><h2>${product.name}</h2><p>${product.short} · ${product.size}</p><div class="catalog-price"><strong>${shopMoney.format(product.price)}</strong><del>${shopMoney.format(product.compareAt)}</del></div><button type="button" data-shop-add="${product.id}">Add to bag</button></div>
  </article>`).join("");
}

document.querySelectorAll("[data-shop-filter]").forEach(button => button.addEventListener("click", () => {
  shopCategory = button.dataset.shopFilter;
  document.querySelectorAll("[data-shop-filter]").forEach(item => item.classList.toggle("is-active", item === button));
  renderShopProducts();
}));

document.addEventListener("click", event => {
  const button = event.target.closest("[data-shop-add]");
  if (!button) return;
  const cart = JSON.parse(localStorage.getItem("seoul-glow-cart") || "{}");
  cart[button.dataset.shopAdd] = (cart[button.dataset.shopAdd] || 0) + 1;
  localStorage.setItem("seoul-glow-cart", JSON.stringify(cart));
  const count = Object.values(cart).reduce((sum, quantity) => sum + Number(quantity), 0);
  document.querySelectorAll(".page-cart-count").forEach(element => { element.textContent = count; });
  const toast = document.querySelector(".shop-toast");
  toast.textContent = "Added to your bag";
  toast.classList.add("is-visible");
  clearTimeout(window.shopToastTimer);
  window.shopToastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
});

renderShopProducts();

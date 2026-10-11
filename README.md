# Mira & Moss storefront

A mobile-first static ecommerce storefront built for social-ad traffic. It works without a build step and stores the demo cart in the visitor's browser.

## Preview locally

Run `python3 -m http.server 4173 --directory dist` in this folder, then open `http://localhost:4173`.

## Add or edit a product (no coding tools required)

1. Open `dist/products.js` in any text editor.
2. Copy one complete product block, from `{` through `},`.
3. Change its `id`, `name`, `category`, description, prices, and size.
4. Put the new photo in the `assets` folder and update the `image` filename.
5. Save the file and refresh the website.

Prices are written as whole rupee amounts: `799` displays as `₹799`.

## Before taking real orders

The cart and checkout experience are functional demos, but they do not charge a card or save orders. Connect a commerce backend/payment provider such as Shopify, Razorpay, or Stripe, replace the sample products and contact links, and add final shipping/returns/privacy policies before advertising.

## Files

- `dist/index.html` — page structure and store copy
- `dist/styles.css` — visual design and responsive layout
- `dist/products.js` — the easy-to-edit product catalog
- `dist/app.js` — filters, search, product details, cart, and demo checkout
- `dist/assets/` — product and hero images

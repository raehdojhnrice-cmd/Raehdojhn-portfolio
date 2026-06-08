BASIC AMERICANA — STORE (elevated multi-page build)
Low Rent Glamour for American Defaults.

PAGES
  index.html      Home — hero campaign, shop preview, LA scroll world, sticker wall, lookbook preview, packaging, FAQ
  shop.html       Storefront — 8 products, category filters, quick add
  product.html    PDP — dynamic via ?id= (e.g. product.html?id=hoodie); gallery, swatches, sizes, accordions, related
  lookbook.html   Editorial Vol. 001 — real model photography
  social.html     @basicamericana mock social — profile, story highlights, feed grid, reel video (labeled mock)
  brand.html      Brand system — positioning, logo/star, color palette, type specimens, motifs, applied photos, rules

SHARED
  assets/ba.css   All styles (AA color-block · Acne whitespace · Heaven Y2K stickers · CK logo scale)
  assets/ba.js    Product catalog, cart drawer (localStorage), quick-view, PDP, parallax, draggable stickers
  assets/img/     Real photos wired in:
                    hero-campaign / editorial-cover / posters
                    products/*  (8 product shots)
                    looks/*     (8 lookbook frames)
                    gallery/*   (PDP hoodie gallery + flatlays + sticker pack)
                    scene/palm.png, scene/helicopter.png  (transparent cutouts for the scroll world)
  assets/video/   reel.mp4  (motion clip used in social.html)

NOTES
  - Cart persists across pages via localStorage (key: ba-cart-v1). Checkout is simulated.
  - All motion respects prefers-reduced-motion.
  - Open index.html directly, or serve the folder (python3 -m http.server) / drag-and-drop to Vercel/Netlify.
  - Brand marks/graphics are original Basic Americana; no copied logos.

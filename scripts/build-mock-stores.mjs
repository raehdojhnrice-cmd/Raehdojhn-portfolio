import { copyFile, mkdir, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const repoRoot = process.cwd();

const combinedStore = {
  slug: "ranaan-bks-drop-shop",
  brand: "RANAAN x BKS",
  deck: "combined garments and designs archive",
  sources: [
    {
      brand: "RANAAN",
      id: "ranaan",
      source: "/Users/nodear./Desktop/RAE FILES FR /PORTFOLIO EDITS/RANAAN GARMENTS",
    },
    {
      brand: "BKS",
      id: "bks",
      source: "/Users/nodear./Desktop/RAE FILES FR /PORTFOLIO EDITS/BKS DESIGNS",
    },
  ],
};

const deprecatedStoreSlugs = ["ranaan-garments-store", "bks-designs-store"];
const imageExtensions = new Set([".png", ".jpg", ".jpeg", ".webp"]);
const excludedSourceFiles = new Set([
  "bks:bkscrewneck2 (1).png",
  "bks:bkscrewneck2 (2).png",
  "bks:bkssweatpants.png",
  "bks:bkssweatpants1.png",
  "bks:Hoodie mockup copy.png",
  "bks:Hoodie mockup.png",
  "bks:Hoodie mockup1 copy.png",
  "bks:Hoodie mockup1.png",
  "bks:Hoodie mockup2 copy.png",
  "bks:Hoodie mockup2.png",
  "bks:Hoodie mockup4 copy.png",
  "bks:Hoodie mockup4.png",
  "bks:BKSJAPANESE HOODIE.png",
  "bks:bksoversizedtee.png",
  "bks:bkstshirt- .png",
  "bks:black-hoodie-mock-up-set-front-and-back-view-hoody-isolated-on-wgite-background-sweatshirt-mock-up-hoodie-mockup-isolated-over-white-photo.jpeg",
  "bks:blk.tshirt1 b f.jpg",
]);

function slugify(name) {
  const ext = path.extname(name).toLowerCase();
  const base = path.basename(name, ext);
  return `${base
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase()}${ext}`;
}

function labelFromName(name) {
  return path
    .basename(name, path.extname(name))
    .replace(/\s+/g, " ")
    .replace(/[-_]+/g, " ")
    .replace(/\b(psd|mockup|recovered|copy|png|jpg|jpeg)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function categoryFor(name) {
  const lower = name.toLowerCase();
  if (lower.includes("hoodie")) return "hoodies";
  if (lower.includes("tee") || lower.includes("tshirt") || lower.includes("t-shirt")) return "tees";
  if (lower.includes("short")) return "shorts";
  if (lower.includes("sweat") || lower.includes("trouser") || lower.includes("pant")) return "pants";
  if (lower.includes("hat") || lower.includes("trucker")) return "hats";
  if (lower.includes("sock")) return "accessories";
  if (lower.includes("shirt") || lower.includes("rugby") || lower.includes("mechanic")) return "shirts";
  return "all";
}

function priceFor(category, index, brandId) {
  const base = {
    hoodies: 168,
    tees: 58,
    shirts: 118,
    shorts: 78,
    pants: 128,
    hats: 48,
    accessories: 24,
    all: 88,
  }[category];
  return base + (index % 4) * 10 + (brandId === "bks" ? 4 : 0);
}

function navItems(products) {
  const categories = [...new Set(products.map((product) => product.category).filter((category) => category !== "all"))];
  return ["all", "ranaan", "bks", ...categories, "new"];
}

function renderStore(store, products) {
  const productJson = JSON.stringify(products);
  const hero = [
    ...products.filter((product) => product.brandId === "ranaan").slice(0, 4),
    ...products.filter((product) => product.brandId === "bks").slice(0, 4),
  ];
  const runner = products.filter((product) => product.brandId === "bks").slice(10, 18);
  const nav = navItems(products);

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${store.brand} drop shop</title>
  <style>
    * { box-sizing: border-box; }
    html, body { margin: 0; min-height: 100%; background: #f2f2ef; color: #101010; }
    body { font-family: Arial, Helvetica, sans-serif; font-size: 11px; letter-spacing: 0; }
    body.menu-open, body.cart-open { overflow: hidden; }
    button, a { color: inherit; font: inherit; }
    button { border: 0; background: transparent; padding: 0; cursor: pointer; text-align: left; text-transform: inherit; }
    input { border: 0; border-bottom: 1px solid #101010; border-radius: 0; background: transparent; color: inherit; font: inherit; outline: 0; padding: 4px 0; }
    input::placeholder { color: #777; }
    a { text-decoration: none; }
    .page { min-height: 100vh; }
    .promo { position: fixed; inset: 0 0 auto; z-index: 6; display: grid; grid-template-columns: repeat(4, 1fr); border-bottom: 1px solid #c8c8c2; background: #101010; color: #f4f4ef; }
    .promo span { min-height: 22px; border-right: 1px solid #3b3b38; padding: 6px 8px 0; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .promo span:last-child { border-right: 0; }
    .sidebar { position: fixed; z-index: 5; inset: 62px auto 22px 22px; display: flex; width: 140px; flex-direction: column; align-items: flex-start; gap: 18px; }
    .wordmark { display: inline-flex; background: #101010; color: #fff; font-family: Arial Black, Arial, Helvetica, sans-serif; font-size: 20px; font-weight: 900; line-height: .92; padding: 4px 5px 6px; text-transform: uppercase; }
    nav { display: grid; gap: 4px; line-height: 1.05; }
    nav button, .topbar button, .footer button, .filters button, .brand-strip button, .carousel button, .mega-list button { border-bottom: 1px solid transparent; }
    nav button:hover, .topbar button:hover, .footer button:hover, .filters button:hover, .brand-strip button:hover, .carousel button:hover, .mega-list button:hover, .active { border-bottom-color: currentColor; }
    .shell { min-height: 100vh; padding: 48px 22px 46px 188px; }
    .topbar { position: sticky; top: 22px; z-index: 4; display: grid; grid-template-columns: 1fr auto 1fr; gap: 18px; align-items: center; min-height: 42px; border-bottom: 1px solid #c8c8c2; background: rgba(242,242,239,.94); backdrop-filter: blur(12px); }
    .top-logo { justify-self: center; font-family: Arial Black, Arial, Helvetica, sans-serif; font-size: 18px; font-weight: 900; line-height: 1; text-transform: uppercase; }
    .top-actions { justify-self: end; display: flex; align-items: center; gap: 14px; }
    .top-actions input { width: min(24vw, 220px); }
    .stage { display: grid; grid-template-columns: minmax(160px, .42fr) minmax(0, 1.58fr); align-items: end; min-height: 48vh; gap: clamp(20px, 5vw, 72px); padding: 46px 0 24px; }
    .copy { display: grid; align-content: end; max-width: 272px; gap: 9px; }
    h1 { margin: 0; font-family: Arial Black, Arial, Helvetica, sans-serif; font-size: clamp(42px, 8.1vw, 124px); font-weight: 900; letter-spacing: 0; line-height: .77; text-transform: uppercase; }
    .copy p { margin: 0; color: #4d4d4d; line-height: 1.25; }
    .brand-strip { display: flex; flex-wrap: wrap; gap: 12px; padding-top: 4px; }
    .showcase { display: grid; gap: 8px; }
    .rack { display: grid; grid-template-columns: repeat(${hero.length}, minmax(42px, 1fr)); align-items: end; gap: clamp(12px, 2.4vw, 42px); }
    .rack button { display: grid; min-height: 260px; align-items: end; transition: transform 160ms ease; }
    .rack button:hover { transform: translateY(-6px); }
    .rack img { width: 100%; max-height: 360px; object-fit: contain; mix-blend-mode: multiply; filter: contrast(1.04); }
    .carousel { display: flex; justify-content: space-between; border-top: 1px solid #c8c8c2; padding-top: 8px; }
    .home-links { display: grid; grid-template-columns: repeat(4, 1fr); border-block: 1px solid #101010; margin: 6px 0 20px; }
    .home-links button { min-height: 44px; border-right: 1px solid #101010; text-align: center; text-transform: uppercase; }
    .home-links button:last-child { border-right: 0; }
    .home-links button:hover { background: #101010; color: #f4f4ef; }
    .runner { border-block: 1px solid #c6c6c1; padding: 16px 0; overflow: hidden; }
    .runner-track { display: grid; grid-auto-flow: column; grid-auto-columns: minmax(148px, 1fr); gap: 22px; overflow-x: auto; scroll-snap-type: x proximity; }
    .runner-track button { display: grid; gap: 8px; scroll-snap-align: start; }
    .runner-track img { width: 100%; height: 170px; object-fit: contain; mix-blend-mode: multiply; }
    .runner-track span { display: flex; justify-content: space-between; gap: 8px; }
    .rail { display: grid; grid-template-columns: repeat(4, 1fr); border-block: 1px solid #c6c6c1; }
    .rail p { margin: 0; min-height: 34px; border-right: 1px solid #c6c6c1; padding: 11px 10px 0 0; text-transform: lowercase; }
    .rail p:last-child { border-right: 0; }
    .collection { display: flex; align-items: end; justify-content: space-between; gap: 18px; padding: 18px 0 14px; }
    .collection h2 { margin: 0; font-size: 14px; line-height: 1; text-transform: lowercase; }
    .collection p { margin: 6px 0 0; color: #686868; }
    .filters { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 10px; }
    .grid { display: grid; grid-template-columns: repeat(6, minmax(118px, 1fr)); gap: 28px 16px; }
    .product { min-width: 0; }
    .product-image { position: relative; display: grid; width: 100%; min-height: 228px; align-items: end; justify-items: center; background: #e8e8e5; outline: 1px solid transparent; transition: background 160ms ease, outline-color 160ms ease, transform 160ms ease; }
    .product-image:hover { background: #f8f8f6; outline-color: #101010; transform: translateY(-2px); }
    .product-image span { position: absolute; top: 7px; left: 7px; background: #101010; color: #fff; padding: 2px 4px 3px; text-transform: uppercase; }
    .product-image img { width: 100%; height: 228px; object-fit: contain; mix-blend-mode: multiply; transition: opacity 160ms ease; }
    .product-image img.hover { position: absolute; inset: auto 0 0; opacity: 0; }
    .product-image:hover img.hover { opacity: 1; }
    .product-image:hover img.hover + img.primary { opacity: 0; }
    .product[data-brand="bks"] .product-image span, .brand-badge--bks { background: #9e1010; }
    .meta { display: grid; gap: 3px; padding-top: 8px; }
    .meta h3, .meta p { margin: 0; overflow-wrap: anywhere; }
    .meta h3 { display: grid; grid-template-columns: 22px 1fr; font-size: 11px; font-weight: 700; line-height: 1.15; }
    .meta h3 span { color: #777; font-weight: 400; }
    .meta p { color: #696969; }
    .meta div { display: flex; justify-content: space-between; gap: 8px; }
    .drawer { position: fixed; inset: 0 0 0 auto; z-index: 10; display: grid; width: min(410px, 100vw); grid-template-rows: auto minmax(190px, 1fr) auto auto auto auto; gap: 16px; border-left: 1px solid #101010; background: #f5f5f2; padding: 18px; transform: translateX(100%); transition: transform 210ms ease; }
    .drawer.open { transform: translateX(0); }
    .drawer img { align-self: end; width: 100%; max-height: 47vh; object-fit: contain; mix-blend-mode: multiply; }
    .drawer h2, .drawer p { margin: 0; }
    .drawer-meta { display: grid; gap: 4px; border-top: 1px solid #101010; padding-top: 12px; }
    .sizes { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
    .subtotal { display: flex; justify-content: space-between; border-top: 1px solid #101010; padding-top: 12px; text-transform: uppercase; }
    .sizes button, .add, .checkout { display: grid; min-height: 34px; place-items: center; border: 1px solid #101010; text-align: center; text-transform: uppercase; }
    .sizes button:hover, .add:hover, .checkout:hover { background: #101010; color: #fff; }
    .menu { position: fixed; inset: 0; z-index: 9; display: grid; grid-template-columns: .42fr 1fr .42fr; align-content: start; gap: 44px; background: #101010; color: #f4f4ef; padding: 22px 28px; transform: translateY(-100%); transition: transform 240ms ease; }
    .menu.open { transform: translateY(0); }
    .menu .close { grid-column: 1 / -1; justify-self: end; }
    .menu h2 { margin: 0; font-family: Arial Black, Arial, Helvetica, sans-serif; font-size: clamp(52px, 10vw, 150px); line-height: .8; text-transform: uppercase; }
    .menu p { max-width: 300px; margin: 16px 0 0; color: #c9c9c2; line-height: 1.3; }
    .mega-list { display: grid; align-content: start; gap: 8px; }
    .mega-list button { width: fit-content; font-size: clamp(28px, 5vw, 72px); font-weight: 700; line-height: .94; text-transform: lowercase; }
    .menu-columns { display: grid; grid-template-columns: repeat(2, 1fr); gap: 28px; align-content: start; }
    .menu-columns h3, .footer h3 { margin: 0 0 10px; font-size: 11px; text-transform: uppercase; }
    .menu-columns ul, .footer ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; }
    .footer { display: grid; grid-template-columns: 1.2fr repeat(3, 1fr); gap: 28px; border-top: 1px solid #c6c6c1; margin-top: 40px; padding-top: 23px; color: #333; }
    .footer-logo { font-family: Arial Black, Arial, Helvetica, sans-serif; font-size: 24px; line-height: .9; color: #101010; text-transform: uppercase; }
    @media (max-width: 1100px) { .grid { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
    @media (max-width: 980px) { .grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } .stage { grid-template-columns: 1fr; } .copy { max-width: 430px; } .top-actions input { display: none; } }
    @media (max-width: 760px) { .promo { grid-template-columns: repeat(2, 1fr); position: static; } .sidebar { position: static; width: auto; padding: 14px 14px 0; } nav { grid-template-columns: repeat(4, auto); gap: 7px 10px; } .shell { padding: 12px 14px 32px; } .topbar { top: 0; grid-template-columns: 1fr auto; } .top-logo { display: none; } .top-actions { gap: 10px; } .stage { min-height: auto; padding: 34px 0 28px; } .rack { grid-template-columns: repeat(4, minmax(48px, 1fr)); } .rack button { min-height: 158px; } .home-links, .rail { grid-template-columns: repeat(2, 1fr); } .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px 12px; } .product-image, .product-image img { min-height: 192px; height: 192px; } .menu { grid-template-columns: 1fr; gap: 32px; overflow-y: auto; } .footer { grid-template-columns: 1fr 1fr; } }
  </style>
</head>
<body>
  <main class="page">
    <div class="promo"><span>RANAAN x BKS</span><span>Drop 06</span><span>Los Angeles</span><span>Cart ships never</span></div>
    <aside class="sidebar">
      <button class="wordmark" data-menu>${store.brand}</button>
      <nav>${nav.map((item) => `<button data-filter="${item}"${item === "all" ? ` class="active"` : ""}>${item}</button>`).join("")}</nav>
    </aside>
    <section class="shell">
      <header class="topbar">
        <button data-menu>Menu</button>
        <button class="top-logo" data-filter="all">RANAAN x BKS</button>
        <div class="top-actions"><input id="search" type="search" placeholder="Enter search query"><button>Account</button><button data-cart data-cart-label>Cart 00</button></div>
      </header>
      <section class="stage">
        <div class="copy"><h1>RANAAN<br>SHOP</h1><p>${store.deck}. ${products.length} source-folder images staged as one direct product grid.</p><div class="brand-strip"><button data-filter="ranaan">RANAAN</button><button data-filter="bks">BKS</button></div></div>
        <div class="showcase"><div class="rack" id="rack">${hero.map((item) => `<button data-pick="${item.index}"><img src="${item.image}" alt=""></button>`).join("")}</div><div class="carousel"><button data-rack-prev>Previous</button><button data-rack-next>Next</button></div></div>
      </section>
      <section class="home-links"><button data-filter="all">Home</button><button data-filter="new">Shop</button><button data-menu>Contact</button><button data-menu>Terms & Info</button></section>
      <section class="runner"><div class="runner-track">${runner.map((item) => `<button data-pick="${item.index}"><img src="${item.image}" alt=""><span><strong>${item.title}</strong><em>${item.brand}</em></span></button>`).join("")}</div></section>
      <section class="rail"><p>drop 06</p><p>two archives</p><p>mock checkout</p><p>restock unknown</p></section>
      <section class="collection"><div><h2 id="current">all</h2><p><span id="count">${products.length}</span> items</p></div><div class="filters"><button data-filter="ranaan">RANAAN</button><button data-filter="bks">BKS</button><button data-filter="hoodies">hoodies</button><button data-filter="tees">tees</button><button data-filter="all">all</button></div></section>
      <section class="grid" id="grid"></section>
      <footer class="footer">
        <div><div class="footer-logo">RANAAN<br>BKS</div><p>Location: US / Change</p></div>
        <div><h3>Customer</h3><ul><li><button>Shipping</button></li><li><button>Contact</button></li><li><button>Account</button></li></ul></div>
        <div><h3>Information</h3><ul><li><button>Terms</button></li><li><button>Privacy</button></li><li><button>Accessibility</button></li></ul></div>
        <div><h3>Social</h3><ul><li><button>Instagram</button></li><li><button>YouTube</button></li><li><button>Newsletter</button></li></ul></div>
      </footer>
    </section>
    <section class="drawer" id="drawer"><button class="close" data-close-cart>Close</button><p>Your Cart</p><img id="drawerImage" alt=""><div class="drawer-meta"><p id="drawerBrand">Your cart is empty...</p><h2 id="drawerTitle"></h2><span id="drawerColor"></span><strong id="drawerPrice"></strong></div><div class="sizes"><button>S</button><button>M</button><button>L</button><button>XL</button></div><div class="subtotal"><span>Subtotal</span><strong id="subtotal">$0</strong></div><button class="checkout">Go To Checkout</button><button class="add" data-add-cart>add to cart</button></section>
    <section class="menu" id="menu">
      <button class="close" data-close-menu>Close</button>
      <div><h2>RANAAN<br>BKS</h2><p>one storefront system for garment studies, product mocks, and retail-ready previews across both archives.</p><input id="menuSearch" type="search" placeholder="Enter search query"></div>
      <nav class="mega-list">${["new", "hoodies", "tees", "shirts", "pants", "hats", "accessories"].map((item) => `<button data-filter="${item}" data-close-menu>${item}</button>`).join("")}</nav>
      <div class="menu-columns">
        <div><h3>Lookbooks</h3><ul><li><button>Drop 06</button></li><li><button>Archive</button></li><li><button>Preview</button></li></ul></div>
        <div><h3>Locations</h3><ul><li><button>Los Angeles</button></li><li><button>New York</button></li><li><button>Online</button></li></ul></div>
        <div><h3>Customer</h3><ul><li><button>Shipping</button></li><li><button>Contact</button></li><li><button>Account</button></li></ul></div>
        <div><h3>Follow</h3><ul><li><button>Instagram</button></li><li><button>Newsletter</button></li><li><button>iOS App</button></li></ul></div>
      </div>
    </section>
  </main>
  <script>
    const products = ${productJson};
    let active = "all";
    let query = "";
    let cartCount = 0;
    let subtotal = 0;
    const grid = document.getElementById("grid");
    const current = document.getElementById("current");
    const count = document.getElementById("count");
    const drawer = document.getElementById("drawer");
    const menu = document.getElementById("menu");
    const search = document.getElementById("search");
    const menuSearch = document.getElementById("menuSearch");
    const money = value => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
    function visibleProducts() {
      const rows = active === "all" ? products : active === "new" ? products.slice(0, 24) : products.filter(product => product.category === active || product.brandId === active);
      if (!query) return rows;
      const term = query.toLowerCase();
      return rows.filter(product => [product.title, product.brand, product.category, product.color].some(value => String(value).toLowerCase().includes(term)));
    }
    function updateCart() {
      document.querySelectorAll("[data-cart-label]").forEach(button => button.textContent = \`Cart \${String(cartCount).padStart(2, "0")}\`);
      document.getElementById("subtotal").textContent = money(subtotal);
    }
    function draw() {
      const rows = visibleProducts();
      current.textContent = active;
      count.textContent = rows.length;
      document.querySelectorAll("[data-filter]").forEach(button => button.classList.toggle("active", button.dataset.filter === active));
      grid.innerHTML = rows.map((product, index) => \`
        <article class="product" data-brand="\${product.brandId}">
          <button class="product-image" data-product="\${product.index}">
            \${index < 10 ? \`<span class="brand-badge brand-badge--\${product.brandId}">\${product.brand}</span>\` : ""}
            \${product.hoverImage ? \`<img class="hover" src="\${product.hoverImage}" alt="\${product.title} alternate view">\` : ""}
            <img class="primary" src="\${product.image}" alt="\${product.title}">
          </button>
          <div class="meta">
            <h3><span>\${String(index + 1).padStart(2, "0")}</span>\${product.title}</h3>
            <p>\${product.brand} / \${product.color}</p>
            <div><span>\${money(product.price)}</span><span>\${product.status}</span></div>
          </div>
        </article>\`).join("");
    }
    function openProduct(index) {
      const product = products[index];
      document.getElementById("drawerImage").src = product.image;
      document.getElementById("drawerBrand").textContent = product.brand;
      document.getElementById("drawerTitle").textContent = product.title;
      document.getElementById("drawerColor").textContent = product.color;
      document.getElementById("drawerPrice").textContent = money(product.price);
      drawer.classList.add("open");
      document.body.classList.add("cart-open");
    }
    document.addEventListener("click", event => {
      const filter = event.target.closest("[data-filter]");
      const product = event.target.closest("[data-product]");
      const pick = event.target.closest("[data-pick]");
      if (filter) { active = filter.dataset.filter; draw(); }
      if (product) openProduct(Number(product.dataset.product));
      if (pick) openProduct(Number(pick.dataset.pick));
      if (event.target.closest("[data-cart]")) openProduct(0);
      if (event.target.closest("[data-menu]")) { menu.classList.add("open"); document.body.classList.add("menu-open"); }
      if (event.target.closest("[data-close-cart]")) { drawer.classList.remove("open"); document.body.classList.remove("cart-open"); }
      if (event.target.closest("[data-close-menu]")) { menu.classList.remove("open"); document.body.classList.remove("menu-open"); }
      if (event.target.closest("[data-add-cart]")) {
        const price = Number(document.getElementById("drawerPrice").textContent.replace(/[^0-9]/g, "")) || 0;
        cartCount += 1;
        subtotal += price;
        updateCart();
      }
      if (event.target.closest("[data-rack-prev]")) document.getElementById("rack").scrollBy({ left: -180, behavior: "smooth" });
      if (event.target.closest("[data-rack-next]")) document.getElementById("rack").scrollBy({ left: 180, behavior: "smooth" });
    });
    search.addEventListener("input", event => { query = event.target.value.trim(); menuSearch.value = query; draw(); });
    menuSearch.addEventListener("input", event => { query = event.target.value.trim(); search.value = query; draw(); });
    updateCart();
    draw();
  </script>
</body>
</html>`;
}

async function readImageFiles(source) {
  const entries = await readdir(source, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && imageExtensions.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

function mergeHoverPairs(products) {
  const mergedPairs = [
    {
      primary: "ranaan hoodie concept #1 (back).png",
      hover: "ranaan hoodie concept #1.png",
      title: "ranaan hoodie concept #1",
    },
    {
      primary: "ranaan hoodie concept #2 (back).png",
      hover: "ranaan hoodie concept #2.png",
      title: "ranaan hoodie concept #2",
    },
    {
      primary: "ranaan hoodie concept #3 (back).png",
      hover: "ranaan hoodie concept #3.png",
      title: "ranaan hoodie concept #3",
    },
    {
      primary: "BKS JAPANESE HOODIE #1 (BACK) .png",
      hover: "BKS JAPANESE HOODIE #1.png",
      title: "BKS JAPANESE HOODIE #1",
    },
    {
      primary: "BKS JAPANESE HOODIE #2 (BACK) .png",
      hover: "BKS JAPANESE HOODIE #2.png",
      title: "BKS JAPANESE HOODIE #2",
    },
    {
      primary: "BKS JAPANESE HOODIE #3 (BACK) .png",
      hover: "BKS JAPANESE HOODIE #3.png",
      title: "BKS JAPANESE HOODIE #3",
    },
    {
      primary: "BKS JAPANESE HOODIE #4 (BACK) .png",
      hover: "BKS JAPANESE HOODIE #4.png",
      title: "BKS JAPANESE HOODIE #4",
    },
    {
      primary: "BKS MECHANIC SHIRT #1 (Back) .png",
      hover: "BKS MECHANIC SHIRT #1.png",
      title: "BKS MECHANIC SHIRT #1",
    },
    {
      primary: "BKS MECHANIC SHIRT #2 (Back) .png",
      hover: "BKS MECHANIC SHIRT #2.png",
      title: "BKS MECHANIC SHIRT #2",
    },
    {
      primary: "BKS MECHANIC SHIRT #3 (Back) .png",
      hover: "BKS MECHANIC SHIRT #3.png",
      title: "BKS MECHANIC SHIRT #3",
    },
    {
      primary: "BKS MECHANIC SHIRT #4 (Back) .png",
      hover: "BKS MECHANIC SHIRT #4.png",
      title: "BKS MECHANIC SHIRT #4",
    },
    {
      primary: "brothersteeback2.png",
      hover: "brotherstee1.png",
      title: "brothersteeback2",
    },
    {
      primary: "brothersteeback1.png",
      hover: "brotherstee2.png",
      title: "brothersteeback1",
    },
    {
      primary: "brothersteeback.png",
      hover: "brotherstee3.png",
      title: "brothersteeback",
    },
  ];

  let rows = products;

  for (const pair of mergedPairs) {
    const primary = rows.find((product) => product.source === pair.primary);
    const hover = rows.find((product) => product.source === pair.hover);
    if (!primary || !hover) continue;

    primary.title = pair.title;
    primary.hoverImage = hover.image;
    primary.hoverSource = hover.source;
    rows = rows.filter((product) => product !== hover);
  }

  return rows.map((product, index) => ({ ...product, index }));
}

async function buildCombinedStore(store) {
  const dest = path.join(repoRoot, "public", "projects", store.slug);
  const imageDest = path.join(dest, "img");
  await rm(dest, { recursive: true, force: true });
  await mkdir(imageDest, { recursive: true });

  const seen = new Map();
  const products = [];

  for (const sourceConfig of store.sources) {
    const imageFiles = await readImageFiles(sourceConfig.source);

    for (const file of imageFiles) {
      if (excludedSourceFiles.has(`${sourceConfig.id}:${file}`)) continue;

      const slug = `${sourceConfig.id}-${slugify(file)}`;
      const count = seen.get(slug) || 0;
      seen.set(slug, count + 1);
      const safeName = count === 0 ? slug : slug.replace(/(\.[^.]+)$/, `-${count + 1}$1`);
      const category = categoryFor(file);
      const index = products.length;

      await copyFile(path.join(sourceConfig.source, file), path.join(imageDest, safeName));
      products.push({
        index,
        brand: sourceConfig.brand,
        brandId: sourceConfig.id,
        title: labelFromName(file) || `${sourceConfig.brand} item ${index + 1}`,
        color: category,
        category,
        price: priceFor(category, index, sourceConfig.id),
        status: index % 7 === 0 ? "low stock" : "available",
        image: `./img/${safeName}`,
        source: file,
      });
    }
  }

  const mergedProducts = mergeHoverPairs(products);

  for (const slug of deprecatedStoreSlugs) {
    await rm(path.join(repoRoot, "public", "projects", slug), { recursive: true, force: true });
  }

  await writeFile(path.join(dest, "manifest.json"), JSON.stringify({ ...store, products: mergedProducts }, null, 2));
  await writeFile(path.join(dest, "index.html"), renderStore(store, mergedProducts));
  return { slug: store.slug, count: mergedProducts.length };
}

const result = await buildCombinedStore(combinedStore);
console.log(`${result.slug}: ${result.count} images`);

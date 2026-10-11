"use strict";

const shopEmail = "tatansavenok35@gmail.com";

const products = [
  {
    name: "rosengarten",
    price: 5.00,
    description: "Ein sanfter Lichtblick für entspannte Momente.",
       image: "https://cdn.phototourl.com/member/2026-10-11-30ded1ea-9bc2-468d-a1b1-cd329c2d48d1.jpg",
    link: "https://www.vinted.de/items/10334352328-handgemachte-bienenwachskerze-in-herzform-100-natur-honig-blutenduft",
    bg: "#eee1d1",
    wax: "#f2d9b9"
  },
  {
    name: "waimachzbaum",
    price:  5.00,
    description: "Für gemütliche Pausen und kleine Auszeiten.",
    image: "https://dark-leaf-727.linkyhost.com",
    link: "https://www.vinted.de/items/10334202599-handgemachte-kerze-weihnachtsbaum-aus-naturlichem-wachs",
    bg: "#f0dedc",
    wax: "#e6b9b4"
  },
  {
    name: "honig standart ",
    price: 5.00,
    description: "Ein Hauch von Wärme für dein Zuhause.",
    image: "https://cdn.phototourl.com/member/2026-10-11-b09e7873-ad7d-431a-bc4e-f513ccc83777.jpg",
    link: "https://www.vinted.de/items/10334260225-handgemachte-bienenwachskerze-100-naturlich-honigduft",
    bg: "#e3e7d9",
    wax: "#d2d9c4"
  },
  {
    name: "golden Abent [metal]",
    price: 5.00,
    description: "Ein romantischer Akzent für besondere Momente.",
    image: "https://cdn.phototourl.com/member/2026-10-11-4f892ae9-3896-40de-a1ec-c3a6d1fe6815.jpg",
    link: "https://www.vinted.de/items/10334499362-handgemachte-bienenwachskerze-100-natur-pur",
    bg: "#efe4c9",
    wax: "#ead5a4"
  },
  {
    name: "Kerze Waldzauber",
    price: 5.00,
    description: "Inspiriert von der Schönheit der Natur.",
    image: "https://cdn.phototourl.com/member/2026-10-11-ad0133de-9829-4d8d-8654-8f77fcb8074a.jpg",
    link: "https://www.vinted.de/items/10334444539-handgemachte-kerze-aus-100-naturlichem-bienenwachs",
    bg: "#eadfe9",
    wax: "#d8c1d9"
  },
  {
    name: "Kerze Goldener Abend",
    price: 5.00,
    description: "Ein warmes Licht für entspannte Abende.",
    image: "https://cdn.phototourl.com/member/2026-10-11-b09e7873-ad7d-431a-bc4e-f513ccc83777.jpg",
    link: "https://buy.stripe.com/test_00w9AUa22aRl4NkcaV00009",
    bg: "#f0e0d4",
    wax: "#e6bfa9"
  }
];

const container = document.getElementById("products");

function formatPrice(price) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR"
  }).format(price);
}

function renderProducts() {
  if (!container) return;

  container.replaceChildren();

  products.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";

    const imageArea = document.createElement("div");
    imageArea.className = "product-image";
    imageArea.style.setProperty("--product-bg", product.bg);
    imageArea.style.setProperty("--wax", product.wax);

    if (
      product.image &&
      product.image !== "HIER_FOTO_URL_EINFUEGEN"
    ) {
      const img = document.createElement("img");
      img.src = product.image;
      img.alt = product.name;
      img.loading = "lazy";

      img.addEventListener("error", () => {
        img.remove();
        const placeholder = document.createElement("div");
        placeholder.className = "image-placeholder";
        placeholder.textContent = "Bild konnte nicht geladen werden";
        imageArea.appendChild(placeholder);
      });

      imageArea.appendChild(img);
    } else {
      const candle = document.createElement("div");
      candle.className = "candle-art";
      candle.setAttribute("role", "img");
      candle.setAttribute("aria-label", product.name);

      const placeholder = document.createElement("div");
      placeholder.className = "image-placeholder";
      placeholder.textContent = "HIER FOTO URL EINFÜGEN";

      imageArea.append(candle, placeholder);
    }

    const info = document.createElement("div");
    info.className = "product-info";

    const title = document.createElement("h3");
    title.textContent = product.name;

    const description = document.createElement("p");
    description.className = "description";
    description.textContent = product.description;

    const price = document.createElement("div");
    price.className = "product-price";
    price.textContent = formatPrice(product.price);

    const actions = document.createElement("div");
    actions.className = "product-actions";

    const buy = document.createElement("a");
    buy.className = "button";
    buy.href = product.link;
    buy.target = "_blank";
    buy.rel = "noopener noreferrer";
    buy.textContent = "Jetzt kaufen";

    const add = document.createElement("button");
    add.className = "button-secondary";
    add.type = "button";
    add.textContent = "In den Warenkorb";

    add.addEventListener("click", () => {
      add.textContent = "Hinzugefügt ✓";
      add.setAttribute("aria-label", product.name + " hinzugefügt");

      const status = document.createElement("p");
      status.className = "cart-status";
      status.setAttribute("role", "status");
      status.textContent =
        product.name + " wurde ausgewählt. " +
        "Bitte nutze „Jetzt kaufen“, um dieses Produkt separat zu bezahlen.";

      const previous = actions.querySelector(".cart-status");
      if (previous) previous.remove();

      actions.appendChild(status);
    });

    actions.append(buy, add);
    info.append(title, description, price, actions);
    card.append(imageArea, info);
    container.appendChild(card);
  });
}

const form = document.getElementById("contact-form");

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("customer-email").value.trim();
    const message = document.getElementById("customer-message").value.trim();
    const status = document.getElementById("contact-status");

    if (!shopEmail || shopEmail === "HIER_E-MAIL_EINFUEGEN") {
      status.textContent =
        "Bitte trage zuerst deine E-Mail-Adresse im script.js ein.";
      return;
    }

    const subject = encodeURIComponent("Nachricht über Kerzenzauber");
    const body = encodeURIComponent(
      "Kunden-E-Mail: " + email + "\n\nNachricht:\n" + message
    );

    status.textContent =
      "Dein E-Mail-Programm wird geöffnet. Bitte sende die Nachricht dort ab.";

    window.location.href =
      "mailto:" + shopEmail +
      "?subject=" + subject +
      "&body=" + body;
  });
}

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

renderProducts();
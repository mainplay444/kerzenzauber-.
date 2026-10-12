"use strict";

/* =====================================
   KROIZAUBER – PRODUKTE
===================================== */

const shopEmail = "tatansavenok35@gmail.com";

const products = [
  {
    name: "Vanilletraum",
    price: 5,
    description: "Ein warmer, süßer Vanilleduft für gemütliche Abende.",
    symbol: "🕯️",
    subject: "Vanilletraum"
  },
  {
    name: "Rosengarten",
    price: 5,
    description: "Eine romantische Geschenkidee mit blumigem Charakter.",
    symbol: "🌹",
    subject: "Rosengarten"
  },
  {
    name: "Blütenzauber",
    price: 5,
    description: "Eine liebevolle Kerzenidee für besondere Momente.",
    symbol: "🌸",
    subject: "Bluetenzauber"
  },
  {
    name: "Geschenklicht",
    price: 5,
    description: "Eine kleine Aufmerksamkeit für einen lieben Menschen.",
    symbol: "🎁",
    subject: "Geschenklicht"
  },
  {
    name: "Cremeweiß",
    price: 5,
    description: "Schlichtes Design für ein ruhiges und gemütliches Zuhause.",
    symbol: "🤍",
    subject: "Cremeweiss"
  },
  {
    name: "Abendruhe",
    price: 5,
    description: "Für entspannte Stunden und eine warme Atmosphäre.",
    symbol: "✨",
    subject: "Abendruhe"
  }
];

/* =====================================
   PRODUKTE ANZEIGEN
===================================== */

function renderProducts() {
  const container = document.getElementById("products");

  if (!container) {
    console.error('Der Bereich "#products" wurde nicht gefunden.');
    return;
  }

  container.replaceChildren();

  products.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";

    const visual = document.createElement("div");
    visual.className = "product-visual";
    visual.setAttribute("aria-hidden", "true");
    visual.textContent = product.symbol;

    const content = document.createElement("div");
    content.className = "product-card-content";

    const title = document.createElement("h3");
    title.textContent = product.name;

    const description = document.createElement("p");
    description.textContent = product.description;

    const price = document.createElement("p");
    price.className = "product-price";
    price.textContent =
      product.price.toLocaleString("de-DE", {
        style: "currency",
        currency: "EUR"
      });

    const buyButton = document.createElement("a");
    buyButton.className = "button";
    buyButton.textContent = "Produkt anfragen";
    buyButton.href =
      "mailto:" +
      shopEmail +
      "?subject=" +
      encodeURIComponent("Produktanfrage: " + product.subject);

    const note = document.createElement("p");
    note.className = "product-note";
    note.textContent = "Bestellung per E-Mail anfragen";

    content.append(title, description, price, buyButton, note);
    card.append(visual, content);
    container.appendChild(card);
  });
}

/* =====================================
   KONTAKTFORMULAR
===================================== */

function setupContactForm() {
  const form = document.getElementById("contactForm");

  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!name || !email || !message) {
      alert("Bitte fülle alle Felder aus.");
      return;
    }

    const subject = encodeURIComponent(
      "Nachricht über die Kroizauber-Website"
    );

    const body = encodeURIComponent(
      "Name: " + name + "\n" +
      "E-Mail: " + email + "\n\n" +
      "Nachricht:\n" + message
    );

    window.location.href =
      "mailto:" + shopEmail +
      "?subject=" + subject +
      "&body=" + body;
  });
}

/* =====================================
   JAHR IM FOOTER
===================================== */

function setupFooterYear() {
  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }
}

/* =====================================
   MINISPIEL: RETTE DIE KERZEN!
===================================== */

function setupKerzenspiel() {
  const feld = document.getElementById("gameCandles");
  const zeitAnzeige = document.getElementById("gameTime");
  const anzahlAnzeige = document.getElementById("gameLit");
  const nachricht = document.getElementById("gameMessage");
  const startButton = document.getElementById("startCandleGame");

  if (!feld || !zeitAnzeige || !anzahlAnzeige || !nachricht || !startButton) {
    console.error("Das Kerzenspiel konnte nicht initialisiert werden.");
    return;
  }

  const ANZAHL_KERZEN = 20;
  const SPIELZEIT = 15;

  let kerzen = [];
  let laeuft = false;
  let endzeit = 0;
  let countdown = null;
  let loeschTimer = null;
  let spielGeneration = 0;

  function timerStoppen() {
    clearInterval(countdown);
    clearInterval(loeschTimer);

    countdown = null;
    loeschTimer = null;
  }

  function statistikAktualisieren() {
    const verbleibend = laeuft
      ? Math.max(0, Math.ceil((endzeit - Date.now()) / 1000))
      : Number(zeitAnzeige.textContent);

    zeitAnzeige.textContent = String(verbleibend);
    anzahlAnzeige.textContent = String(
      kerzen.filter((kerze) => kerze.brennt).length
    );
  }

  function kerzenZeichnen() {
    feld.replaceChildren();

    kerzen.forEach((kerze, index) => {
      const button = document.createElement("button");

      button.type = "button";
      button.className = "game-candle";
      button.textContent = kerze.brennt ? "🕯️" : "🌫️";
      button.setAttribute(
        "aria-label",
        "Kerze " + (index + 1) + (kerze.brennt ? " brennt" : " ist aus")
      );

      if (!kerze.brennt) {
        button.classList.add("off");
      }

      button.addEventListener("click", () => {
        if (!laeuft || kerze.brennt) return;

        kerze.brennt = true;
        kerzenZeichnen();
        statistikAktualisieren();
      });

      feld.appendChild(button);
    });
  }

  function spielBeenden(generation) {
    if (!laeuft || generation !== spielGeneration) return;

    laeuft = false;
    timerStoppen();

    const alleBrennen = kerzen.every((kerze) => kerze.brennt);

    zeitAnzeige.textContent = "0";

    if (alleBrennen) {
      nachricht.textContent =
        "🎉 Gewonnen! Alle 20 Kerzen brennen noch!";
    } else {
      nachricht.textContent =
        "⏰ Die Zeit ist um! Versuche es noch einmal.";
    }

    startButton.textContent = "Noch einmal spielen";
    statistikAktualisieren();
  }

  function kerzeLoeschen() {
    if (!laeuft) return;

    const brennendeKerzen = kerzen.filter((kerze) => kerze.brennt);

    if (brennendeKerzen.length === 0) return;

    const index = Math.floor(Math.random() * brennendeKerzen.length);
    brennendeKerzen[index].brennt = false;

    kerzenZeichnen();
    statistikAktualisieren();
  }

  function spielStarten() {
    timerStoppen();

    spielGeneration += 1;
    const generation = spielGeneration;

    kerzen = Array.from(
      { length: ANZAHL_KERZEN },
      () => ({ brennt: true })
    );

    laeuft = true;
    endzeit = Date.now() + SPIELZEIT * 1000;

    nachricht.textContent =
      "Schnell! Tippe auf jede erloschene Kerze!";
    startButton.textContent = "Spiel läuft …";

    kerzenZeichnen();
    statistikAktualisieren();

    // Alle drei Sekunden geht eine zufällige Kerze aus.
    loeschTimer = setInterval(kerzeLoeschen, 3000);

    countdown = setInterval(() => {
      if (!laeuft || generation !== spielGeneration) return;

      statistikAktualisieren();

      if (Date.now() >= endzeit) {
        spielBeenden(generation);
      }
    }, 100);
  }

  startButton.addEventListener("click", spielStarten);

  kerzen = Array.from(
    { length: ANZAHL_KERZEN },
    () => ({ brennt: true })
  );

  zeitAnzeige.textContent = String(SPIELZEIT);
  kerzenZeichnen();
  statistikAktualisieren();
}

/* =====================================
   WEBSITE STARTEN
===================================== */

function websiteStarten() {
  renderProducts();
  setupContactForm();
  setupFooterYear();
  setupKerzenspiel();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", websiteStarten);
} else {
  websiteStarten();
}

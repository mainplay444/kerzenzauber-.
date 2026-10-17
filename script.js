/* =========================================================
   KROIZAUBER — SHOP, FAVORITEN UND KERZENSPIEL
   Statische Website: keine externen Bibliotheken erforderlich.
   ========================================================= */

"use strict";

/* ---------------------------------------------------------
   1. KONFIGURATION UND PRODUKTDATEN
   --------------------------------------------------------- */

const SHOP_EMAIL = "tatansavenok35@gmail.com";
const GAME_DURATION_SECONDS = 20;
const GAME_CANDLE_COUNT = 20;
const STORAGE_KEYS = { favorites: "kroizauber-favorites-v1" };

const products = [
  {
    id: "rosengarten",
    name: "rosengarten",
    price: 3.50,
    description: "Ein sanfter Lichtblick für entspannte Momente.",
    image: "https://cdn.phototourl.com/member/2026-10-11-30ded1ea-9bc2-468d-a1b1-cd329c2d48d1.jpg",
    link: "https://www.vinted.de/items/10334352328-handgemachte-bienenwachskerze-in-herzform-100-natur-honig-blutenduft",
    bg: "#eee1d1",
    wax: "#f2d9b9",
    category: "Blumig",
    badge: "Beliebt"
  },
  {
    id: "waimachzbaum",
    name: "waimachzbaum",
    price: 3.50,
    description: "Für gemütliche Pausen und kleine Auszeiten.",
    image: "https://dark-leaf-727.linkyhost.com",
    link: "https://i.postimg.cc/MGdgG1by/zobrazenna-viber-2026-10-11-15-15-51-119.jpg",
    bg: "#f0dedc",
    wax: "#e6b9b4",
    category: "Saisonal",
    badge: "Besonders"
  },
  {
    id: "honig-standart",
    name: "honig standart",
    price: 3.50,
    description: "Ein Hauch von Wärme für dein Zuhause.",
    image: "https://cdn.phototourl.com/member/2026-10-11-b09e7873-ad7d-431a-bc4e-f513ccc83777.jpg",
    link: "https://www.vinted.de/items/10334260225-handgemachte-bienenwachskerze-100-naturlich-honigduft",
    bg: "#e3e7d9",
    wax: "#d2d9c4",
    category: "Natürlich",
    badge: "Natürlich"
  },
  {
    id: "golden-abent-metal",
    name: "golden Abent [metal]",
    price: 3.50,
    description: "Ein romantischer Akzent für besondere Momente.",
    image: "https://cdn.phototourl.com/member/2026-10-11-4f892ae9-3896-40de-a1ec-c3a6d1fe6815.jpg",
    link: "https://www.vinted.de/items/10334499362-handgemachte-bienenwachskerze-100-natur-pur",
    bg: "#efe4c9",
    wax: "#ead5a4",
    category: "Elegant",
    badge: "Elegant"
  },
  {
    id: "waldzauber",
    name: "Kerze Waldzauber",
    price: 3.50,
    description: "Inspiriert von der Schönheit der Natur.",
    image: "https://cdn.phototourl.com/member/2026-10-11-ad0133de-9829-4d8d-8654-8f77fcb8074a.jpg",
    link: "https://www.vinted.de/items/10334444539-handgemachte-kerze-aus-100-naturlichem-bienenwachs",
    bg: "#eadfe9",
    wax: "#d8c1d9",
    category: "Natürlich",
    badge: "Natur"
  },
  {
    id: "goldener-abend",
    name: "Kerze Goldener Abend",
    price: 3.50,
    description: "Ein warmes Licht für entspannte Abende.",
    image: "https://cdn.phototourl.com/member/2026-10-11-b09e7873-ad7d-431a-bc4e-f513ccc83777.jpg",
    link: "https://buy.stripe.com/test_00w9AUa22aRl4NkcaV00009",
    bg: "#f0e0d4",
    wax: "#e6bfa9",
    category: "Abend",
    badge: "Stimmungsvoll"
  }
];

/* ---------------------------------------------------------
   2. DOM-HELPER UND FORMATIERUNG
   --------------------------------------------------------- */

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function byId(id) {
  return document.getElementById(id);
}

function formatPrice(value) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR"
  }).format(value);
}

function safeParseJSON(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.warn("Gespeicherte Website-Daten konnten nicht gelesen werden.", error);
    return fallback;
  }
}

function readStorage(key, fallback) {
  try {
    return safeParseJSON(localStorage.getItem(key), fallback);
  } catch (error) {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn("Speichern im Browser ist nicht verfügbar.", error);
    return false;
  }
}

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function findProduct(productId) {
  return products.find((product) => product.id === productId);
}

/* ---------------------------------------------------------
   3. TOAST-MELDUNGEN
   --------------------------------------------------------- */

let toastCounter = 0;

function showToast(message, type = "success") {
  const region = byId("toast-region");
  if (!region) return;

  const toast = createElement("div", `toast toast--${type}`, message);
  toast.setAttribute("role", type === "error" ? "alert" : "status");
  region.appendChild(toast);

  const toastId = ++toastCounter;

  window.setTimeout(() => {
    if (toast.isConnected && toastId <= toastCounter) {
      toast.remove();
    }
  }, 3200);
}

/* ---------------------------------------------------------
   4. FAVORITEN
   --------------------------------------------------------- */

const state = {
  favorites: new Set(
    readStorage(STORAGE_KEYS.favorites, []).filter((id) =>
      products.some((product) => product.id === id)
    )
  ),
  favoritesOnly: false,
  searchQuery: "",
  sortMode: "featured"
};

function saveFavorites() {
  writeStorage(STORAGE_KEYS.favorites, [...state.favorites]);
}

function updateFavoritesCount() {
  const counter = byId("favorites-count");
  if (counter) counter.textContent = String(state.favorites.size);
}

function toggleFavorite(productId) {
  if (state.favorites.has(productId)) {
    state.favorites.delete(productId);
    showToast("Aus deinen Favoriten entfernt.");
  } else {
    state.favorites.add(productId);
    showToast("Zu deinen Favoriten hinzugefügt.");
  }

  saveFavorites();
  updateFavoritesCount();
  renderProducts();
}

function setFavoritesFilter(enabled) {
  state.favoritesOnly = enabled;

  const button = byId("favorites-filter");
  if (button) {
    button.setAttribute("aria-pressed", String(enabled));
  }

  renderProducts();
}

/* ---------------------------------------------------------
   5. PRODUKTKARTEN
   --------------------------------------------------------- */

function createProductImage(product) {
  const visual = createElement("div", "product-card__visual");
  visual.style.setProperty("--product-bg", product.bg);
  visual.style.setProperty("--wax", product.wax);

  const badge = createElement("span", "product-card__badge", product.badge);
  visual.appendChild(badge);

  const favorite = createElement("button", "favorite-button");
  favorite.type = "button";
  favorite.textContent = state.favorites.has(product.id) ? "♥" : "♡";
  favorite.setAttribute("aria-label",
    state.favorites.has(product.id)
      ? `${product.name} aus Favoriten entfernen`
      : `${product.name} zu Favoriten hinzufügen`
  );
  favorite.setAttribute("aria-pressed", String(state.favorites.has(product.id)));
  favorite.addEventListener("click", () => toggleFavorite(product.id));
  visual.appendChild(favorite);

  const image = createElement("img", "product-card__image");
  image.src = product.image;
  image.alt = product.name;
  image.loading = "lazy";
  image.decoding = "async";

  image.addEventListener("error", () => {
    if (!visual.isConnected) return;
    image.remove();

    const fallback = createElement("div", "product-card__image-fallback");
    fallback.style.setProperty("--product-bg", product.bg);
    fallback.style.setProperty("--wax", product.wax);

    const candle = createElement("div", "fallback-candle");
    const caption = createElement("span", "fallback-caption", "Foto momentan nicht verfügbar");

    fallback.append(candle, caption);
    visual.appendChild(fallback);
  }, { once: true });

  visual.appendChild(image);
  return visual;
}

function createProductCard(product) {
  const card = createElement("article", "product-card");
  card.dataset.productId = product.id;

  const visual = createProductImage(product);
  const content = createElement("div", "product-card__content");

  const meta = createElement("div", "product-card__meta");
  meta.appendChild(createElement("span", "", product.category));
  meta.appendChild(createElement("span", "", "Kroizauber"));

  const title = createElement("h3", "product-card__title", product.name);
  const description = createElement("p", "product-card__description", product.description);

  const purchaseRow = createElement("div", "product-card__purchase-row");
  purchaseRow.appendChild(createElement("strong", "product-card__price", formatPrice(product.price)));
  purchaseRow.appendChild(createElement("span", "product-card__price-note", "pro Kerze"));

  const actions = createElement("div", "product-card__actions");

  const buy = createElement("a", "button button--gold");
  const isTestPayment = typeof product.link === "string" && product.link.includes("buy.stripe.com/test_");
  buy.href = isTestPayment ? "#contact" : product.link;
  if (!isTestPayment) { buy.target = "_blank"; buy.rel = "noopener noreferrer"; }
  buy.append(document.createTextNode(isTestPayment ? "Zahlung einrichten" : "Jetzt kaufen "), createElement("span", "", isTestPayment ? "!" : "↗"));
  buy.setAttribute("aria-label", isTestPayment ? `${product.name}: Stripe-Link ist nur ein Testlink` : `${product.name} auf der Verkaufsplattform öffnen`);
  if (isTestPayment) {
    buy.classList.add("button--payment-unconfigured");
    buy.addEventListener("click", (event) => {
      event.preventDefault();
      showToast("Dieser Stripe-Link ist ein TEST-Link. Live-Zahlung noch nicht eingerichtet.", "error");
      const contact = byId("contact");
      if (contact) contact.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  actions.append(buy);
  content.append(meta, title, description, purchaseRow, actions);
  card.append(visual, content);

  return card;
}

function getFilteredProducts() {
  let filtered = [...products];

  if (state.searchQuery) {
    const query = state.searchQuery.toLocaleLowerCase("de-DE");
    filtered = filtered.filter((product) => {
      const haystack = `${product.name} ${product.description} ${product.category}`.toLocaleLowerCase("de-DE");
      return haystack.includes(query);
    });
  }

  if (state.favoritesOnly) {
    filtered = filtered.filter((product) => state.favorites.has(product.id));
  }

  switch (state.sortMode) {
    case "name-asc":
      filtered.sort((a, b) => a.name.localeCompare(b.name, "de"));
      break;
    case "name-desc":
      filtered.sort((a, b) => b.name.localeCompare(a.name, "de"));
      break;
    case "price-asc":
      filtered.sort((a, b) => a.price - b.price || a.name.localeCompare(b.name, "de"));
      break;
    case "price-desc":
      filtered.sort((a, b) => b.price - a.price || a.name.localeCompare(b.name, "de"));
      break;
    default:
      // Die ursprüngliche Reihenfolge ist die empfohlene Reihenfolge.
      break;
  }

  return filtered;
}

function renderProducts() {
  const container = byId("products");
  const status = byId("catalog-status");
  const emptyState = byId("empty-state");

  if (!container) {
    console.error("Der Produktcontainer #products fehlt.");
    return;
  }

  const filtered = getFilteredProducts();
  container.replaceChildren();

  filtered.forEach((product) => {
    container.appendChild(createProductCard(product));
  });

  if (status) {
    const countText = filtered.length === 1
      ? "1 Kerze gefunden"
      : `${filtered.length} Kerzen gefunden`;
    status.textContent = state.favoritesOnly
      ? `${countText} in deinen Favoriten`
      : countText;
  }

  if (emptyState) {
    emptyState.hidden = filtered.length !== 0;
  }

  container.hidden = filtered.length === 0;
}

/* ---------------------------------------------------------
   7. MOBILE NAVIGATION
   --------------------------------------------------------- */

function initNavigation() {
  const toggle = byId("menu-toggle");
  const nav = byId("primary-nav");

  if (!toggle || !nav) return;

  function closeMenu() {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Menü öffnen");
  }

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Menü schließen" : "Menü öffnen");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) closeMenu();
  });
}

/* ---------------------------------------------------------
   8. KONTAKTFORMULAR
   --------------------------------------------------------- */

function initContactForm() {
  const form = byId("contact-form");
  const status = byId("contact-status");

  if (!form || !status) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const emailInput = byId("customer-email");
    const messageInput = byId("customer-message");

    if (!emailInput || !messageInput) return;

    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    if (!email || !message) {
      status.textContent = "Bitte fülle beide Felder aus.";
      return;
    }

    if (!emailInput.checkValidity()) {
      status.textContent = "Bitte gib eine gültige E-Mail-Adresse ein.";
      emailInput.focus();
      return;
    }

    if (!SHOP_EMAIL || !SHOP_EMAIL.includes("@")) {
      status.textContent = "Die Kontaktadresse ist noch nicht richtig eingerichtet.";
      return;
    }

    const subject = encodeURIComponent("Nachricht über Kroizauber");
    const body = encodeURIComponent(
      `Kunden-E-Mail: ${email}\n\nNachricht:\n${message}`
    );

    status.textContent =
      "Dein E-Mail-Programm wird geöffnet. Bitte prüfe die Nachricht und sende sie dort ab.";

    window.location.href = `mailto:${SHOP_EMAIL}?subject=${subject}&body=${body}`;
  });
}

/* ---------------------------------------------------------
   9. SPIEL: KERZEN AUSPusten
   --------------------------------------------------------- */

const gameState = {
  running: false,
  startedAt: 0,
  deadline: 0,
  timerId: null,
  candles: [],
  score: 0,
  finished: false,
  lastAutomaticSecond: 0
};

const gameElements = {
  timer: byId("game-timer"),
  score: byId("game-score"),
  board: byId("candle-board"),
  timerBar: byId("timer-bar"),
  progress: byId("timer-progress"),
  instruction: byId("game-instruction"),
  result: byId("game-result"),
  resultTitle: byId("result-title"),
  resultDescription: byId("result-description"),
  coupon: byId("coupon-code"),
  copyButton: byId("copy-coupon"),
  startButton: byId("start-game")
};

function makeCandle(index) {
  return {
    id: index,
    out: false,
    playerBlown: false,
    button: null
  };
}

function createCandleButton(candle) {
  const button = createElement("button", "game-candle");
  button.type = "button";
  button.dataset.candleId = String(candle.id);
  button.setAttribute("aria-label", `Kerze ${candle.id + 1} auspusten`);

  const wax = createElement("span", "candle-wax");
  const flame = createElement("span", "candle-flame");
  flame.setAttribute("aria-hidden", "true");
  wax.appendChild(flame);

  const number = createElement("span", "candle-number", String(candle.id + 1));

  button.append(wax, number);
  button.addEventListener("click", () => playerBlowsCandle(candle.id));

  candle.button = button;
  updateCandleVisual(candle);

  return button;
}

function resetCandles() {
  const board = gameElements.board;
  if (!board) return;

  board.replaceChildren();
  gameState.candles = Array.from(
    { length: GAME_CANDLE_COUNT },
    (_, index) => makeCandle(index)
  );

  gameState.candles.forEach((candle) => {
    board.appendChild(createCandleButton(candle));
  });
}

function updateCandleVisual(candle) {
  const button = candle.button;
  if (!button) return;

  button.classList.toggle("is-out", candle.out);
  button.classList.toggle("was-blown", candle.playerBlown);
  button.disabled = candle.out || !gameState.running;

  const number = button.querySelector(".candle-number");

  if (number) {
    if (candle.playerBlown) {
      number.textContent = "✓";
    } else if (candle.out) {
      number.textContent = "Aus";
    } else {
      number.textContent = String(candle.id + 1);
    }
  }

  const status = candle.playerBlown
    ? "von dir ausgepustet"
    : candle.out
      ? "automatisch erloschen"
      : "brennt";

  button.setAttribute("aria-label", `Kerze ${candle.id + 1}: ${status}`);
}

function updateGameUI() {
  const remaining = Math.max(0, (gameState.deadline - Date.now()) / 1000);
  const seconds = Math.ceil(remaining);

  if (gameElements.timer) {
    gameElements.timer.textContent = String(seconds);
  }

  if (gameElements.score) {
    gameElements.score.textContent = String(gameState.score);
  }

  const percent = Math.max(0, Math.min(100, remaining / GAME_DURATION_SECONDS * 100));

  if (gameElements.timerBar) {
    gameElements.timerBar.style.width = `${percent}%`;
  }

  if (gameElements.progress) {
    gameElements.progress.setAttribute("aria-valuenow", String(seconds));
  }
}

function playerBlowsCandle(candleId) {
  if (!gameState.running || gameState.finished) return;

  const candle = gameState.candles[candleId];
  if (!candle || candle.out) return;

  candle.out = true;
  candle.playerBlown = true;
  gameState.score += 1;

  updateCandleVisual(candle);
  updateGameUI();

  if (gameElements.instruction) {
    gameElements.instruction.textContent =
      gameState.score === GAME_CANDLE_COUNT
        ? "Alle 20 Kerzen selbst ausgepustet — großartig!"
        : "Gut gemacht! Tippe auf die nächste brennende Kerze.";
  }

  if (gameState.score >= GAME_CANDLE_COUNT) {
    finishGame();
  }
}

function extinguishOneRandomCandle() {
  const candidates = gameState.candles.filter((candle) => !candle.out);
  if (candidates.length === 0) return;

  const index = Math.floor(Math.random() * candidates.length);
  const candle = candidates[index];

  candle.out = true;
  candle.playerBlown = false;

  updateCandleVisual(candle);

  if (gameElements.instruction) {
    gameElements.instruction.textContent =
      "Eine Kerze ist von selbst erloschen — tippe schnell auf die übrigen Flammen!";
  }
}

function rewardForScore(score) {
  if (score >= 20) {
    return {
      code: "MAX20",
      title: "Alle 20 Kerzen! Meisterhaft!",
      message: "Du hast jede Kerze selbst ausgepustet. Das ist die höchste Spielstufe!"
    };
  }

  if (score >= 15) {
    return {
      code: "ZABER15+",
      title: "Fantastisch gespielt!",
      message: `Du hast ${score} Kerzen selbst ausgepustet und die 15er-Stufe erreicht.`
    };
  }

  if (score >= 10) {
    return {
      code: "KRIZE10",
      title: "Sehr gut!",
      message: `Du hast ${score} Kerzen selbst ausgepustet und die 10er-Stufe erreicht.`
    };
  }

  if (score >= 5) {
    return {
      code: "FREE5",
      title: "Gut gemacht!",
      message: `Du hast ${score} Kerzen selbst ausgepustet und die 5er-Stufe erreicht.`
    };
  }

  return {
    code: "",
    title: "Versuche es noch einmal!",
    message: `Du hast ${score} Kerzen selbst ausgepustet. Für einen Spielcode brauchst du mindestens 5.`
  };
}

function finishGame() {
  if (gameState.finished) return;

  gameState.finished = true;
  gameState.running = false;

  if (gameState.timerId !== null) {
    window.clearInterval(gameState.timerId);
    gameState.timerId = null;
  }

  gameState.candles.forEach(updateCandleVisual);
  updateGameUI();

  const reward = rewardForScore(gameState.score);

  if (gameElements.resultTitle) {
    gameElements.resultTitle.textContent = reward.title;
  }

  if (gameElements.resultDescription) {
    gameElements.resultDescription.textContent = reward.message;
  }

  if (gameElements.coupon) {
    gameElements.coupon.textContent = reward.code || "KEIN CODE";
  }

  if (gameElements.copyButton) {
    gameElements.copyButton.disabled = !reward.code;
    gameElements.copyButton.dataset.code = reward.code;
    gameElements.copyButton.textContent = reward.code
      ? "Code kopieren"
      : "Noch einmal versuchen";
  }

  if (gameElements.result) {
    gameElements.result.hidden = false;
  }

  if (gameElements.instruction) {
    gameElements.instruction.textContent = "Das Spiel ist beendet. Möchtest du es erneut versuchen?";
  }

  if (gameElements.startButton) {
    gameElements.startButton.disabled = false;
    gameElements.startButton.innerHTML = 'Noch einmal spielen <span aria-hidden="true">↻</span>';
  }
}

function tickGame() {
  if (!gameState.running || gameState.finished) return;

  const now = Date.now();
  const elapsedSeconds = Math.floor((now - gameState.startedAt) / 1000);

  // Die Zeit wird über Zeitstempel gemessen, nicht durch das Zählen
  // der Intervalle. Das bleibt genauer, wenn ein Handy kurz pausiert.
  if (elapsedSeconds >= GAME_DURATION_SECONDS || now >= gameState.deadline) {
    finishGame();
    return;
  }

  // Pro vollständig vergangener Sekunde erlischt höchstens eine
  // zufällige noch brennende Kerze.
  while (gameState.lastAutomaticSecond < elapsedSeconds) {
    gameState.lastAutomaticSecond += 1;
    extinguishOneRandomCandle();
  }

  updateGameUI();
}

function startGame() {
  if (gameState.running) return;

  if (!gameElements.board || !gameElements.startButton) return;

  if (gameState.timerId !== null) {
    window.clearInterval(gameState.timerId);
    gameState.timerId = null;
  }

  gameState.running = true;
  gameState.finished = false;
  gameState.score = 0;
  gameState.startedAt = Date.now();
  gameState.deadline = gameState.startedAt + GAME_DURATION_SECONDS * 1000;
  gameState.lastAutomaticSecond = 0;

  if (gameElements.result) {
    gameElements.result.hidden = true;
  }

  if (gameElements.instruction) {
    gameElements.instruction.textContent =
      "Los geht's! Tippe auf die Flammen. Automatisch erloschene Kerzen geben keine Punkte.";
  }

  gameElements.startButton.disabled = true;
  gameElements.startButton.textContent = "Spiel läuft …";

  resetCandles();
  updateGameUI();

  gameState.timerId = window.setInterval(tickGame, 80);
}

function initGame() {
  if (!gameElements.board) return;

  resetCandles();

  // Vor dem Start sind alle 20 Kerzen zu sehen, aber noch keine
  // Kerze zählt als ausgepustet.
  gameState.running = false;
  gameState.candles.forEach(updateCandleVisual);
  updateGameUI();

  if (gameElements.startButton) {
    gameElements.startButton.addEventListener("click", startGame);
  }

  if (gameElements.copyButton) {
    gameElements.copyButton.addEventListener("click", async () => {
      const code = gameElements.copyButton.dataset.code;
      if (!code) return;

      try {
        await navigator.clipboard.writeText(code);
        gameElements.copyButton.textContent = "Kopiert ✓";
        showToast("Dein Spielcode wurde kopiert.");
      } catch (error) {
        // Fallback für Browser, die die Clipboard-API nicht erlauben.
        const helper = createElement("textarea");
        helper.value = code;
        helper.setAttribute("readonly", "");
        helper.style.position = "fixed";
        helper.style.opacity = "0";
        document.body.appendChild(helper);
        helper.select();

        let copied = false;

        try {
          copied = document.execCommand("copy");
        } catch (copyError) {
          copied = false;
        }

        helper.remove();

        if (copied) {
          gameElements.copyButton.textContent = "Kopiert ✓";
          showToast("Dein Spielcode wurde kopiert.");
        } else {
          showToast("Kopieren nicht möglich. Markiere den Code und kopiere ihn manuell.", "error");
        }
      }
    });
  }
}

/* ---------------------------------------------------------
   10. SUCHEN, SORTIEREN UND FILTER
   --------------------------------------------------------- */

function initCatalogControls() {
  const search = byId("product-search");
  const sort = byId("product-sort");
  const favoritesFilter = byId("favorites-filter");
  const favoritesShortcut = byId("favorites-shortcut");
  const reset = byId("reset-filters");

  if (search) {
    search.addEventListener("input", () => {
      state.searchQuery = search.value.trim();
      renderProducts();
    });
  }

  if (sort) {
    sort.addEventListener("change", () => {
      state.sortMode = sort.value;
      renderProducts();
    });
  }

  if (favoritesFilter) {
    favoritesFilter.addEventListener("click", () => {
      setFavoritesFilter(!state.favoritesOnly);
    });
  }

  if (favoritesShortcut) {
    favoritesShortcut.addEventListener("click", () => {
      setFavoritesFilter(!state.favoritesOnly);
      const catalog = byId("products");
      if (catalog) {
        byId("products").scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  if (reset) {
    reset.addEventListener("click", () => {
      state.searchQuery = "";
      state.sortMode = "featured";
      state.favoritesOnly = false;

      if (search) search.value = "";
      if (sort) sort.value = "featured";

      setFavoritesFilter(false);
      renderProducts();
    });
  }
}

/* ---------------------------------------------------------
   12. SCROLL-EFFEKTE
   --------------------------------------------------------- */

function initRevealAnimations() {
  const reducedMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reducedMotion || !("IntersectionObserver" in window)) {
    $$(".reveal").forEach((element) => element.classList.add("is-visible"));
    return;
  }

  document.documentElement.classList.add("js-motion");

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      currentObserver.unobserve(entry.target);
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -25px 0px"
  });

  $$(".reveal").forEach((element) => observer.observe(element));
}

/* ---------------------------------------------------------
   13. FOOTER-JAHR
   --------------------------------------------------------- */

function updateFooterYear() {
  const year = byId("year");
  if (year) year.textContent = String(new Date().getFullYear());
}

/* ---------------------------------------------------------
   14. MINI-SPIEL: KERZENSTUDIO / KREATION
   --------------------------------------------------------- */
function initCandleDesigner() {
  const color = byId("designer-color");
  const scent = byId("designer-scent");
  const shape = byId("designer-shape");
  const wax = byId("designer-wax");
  const preview = byId("designer-preview");
  const summary = byId("designer-summary");
  const randomButton = byId("designer-random");
  if (!color || !scent || !shape || !wax || !preview || !summary || !randomButton) return;
  const shapeClasses = ["classic", "round", "slim"];
  function update() {
    wax.style.background = color.value;
    preview.classList.remove(...shapeClasses.map((name) => `shape-${name}`));
    preview.classList.add(`shape-${shape.value}`);
    const colorName = color.options[color.selectedIndex].text;
    summary.textContent = `Deine Idee: ${colorName}farbene ${shape.options[shape.selectedIndex].text.toLowerCase()}e Kerze mit ${scent.value}duft.`;
  }
  [color, scent, shape].forEach((control) => control.addEventListener("change", update));
  randomButton.addEventListener("click", () => {
    color.selectedIndex = Math.floor(Math.random() * color.options.length);
    scent.selectedIndex = Math.floor(Math.random() * scent.options.length);
    shape.selectedIndex = Math.floor(Math.random() * shape.options.length);
    update();
    showToast("Neue Kerzenidee erstellt!");
  });
  update();
}

/* ---------------------------------------------------------
   14. INITIALISIERUNG
   --------------------------------------------------------- */

function initializeSite() {
  renderProducts();
  updateFavoritesCount();

  initNavigation();
  initContactForm();
  initGame();
  initCandleDesigner();
  initCatalogControls();
  initRevealAnimations();
  updateFooterYear();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeSite, { once: true });
} else {
  initializeSite();
}

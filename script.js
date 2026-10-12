"use strict";

function setupKerzenspiel() {
  let spiel = document.getElementById("candleGame");

  if (!spiel) {
    spiel = document.createElement("section");
    spiel.id = "candleGame";
    spiel.className = "candle-game";

    const footer = document.querySelector("footer, .footer");

    if (footer) {
      footer.parentNode.insertBefore(spiel, footer);
    } else {
      document.body.appendChild(spiel);
    }
  }

  spiel.innerHTML = `
    <h2>🕯️ Das Kerzenspiel</h2>
    <p>
      Du hast 15 Sekunden Zeit!
      Wenn eine Kerze ausgeht, klicke sie an,
      um sie wieder anzuzünden.
      Halte alle 20 Kerzen am Brennen!
    </p>

    <div class="game-stats">
      <div class="stat">
        ⏱️ Zeit: <span id="gameTime">15</span> Sek.
      </div>
      <div class="stat">
        🔥 Brennende Kerzen:
        <span id="gameLit">20</span>/20
      </div>
    </div>

    <div class="game-candles" id="gameCandles"></div>

    <p class="game-message" id="gameMessage" aria-live="polite">
      Klicke auf „Spiel starten“!
    </p>

    <button class="game-button" id="startCandleGame" type="button">
      Spiel starten
    </button>
  `;

  const kerzenFeld = spiel.querySelector("#gameCandles");
  const zeitAnzeige = spiel.querySelector("#gameTime");
  const anzahlAnzeige = spiel.querySelector("#gameLit");
  const nachricht = spiel.querySelector("#gameMessage");
  const startKnopf = spiel.querySelector("#startCandleGame");

  const anzahlKerzen = 20;
  const spielDauer = 15;

  let kerzen = [];
  let laeuft = false;
  let endZeit = 0;
  let zeitIntervall;
  let loeschIntervall;

  function timerStoppen() {
    clearInterval(zeitIntervall);
    clearInterval(loeschIntervall);
  }

  function anzeigen() {
    kerzenFeld.replaceChildren();

    kerzen.forEach((kerze, index) => {
      const knopf = document.createElement("button");

      knopf.type = "button";
      knopf.className = "game-candle";
      knopf.textContent = kerze.brennt ? "🕯️" : "🌫️";
      knopf.setAttribute(
        "aria-label",
        `Kerze ${index + 1}: ${kerze.brennt ? "brennt" : "aus"}`
      );

      if (!kerze.brennt) {
        knopf.classList.add("off");
      }

      knopf.addEventListener("click", () => {
        if (!laeuft || kerze.brennt) return;

        kerze.brennt = true;
        anzeigen();
        statistikAktualisieren();
      });

      kerzenFeld.appendChild(knopf);
    });
  }

  function statistikAktualisieren() {
    zeitAnzeige.textContent = String(
      Math.max(0, Math.ceil((endZeit - Date.now()) / 1000))
    );

    anzahlAnzeige.textContent = String(
      kerzen.filter((kerze) => kerze.brennt).length
    );
  }

  function zufaelligeKerzeLoeschen() {
    if (!laeuft) return;

    const brennendeKerzen = kerzen.filter((kerze) => kerze.brennt);

    if (brennendeKerzen.length === 0) return;

    const zufall = Math.floor(Math.random() * brennendeKerzen.length);
    brennendeKerzen[zufall].brennt = false;

    anzeigen();
    statistikAktualisieren();
  }

  function spielBeenden() {
    if (!laeuft) return;

    laeuft = false;
    timerStoppen();

    const alleBrennen = kerzen.every((kerze) => kerze.brennt);

    nachricht.textContent = alleBrennen
      ? "🎉 Gewonnen! Alle 20 Kerzen brennen!"
      : "⏰ Die Zeit ist um! Versuch es noch einmal.";

    startKnopf.textContent = "Noch einmal spielen";
    statistikAktualisieren();
  }

  function spielStarten() {
    timerStoppen();

    kerzen = Array.from(
      { length: anzahlKerzen },
      () => ({ brennt: true })
    );

    laeuft = true;
    endZeit = Date.now() + spielDauer * 1000;

    nachricht.textContent = "Schnell! Zünde die Kerzen wieder an!";
    startKnopf.textContent = "Spiel läuft …";

    anzeigen();
    statistikAktualisieren();

    loeschIntervall = setInterval(zufaelligeKerzeLoeschen, 3000);

    zeitIntervall = setInterval(() => {
      statistikAktualisieren();

      if (Date.now() >= endZeit) {
        spielBeenden();
      }
    }, 100);
  }

  startKnopf.addEventListener("click", spielStarten);

  kerzen = Array.from(
    { length: anzahlKerzen },
    () => ({ brennt: true })
  );

  anzeigen();
  statistikAktualisieren();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupKerzenspiel);
} else {
  setupKerzenspiel();
}

* {
  box-sizing: border-box;
}

:root {
  --cream: #fbf6ef;
  --white: #fffdf9;
  --rose: #a76c70;
  --rose-dark: #875155;
  --text: #382f2c;
  --muted: #81736d;
  --line: #eadfd5;
}

html {
  scroll-behavior: smooth;
  scroll-padding-top: 20px;
}

body {
  margin: 0;
  background: var(--cream);
  color: var(--text);
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.6;
}

a {
  color: inherit;
  text-decoration: none;
}

button,
input,
textarea {
  font: inherit;
}

button {
  -webkit-tap-highlight-color: transparent;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 20px 7%;
  background: var(--white);
  border-bottom: 1px solid var(--line);
}

.logo {
  font-family: Georgia, serif;
  font-size: 27px;
  font-weight: bold;
  white-space: nowrap;
}

.logo span {
  color: var(--rose);
}

.header nav {
  display: flex;
  justify-content: center;
  gap: 18px;
  flex-wrap: wrap;
}

.header nav a {
  color: var(--muted);
  font-size: 14px;
}

.header nav a:hover {
  color: var(--rose);
}

/* Typography */
h1,
h2,
h3 {
  font-family: Georgia, "Times New Roman", serif;
  line-height: 1.2;
}

/* Hero */
.hero {
  position: relative;
  overflow: hidden;
  min-height: 420px;
  display: flex;
  align-items: center;
  padding: 70px 10%;
  background: linear-gradient(120deg, #f7e9df, #ead4cb);
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 620px;
}

.eyebrow {
  color: var(--rose);
  font-size: 11px;
  font-weight: bold;
  letter-spacing: 2px;
}

h1 {
  margin: 15px 0;
  font-size: clamp(38px, 6vw, 64px);
}

h1 span {
  color: var(--rose);
}

.hero-content > p:not(.eyebrow) {
  max-width: 450px;
  color: #695953;
}

.hero-symbol {
  position: absolute;
  right: 12%;
  top: 15%;
  color: rgba(167, 108, 112, 0.22);
  font-size: 230px;
}

/* Buttons */
.button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 13px 22px;
  margin-top: 15px;
  border: none;
  border-radius: 7px;
  background: var(--rose);
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}

.button:hover {
  background: var(--rose-dark);
  transform: translateY(-2px);
}

.button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  transform: none;
}

/* Sections */
.section {
  padding: 70px 7%;
}

.section-heading {
  max-width: 650px;
  margin: 0 auto 38px;
  text-align: center;
}

.section-heading h2,
.about h2 {
  margin: 10px 0;
  font-size: clamp(29px, 4vw, 40px);
}

.section-heading > p:last-child {
  color: var(--muted);
}

/* Products */
.products-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
  max-width: 1200px;
  margin: auto;
}

.product-card {
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--white);
  box-shadow: 0 5px 18px rgba(70, 45, 35, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 25px rgba(70, 45, 35, 0.1);
}

.product-image {
  height: 230px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: var(--product-bg, #eee1d1);
}

.product-image img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  position: absolute;
  bottom: 8px;
  left: 8px;
  right: 8px;
  padding: 5px 9px;
  border-radius: 5px;
  background: rgba(255, 253, 249, 0.9);
  color: #695953;
  font-size: 11px;
}

.candle-art {
  position: relative;
  width: 88px;
  height: 135px;
  border-radius: 8px 8px 13px 13px;
  background: var(--wax, #f2d9b9);
  box-shadow: 8px 12px 22px rgba(90, 60, 40, 0.14);
}

.candle-art::before {
  content: "";
  position: absolute;
  top: -5px;
  left: 0;
  width: 100%;
  height: 12px;
  border-radius: 50%;
  background: var(--wax, #f2d9b9);
}

.candle-art::after {
  content: "";
  position: absolute;
  top: -28px;
  left: 40px;
  width: 8px;
  height: 23px;
  border-radius: 70% 30% 60% 40%;
  background: #d79a55;
  box-shadow: 0 0 18px 7px rgba(239, 173, 89, 0.3);
}

.product-info {
  padding: 20px;
}

.product-info h3 {
  margin: 0 0 8px;
  font-size: 23px;
  overflow-wrap: anywhere;
}

.description {
  min-height: 44px;
  color: var(--muted);
  font-size: 14px;
}

.product-price {
  margin: 15px 0;
  font-size: 21px;
  font-weight: bold;
}

.product-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.product-actions .button {
  width: 100%;
  margin: 0;
  text-align: center;
}

.button-secondary {
  width: 100%;
  padding: 11px;
  border: 1px solid var(--line);
  border-radius: 7px;
  background: transparent;
  color: var(--text);
  font-weight: bold;
  cursor: pointer;
}

.button-secondary:hover {
  background: #f5ece4;
}

.cart-status {
  margin: 5px 0;
  color: var(--rose-dark);
  font-size: 13px;
}

/* About */
.about {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 35px;
  padding: 65px 10%;
  background: #f0e6db;
}

.about > div:last-child {
  max-width: 620px;
}

.about-icon {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 100px;
  height: 100px;
  border: 1px solid #cba9a1;
  border-radius: 50%;
  color: var(--rose);
  font-family: Georgia, serif;
  font-size: 54px;
}

.about p:last-child {
  color: var(--muted);
}

/* Contact */
.contact {
  background: var(--white);
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 550px;
  margin: auto;
}

.contact-form label {
  margin-top: 8px;
  font-size: 14px;
  font-weight: bold;
}

.contact-form input,
.contact-form textarea {
  width: 100%;
  padding: 13px;
  border: 1px solid var(--line);
  border-radius: 7px;
  background: white;
  color: var(--text);
}

.contact-form input:focus,
.contact-form textarea:focus {
  outline: 2px solid #d9afb0;
}

.contact-form .button {
  width: 100%;
}

.form-note,
#contact-status {
  color: var(--muted);
  font-size: 12px;
}

/* Candle game */
.candle-game {
  width: calc(100% - 32px);
  max-width: 700px;
  margin: 55px auto;
  padding: 35px 20px;
  background: var(--white);
  border: 1px solid var(--line);
  border-radius: 18px;
  box-shadow: 0 8px 25px rgba(70, 45, 35, 0.08);
  text-align: center;
}

.game-heading h2 {
  margin: 10px 0;
  font-size: clamp(27px, 5vw, 38px);
}

.game-heading > p {
  color: var(--muted);
}

.game-heading .eyebrow {
  color: var(--rose);
}

.game-instructions {
  max-width: 480px;
  margin: 15px auto;
  font-size: 14px;
}

.game-stats {
  display: flex;
  justify-content: center;
  gap: 35px;
  margin: 25px 0;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 5px;
  color: var(--muted);
  font-size: 13px;
}

.stat strong {
  color: var(--rose-dark);
  font-size: 25px;
}

/* 20 candles, centered */
.game-candles {
  display: grid;
  grid-template-columns: repeat(5, 52px);
  justify-content: center;
  align-items: center;
  gap: 24px 14px;
  width: 100%;
  max-width: 420px;
  margin: 35px auto;
}

.game-candle {
  position: relative;
  display: block;
  width: 52px;
  height: 76px;
  margin-top: 18px;
  padding: 0;
  border: 1px solid #e5cbb0;
  border-radius: 8px 8px 5px 5px;
  background: linear-gradient(90deg, #e8cba9, #fff0d8, #e8cba9);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  touch-action: manipulation;
  transition: background 0.15s, transform 0.15s;
}

.game-candle::before {
  content: "";
  position: absolute;
  top: -20px;
  left: 21px;
  width: 9px;
  height: 17px;
  border-radius: 80% 20% 60% 40%;
  background: #f3a743;
  box-shadow: 0 0 12px 4px rgba(243, 167, 67, 0.4);
  animation: candle-flicker 1.2s infinite alternate;
}

.game-candle:active {
  transform: scale(0.94);
}

.game-candle.off {
  background: #d8d0c8;
  border-color: #c7bdb3;
  box-shadow: none;
}

.game-candle.off::before {
  display: none;
}

.game-candle:disabled {
  cursor: default;
}

.game-candle:focus-visible {
  outline: 3px solid var(--rose);
  outline-offset: 4px;
}

@keyframes candle-flicker {
  from {
    transform: rotate(-4deg) scale(0.95);
  }

  to {
    transform: rotate(4deg) scale(1.05);
  }
}

.game-message {
  min-height: 48px;
  margin: 20px auto 5px;
  color: var(--rose-dark);
  font-weight: bold;
}

.game-button {
  min-width: 180px;
}

/* Footer */
.footer {
  padding: 35px 7%;
  background: #352c29;
  color: #f7eee7;
  text-align: center;
}

.footer-logo span {
  color: #d6a3a1;
}

.footer p {
  color: #d1c1b8;
  font-size: 13px;
}

.footer-links {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  margin: 20px 0;
  font-size: 13px;
}

.footer-links a:hover {
  color: #e6b9b4;
}

/* Tablets */
@media (max-width: 850px) {
  .products-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .header {
    padding: 18px 5%;
  }

  .header nav {
    gap: 12px;
  }
}

/* Phones */
@media (max-width: 580px) {
  .header {
    flex-direction: column;
    gap: 12px;
  }

  .header nav {
    justify-content: center;
    gap: 10px 15px;
  }

  .hero {
    min-height: 380px;
    padding: 55px 7%;
  }

  .hero-symbol {
    right: 0;
    top: 45%;
    font-size: 130px;
  }

  .section {
    padding: 45px 5%;
  }

  .products-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .product-image {
    height: 250px;
  }

  .about {
    flex-direction: column;
    padding: 45px 7%;
    text-align: center;
  }

  .candle-game {
    width: calc(100% - 24px);
    margin: 35px auto;
    padding: 28px 10px;
  }

  .game-stats {
    gap: 20px;
  }

  .game-stats .stat {
    max-width: 45%;
  }

  .game-candles {
    grid-template-columns: repeat(4, 48px);
    gap: 22px 12px;
    max-width: 260px;
  }

  .game-candle {
    width: 48px;
    height: 68px;
  }

  .game-candle::before {
    left: 19px;
  }
}

@media (max-width: 340px) {
  .game-candles {
    grid-template-columns: repeat(4, 42px);
    gap: 20px 8px;
    max-width: 192px;
  }

  .game-candle {
    width: 42px;
    height: 62px;
  }

  .game-candle::before {
    left: 16px;
  }

  .game-stats {
    gap: 10px;
  }
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

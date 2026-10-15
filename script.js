'use strict';

/* KROIZAUBER – Produktdaten und Funktionen.
   E-Mail und Produktlinks kannst du in diesem Bereich bearbeiten. */
const SHOP_EMAIL = 'tatansavenok35@gmail.com';
const STORAGE_KEYS = { cart: 'kroizauber-cart-v2', favorites: 'kroizauber-favorites-v2', best: 'kroizauber-click-best-v1' };
const products = [
  { id:'rosengarten', name:'Rosengarten', price:5.00, description:'Ein sanfter Lichtblick für entspannte Momente.', image:'https://cdn.phototourl.com/member/2026-10-11-30ded1ea-9bc2-468d-a1b1-cd329c2d48d1.jpg', link:'https://www.vinted.de/items/10334352328-handgemachte-bienenwachskerze-in-herzform-100-natur-honig-blutenduft', bg:'#eee1d1', wax:'#f2d9b9', category:'Blumig', badge:'Beliebt' },
  { id:'waimachzbaum', name:'Weihnachtsbaum', price:5.00, description:'Für gemütliche Pausen und kleine Auszeiten.', image:'https://i.postimg.cc/qB3nQ2mk/zobrazenna-viber-2026-10-11-15-15-51-119.jpg', link:'https://www.vinted.de/items/10334202599-handgemachte-kerze-weihnachtsbaum-aus-naturlichem-wachs', bg:'#f0dedc', wax:'#e6b9b4', category:'Saisonal', badge:'Besonders' },
  { id:'honig-standart', name:'Honig Standard', price:5.00, description:'Ein Hauch von Wärme für dein Zuhause.', image:'https://cdn.phototourl.com/member/2026-10-11-b09e7873-ad7d-431a-bc4e-f513ccc83777.jpg', link:'https://www.vinted.de/items/10334260225-handgemachte-bienenwachskerze-100-naturlich-honigduft', bg:'#e3e7d9', wax:'#d2d9c4', category:'Natürlich', badge:'Natürlich' },
  { id:'golden-abent-metal', name:'Golden Abend Metal', price:5.00, description:'Ein romantischer Akzent für besondere Momente.', image:'https://cdn.phototourl.com/member/2026-10-11-4f892ae9-3896-40de-a1ec-c3a6d1fe6815.jpg', link:'https://www.vinted.de/items/10334499362-handgemachte-bienenwachskerze-100-natur-pur', bg:'#efe4c9', wax:'#ead5a4', category:'Elegant', badge:'Elegant' },
  { id:'waldzauber', name:'Waldzauber', price:5.00, description:'Inspiriert von der Schönheit der Natur.', image:'https://cdn.phototourl.com/member/2026-10-11-ad0133de-9829-4d8d-8654-8f77fcb8074a.jpg', link:'https://www.vinted.de/items/10334444539-handgemachte-kerze-aus-100-naturlichem-bienenwachs', bg:'#eadfe9', wax:'#d8c1d9', category:'Natürlich', badge:'Natur' },
  { id:'goldener-abend', name:'Goldener Abend', price:5.00, description:'Ein warmes Licht für entspannte Abende.', image:'https://cdn.phototourl.com/member/2026-10-11-b09e7873-ad7d-431a-bc4e-f513ccc83777.jpg', link:'https://buy.stripe.com/test_00w9AUa22aRl4NkcaV00009', bg:'#f0e0d4', wax:'#e6bfa9', category:'Abend', badge:'Stimmungsvoll' }
];

const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
const euro = amount => new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR'}).format(amount);
const safeRead = (key, fallback) => { try { const value=JSON.parse(localStorage.getItem(key)); return value ?? fallback; } catch { return fallback; } };
let cart = safeRead(STORAGE_KEYS.cart, {});
let favorites = new Set(safeRead(STORAGE_KEYS.favorites, []));
let activeCategory = 'Alle';
let favoritesOnly = false;
let searchTerm = '';
let sortMode = 'featured';
let toastTimer;

function showToast(message) {
  const region=$('#toast-region'); if(!region) return;
  region.textContent=message; region.classList.add('show');
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>region.classList.remove('show'),2600);
}
function saveCart(){ try{localStorage.setItem(STORAGE_KEYS.cart,JSON.stringify(cart));}catch{} }
function saveFavorites(){ try{localStorage.setItem(STORAGE_KEYS.favorites,JSON.stringify([...favorites]));}catch{} }
function productById(id){return products.find(product=>product.id===id);}
function validImage(url){return typeof url==='string' && /^https:\/\//i.test(url);}

function renderProducts(){
  const grid=$('#products'); if(!grid) return;
  let list=products.filter(product=>{
    const matchesCategory=activeCategory==='Alle'||product.category===activeCategory;
    const haystack=`${product.name} ${product.description} ${product.category} ${product.badge}`.toLocaleLowerCase('de-DE');
    return matchesCategory && haystack.includes(searchTerm.toLocaleLowerCase('de-DE')) && (!favoritesOnly||favorites.has(product.id));
  });
  if(sortMode==='price-asc') list.sort((a,b)=>a.price-b.price||a.name.localeCompare(b.name,'de'));
  if(sortMode==='price-desc') list.sort((a,b)=>b.price-a.price||a.name.localeCompare(b.name,'de'));
  if(sortMode==='name') list.sort((a,b)=>a.name.localeCompare(b.name,'de'));
  grid.innerHTML=list.map(product=>{
    const isFav=favorites.has(product.id);
    const image=validImage(product.image)?`<img class="product-image" src="${product.image}" alt="${escapeHtml(product.name)} – handgemachte Kerze" loading="lazy" data-product-image="${product.id}">`:`<div class="product-image-fallback"><div class="fallback-candle"></div><span class="fallback-caption">Kroizauber</span></div>`;
    return `<article class="product-card" style="--product-bg:${product.bg}">
      <div class="product-image-wrap"><a href="#kontakt" class="product-image-link" data-image-product="${product.id}" aria-label="Mehr über ${escapeHtml(product.name)} erfahren">${image}</a><span class="product-badge">${escapeHtml(product.badge)}</span><button class="favorite-button ${isFav?'is-favorite':''}" data-favorite="${product.id}" aria-label="${isFav?'Aus Favoriten entfernen':'Zu Favoriten hinzufügen'}" aria-pressed="${isFav}">${isFav?'♥':'♡'}</button><div class="product-quick-add"><button class="button" data-add="${product.id}">＋ In den Warenkorb</button></div></div>
      <div class="product-info"><div class="product-meta"><span class="product-category">${escapeHtml(product.category)}</span><span class="product-price">${euro(product.price)}</span></div><h3>${escapeHtml(product.name)}</h3><p>${escapeHtml(product.description)}</p><div class="product-bottom"><button class="button button-dark" data-add="${product.id}">In den Warenkorb <span>＋</span></button><a class="vinted-link" href="${escapeAttr(product.link)}" target="_blank" rel="noopener noreferrer">${product.id==='goldener-abend'?'Kaufseite öffnen':'Auf Vinted ansehen'} ↗</a></div></div>
    </article>`;
  }).join('');
  $$('.product-image',grid).forEach(img=>img.addEventListener('error',()=>{
    const product=productById(img.dataset.productImage); if(!product||img.dataset.fallback==='1') return;
    img.dataset.fallback='1'; const wrap=img.closest('.product-image-wrap');
    const fallback=document.createElement('div'); fallback.className='product-image-fallback'; fallback.innerHTML='<div class="fallback-candle"></div><span class="fallback-caption">Kroizauber</span>';
    img.replaceWith(fallback);
  },{once:true}));
  $('#catalog-status').textContent=list.length===0?'Keine passenden Kerzen gefunden.':`${list.length} ${list.length===1?'liebevoll gestaltete Kerze':'liebevoll gestaltete Kerzen'} ${favoritesOnly?'in deinen Favoriten':'für dich entdeckt'}.`;
  $('#empty-state').hidden=list.length!==0; grid.hidden=list.length===0;
  $('#favorites-count').textContent=String(favorites.size);
  $('#favorites-filter').setAttribute('aria-pressed',String(favoritesOnly));
}
function escapeHtml(value){return String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));}
function escapeAttr(value){return escapeHtml(value);}

function addToCart(id){const product=productById(id);if(!product)return;cart[id]=Math.min(99,(Number(cart[id])||0)+1);saveCart();renderCart();showToast(`${product.name} wurde hinzugefügt.`);}
function changeQuantity(id,delta){if(!cart[id])return;cart[id]=Math.max(0,Math.min(99,(Number(cart[id])||0)+delta));if(cart[id]===0)delete cart[id];saveCart();renderCart();}
function removeFromCart(id){delete cart[id];saveCart();renderCart();showToast('Artikel entfernt.');}
function cartEntries(){return Object.entries(cart).map(([id,qty])=>({product:productById(id),qty:Number(qty)||0})).filter(entry=>entry.product&&entry.qty>0);}
function renderCart(){
  const entries=cartEntries(); const count=entries.reduce((sum,item)=>sum+item.qty,0);const subtotal=entries.reduce((sum,item)=>sum+item.product.price*item.qty,0);
  $('#cart-count').textContent=String(count);$('#cart-title-count').textContent=`(${count})`;$('#cart-subtotal').textContent=euro(subtotal);
  $('#cart-empty').hidden=count>0;$('#cart-footer').hidden=count===0;
  $('#cart-items').innerHTML=entries.map(({product,qty})=>`<article class="cart-item"><img class="cart-item-image" src="${escapeAttr(product.image)}" alt="${escapeHtml(product.name)}" onerror="this.style.visibility='hidden'"><div><h3>${escapeHtml(product.name)}</h3><div class="cart-item-price">${euro(product.price)} pro Stück</div><div class="quantity-controls"><button data-quantity="${product.id}" data-delta="-1" aria-label="Ein Stück ${escapeHtml(product.name)} entfernen">−</button><span>${qty}</span><button data-quantity="${product.id}" data-delta="1" aria-label="Ein Stück ${escapeHtml(product.name)} hinzufügen">＋</button></div></div><div class="cart-item-end"><strong class="cart-item-total">${euro(product.price*qty)}</strong><button class="remove-item" data-remove="${product.id}">Entfernen</button></div></article>`).join('');
}
function openCart(){ $('#cart-panel').classList.add('is-open');$('#cart-panel').setAttribute('aria-hidden','false');$('#page-scrim').classList.add('is-visible');document.body.classList.add('no-scroll');$('#cart-close').focus(); }
function closeCart(){ $('#cart-panel').classList.remove('is-open');$('#cart-panel').setAttribute('aria-hidden','true');$('#page-scrim').classList.remove('is-visible');document.body.classList.remove('no-scroll'); }
function prepareOrder(){
  const entries=cartEntries();
  if(!entries.length){showToast('Dein Warenkorb ist noch leer.');return;}
  const emailField=$('#checkout-email');
  const customerEmail=emailField.value.trim();
  if(!customerEmail){showToast('Bitte gib deine E-Mail-Adresse ein.');emailField.focus();return;}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)){showToast('Bitte gib eine gültige E-Mail-Adresse ein, z. B. name@gmail.com.');emailField.focus();return;}
  const subtotal=entries.reduce((sum,item)=>sum+item.product.price*item.qty,0);
  const lines=entries.map(({product,qty})=>`- ${product.name} x ${qty} = ${euro(product.price*qty)}\n  Produktseite: ${product.link}`).join('\n\n');
  const subject='Bestellanfrage – Kroizauber';
  const body=`Hallo Kroizauber,\n\nich möchte gerne eine unverbindliche Bestellanfrage stellen:\n\n${lines}\n\nZwischensumme: ${euro(subtotal)}\nVersand: bitte noch mitteilen\nMeine E-Mail: ${customerEmail}\n\nBitte teilt mir mit, ob die Artikel verfügbar sind, wie hoch die Versandkosten sind und wie die Zahlung erfolgen kann.\n\nViele Grüße`;
  $('#order-text').value=`An: ${SHOP_EMAIL}\nBetreff: ${subject}\n\n${body}`;
  const gmailUrl=`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(SHOP_EMAIL)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  $('#open-gmail').href=gmailUrl;
  $('#order-help').hidden=false;
  $('#order-help').scrollIntoView({behavior:'smooth',block:'nearest'});
  showToast('Anfrage vorbereitet. Wähle „Gmail öffnen“ oder kopiere den Text.');
}

function initShop(){
  renderProducts();renderCart();$('#contact-email-display').textContent=SHOP_EMAIL;$('#current-year').textContent=String(new Date().getFullYear());
  $('#products').addEventListener('click',event=>{
    const add=event.target.closest('[data-add]');if(add){addToCart(add.dataset.add);return;}
    const fav=event.target.closest('[data-favorite]');if(fav){const id=fav.dataset.favorite;if(favorites.has(id))favorites.delete(id);else favorites.add(id);saveFavorites();renderProducts();showToast(favorites.has(id)?'Zu Favoriten hinzugefügt.':'Aus Favoriten entfernt.');return;}
  });
  $('#product-search').addEventListener('input',event=>{searchTerm=event.target.value.trim();renderProducts();});
  $('#product-sort').addEventListener('change',event=>{sortMode=event.target.value;renderProducts();});
  $('#category-filters').addEventListener('click',event=>{const button=event.target.closest('[data-category]');if(!button)return;activeCategory=button.dataset.category;$$('.filter-chip').forEach(chip=>chip.classList.toggle('active',chip===button));renderProducts();});
  $('#favorites-filter').addEventListener('click',()=>{favoritesOnly=!favoritesOnly;renderProducts();$('#shop').scrollIntoView({behavior:'smooth'});if(favoritesOnly)showToast('Deine Favoriten werden angezeigt.');});
  $('#reset-filters').addEventListener('click',()=>{activeCategory='Alle';searchTerm='';sortMode='featured';favoritesOnly=false;$('#product-search').value='';$('#product-sort').value='featured';$$('.filter-chip').forEach(chip=>chip.classList.toggle('active',chip.dataset.category==='Alle'));renderProducts();});
  $('#cart-toggle').addEventListener('click',openCart);$('#cart-close').addEventListener('click',closeCart);$('#page-scrim').addEventListener('click',closeCart);$('#continue-shopping').addEventListener('click',()=>{closeCart();$('#shop').scrollIntoView({behavior:'smooth'});});
  $('#cart-items').addEventListener('click',event=>{const qty=event.target.closest('[data-quantity]');if(qty){changeQuantity(qty.dataset.quantity,Number(qty.dataset.delta));return;}const remove=event.target.closest('[data-remove]');if(remove)removeFromCart(remove.dataset.remove);});
  $('#cart-clear').addEventListener('click',()=>{cart={};saveCart();renderCart();$('#order-help').hidden=true;showToast('Warenkorb geleert.');});$('#cart-checkout').addEventListener('click',prepareOrder);$('#copy-order').addEventListener('click',async()=>{const text=$('#order-text').value;try{await navigator.clipboard.writeText(text);showToast('Bestelltext kopiert. Füge ihn in eine E-Mail ein.');}catch{const field=$('#order-text');field.focus();field.select();try{document.execCommand('copy');showToast('Bestelltext markiert. Kopiere ihn und füge ihn in eine E-Mail ein.');}catch{showToast('Bitte markiere den Text und kopiere ihn manuell.');}}});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeCart();closeMobileMenu();}});
  $('#menu-toggle').addEventListener('click',()=>{const nav=$('#primary-nav');const open=nav.classList.toggle('is-open');$('#menu-toggle').setAttribute('aria-expanded',String(open));$('#menu-toggle').setAttribute('aria-label',open?'Menü schließen':'Menü öffnen');});
  $$('#primary-nav a').forEach(link=>link.addEventListener('click',closeMobileMenu));
  $('#contact-form').addEventListener('submit',event=>{event.preventDefault();const email=$('#customer-email').value.trim();const message=$('#customer-message').value.trim();if(!email||!message)return;const subject=encodeURIComponent('Nachricht über Kroizauber');const body=encodeURIComponent(`Hallo Kroizauber,\n\n${message}\n\nMeine E-Mail-Adresse: ${email}`);$('#contact-status').textContent='Dein E-Mail-Programm wird geöffnet. Bitte sende die Nachricht dort selbst ab.';window.location.href=`mailto:${SHOP_EMAIL}?subject=${subject}&body=${body}`;});
}
function closeMobileMenu(){const nav=$('#primary-nav');if(!nav)return;nav.classList.remove('is-open');$('#menu-toggle').setAttribute('aria-expanded','false');$('#menu-toggle').setAttribute('aria-label','Menü öffnen');}

/* SPIEL 1: Sterne in 20 Sekunden anklicken. */
let gameActive=false,gameScore=0,gameTime=20,gameInterval=null,spawnTimeout=null;
let gameBest=Number(safeRead(STORAGE_KEYS.best,0))||0;
function updateGameStats(){$('#click-score').textContent=String(gameScore);$('#click-time').textContent=String(gameTime);$('#click-best').textContent=String(gameBest);}
function spawnTarget(){if(!gameActive)return;const arena=$('#click-arena');arena.querySelector('.arena-start')?.remove();const target=document.createElement('button');target.className='light-target';target.type='button';target.textContent=['✦','✧','✺','☼','✷'][Math.floor(Math.random()*5)];target.setAttribute('aria-label','Lichtpunkt einsammeln');const maxX=Math.max(0,arena.clientWidth-44),maxY=Math.max(0,arena.clientHeight-44);target.style.left=`${Math.random()*maxX}px`;target.style.top=`${Math.random()*maxY}px`;target.addEventListener('click',()=>{if(!gameActive)return;gameScore++;updateGameStats();target.remove();spawnTarget();});arena.appendChild(target);clearTimeout(spawnTimeout);spawnTimeout=setTimeout(()=>{target.remove();if(gameActive&&!arena.querySelector('.light-target'))spawnTarget();},1100);}
function endGame(){gameActive=false;clearInterval(gameInterval);clearTimeout(spawnTimeout);$('#click-arena').innerHTML=`<div class="arena-start"><span>${gameScore>=10?'✦':'☼'}</span><strong>${gameScore>=10?'Wunderbar gesammelt!':'Gut gemacht!'}</strong><small>Du hast ${gameScore} Lichtpunkte gesammelt.</small></div>`;$('#click-start').textContent='Noch einmal spielen';$('#click-message').textContent=gameScore>gameBest?'Neuer Bestwert!':'Lust auf eine neue Runde?';if(gameScore>gameBest){gameBest=gameScore;try{localStorage.setItem(STORAGE_KEYS.best,JSON.stringify(gameBest));}catch{}}updateGameStats();}
function startGame(){clearInterval(gameInterval);clearTimeout(spawnTimeout);gameActive=true;gameScore=0;gameTime=20;$('#click-arena').innerHTML='';$('#click-start').textContent='Spiel läuft …';$('#click-message').textContent='Schnell klicken!';updateGameStats();spawnTarget();gameInterval=setInterval(()=>{gameTime--;updateGameStats();if(gameTime<=0)endGame();},1000);}
function initGames(){updateGameStats();$('#click-start').addEventListener('click',startGame);$('#maker-color').addEventListener('change',updateMakerPreview);$('#maker-wax').addEventListener('change',updateMakerPreview);$('#maker-scent').addEventListener('change',updateMakerPreview);$('#make-candle').addEventListener('click',createFantasyCandle);updateMakerPreview();}

/* SPIEL 2: Fantasiekerze gestalten. Das ist eine Vorschau, kein echtes Produkt. */
function updateMakerPreview(){const color=$('#maker-color').value;const wax=$('#maker-wax').value;const preview=$('#maker-preview');preview.style.setProperty('--maker-color',color);const candle=$('.maker-candle',preview);if(candle){if(wax==='soy'){candle.style.borderRadius='16px 16px 5px 5px';candle.style.width='84px';}else if(wax==='fantasy'){candle.style.borderRadius='22px 22px 5px 5px';candle.style.width='69px';}else{candle.style.borderRadius='9px 9px 4px 4px';candle.style.width='76px';}}}
function createFantasyCandle(){const wax=$('#maker-wax').selectedOptions[0].textContent;const color=$('#maker-color').selectedOptions[0].textContent;const scent=$('#maker-scent').value;const messages=['Das klingt wunderbar gemütlich!','Eine tolle Kombination für deine Fantasiekerze.','Dein eigener kleiner Lichtblick!','Diese Kerze hätte einen ganz besonderen Charakter.'];$('#maker-result').textContent=`Deine Kreation: ${wax}, ${color}, Duft ${scent}. ${messages[Math.floor(Math.random()*messages.length)]}`;const preview=$('#maker-preview');preview.animate?.([{transform:'scale(1)'},{transform:'scale(1.035)'},{transform:'scale(1)'}],{duration:360,easing:'ease-out'});showToast('Deine Fantasiekerze ist gestaltet!');}

document.addEventListener('DOMContentLoaded',()=>{initShop();initGames();});

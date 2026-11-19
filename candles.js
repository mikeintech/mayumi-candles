// Mayumi candles: entry, collections, scent wall, product view, bag. Prices + notes are placeholders.
(() => {
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const money = n => '$' + Math.round(n);

  const SCENTS = [
    { id: 'nhie', name: 'Never Have I Ever', col: 'cocoa', st: 'pre', size: '16oz · 2 wicks', price: 45,
      song: 'Named for “Never Have I Ever”, the new single.', notes: [['Notes', 'Black cherry, smoked clove, leather, dark amber']] },
    { id: 'henny-crystals', name: 'Henny & Crystals', col: 'cocoa', size: '7oz · 1 wick', price: 35,
      song: 'White tea and clean citrus, followed by sweet florals of jasmine and violet, resting on a base of cedar, sandalwood, tonka and light amber.', notes: [['Top', 'White tea, clean citrus'], ['Heart', 'Jasmine, violet'], ['Base', 'Cedar, sandalwood, tonka, light amber']] },
    { id: 'clean-up', name: 'Clean Up', col: 'cocoa', size: '18oz · 2 wicks', price: 50,
      song: 'Gardenia tuberose infused with essential oils of lemon peel, lemon, nutmeg and lime, with the lush green scent of orchid blended with heavy notes of pear and light musk.', notes: [['Notes', 'Gardenia tuberose, lemon, nutmeg, lime'], ['Finish', 'Orchid, pear, light musk']] },
    { id: 'forever-lasting', name: 'Forever Lasting', col: 'sand', size: '16oz · 2 wicks', price: 45,
      song: 'Bold and unforgettable, like a timeless romance or your favorite old-school track. Warm vanilla evokes the quiet comfort of lasting connection, while deep woods and smoky undertones leave a presence that stays with you. Maybe even forever.', notes: [['Notes', 'Coffee & whiskey, vanilla bean noel, mahogany teakwood, palo santo patchouli']] },
    { id: 'hot-yoga', name: 'Hot Yoga', col: 'sand', st: 'out', size: '8oz · 1 wick · copper jar', price: 35,
      song: 'Smooth, grounding, and softly sweet, like a deep exhale after your final pose. Warm vanilla blends with earthy palo santo and patchouli for a calm, restorative atmosphere that lingers like peace on your skin.', notes: [['Notes', 'Vanilla bean noel, palo santo patchouli']] },
    { id: 'good-girl', name: 'Good Girl', col: 'sand', st: 'pre', size: '8oz · 1 wick · iridescent sherbet', price: 35,
      song: 'Soft, warm, and quietly addictive. Rich cocoa butter and airy cashmere melt into the skin: creamy sweetness meets velvety warmth. Effortless, feminine, and a little dangerous, because “good” is only part of the story.', notes: [['Notes', 'Cocoa butter, cashmere']] },
    { id: 'call-me', name: 'Call Me', col: 'sand', size: '8oz · 1 wick · amber jar', price: 20,
      song: 'Soft, fresh, and sincere, like checking in just to hear how someone’s day went. Airy florals, a touch of brightness, and a grounding finish: a quiet kind of care that stays with you.', notes: [['Notes', 'Gardenia, frankincense, citrus vervain']] },
  ];
  const SETS = [
    { id: 'set-sand', name: 'The Sand Set', col: 'sand', price: 54, img: 'img/forever-lasting-2.webp', inc: 'Forever Lasting · Call Me · Hot Yoga', size: '3 × 6oz in the sand gift box' },
    { id: 'set-cocoa', name: 'The Cocoa Set', col: 'cocoa', price: 54, img: 'img/nhie-1.webp', inc: 'Henny & Crystals · Never Have I Ever · Clean Up', size: '3 × 6oz in the cocoa gift box' },
  ];
  const N = { nhie: 1, 'good-girl': 1 }; const shots = p => (N[p.id] === 1 ? [1] : [1, 2]).map(k => `img/${p.id}-${k}.webp`);
  const HERO = { cocoa: 'img/nhie-1.webp', sand: 'img/forever-lasting-1.webp' };
  const btnTxt = p => (p.st === 'pre' ? 'Pre-order' : p.st === 'out' ? 'Sold out' : 'Add to bag');
  const ALL = Object.fromEntries([...SCENTS, ...SETS].map(p => [p.id, p]));

  // ---------- entry: tap to light (remembered after the first visit) ----------
  const enter = () => {
    $('#entry').classList.add('gone'); document.body.classList.remove('locked');
    setTimeout(() => document.body.classList.add('lit'), 200);
    try { localStorage.setItem('mayumi-lit', '1'); } catch (e) {}
  };
  $('#light').onclick = () => { const e = $('#entry'); if (e.classList.contains('on')) return; e.classList.add('on'); $('.e-tap').textContent = 'Welcome in'; setTimeout(enter, 1500); };
  if (document.documentElement.classList.contains('lit-before')) enter();

  // ---------- collection: sand / cocoa changes the whole room ----------
  const setCol = c => { document.documentElement.dataset.col = c; $$('.col-toggle button').forEach(b => b.classList.toggle('on', b.dataset.c === c));
    $$('.brand img, footer img').forEach(i => (i.src = `img/logo-${c}.webp`)); $('.h-room img').src = HERO[c]; $('.h-room').dataset.c = c; };
  $$('.col-toggle button').forEach(b => (b.onclick = () => setCol(b.dataset.c)));

  // ---------- scent wall ----------
  const card = p => `<button class="sc ${p.col}" data-id="${p.id}" aria-label="${p.name}">
      <span class="sc-img">${p.st ? `<em class="tag ${p.st}">${p.st === 'pre' ? 'Pre-order' : 'Sold out'}</em>` : ''}${shots(p).map((s, i) => `<img${i ? ' class="lbl"' : ''} src="${s}" alt="" loading="lazy">`).join('')}</span>
      <span class="sc-t"><b>${p.name}</b><small>${p.size}</small></span><span class="sc-p">${money(p.price)}</span></button>`;
  const build = f => { $('#wall').innerHTML = SCENTS.filter(p => f === 'all' || p.col === f).map(card).join(''); };
  build('all');
  $$('.tabs button').forEach(b => (b.onclick = () => { $$('.tabs button').forEach(x => x.classList.toggle('on', x === b)); build(b.dataset.f); if (b.dataset.f !== 'all') setCol(b.dataset.f); }));
  $('#wall').onclick = e => { const c = e.target.closest('.sc'); if (c) open(c.dataset.id); };

  $('#sets-grid').innerHTML = SETS.map(s => `<article class="set ${s.col}"><img src="${s.img}" alt="${s.name}" loading="lazy">
    <div><p class="kick">${s.size}</p><h3>${s.name}</h3><p>${s.inc}</p><div class="set-b"><span>${money(s.price)}</span><button class="btn solid" data-add="${s.id}">Add to bag</button></div></div></article>`).join('');
  $('#sets-grid').onclick = e => { const b = e.target.closest('[data-add]'); if (b) { add(b.dataset.add, 1); b.textContent = 'Added ✓'; setTimeout(() => (b.textContent = 'Add to bag'), 1400); } };

  // ---------- back-in-stock alerts (saved locally until wired to the list service) ----------
  $('#pNotify').onsubmit = e => { e.preventDefault(); const f = e.target, em = f.email.value.trim(), m = f.querySelector('.n-msg');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) { m.textContent = 'Enter a valid email address.'; return; }
    try { const k = 'mayumi-restock', l = JSON.parse(localStorage.getItem(k) || '[]'); l.push({ email: em, scent: cur.id, at: Date.now() }); localStorage.setItem(k, JSON.stringify(l)); } catch (x) {}
    f.classList.add('done'); f.email.value = ''; m.textContent = `You're on the list. We'll email you when ${cur.name} is back.`; };

  // ---------- product view ----------
  let cur = null, qty = 1;
  function open(id) {
    const p = ALL[id]; cur = p; qty = 1; $('#pQty').textContent = 1;
    const sh = shots(p);
    $('#pImg').src = sh[0]; $('#pImg').alt = p.name;
    $('#pThumbs').innerHTML = sh.length < 2 ? '' : sh.map((s, i) => `<button class="${i ? '' : 'on'}" data-s="${s}"><img src="${s}" alt=""></button>`).join('');
    $('#pCol').textContent = (p.col === 'sand' ? 'Sand' : 'Cocoa') + ' collection';
    $('#pName').textContent = p.name; $('#pPrice').textContent = money(p.price); $('#pSong').textContent = p.song;
    $('#pNotes').innerHTML = p.notes.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
    $('#pMeta').textContent = p.size + ' · Coconut soy';
    // a full page: the shop hides, the candle takes the page in its own collection's colors
    if (!document.body.classList.contains('product')) backY = scrollY;
    setCol(p.col); $('#pdp').dataset.col = p.col; $('#pdp').classList.add('on'); document.body.classList.add('product');
    $('#pMore').innerHTML = SCENTS.filter(s => s.id !== p.id).slice(0, 3).map(card).join('');
    const out = p.st === 'out'; $('.p-buy').hidden = out; $('#pNotify').hidden = !out;
    $('#pNotify .n-msg').textContent = ''; $('#pNotify').classList.remove('done');
    const pb = $('#pAdd'); pb.textContent = btnTxt(p); pb.disabled = p.st === 'out';
    $('#pShipNote') && ($('#pShipNote').textContent = p.st === 'pre' ? 'Pre-order: ships when the first pour is ready.' : '');
    document.title = p.name + ' · Mayumi Candles';
    if (location.hash !== '#' + p.id) history.pushState(null, '', '#' + p.id);
    scrollTo({ top: 0, behavior: 'instant' });
  }
  let backY = 0;
  const close = (push = true) => { if (!document.body.classList.contains('product')) return;
    $('#pdp').classList.remove('on'); document.body.classList.remove('product'); document.title = 'Mayumi Candles · Domani';
    if (push) history.pushState(null, '', location.pathname); scrollTo({ top: backY, behavior: 'instant' }); };
  addEventListener('popstate', () => { const id = location.hash.slice(1), sec = id && document.getElementById(id);
    if (ALL[id] && !ALL[id].img) return open(id);
    if (sec && document.body.classList.contains('product')) { backY = sec.getBoundingClientRect().top + scrollY; } // a nav link: land on that section
    close(false); });
  $('#pMore').onclick = e => { const c = e.target.closest('.sc'); if (c) open(c.dataset.id); };
  $('#pBack').onclick = e => { e.preventDefault(); close(); $('#scents').scrollIntoView({ behavior: 'instant' }); };
  $('#pThumbs').onclick = e => { const b = e.target.closest('button'); if (!b) return; $('#pImg').src = b.dataset.s; $$('#pThumbs button').forEach(x => x.classList.toggle('on', x === b)); };
  $$('#pdp [data-q]').forEach(b => (b.onclick = () => { qty = Math.max(1, Math.min(9, qty + +b.dataset.q)); $('#pQty').textContent = qty; }));
  $('#pAdd').onclick = () => { if (cur.st === 'out') return; add(cur.id, qty); $('#pAdd').textContent = 'Added ✓'; setTimeout(() => { $('#pAdd').textContent = btnTxt(cur); openBag(); }, 700); };
  addEventListener('keydown', e => { if (e.key === 'Escape') closeBag(); });
  if (ALL[location.hash.slice(1)]) { enter(); open(location.hash.slice(1)); }

  // ---------- bag (local until it's wired to the Shopify cart) ----------
  let BAG = {}; try { BAG = JSON.parse(localStorage.getItem('mayumi-bag') || '{}'); } catch (e) {}
  const saveBag = () => { try { localStorage.setItem('mayumi-bag', JSON.stringify(BAG)); } catch (e) {} paintBag(); };
  function add(id, n) { BAG[id] = (BAG[id] || 0) + n; saveBag(); const b = $('#bagBtn'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
  function paintBag() {
    const ids = Object.keys(BAG).filter(id => BAG[id] > 0 && ALL[id]);
    $('#bagN').textContent = ids.reduce((s, id) => s + BAG[id], 0);
    $('#bagList').innerHTML = ids.length ? ids.map(id => { const p = ALL[id], im = p.img || `img/${id}-1.webp`;
      return `<li><img src="${im}" alt=""><div><b>${p.name}</b><small>${money(p.price)} · qty ${BAG[id]}</small></div><button data-rm="${id}" aria-label="Remove ${p.name}">Remove</button></li>`; }).join('') : '<li class="empty">Nothing burning yet.</li>';
    $('#bagSub').textContent = money(ids.reduce((s, id) => s + ALL[id].price * BAG[id], 0));
  }
  $('#bagList').onclick = e => { const b = e.target.closest('[data-rm]'); if (b) { delete BAG[b.dataset.rm]; saveBag(); } };
  const openBag = () => { $('#bag').classList.add('on'); $('#scrim').classList.add('on'); };
  const closeBag = () => { $('#bag').classList.remove('on'); $('#scrim').classList.remove('on'); };
  $('#bagBtn').onclick = openBag; $('#bagX').onclick = closeBag; $('#scrim').onclick = closeBag;
  paintBag();

  // ---------- sign-up (name + email and/or SMS), never asked again once joined ----------
  const f = $('form.cap');
  try { if (localStorage.getItem('domani-joined')) $('.join').remove(); } catch (e) {}
  if (document.body.contains(f)) f.onsubmit = e => {
    e.preventDefault();
    const nm = f.fname.value.trim(), em = f.email.value.trim(), ph = f.phone.value.replace(/[^\d+]/g, ''), err = f.querySelector('.cap-e');
    err.textContent = !nm ? 'Add your first name.' : !em && !ph ? 'Add an email or a mobile number.' : em && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em) ? 'That email doesn’t look right.' : ph && ph.replace(/\D/g, '').length < 10 ? 'That number looks short.' : ph && !f.sms.checked ? 'Tick the box so we can text you.' : '';
    if (err.textContent) return;
    try { const L = JSON.parse(localStorage.getItem('domani-list') || '[]'); L.push({ name: nm, email: em, phone: ph, from: 'mayumi', at: Date.now() }); localStorage.setItem('domani-list', JSON.stringify(L)); localStorage.setItem('domani-joined', '1'); } catch (x) {}
    f.classList.add('done'); f.querySelector('.cap-t').textContent = 'You’re on the list, ' + nm + '.';
  };

  // ---------- reveal on scroll ----------
  const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && (e.target.classList.add('in'), io.unobserve(e.target))), { threshold: .15 });
  const watch = () => $$('.sec-h, .sc, .set, .ritual > *, .join').forEach(el => io.observe(el));
  watch(); new MutationObserver(watch).observe($('#wall'), { childList: true });
  addEventListener('scroll', () => $('#nav').classList.toggle('solid', scrollY > 40), { passive: true });
})();

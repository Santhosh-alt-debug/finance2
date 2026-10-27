/* Stackly Finance - shared script */
(function () {
  'use strict';
  var doc = document;
  var body = doc.body;
  var page = body.getAttribute('data-page') || '';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Data ---------- */
  var NAV = [
    ['index.html', 'Home', 'home'],
    ['about.html', 'About', 'about'],
    ['services.html', 'Services', 'services'],
    ['calculator.html', 'EMI Calculator', 'calculator'],
    ['pricing.html', 'Pricing', 'pricing'],
    ['blog.html', 'Insights', 'blog'],
    ['faq.html', 'FAQ', 'faq'],
    ['contact.html', 'Contact', 'contact']
  ];
  var PRODUCTS = [
    ['personal-loans.html', 'Personal Loans'],
    ['home-auto-loans.html', 'Home &amp; Auto Loans'],
    ['insurance.html', 'Insurance'],
    ['investments.html', 'Investments &amp; Mutual Funds']
  ];
  var LOGO = '<img class="logo-img" src="logo-light.webp" width="137" height="40" alt="Stackly">';
  var ICONS = '<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">' +
    '<symbol id="i-loan" viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 12h.01M18 12h.01"/></symbol>' +
    '<symbol id="i-home" viewBox="0 0 24 24"><path d="M3 11l9-8 9 8M5 10v10h14V10M10 20v-6h4v6"/></symbol>' +
    '<symbol id="i-shield" viewBox="0 0 24 24"><path d="M12 3l8 3v6c0 4.500-3.200 8-8 9-4.800-1-8-4.500-8-9V6z"/><path d="M9 12l2 2 4-4"/></symbol>' +
    '<symbol id="i-chart" viewBox="0 0 24 24"><path d="M4 20V4M4 20h16M7 15l4-4 3 3 5-6"/></symbol>' +
    '<symbol id="i-calc" viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h2M14 12h2M8 16h2M14 16h2"/></symbol>' +
    '<symbol id="i-tag" viewBox="0 0 24 24"><path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.500" cy="8.500" r="1"/></symbol>' +
    '<symbol id="i-check" viewBox="0 0 24 24"><path d="M5 12l4 4 10-10"/></symbol>' +'<symbol id="i-fb" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></symbol>' +'<symbol id="i-x" viewBox="0 0 24 24"><path d="M4 4l11.7 16H20L8.300 4zM4 20l6.800-6.800M13.200 10.800L20 4"/></symbol>' +'<symbol id="i-in" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></symbol>' +'<symbol id="i-ig" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.500 6.500h.01"/></symbol>' +'<symbol id="i-yt" viewBox="0 0 24 24"><path d="M22.500 6.400a2.800 2.800 0 0 0-1.900-2C18.900 4 12 4 12 4s-6.900 0-8.600.5a2.800 2.800 0 0 0-1.900 2A29 29 0 0 0 1 11.800a29 29 0 0 0 .5 5.300A2.800 2.800 0 0 0 3.400 19c1.700.5 8.600.5 8.600.5s6.900 0 8.600-.5a2.800 2.800 0 0 0 1.900-2 29 29 0 0 0 .5-5.200 29 29 0 0 0-.5-5.400z"/><path d="M9.800 15l5.700-3.200L9.800 8.500z"/></symbol>' +
    '</svg>';

  /* ---------- Helpers (also used by later pages) ---------- */
  function inr(n) { return '\u20B9' + Math.round(n).toLocaleString('en-IN'); }
  function emi(principal, annualRate, months) {
    var r = annualRate / 1200;
    if (!r) { return principal / months; }
    var f = Math.pow(1 + r, months);
    return principal * r * f / (f - 1);
  }
  function fillRange(el) {
    var min = parseFloat(el.min) || 0, max = parseFloat(el.max) || 100;
    el.style.setProperty('--p', ((el.value - min) / (max - min) * 100) + '%');
  }
  window.Stackly = { inr: inr, emi: emi, fillRange: fillRange, reduceMotion: reduce };

  /* ---------- Header + footer ---------- */
  var header = doc.getElementById('site-header');
  var footer = doc.getElementById('site-footer');
  var year = new Date().getFullYear();
  var HOMEPAGE = { user: 'user-dashboard.html', admin: 'admin-dashboard.html' };
  var sess = null;
  try { sess = JSON.parse(window.sessionStorage.getItem('stackly_session')); } catch (e) { sess = null; }
  var acct = (sess && HOMEPAGE[sess.role]) ? ['Dashboard', HOMEPAGE[sess.role]] : ['Log in / Sign up', 'login.html'];
  var SOCIAL = [['Facebook', 'fb'], ['X', 'x'], ['LinkedIn', 'in'], ['Instagram', 'ig'], ['YouTube', 'yt']];
  var OTHER = ['Personal Loans', 'Home &amp; Auto Loans', 'Insurance', 'Investments', 'Privacy Policy', 'Terms of Use', 'Careers', 'Support'];
  var bar = doc.createElement('div'); bar.className = 'progress'; bar.setAttribute('aria-hidden', 'true'); body.appendChild(bar);

  if (header) {
    var items = NAV.map(function (n) {
      return '<li><a href="' + n[0] + '"' + (n[2] === page ? ' aria-current="page"' : '') + '>' + n[1] + '</a></li>';
    }).join('');
    header.innerHTML =
      '<a class="skip" href="#main">Skip to content</a>' +
      '<div class="container nav-wrap">' +
      '<a class="logo" href="index.html" aria-label="Stackly Finance home">' + LOGO + '<span class="logo-word"><b>Finance</b></span></a>' +
      '<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-nav" aria-label="Open menu"><span></span></button>' +
      '<nav id="primary-nav" class="nav" aria-label="Primary"><ul>' + items + '</ul>' +
      '<a class="btn btn-teal btn-sm" href="' + acct[1] + '"' + ((page === 'login' || page === 'dashboard') ? ' aria-current="page"' : '') + '>' + acct[0] + '</a></nav>' +
      '</div>';
  }

  if (footer) {
    var SOC2 = [['Facebook', 'fb'], ['YouTube', 'yt'], ['LinkedIn', 'in'], ['Instagram', 'ig'], ['X', 'x']];
    var SERVICES = ['Personal Loans', 'Home &amp; Auto Loans', 'Insurance', 'Mutual Funds'];
    var COMPANY = ['Careers', 'Press', 'Partner with us', 'Support'];
    var soc = SOC2.map(function (x) { return '<li><a href="404.html" aria-label="' + x[0] + '"><svg class="ico" aria-hidden="true"><use href="#i-' + x[1] + '"/></svg></a></li>'; }).join('');
    var col = function (id, title, items, cls) { return '<nav' + (cls ? ' class="foot-navcol"' : '') + ' aria-labelledby="' + id + '"><h3 id="' + id + '">' + title + '</h3><ul' + (cls ? ' class="foot-two"' : '') + '>' + items + '</ul></nav>'; };
    var fnav = NAV.map(function (n) { return '<li><a href="' + n[0] + '">' + n[1] + '</a></li>'; }).join('');
    var f404 = function (arr) { return arr.map(function (t) { return '<li><a href="404.html">' + t + '</a></li>'; }).join(''); };
    footer.innerHTML =
      '<div class="container foot-wrap"><div class="foot-grid">' +
      '<div class="foot-brand"><a class="logo" href="index.html" aria-label="Stackly Finance home">' + LOGO + '<span class="logo-word"><b>Finance</b></span></a>' +
      '<p class="foot-desc">Loans, insurance and investments from one trusted team in Salem, serving customers across Tamil Nadu since 2019.</p>' +
      '<ul class="foot-contact"><li><a href="tel:+919000000000">+91 90000 00000</a></li><li><a href="mailto:hello@stacklyfinance.example">hello@stacklyfinance.example</a></li></ul>' +
      '<ul class="socials" aria-label="Social media">' + soc + '</ul></div>' +
      col('fh-nav', 'Navigate', fnav, true) + col('fh-svc', 'Services', f404(SERVICES)) + col('fh-co', 'Company', f404(COMPANY)) +
      '</div><div class="foot-bottom"><span>&copy; ' + year + ' Stackly Finance Pvt. Ltd. All rights reserved. Rates shown are illustrative.</span>' +
      '<span class="foot-legal"><a href="404.html">Privacy policy</a><a href="404.html">Terms &amp; conditions</a></span></div></div>';
  }
  body.insertAdjacentHTML('afterbegin', ICONS);

  /* ---------- Mobile menu ---------- */
  var toggle = doc.querySelector('.nav-toggle');
  var nav = doc.getElementById('primary-nav');
  function setNav(open) {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () { setNav(!nav.classList.contains('open')); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) { setNav(false); } });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) { setNav(false); toggle.focus(); }
    });
    doc.addEventListener('click', function (e) {
      if (nav.classList.contains('open') && !e.target.closest('.nav-wrap')) { setNav(false); }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 1180) { setNav(false); } });
  }

  /* ---------- Header shadow on scroll ---------- */
  function onScroll() {
    if (header) { header.classList.toggle('scrolled', window.scrollY > 8); }
    var h = doc.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, window.scrollY / h) : 0) + ')';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Scroll reveal + stat counters ---------- */
  function fmt(v, dec) {
    return v.toLocaleString('en-IN', { minimumFractionDigits: dec, maximumFractionDigits: dec });
  }
  function count(el) {
    var end = parseFloat(el.getAttribute('data-count')), dec = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var pre = el.getAttribute('data-prefix') || '', suf = el.getAttribute('data-suffix') || '';
    function show(v) { el.textContent = pre + fmt(v, dec) + suf; }
    if (reduce) { show(end); return; }
    var t0 = null, dur = 1400;
    function step(ts) {
      if (t0 === null) { t0 = ts; }
      var k = Math.min((ts - t0) / dur, 1);
      show(end * (1 - Math.pow(1 - k, 3)));
      if (k < 1) { requestAnimationFrame(step); }
    }
    requestAnimationFrame(step);
  }
  var reveals = doc.querySelectorAll('.reveal');
  var counters = doc.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      var k = 0;
      entries.forEach(function (en) {
        if (!en.isIntersecting) { return; }
        var t = en.target, delay = reduce ? 0 : (k++) * 90;
        setTimeout(function () { t.classList.add('in'); if (t.hasAttribute('data-count')) { count(t); } }, delay);
        io.unobserve(t);
      });
    }, { threshold: 0.15 });
    reveals.forEach(function (el) { io.observe(el); });
    counters.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Home hero mini EMI estimator ---------- */
  var mc = doc.getElementById('mini-calc');
  if (mc) {
    var amount = doc.getElementById('mc-amount'), tenure = doc.getElementById('mc-tenure');
    var amountOut = doc.getElementById('mc-amount-out'), tenureOut = doc.getElementById('mc-tenure-out');
    var result = doc.getElementById('mc-result');
    var rate = parseFloat(mc.getAttribute('data-rate')) || 10.5;
    var update = function () {
      amountOut.textContent = inr(amount.value);
      tenureOut.textContent = tenure.value + ' months';
      result.textContent = inr(emi(+amount.value, rate, +tenure.value));
      fillRange(amount); fillRange(tenure);
    };
    amount.addEventListener('input', update);
    tenure.addEventListener('input', update);
    update();
  }
})();

/* ===== Pages 2-13: validation, calculator, accordion, blog filter, auth ===== */
(function () {
  'use strict';
  var D = document, S = window.Stackly;
  var EMAIL = /^(?!.*\.\.)[A-Za-z0-9][A-Za-z0-9._%+-]{0,63}@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/;
  var ADMIN_CODE = 'STACKLY-ADMIN-2026';

  /* ---- Field-level validation ---- */
  function check(el) {
    var chk = el.type === 'checkbox', v = chk ? el.checked : el.value.trim();
    var name = el.getAttribute('data-label') || 'this field';
    if (el.required && !v) {
      if (chk) { return 'You need to ' + name + ' to continue.'; }
      return (el.tagName === 'SELECT' ? 'Choose ' : 'Enter ') + name + '.';
    }
    if (!v || chk) { return ''; }
    var r = el.getAttribute('data-rule');
    if (r === 'email' && !EMAIL.test(v)) { return 'Enter a valid email address, like name@company.com.'; }
    if (r === 'phone' && !/^[6-9]\d{9}$/.test(v)) { return /\s/.test(v) ? 'Remove the spaces. Enter 10 digits only.' : 'Enter a 10-digit mobile number starting with 6, 7, 8 or 9.'; }
    if (r === 'name' && !/^[A-Za-z][A-Za-z .'-]{1,59}$/.test(v)) { return 'Use letters only, 2 to 60 characters.'; }
    if (r === 'password') { var pm = pwIssue(v); if (pm) { return pm; } }
    if (r === 'admincode' && v.toUpperCase() !== ADMIN_CODE) { return 'This admin access code is not valid.'; }
    if (el.minLength > 0 && v.length < el.minLength) { return 'Enter at least ' + el.minLength + ' characters.'; }
    var m = el.getAttribute('data-match');
    if (m && v !== D.getElementById(m).value) { return 'Passwords do not match.'; }
    return '';
  }
  function show(el, msg) {
    var err = D.getElementById(el.id + '-err');
    if (err) { err.textContent = msg; }
    el.setAttribute('aria-invalid', msg ? 'true' : 'false');
  }
  function initForm(form, onValid) {
    var fields = [].slice.call(form.querySelectorAll('[data-label]'));
    var sum = form.querySelector('.form-summary');
    fields.forEach(function (el) {
      if (el.getAttribute('data-rule') === 'phone') {
        el.addEventListener('input', function () {
          var d = el.value.replace(/\D/g, '');
          if (d.length > 10 && d.indexOf('91') === 0) { d = d.slice(2); }
          d = d.slice(0, 10);
          if (el.value !== d) { el.value = d; }
        });
      }
      el.addEventListener('blur', function () { el.setAttribute('data-touched', '1'); show(el, check(el)); });
      var ev = (el.type === 'checkbox' || el.tagName === 'SELECT') ? 'change' : 'input';
      el.addEventListener(ev, function () {
        if (el.getAttribute('data-touched')) { show(el, check(el)); }
        fields.forEach(function (o) { if (o.getAttribute('data-match') === el.id && o.getAttribute('data-touched')) { show(o, check(o)); } });
      });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var first = null, bad = 0;
      fields.forEach(function (el) {
        el.setAttribute('data-touched', '1');
        var msg = check(el); show(el, msg);
        if (msg) { bad++; if (!first) { first = el; } }
      });
      if (sum) { sum.hidden = !bad; if (bad) { sum.textContent = 'Please fix the ' + bad + ' highlighted field' + (bad > 1 ? 's' : '') + ' above, then try again.'; } }
      if (first) { first.focus(); return; }
      onValid(form);
    });
  }
  function note(box, ok, text) {
    box.hidden = false; box.className = 'notice ' + (ok ? 'notice-ok' : 'notice-err'); box.textContent = text;
  }

  /* ---- Contact ---- */
  var cf = D.getElementById('contact-form');
  if (cf) {
    initForm(cf, function (f) {
      var who = f.querySelector('#ct-name').value.trim().split(' ')[0];
      note(D.getElementById('contact-status'), true, 'Thanks, ' + who + '. We have your message and will reply within one working day.');
      f.reset();
      [].forEach.call(f.querySelectorAll('[data-label]'), function (el) { el.removeAttribute('data-touched'); show(el, ''); });
    });
  }

  /* ---- EMI calculator ---- */
  var calc = D.getElementById('calc');
  if (calc) {
    var fields = {};
    [].forEach.call(calc.querySelectorAll('.calc-field'), function (box) {
      var id = box.getAttribute('data-field');
      var f = fields[id] = { range: box.querySelector('input[type=range]'), num: box.querySelector('input[type=number]'), err: box.querySelector('.field-error'), label: box.getAttribute('data-name') };
      f.min = +f.range.min; f.max = +f.range.max;
      f.range.addEventListener('input', function () { f.num.value = f.range.value; f.num.setAttribute('aria-invalid', 'false'); f.err.textContent = ''; run(); });
      f.num.addEventListener('input', function () {
        var v = parseFloat(f.num.value);
        if (isNaN(v) || v < f.min || v > f.max) {
          f.num.setAttribute('aria-invalid', 'true');
          f.err.textContent = 'Enter ' + f.label + ' between ' + f.min.toLocaleString('en-IN') + ' and ' + f.max.toLocaleString('en-IN') + '.';
        } else { f.num.setAttribute('aria-invalid', 'false'); f.err.textContent = ''; f.range.value = v; run(); }
      });
      f.num.addEventListener('blur', function () {
        var v = parseFloat(f.num.value);
        if (isNaN(v) || v < f.min || v > f.max) {
          v = isNaN(v) ? +f.range.value : Math.min(f.max, Math.max(f.min, v));
          f.num.value = v; f.range.value = v; f.num.setAttribute('aria-invalid', 'false'); f.err.textContent = ''; run();
        }
      });
    });
    var $ = function (id) { return D.getElementById(id); };
    var run = function () {
      var P = +fields.amount.range.value, R = +fields.rate.range.value, N = +fields.tenure.range.value;
      Object.keys(fields).forEach(function (k) { S.fillRange(fields[k].range); });
      var m = S.emi(P, R, N), total = m * N, interest = total - P;
      $('r-emi').textContent = S.inr(m);
      $('r-principal').textContent = S.inr(P);
      $('r-interest').textContent = S.inr(interest);
      $('r-total').textContent = S.inr(total);
      $('r-tenure').textContent = Math.floor(N / 12) + ' yr ' + (N % 12) + ' mo';
      $('donut').style.setProperty('--pct', (P / total * 100).toFixed(1) + '%');
      var bal = P, r = R / 1200, rows = '', yp = 0, yi = 0;
      for (var i = 1; i <= N; i++) {
        var int = bal * r, pr = m - int; bal = Math.max(0, bal - pr); yp += pr; yi += int;
        if (i % 12 === 0 || i === N) {
          rows += '<tr><th scope="row">Year ' + Math.ceil(i / 12) + '</th><td>' + S.inr(yp) + '</td><td>' + S.inr(yi) + '</td><td>' + S.inr(bal < 1 ? 0 : bal) + '</td></tr>';
          yp = 0; yi = 0;
        }
      }
      $('schedule').innerHTML = rows;
    };
    run();
  }

  /* ---- FAQ accordion ---- */
  var btns = D.querySelectorAll('.acc-btn');
  [].forEach.call(btns, function (b) {
    b.addEventListener('click', function () {
      var open = b.getAttribute('aria-expanded') === 'true';
      [].forEach.call(btns, function (o) { o.setAttribute('aria-expanded', 'false'); D.getElementById(o.getAttribute('aria-controls')).hidden = true; });
      if (!open) { b.setAttribute('aria-expanded', 'true'); D.getElementById(b.getAttribute('aria-controls')).hidden = false; }
    });
  });

  /* ---- Blog filter ---- */
  var chips = D.querySelectorAll('.chip');
  [].forEach.call(chips, function (c) {
    c.addEventListener('click', function () {
      var f = c.getAttribute('data-filter');
      [].forEach.call(chips, function (o) { o.setAttribute('aria-pressed', String(o === c)); });
      [].forEach.call(D.querySelectorAll('.post'), function (p) { p.hidden = f !== 'all' && p.getAttribute('data-cat') !== f; });
    });
  });

  /* ---- Password policy, meter and show/hide ---- */
  function personalIssue(v) {
    var em = D.getElementById('su-email'), nm = D.getElementById('su-name');
    if (/password|qwerty|123456|letmein|welcome|admin|stackly/i.test(v)) { return 'Choose a less common password.'; }
    var low = v.toLowerCase(), local = ((em && em.value) || '').split('@')[0].toLowerCase();
    if (local.length >= 4 && low.indexOf(local) > -1) { return 'Do not include your email name in the password.'; }
    var parts = ((nm && nm.value) || '').toLowerCase().split(/\s+/);
    for (var i = 0; i < parts.length; i++) { if (parts[i].length >= 4 && low.indexOf(parts[i]) > -1) { return 'Do not include your name in the password.'; } }
    return '';
  }
  function pwIssue(v) {
    if (v.length < 10) { return 'Use at least 10 characters.'; }
    if (/\s/.test(v)) { return 'Remove spaces from the password.'; }
    if (!/[A-Z]/.test(v)) { return 'Add an uppercase letter.'; }
    if (!/[a-z]/.test(v)) { return 'Add a lowercase letter.'; }
    if (!/\d/.test(v)) { return 'Add a number.'; }
    if (!/[^A-Za-z0-9]/.test(v)) { return 'Add a symbol, such as ! @ # $ %.'; }
    if (/(.)\1\1/.test(v)) { return 'Avoid repeating the same character three times in a row.'; }
    return personalIssue(v);
  }
  [].forEach.call(D.querySelectorAll('.pw-toggle'), function (b) {
    b.addEventListener('click', function () {
      var inp = D.getElementById(b.getAttribute('aria-controls')), on = inp.type === 'password';
      inp.type = on ? 'text' : 'password';
      b.setAttribute('aria-pressed', String(on)); b.setAttribute('aria-label', on ? 'Hide password' : 'Show password'); b.textContent = on ? 'Hide' : 'Show';
    });
  });
  var spw = D.getElementById('su-password');
  if (spw) {
    var tests = {
      len: function (v) { return v.length >= 10; }, upper: function (v) { return /[A-Z]/.test(v); }, lower: function (v) { return /[a-z]/.test(v); },
      num: function (v) { return /\d/.test(v); }, sym: function (v) { return /[^A-Za-z0-9]/.test(v); },
      clean: function (v) { return !/\s/.test(v) && !/(.)\1\1/.test(v); }, safe: function (v) { return !personalIssue(v); }
    };
    var lis = D.querySelectorAll('#su-rules li'), meter = D.getElementById('su-meter'), mlabel = D.getElementById('su-meter-label');
    var updatePw = function () {
      var v = spw.value, n = 0, total = lis.length;
      [].forEach.call(lis, function (li) { var ok = v.length > 0 && tests[li.getAttribute('data-r')](v); li.classList.toggle('ok', ok); if (ok) { n++; } });
      var label = 'Password strength', color = '#d8d2c2';
      if (v) {
        if (n < 4) { label = 'Strength: Weak'; color = '#c0392b'; }
        else if (n < total) { label = 'Strength: Fair. Complete every item in the checklist.'; color = '#d98e1f'; }
        else if (v.length >= 14) { label = 'Strength: Strong'; color = '#1f6b4a'; }
        else { label = 'Strength: Good'; color = '#2f7d5b'; }
      }
      meter.style.width = v ? Math.max(8, n / total * 100) + '%' : '0'; meter.style.background = color; mlabel.textContent = label;
    };
    ['su-password', 'su-name', 'su-email'].forEach(function (id) { var el = D.getElementById(id); if (el) { el.addEventListener('input', updatePw); } });
  }

  /* ---- Auth, session and role-based dashboards (front-end demo, no server) ---- */
  var SESSION = 'stackly_session', USERS = 'stackly_users';
  var HOME = { user: 'user-dashboard.html', admin: 'admin-dashboard.html' };
  var DEMO = [
    { email: 'user@stackly.demo', password: 'Stackly@2026!', name: 'Demo User', role: 'user' },
    { email: 'admin@stackly.demo', password: 'Stackly@2026!', name: 'Demo Admin', role: 'admin' }
  ];
  function read(store, key) { try { return JSON.parse(store.getItem(key)); } catch (e) { return null; } }
  function write(store, key, val) { try { store.setItem(key, JSON.stringify(val)); return true; } catch (e) { return false; } }
  function hash(str) {
    if (window.crypto && window.crypto.subtle && window.TextEncoder) {
      return window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(str)).then(function (b) {
        return [].map.call(new Uint8Array(b), function (x) { return ('0' + x.toString(16)).slice(-2); }).join('');
      });
    }
    var h = 2166136261; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return Promise.resolve('f' + (h >>> 0).toString(16));
  }
  var salt = function (email, pw) { return 'stackly:' + email.toLowerCase() + ':' + pw; };
  function find(email) {
    var all = (read(window.localStorage, USERS) || []).concat(DEMO);
    for (var i = 0; i < all.length; i++) { if (all[i].email === email.toLowerCase()) { return all[i]; } }
    return null;
  }
  function verify(u, pw) { return u.hash ? hash(salt(u.email, pw)).then(function (h) { return h === u.hash; }) : Promise.resolve(u.password === pw); }
  var session = read(window.sessionStorage, SESSION);
  function start(u) { write(window.sessionStorage, SESSION, { name: u.name, email: u.email, role: u.role }); location.href = HOME[u.role]; }

  var authView = D.getElementById('auth-view');
  if (authView) {
    var sn = D.getElementById('session-note');
    if (session && HOME[session.role] && sn) { D.getElementById('session-name').textContent = session.name; D.getElementById('session-link').setAttribute('href', HOME[session.role]); sn.hidden = false; }
    var tabs = { login: D.getElementById('tab-login'), signup: D.getElementById('tab-signup') };
    var route = function () {
      var which = location.hash === '#signup' ? 'signup' : 'login';
      Object.keys(tabs).forEach(function (k) {
        tabs[k].setAttribute('aria-selected', String(k === which)); tabs[k].tabIndex = k === which ? 0 : -1;
        D.getElementById('panel-' + k).hidden = k !== which;
      });
    };
    Object.keys(tabs).forEach(function (k) { tabs[k].addEventListener('click', function () { location.hash = k; }); });
    window.addEventListener('hashchange', route); route();
    if (/[?&]created=1/.test(location.search)) {
      var pf = read(window.sessionStorage, 'stackly_prefill');
      if (pf) { D.getElementById('lg-email').value = pf.email; D.getElementById('lg-role').value = pf.role; try { window.sessionStorage.removeItem('stackly_prefill'); } catch (e) { /* ignore */ } }
      note(D.getElementById('login-status'), true, 'Account created successfully. Please log in to continue.');
      D.getElementById('lg-password').focus();
      if (window.history && history.replaceState) { history.replaceState(null, '', 'login.html#login'); }
    }
    var roleSel = D.getElementById('su-role'), codeBox = D.getElementById('su-code-field'), code = D.getElementById('su-code');
    var syncRole = function () { var a = roleSel.value === 'admin'; codeBox.hidden = !a; code.required = a; if (!a) { code.value = ''; show(code, ''); } };
    roleSel.addEventListener('change', syncRole); syncRole();
    initForm(D.getElementById('login-form'), function (f) {
      var box = D.getElementById('login-status'), role = f.querySelector('#lg-role').value, pw = f.querySelector('#lg-password').value;
      var u = find(f.querySelector('#lg-email').value.trim());
      if (!u) { note(box, false, 'No account was found for this email. Use Sign up to create one, or try a demo login below.'); return; }
      verify(u, pw).then(function (ok) {
        if (!ok) { note(box, false, 'Incorrect password. Please try again.'); }
        else if (u.role !== role) { note(box, false, 'This email is registered as ' + (u.role === 'admin' ? 'an Admin' : 'a User') + ' account. Choose the matching account type.'); }
        else { start(u); }
      });
    });
    [].forEach.call(D.querySelectorAll('[data-demo]'), function (b) {
      b.addEventListener('click', function () {
        var r = b.getAttribute('data-demo');
        D.getElementById('lg-role').value = r; D.getElementById('lg-email').value = r + '@stackly.demo'; D.getElementById('lg-password').value = 'Stackly@2026!';
        ['lg-role', 'lg-email', 'lg-password'].forEach(function (id) { show(D.getElementById(id), ''); });
        D.getElementById('login-status').hidden = true;
        var sm = D.querySelector('#login-form .form-summary'); if (sm) { sm.hidden = true; }
      });
    });
    initForm(D.getElementById('signup-form'), function (f) {
      var email = f.querySelector('#su-email');
      if (find(email.value.trim())) { show(email, 'An account with this email already exists. Log in instead.'); email.focus(); return; }
      var u = { name: f.querySelector('#su-name').value.trim(), email: email.value.trim().toLowerCase(), role: roleSel.value };
      hash(salt(u.email, f.querySelector('#su-password').value)).then(function (h) {
        u.hash = h; var list = read(window.localStorage, USERS) || []; list.push(u);
        if (!write(window.localStorage, USERS, list)) { var sm = f.querySelector('.form-summary'); sm.textContent = 'Your browser blocked saving the account. Allow site storage and try again.'; sm.hidden = false; return; }
        write(window.sessionStorage, 'stackly_prefill', { email: u.email, role: u.role });
        location.href = 'login.html?created=1#login';
      });
    });
  }

  /* ---- Dashboard guard + role-specific behaviour ---- */
  var need = D.body.getAttribute('data-require');
  if (need) {
    var gate = function (title, msg, href, label) {
      var g = D.getElementById('gate');
      if (!g) { location.replace(href); return; }
      D.getElementById('gate-title').textContent = title; D.getElementById('gate-msg').textContent = msg;
      var a = D.getElementById('gate-link'); a.setAttribute('href', href); a.textContent = label; g.hidden = false;
    };
    if (!session || !HOME[session.role]) { gate('Please log in to continue', 'This dashboard is only available after you log in. Use a demo login or create your own account.', 'login.html', 'Go to login'); }
    else if (session.role !== need) { gate('This page is for ' + need + ' accounts', 'You are logged in as ' + (session.role === 'admin' ? 'an admin' : 'a user') + '. Open your own dashboard instead.', HOME[session.role], 'Open my dashboard'); }
    else {
      D.getElementById('main').hidden = false;
      var first = session.name.split(' ')[0];
      [].forEach.call(D.querySelectorAll('[data-user-first]'), function (e) { e.textContent = first; });
      [].forEach.call(D.querySelectorAll('[data-user-name]'), function (e) { e.textContent = session.name; });
      [].forEach.call(D.querySelectorAll('[data-user-email]'), function (e) { e.textContent = session.email; });
    }
  }
  [].forEach.call(D.querySelectorAll('[data-logout]'), function (b) {
    b.addEventListener('click', function () { try { window.sessionStorage.removeItem(SESSION); } catch (e) { /* ignore */ } location.href = 'login.html'; });
  });
  var apps = D.getElementById('apps');
  if (apps) {
    apps.addEventListener('click', function (e) {
      var b = e.target.closest('[data-act]'); if (!b) { return; }
      var tr = b.closest('tr'), st = tr.querySelector('.st'), ok = b.getAttribute('data-act') === 'approve';
      st.textContent = ok ? 'Approved' : 'Rejected'; st.className = 'st badge-s ' + (ok ? 'ok' : 'bad');
      tr.querySelector('.acts').textContent = 'Completed';
      D.getElementById('admin-live').textContent = 'Application ' + tr.getAttribute('data-id') + ' ' + (ok ? 'approved' : 'rejected') + '.';
    });
    D.getElementById('app-filter').addEventListener('input', function (e) {
      var q = e.target.value.toLowerCase();
      [].forEach.call(apps.querySelectorAll('tbody tr'), function (tr) { tr.hidden = tr.textContent.toLowerCase().indexOf(q) === -1; });
    });
  }
})();

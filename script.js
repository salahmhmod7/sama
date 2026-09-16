/* =================================================================
   سما — script.js
   Cinematic journey · vanilla JS
   ================================================================= */

'use strict';

/* =================================================================
   CONFIG — the only place to edit
   ================================================================= */
const CONFIG = {
  startDate: '2025-01-21',
  password: 'بحبك',

  /* رابط الأغنية — ضعي مسار الملف أو رابط مباشر */
  musicSrc: 'song.mp3',

  images: {
    seaDay:  'img.jpeg',
    sunset:  'img2.jpeg',
    lilies:  'https://plus.unsplash.com/premium_photo-1713823800074-b3a0a8a9c3ae?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8bGlsaWVzfGVufDB8fDB8fHww'
  },

  eggs: {
    counter: { lbl: 'همسة', ttl: 'كل يوم', txt: 'كل يوم عدى من 21 يناير كان بيضيف حاجة جديدة لحكايتنا. حتى الأيام اللي مكانش فيها كلام كتير.' },
    lily:    { lbl: 'زهرة', ttl: 'زي الـLily', txt: 'الـLily هادية، مش بتحاول تلفت النظر، وبرضه مستحيل تعدي من غير ما تاخد بالك منها. شبهك بالظبط.' },
    nickname:{ lbl: 'اسم داخلي', ttl: 'أوتر', txt: 'من يوم ما بقى لك اسم صغير عندي، والحكاية بقت أقرب. مش محتاج أقوله بصوت عالي عشان تعرفيه.' },
    star:    { lbl: 'نجمة', ttl: 'النجمة اللي بعيدة', txt: 'في نجوم بعيدة أوي لدرجة إنك مش شايفها، بس إنتِ عارف إنها موجودة. شبهك في أول أيامنا كده.' },
    drift:   { lbl: 'ضوء صغير', ttl: 'حاجة مخبية', txt: 'في حاجات في الموقع مخبية كده. مش عشان حد يلاقيها. عشان إنتِ بالذات تلاقيها.' }
  },

  littleItems: [
    { t: 'رسالة',   txt: 'رسالة صغيرة في وسط اليوم، بتقلب المزاج من غير ما تاخد إذن.' },
    { t: 'أغنية',   txt: 'الأغاني اللي بتقولي عليها، وبقيت أسمعها وأفتكرك في كل مرة.' },
    { t: 'فيلم',    txt: 'بنشوف فيلم سوا وإحنا في مكانين مختلفين، وبنتكلم عنه لآخر الليل.' },
    { t: 'خروجة',   txt: 'بنخطط لخروجة كأنها بكرة، وإحنا لسه في مكانا.' },
    { t: 'مفاجأة',  txt: 'أي حاجة مش متوقعة، مهما كانت بسيطة، بتفضل في الدماغ أسبوع.' },
    { t: 'هزار',    txt: 'لحد ما نلاقي نفسنا بنتكلم لغايه الفجر' },
    { t: 'ضحكة',    txt: 'الضحكة اللي بتيجي فجأة في وسط كلام جدي، وبتخلي اليوم كله يبقى أخف.' },
    
    { t: 'سهر',     txt: 'بعد 12، لما الدنيا تهدى، وتبدأ أحلى حكاوينا.' },
    { t: 'تفصيلة',  txt: 'بتفتكري حاجة قلتها مرة واحدة، وبتسألي عنها بعد أسبوع.' },
    { t: 'مكان',    txt: 'الأماكن اللي بنقول هنروحها، وبنتخيل شكلها سوا.' }
  ]
};


/* =================================================================
   Utils
   ================================================================= */
const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(hover: none)').matches;

const lerp  = (a, b, t) => a + (b - a) * t;
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

function observe(elements, cb, opts = {}) {
  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => cb(el));
    return null;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        cb(e.target);
        if (!opts.repeat) io.unobserve(e.target);
      }
    });
  }, Object.assign({ threshold: 0.15, rootMargin: '0px 0px -8% 0px' }, opts));
  elements.forEach(el => io.observe(el));
  return io;
}

function splitLetters(el) {
  const txt = el.textContent.trim();
  el.textContent = '';
  const frag = document.createDocumentFragment();
  Array.from(txt).forEach((ch, i) => {
    const s = document.createElement('span');
    s.className = 'letter';
    s.textContent = ch === ' ' ? '\u00A0' : ch;
    s.style.setProperty('--i', (i * 0.08) + 's');
    frag.appendChild(s);
  });
  el.appendChild(frag);
}

function buildStars(container, count, brightRatio = 0.15) {
  if (!container) return;
  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const s = document.createElement('span');
    s.style.top  = Math.random() * 100 + '%';
    s.style.left = Math.random() * 100 + '%';
    s.style.animationDelay = (Math.random() * 4).toFixed(2) + 's';
    s.style.animationDuration = (2.5 + Math.random() * 3).toFixed(2) + 's';
    if (Math.random() < brightRatio) s.classList.add('bright');
    frag.appendChild(s);
  }
  container.appendChild(frag);
}

function buildDust() {
  const c = $('#dust');
  if (!c || reduced) return;
  const n = window.innerWidth < 720 ? 14 : 26;
  for (let i = 0; i < n; i++) {
    const s = document.createElement('span');
    s.style.left = Math.random() * 100 + '%';
    s.style.top  = (100 + Math.random() * 30) + '%';
    s.style.animationDelay = (Math.random() * 18) + 's';
    s.style.animationDuration = (14 + Math.random() * 10) + 's';
    s.style.opacity = (0.3 + Math.random() * 0.6).toFixed(2);
    c.appendChild(s);
  }
}

function buildFairyLights() {
  const c = $('#finalFairy');
  if (!c || reduced) return;
  for (let i = 0; i < 18; i++) {
    const s = document.createElement('span');
    s.style.top  = (15 + Math.random() * 40) + '%';
    s.style.left = Math.random() * 100 + '%';
    s.style.animationDelay = (Math.random() * 4).toFixed(2) + 's';
    s.style.animationDuration = (3 + Math.random() * 3).toFixed(2) + 's';
    c.appendChild(s);
  }
}


/* =================================================================
   Atmosphere
   ================================================================= */
const Atmo = {
  layers: {},
  current: null,

  init() {
    $$('.atmo__layer').forEach(l => {
      const key = l.className.match(/atmo__layer--(\w+)/);
      if (key) this.layers[key[1]] = l;
    });

    this.set('dawn');

    const sections = $$('section[data-atm]');
    if (!('IntersectionObserver' in window)) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.set(entry.target.dataset.atm);
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

    sections.forEach(s => io.observe(s));
  },

  set(name) {
    if (!name || name === this.current) return;
    if (!this.layers[name]) return;

    Object.values(this.layers).forEach(l => l.classList.remove('is-on'));
    this.layers[name].classList.add('is-on');
    this.current = name;
    document.body.dataset.atm = name;
  }
};


/* =================================================================
   Rail (chapter dots)
   ================================================================= */
const Rail = {
  dots: [],
  fill: null,
  list: null,

  init() {
    const sections = $$('section.ch[data-title]');
    if (!sections.length) return;

    this.list = $('#railDots');
    this.fill = $('#railFill');
    if (!this.list) return;

    sections.forEach((sec, i) => {
      const li = document.createElement('li');
      li.setAttribute('title', sec.dataset.title || '');
      li.addEventListener('click', () => {
        sec.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
      });
      this.list.appendChild(li);
      this.dots.push(li);
    });

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const i = sections.indexOf(entry.target);
          if (i >= 0) this.setActive(i);
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

    sections.forEach(s => io.observe(s));
  },

  setActive(i) {
    this.dots.forEach((d, j) => d.classList.toggle('is-on', j === i));
    const pct = this.dots.length > 1 ? (i / (this.dots.length - 1)) * 100 : 0;
    if (this.fill) this.fill.style.height = pct + '%';
  }
};


/* =================================================================
   Progress topline
   ================================================================= */
const Topline = {
  init() {
    const fill = $('#topFill');
    if (!fill) return;
    let raf = false;
    const update = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      fill.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
      raf = false;
    };
    window.addEventListener('scroll', () => {
      if (!raf) { raf = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }
};


/* =================================================================
   Parallax
   ================================================================= */
const Parallax = {
  items: [],

  init() {
    if (reduced) return;
    this.items = $$('[data-par]');
    if (!this.items.length) return;

    let raf = false;
    const update = () => {
      const vh = window.innerHeight;
      this.items.forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -150 || r.top > vh + 150) return;
        const speed = parseFloat(el.dataset.par) || 0.1;
        const center = r.top + r.height / 2;
        const offset = (center - vh / 2) * -speed;
        el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
      });
      raf = false;
    };
    window.addEventListener('scroll', () => {
      if (!raf) { raf = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }
};


/* =================================================================
   Cursor light
   ================================================================= */
const Cursor = {
  init() {
    if (isTouch || reduced) return;
    const el = $('#cursorLight');
    if (!el) return;
    let tx = 0, ty = 0, x = 0, y = 0, has = false;

    window.addEventListener('mousemove', (e) => {
      tx = e.clientX; ty = e.clientY;
      if (!has) {
        x = tx; y = ty; has = true;
        document.body.classList.add('has-cursor');
      }
    }, { passive: true });

    const loop = () => {
      x = lerp(x, tx, 0.1);
      y = lerp(y, ty, 0.1);
      el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    };
    loop();
  }
};


/* =================================================================
   Intro
   ================================================================= */
const Intro = {
  init() {
    const btn = $('#startBtn');
    const ov  = $('#intro');
    if (!btn || !ov) return;

    btn.addEventListener('click', () => {
      Sound.start();
      ov.classList.add('is-done');
      document.body.classList.remove('is-locked');
      document.body.classList.add('is-started');
      setTimeout(() => {
        const first = $('#ch-1');
        if (first) first.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
      }, 500);
    });
  }
};


/* =================================================================
   Sound
   ================================================================= */
const Sound = {
  audio: null,
  btn: null,
  started: false,

  init() {
    this.audio = $('#audio');
    this.btn = $('#soundBtn');
    if (!this.audio || !this.btn) return;
    if (CONFIG.musicSrc) this.audio.src = CONFIG.musicSrc;

    this.btn.addEventListener('click', () => this.toggle());
    this.audio.addEventListener('play',  () => this.ui(true));
    this.audio.addEventListener('pause', () => this.ui(false));
  },

  start() {
    if (this.started) return;
    this.started = true;
    if (!CONFIG.musicSrc) return;
    this.audio.volume = 0.55;
    this.audio.play().catch(() => {});
  },

  toggle() {
    if (!CONFIG.musicSrc) {
      Modal.open({ lbl: 'الموسيقى', ttl: 'لسه مفيش أغنية', txt: 'ضيفي رابط الأغنية في CONFIG.musicSrc جوه script.js.' });
      return;
    }
    if (this.audio.paused) this.audio.play().catch(() => {});
    else this.audio.pause();
  },

  ui(playing) {
    if (!this.btn) return;
    this.btn.classList.toggle('is-playing', playing);
    this.btn.setAttribute('aria-pressed', String(playing));
    this.btn.setAttribute('aria-label', playing ? 'إيقاف' : 'تشغيل');
  }
};


/* =================================================================
   Reveal on scroll
   ================================================================= */
const Reveal = {
  init() {
    // split letters for the name
    const nameWord = $('.the-name__word');
    if (nameWord && !nameWord.dataset.split) {
      splitLetters(nameWord);
      nameWord.dataset.split = '1';
    }

    // the-name is-in
    const theName = $('.the-name');
    if (theName) {
      observe([theName], () => theName.classList.add('is-in'), { threshold: 0.4 });
    }

    // generic reveals
    const items = $$('[data-reveal]');
    if (!items.length) return;

    if (reduced) {
      items.forEach(el => el.classList.add('is-in'));
      return;
    }

    observe(items, (el) => el.classList.add('is-in'));
  }
};


/* =================================================================
   Talk cloud
   ================================================================= */
const Talk = {
  init() {
    const frags = $$('.frag');
    if (!frags.length) return;
    if (reduced) {
      frags.forEach(f => f.classList.add('is-in'));
      return;
    }

    let raf = false;
    const update = () => {
      const vh = window.innerHeight;
      frags.forEach(f => {
        const r = f.getBoundingClientRect();
        // when the frag is in viewport center area, reveal
        const inView = r.top < vh * 0.75 && r.bottom > vh * 0.15;
        if (inView) f.classList.add('is-in');
      });
      raf = false;
    };

    window.addEventListener('scroll', () => {
      if (!raf) { raf = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }
};


/* =================================================================
   Day counter
   ================================================================= */
const Counter = {
  els: {},

  init() {
    this.els.days = $('#counterDays');
    this.els.hours = $('#detailHours');
    this.els.minutes = $('#detailMinutes');
    this.els.seconds = $('#detailSeconds');
    if (!this.els.days) return;

    this.tick();
    setInterval(() => this.tick(), 1000);

    $('#dayCounter')?.addEventListener('click', () => {
      Modal.open(CONFIG.eggs.counter);
    });
  },

  tick() {
    const start = new Date(CONFIG.startDate + 'T00:00:00').getTime();
    const now = Date.now();
    const diff = Math.max(0, now - start);

    const days    = Math.floor(diff / 86400000);
    const hours   = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    this.animate(this.els.days,    days);
    this.animate(this.els.hours,   hours);
    this.animate(this.els.minutes, minutes);
    this.animate(this.els.seconds, seconds);
  },

  animate(el, val) {
    if (!el) return;
    const current = parseInt(el.textContent.replace(/[^\d]/g, ''), 10);
    if (current === val) return;
    el.textContent = val.toLocaleString('ar-EG');
  }
};


/* =================================================================
   Little things
   ================================================================= */
const Little = {
  init() {
    const field = $('#littleField');
    if (!field) return;
    CONFIG.littleItems.forEach(item => {
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'lit';
      el.innerHTML = `
        <span class="lit__plus" aria-hidden="true"></span>
        <span class="lit__title">${item.t}</span>
        <span class="lit__body"><p>${item.txt}</p></span>
      `;
      el.addEventListener('click', () => el.classList.toggle('is-open'));
      field.appendChild(el);
    });
  }
};


/* =================================================================
   Whisper box (details)
   ================================================================= */
const Whisper = {
  init() {
    const btn = $('#whisperBox');
    const rev = $('#whisperReveal');
    if (!btn || !rev) return;
    btn.addEventListener('click', () => {
      rev.hidden = !rev.hidden;
    });
  }
};


/* =================================================================
   Modal
   ================================================================= */
const Modal = {
  el: null, lbl: null, ttl: null, txt: null, lastFocus: null,

  init() {
    this.el = $('#modal');
    this.lbl = $('#mLabel');
    this.ttl = $('#mTitle');
    this.txt = $('#mText');
    if (!this.el) return;

    $$('[data-close]', this.el).forEach(el =>
      el.addEventListener('click', () => this.close())
    );
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.el.classList.contains('is-open')) this.close();
    });
  },

  open({ lbl = '', ttl = '', txt = '' }) {
    if (!this.el) return;
    this.lastFocus = document.activeElement;
    if (this.lbl) this.lbl.textContent = lbl;
    if (this.ttl) this.ttl.textContent = ttl;
    if (this.txt) this.txt.textContent = txt;
    this.el.hidden = false;
    requestAnimationFrame(() => {
      this.el.classList.add('is-open');
      $('[data-close]', this.el)?.focus();
    });
  },

  close() {
    if (!this.el) return;
    this.el.classList.remove('is-open');
    setTimeout(() => {
      this.el.hidden = true;
      if (this.lastFocus && this.lastFocus.focus) this.lastFocus.focus();
    }, 400);
  }
};


/* =================================================================
   Eggs
   ================================================================= */
const Eggs = {
  found: new Set(),
  total: 5,
  counterEl: null,
  trackEl: null,

  init() {
    this.counterEl = $('#eggCount');
    this.trackEl   = $('#eggTrack');

    $('#dayCounter')?.addEventListener('click', () => this.mark('counter'));
    $('#eggLily')?.addEventListener('click', () => {
      this.mark('lily');
      Modal.open(CONFIG.eggs.lily);
    });
    $('#eggNick')?.addEventListener('click', () => {
      this.mark('nickname');
      Modal.open(CONFIG.eggs.nickname);
    });
    $('#eggStar')?.addEventListener('click', () => {
      this.mark('star');
      Modal.open(CONFIG.eggs.star);
    });
    $('#eggDrift')?.addEventListener('click', () => {
      this.mark('drift');
      Modal.open(CONFIG.eggs.drift);
    });

    this.ui();
  },

  mark(id) {
    if (this.found.has(id)) return;
    this.found.add(id);
    this.ui();
    if (this.found.size === this.total) {
      setTimeout(() => Unlock.open(), 1500);
    }
  },

  ui() {
    if (this.counterEl) {
      this.counterEl.textContent = `${this.found.size}/${this.total}`;
    }
    if (this.trackEl) {
      this.trackEl.classList.toggle('is-complete', this.found.size === this.total);
    }
  }
};


/* =================================================================
   Password / secret letter
   ================================================================= */
const Secret = {
  init() {
    const form = $('#passForm');
    const input = $('#passInput');
    const msg = $('#passMsg');
    const letter = $('#letter');
    if (!form || !input || !msg || !letter) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = (input.value || '').trim();

      const norm = (s) => s
        .replace(/[إأآا]/g, 'ا')
        .replace(/ة/g, 'ه')
        .replace(/ى/g, 'ي')
        .replace(/\s+/g, '');

      if (norm(val) === norm(CONFIG.password)) {
        msg.textContent = 'عرفتيها... زي ما كنت متوقع.';
        msg.className = 'pass__msg is-ok';
        form.style.display = 'none';
        letter.hidden = false;
        setTimeout(() => {
          letter.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
        }, 200);
      } else {
        msg.textContent = 'لأ... حاولي تاني. إنتِ عارفة الإجابة.';
        msg.className = 'pass__msg is-err';
        input.focus();
        input.select?.();
      }
    });
  }
};


/* =================================================================
   Unlock overlay
   ================================================================= */
const Unlock = {
  el: null, closeBtn: null, lastFocus: null,

  init() {
    this.el = $('#unlock');
    this.closeBtn = $('#unlockClose');
    if (!this.el) return;
    this.closeBtn?.addEventListener('click', () => this.close());
  },

  open() {
    if (!this.el) return;
    this.lastFocus = document.activeElement;
    this.el.hidden = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => {
      this.el.classList.add('is-open');
      this.closeBtn?.focus();
    });
  },

  close() {
    if (!this.el) return;
    this.el.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => {
      this.el.hidden = true;
      if (this.lastFocus && this.lastFocus.focus) this.lastFocus.focus();
    }, 1000);
  }
};


/* =================================================================
   Back to top
   ================================================================= */
const BackTop = {
  init() {
    const btn = $('#backTop');
    if (!btn) return;
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });
  }
};


/* =================================================================
   Images
   ================================================================= */
function applyImages() {
  $$('img[data-img]').forEach(img => {
    const key = img.dataset.img;
    if (CONFIG.images[key]) img.src = CONFIG.images[key];
  });
}


/* =================================================================
   Boot
   ================================================================= */
function boot() {
  applyImages();

  // Stars and particles
  buildDust();
  buildStars($('#nightStars'), 100, 0.2);
  buildStars($('#futureStars'), 80, 0.15);
  buildStars($('#secretStars'), 70, 0.15);
  buildStars($('#finalStars'), 120, 0.2);
  buildStars($('#unlockStars'), 90, 0.2);
  buildFairyLights();

  // Modules
  Atmo.init();
  Rail.init();
  Topline.init();
  Parallax.init();
  Cursor.init();
  Intro.init();
  Sound.init();
  Reveal.init();
  Talk.init();
  Counter.init();
  Little.init();
  Whisper.init();
  Modal.init();
  Eggs.init();
  Secret.init();
  Unlock.init();
  BackTop.init();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
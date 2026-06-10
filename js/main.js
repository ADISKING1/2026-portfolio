/* ============================================================
   INK — renderer & interactions.
   Reads window.PORTFOLIO (config.js) and builds the page.
   You shouldn't need to touch this file to customize the site.
   ============================================================ */

(function () {
  "use strict";

  const C = window.PORTFOLIO;
  if (!C || !C.name) {
    document.getElementById("main").innerHTML =
      '<p style="margin:6rem auto;max-width:40rem;text-align:center">Missing or invalid <code>config.js</code> — make sure it defines <code>window.PORTFOLIO</code>.</p>';
    return;
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  /* ---- helpers ------------------------------------------------ */

  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[c]));

  const initials = (name) =>
    name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  const has = (v) => (Array.isArray(v) ? v.length > 0 : Boolean(v));

  function hexToHsl(hex) {
    let h = (hex || "").replace("#", "");
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    if (!/^[0-9a-fA-F]{6}$/.test(h)) h = "ff4d00";
    const r = parseInt(h.slice(0, 2), 16) / 255;
    const g = parseInt(h.slice(2, 4), 16) / 255;
    const b = parseInt(h.slice(4, 6), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const l = (max + min) / 2;
    let hue = 0, s = 0;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) hue = (g - b) / d + (g < b ? 6 : 0);
      else if (max === g) hue = (b - r) / d + 2;
      else hue = (r - g) / d + 4;
      hue *= 60;
    }
    return {
      h: Math.round(hue),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
      lum: 0.2126 * r + 0.7152 * g + 0.0722 * b,
    };
  }

  /* ---- theme / accent ------------------------------------------ */

  const theme = C.theme || {};
  const accent = theme.accent || "#ff4d00";
  const accentHsl = hexToHsl(accent);
  const root = document.documentElement;
  root.style.setProperty("--accent", accent);
  root.style.setProperty("--on-accent", accentHsl.lum > 0.45 ? "#100f0d" : "#f4f1ea");

  const THEME_KEY = "portfolio-theme";

  function resolveTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "dark" || saved === "light") return saved;
    if (theme.mode === "light") return "light";
    if (theme.mode === "auto")
      return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    return "dark";
  }

  function applyTheme(mode) {
    root.setAttribute("data-theme", mode);
    document.querySelectorAll(".theme-toggle").forEach((b) => {
      b.textContent = mode === "dark" ? "Paper" : "Ink";
      b.setAttribute("aria-label", mode === "dark" ? "Switch to light theme" : "Switch to dark theme");
    });
  }

  /* ---- head: title, meta, favicon -------------------------------- */

  const role = (C.hero && C.hero.roles && C.hero.roles[0]) || "";
  document.title = (C.meta && C.meta.title) || `${C.name}${role ? " — " + role : ""}`;
  if (C.meta && C.meta.description) {
    const md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute("content", C.meta.description);
  }

  const favicon = document.createElement("link");
  favicon.rel = "icon";
  favicon.type = "image/svg+xml";
  favicon.href =
    "data:image/svg+xml," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="${accent}"/><text x="32" y="43" font-family="Arial, sans-serif" font-size="26" font-weight="900" fill="${
        accentHsl.lum > 0.45 ? "#100f0d" : "#ffffff"
      }" text-anchor="middle">${esc(initials(C.name))}</text></svg>`
    );
  document.head.appendChild(favicon);

  /* ---- project covers --------------------------------------------- */

  function coverStyle(p) {
    if (p.image) return `background-image:url('${esc(p.image)}')`;
    let hash = 0;
    for (const ch of String(p.title)) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
    const h1 = (accentHsl.h + (Math.abs(hash) % 80) - 40 + 360) % 360;
    const h2 = (h1 + 45 + (Math.abs(hash >> 4) % 40)) % 360;
    return `background-image:linear-gradient(130deg, hsl(${h1} 75% 50%), hsl(${h2} 80% 28%))`;
  }

  /* ---- sections ----------------------------------------------------- */

  const avail = (C.hero && C.hero.availability) || {};

  function heroHTML() {
    const h = C.hero || {};
    const year = new Date().getFullYear();
    return `
      <section class="hero" id="top" data-cursor="Play">
        <canvas class="hero__canvas" aria-hidden="true"></canvas>
        <div class="hero__fallback" aria-hidden="true">${esc(C.name)}</div>
        <h1 class="sr-only">${esc(C.name)}${role ? " — " + esc(role) : ""}</h1>
        <div class="hero__corner hero__corner--tl mono">Portfolio<br/>© ${year}</div>
        <div class="hero__corner hero__corner--tr mono">
          ${avail.show ? `<span class="status-dot"></span>${esc(avail.text || "Open to work")}<br/>` : ""}
          ${C.location ? esc(C.location) : ""}
        </div>
        ${
          h.tagline
            ? `<div class="hero__corner hero__corner--bl"><strong>${esc(
                (h.roles && h.roles[0]) || ""
              )}</strong><br/>${esc(h.tagline)}</div>`
            : ""
        }
        <div class="hero__corner hero__corner--br mono">
          ${(h.roles || []).map((r, i) => `<span>${i ? "" : '<span class="accent">✦</span> '}${esc(r)}</span>`).join("")}
          <span class="accent">[ scroll ]</span>
        </div>
      </section>`;
  }

  function bandsHTML() {
    const items = [];
    if (avail.show) items.push(avail.text || "Open to work");
    items.push(...((C.hero && C.hero.roles) || []));
    if (C.location) items.push(C.location);
    if (items.length < 2) return "";
    const chunk = `<span class="band__chunk">${items.map((i) => `<span>${esc(i)}</span><span aria-hidden="true">✦</span>`).join("")}</span>`;
    const track = (n) => Array(n).fill(chunk).join("");
    const skills = (C.skills || []).flatMap((g) => g.items || []);
    const ghostChunk = skills.length
      ? `<span class="band__chunk">${skills.map((s) => `<span>${esc(s)}</span><span aria-hidden="true">/</span>`).join("")}</span>`
      : chunk;
    return `
      <div class="bands" aria-hidden="true">
        <div class="band band--solid"><div class="band__track">${track(6)}</div></div>
        <div class="band band--ghost"><div class="band__track">${ghostChunk}${ghostChunk}${ghostChunk}</div></div>
      </div>`;
  }

  function sectionFrame(id, num, title, meta, wm, inner, extraClass = "") {
    return `
      <section class="section ${extraClass}" id="${id}">
        <div class="section__bar">
          <span class="mono section__index">${num}</span>
          <h2 class="section__title" aria-label="${esc(title)}"><span aria-hidden="true" data-decode>${esc(title)}</span></h2>
          ${meta ? `<span class="mono section__meta">${meta}</span>` : ""}
        </div>
        <div class="section__body">
          <span class="wm" aria-hidden="true">${esc(wm)}</span>
          ${inner}
        </div>
      </section>`;
  }

  function workHTML(num) {
    if (!has(C.projects)) return "";
    const rows = C.projects
      .map((p, i) => {
        const main = p.link || p.repo;
        const title = `<span class="workrow__title">${esc(p.title)}${p.featured ? '<span class="workrow__star">✦</span>' : ""}</span>`;
        return `
        <li>
          <div class="workrow reveal" data-peek="${i}" data-cursor="View">
            <span class="workrow__index mono">${String(i + 1).padStart(2, "0")}</span>
            <div class="workrow__main">
              ${
                main
                  ? `<a href="${esc(main)}" target="_blank" rel="noopener" aria-label="${esc(p.title)}">${title}</a>`
                  : title
              }
            </div>
            <span class="workrow__tech mono">${(p.tech || []).slice(0, 4).map(esc).join(" · ")}</span>
            <div class="workrow__links">
              ${p.link ? `<a href="${esc(p.link)}" target="_blank" rel="noopener">Live ↗</a>` : ""}
              ${p.repo ? `<a href="${esc(p.repo)}" target="_blank" rel="noopener">Code ↗</a>` : ""}
            </div>
            <span class="workrow__arrow" aria-hidden="true">↗</span>
            ${p.description ? `<p class="workrow__desc">${esc(p.description)}</p>` : ""}
          </div>
        </li>`;
      })
      .join("");
    return sectionFrame(
      "work",
      num,
      "Selected Work",
      `${C.projects.length} projects`,
      "Work",
      `<ul class="worklist">${rows}</ul>`
    );
  }

  function aboutHTML(num) {
    const a = C.about || {};
    if (!has(a.paragraphs) && !has(a.stats)) return "";
    const paras = a.paragraphs || [];
    const ringText = (avail.show ? avail.text || "Open to work" : `${C.name}`) + " ✦ ";
    const inner = `
      <div class="about__grid">
        <div class="about__text reveal">
          ${paras[0] ? `<p class="about__lede">${esc(paras[0])}</p>` : ""}
          ${paras.slice(1).map((p) => `<p>${esc(p)}</p>`).join("")}
        </div>
        <div class="about__rail reveal" style="--d:.12s">
          <div class="badge">
            <svg class="badge__ring" viewBox="0 0 100 100" aria-hidden="true">
              <defs><path id="ring-path" d="M 50 50 m -44 0 a 44 44 0 1 1 88 0 a 44 44 0 1 1 -88 0"/></defs>
              <text><textPath href="#ring-path">${esc((ringText.repeat(3)).slice(0, 86))}</textPath></text>
            </svg>
            <div class="badge__avatar">
              ${a.photo ? `<img src="${esc(a.photo)}" alt="Portrait of ${esc(C.name)}"/>` : `<span aria-hidden="true">${esc(initials(C.name))}</span>`}
            </div>
          </div>
          <dl class="meta-table">
            ${C.location ? `<div><dt>Location</dt><dd>${esc(C.location)}</dd></div>` : ""}
            ${C.email ? `<div><dt>Email</dt><dd><a href="mailto:${esc(C.email)}">${esc(C.email)}</a></dd></div>` : ""}
            ${role ? `<div><dt>Focus</dt><dd>${esc(role)}</dd></div>` : ""}
            ${
              C.resume && C.resume.url
                ? `<div><dt>Résumé</dt><dd><a href="${esc(C.resume.url)}" target="_blank" rel="noopener">${esc(C.resume.label || "Download")} ↗</a></dd></div>`
                : ""
            }
          </dl>
        </div>
      </div>
      ${
        has(a.stats)
          ? `<div class="stats reveal">${a.stats
              .map(
                (s) => `
                <div class="stat">
                  <div class="stat__value"><span class="stat__num" data-target="${Number(s.value) || 0}">0</span>${esc(s.suffix || "")}</div>
                  <div class="stat__label mono">${esc(s.label)}</div>
                </div>`
              )
              .join("")}</div>`
          : ""
      }`;
    return sectionFrame("about", num, "About", C.location ? esc(C.location) : "", "About", inner);
  }

  function experienceHTML(num) {
    if (!has(C.experience)) return "";
    const rows = C.experience
      .map(
        (e) => `
        <div class="xp__row reveal">
          <span class="xp__period mono">${esc(e.period || "")}</span>
          <div>
            <h3 class="xp__role">${esc(e.role)}</h3>
            ${
              e.company
                ? e.companyUrl
                  ? `<a class="xp__company" href="${esc(e.companyUrl)}" target="_blank" rel="noopener">@ ${esc(e.company)} ↗</a>`
                  : `<span class="xp__company">@ ${esc(e.company)}</span>`
                : ""
            }
          </div>
          <div>
            ${e.summary ? `<p class="xp__summary">${esc(e.summary)}</p>` : ""}
            ${has(e.tech) ? `<p class="xp__tech mono">${e.tech.map(esc).join(" / ")}</p>` : ""}
          </div>
        </div>`
      )
      .join("");
    return sectionFrame(
      "experience",
      num,
      "Experience",
      `${C.experience.length} roles`,
      "Career",
      `<div class="xp">${rows}</div>`
    );
  }

  function stackHTML(num) {
    if (!has(C.skills)) return "";
    const count = C.skills.reduce((n, g) => n + (g.items || []).length, 0);
    const groups = C.skills
      .map(
        (g, i) => `
        <div class="stack__group reveal" style="--d:${i * 0.08}s">
          <h3>${esc(g.category)}</h3>
          <ul>${(g.items || []).map((it) => `<li>${esc(it)}</li>`).join("")}</ul>
        </div>`
      )
      .join("");
    return sectionFrame(
      "stack",
      num,
      "Stack",
      `${count} tools`,
      "Stack",
      `<div class="stack">${groups}</div>`
    );
  }

  function contactHTML(num) {
    const ct = C.contact || {};
    if (!C.email && !has(C.socials)) return "";
    const inner = `
      <h2 class="contact__heading reveal" aria-label="${esc(ct.heading || "Get in touch")}"><span aria-hidden="true" data-decode>${esc(
        ct.heading || "Get in touch"
      )}</span></h2>
      ${ct.text ? `<p class="contact__text reveal" style="--d:.08s">${esc(ct.text)}</p>` : ""}
      ${
        C.email
          ? `<div class="contact__actions reveal" style="--d:.16s">
              <a class="contact__email" href="mailto:${esc(C.email)}">${esc(C.email)}</a>
              <span class="copy-email">
                <button class="copy-btn" type="button" data-copy="${esc(C.email)}">Copy</button>
              </span>
            </div>`
          : ""
      }
      ${
        has(C.socials)
          ? `<nav class="socials reveal" style="--d:.24s" aria-label="Social links">
              ${C.socials
                .map(
                  (s) =>
                    `<a href="${esc(s.url)}" target="_blank" rel="noopener"><span>${esc(s.platform)}</span><span aria-hidden="true">↗</span></a>`
                )
                .join("")}
            </nav>`
          : ""
      }`;
    return sectionFrame("contact", num, "Contact", avail.show ? esc(avail.text || "") : "", "Say hi", inner, "contact");
  }

  /* ---- assemble ------------------------------------------------------ */

  const SECTIONS = [
    { id: "work", label: "Work", build: workHTML },
    { id: "about", label: "About", build: aboutHTML },
    { id: "experience", label: "Experience", build: experienceHTML },
    { id: "stack", label: "Stack", build: stackHTML },
    { id: "contact", label: "Contact", build: contactHTML },
  ];

  let counter = 0;
  const rendered = SECTIONS.map((s) => {
    const num = String(counter + 1).padStart(2, "0");
    const html = s.build(num);
    if (html) counter++;
    return { ...s, num: String(counter).padStart(2, "0"), html };
  }).filter((s) => s.html);

  document.getElementById("bar-root").innerHTML = `
    <div class="bar" id="bar">
      <a class="bar__name" href="#top">${esc(C.logo || C.name)}<span class="accent"> ✦</span></a>
      <nav class="bar__links" aria-label="Primary">
        ${rendered.map((s) => `<a href="#${s.id}" data-nav="${s.id}"><sup>${s.num}</sup>${s.label}</a>`).join("")}
      </nav>
      <div class="bar__right">
        <button class="theme-toggle" type="button"></button>
        <button class="bar__burger" type="button" aria-label="Open menu" aria-expanded="false">Menu</button>
      </div>
    </div>`;

  document.getElementById("overlay-root").innerHTML = `
    <div class="overlay" id="overlay" aria-hidden="true">
      <button class="overlay__close" type="button">Close</button>
      <nav class="overlay__links" aria-label="Menu">
        ${rendered.map((s, i) => `<a href="#${s.id}" style="--i:${i}"><sup>${s.num}</sup><span data-decode>${s.label}</span></a>`).join("")}
      </nav>
      <div class="overlay__meta mono">
        ${C.email ? `<span>${esc(C.email)}</span>` : ""}
        ${C.location ? `<span>${esc(C.location)}</span>` : ""}
      </div>
    </div>`;

  document.getElementById("main").innerHTML =
    heroHTML() + bandsHTML() + rendered.map((s) => s.html).join("");

  const year = new Date().getFullYear();
  const note = (C.footer && C.footer.note) || "";
  document.getElementById("footer-root").innerHTML = `
    <div class="footer mono">
      <span>© ${year} ${esc(C.name)}</span>
      ${note ? `<span>${esc(note)}</span>` : ""}
      <span class="footer__time">Local — <span id="clock">00:00:00</span></span>
      <a class="footer__top" href="#top">Back to top ↑</a>
    </div>`;

  applyTheme(resolveTheme());

  /* ============================================================
     INTERACTIONS
     ============================================================ */

  /* Theme toggle */
  document.querySelector(".theme-toggle").addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
    if (field) field.refreshColors();
  });

  /* Overlay menu */
  const overlay = document.getElementById("overlay");
  const burger = document.querySelector(".bar__burger");
  let overlayDecoded = false;

  function setOverlay(open) {
    overlay.classList.toggle("is-open", open);
    overlay.setAttribute("aria-hidden", String(!open));
    burger.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("is-locked", open);
    if (open && !overlayDecoded && !reducedMotion) {
      overlayDecoded = true;
      overlay.querySelectorAll("[data-decode]").forEach(decode);
    }
  }

  burger.addEventListener("click", () => setOverlay(true));
  overlay.querySelector(".overlay__close").addEventListener("click", () => setOverlay(false));
  overlay.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOverlay(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOverlay(false);
  });

  /* Bar background on scroll + progress hairline */
  const bar = document.getElementById("bar");
  const progress = document.querySelector(".scroll-progress");
  let scrollTick = false;
  window.addEventListener(
    "scroll",
    () => {
      if (scrollTick) return;
      scrollTick = true;
      requestAnimationFrame(() => {
        bar.classList.toggle("is-scrolled", window.scrollY > 10);
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
        updateWatermarks();
        scrollTick = false;
      });
    },
    { passive: true }
  );

  /* Watermark parallax */
  const wms = Array.from(document.querySelectorAll(".wm")).map((el) => ({
    el,
    section: el.closest(".section__body"),
  }));

  function updateWatermarks() {
    if (reducedMotion) return;
    const vh = window.innerHeight;
    for (const { el, section } of wms) {
      const r = section.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) continue;
      const p = (vh - r.top) / (vh + r.height); // 0..1 through viewport
      const x = (0.5 - p) * window.innerWidth * 0.28;
      const centered = el.closest(".contact") ? "translateX(-50%) " : "";
      el.style.transform = `${centered}translateX(${x}px)`;
    }
  }
  updateWatermarks();

  /* Reveal on scroll */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("is-visible");
          revealObserver.unobserve(en.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  /* Active nav link */
  const navAnchors = Array.from(document.querySelectorAll("[data-nav]"));
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        navAnchors.forEach((a) => a.classList.toggle("is-active", a.dataset.nav === en.target.id));
      });
    },
    { rootMargin: "-35% 0px -55% 0px" }
  );
  rendered.forEach((s) => {
    const el = document.getElementById(s.id);
    if (el) sectionObserver.observe(el);
  });

  /* Decoder effect */
  const GLYPHS = "▓▒░<>/*#%&@$0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  function decode(el, duration = 750) {
    const final = el.dataset.text || el.textContent;
    el.dataset.text = final;
    if (reducedMotion) {
      el.textContent = final;
      return;
    }
    const start = performance.now();
    const n = final.length;
    (function frame(now) {
      const t = Math.min((now - start) / duration, 1);
      const settled = Math.floor(t * 1.25 * n);
      let out = "";
      for (let i = 0; i < n; i++) {
        const ch = final[i];
        out += ch === " " || i < settled ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      el.textContent = out;
      if (t < 1) requestAnimationFrame(frame);
      else el.textContent = final;
    })(start);
  }

  const decodeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          decode(en.target);
          decodeObserver.unobserve(en.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  document.querySelectorAll("main [data-decode]").forEach((el) => decodeObserver.observe(el));

  /* Stat counters */
  function animateCount(el) {
    const target = Number(el.dataset.target) || 0;
    if (reducedMotion) {
      el.textContent = String(target);
      return;
    }
    const dur = 1300;
    const start = performance.now();
    (function tick(now) {
      const t = Math.min((now - start) / dur, 1);
      el.textContent = String(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) requestAnimationFrame(tick);
    })(start);
  }
  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          animateCount(en.target);
          statObserver.unobserve(en.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  document.querySelectorAll(".stat__num").forEach((el) => statObserver.observe(el));

  /* Copy email */
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    let timer;
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
      } catch {
        /* clipboard unavailable (e.g. http) — select-fallback */
        const ta = document.createElement("textarea");
        ta.value = btn.dataset.copy;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      const wrap = btn.closest(".copy-email");
      wrap.classList.add("is-copied");
      btn.textContent = "Copied ✓";
      clearTimeout(timer);
      timer = setTimeout(() => {
        wrap.classList.remove("is-copied");
        btn.textContent = "Copy";
      }, 1600);
    });
  });

  /* Local time */
  const clock = document.getElementById("clock");
  if (clock) {
    const fmt = new Intl.DateTimeFormat([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
    const tickClock = () => (clock.textContent = fmt.format(new Date()));
    tickClock();
    setInterval(tickClock, 1000);
  }

  /* Pointer-driven UI: custom cursor + floating work preview.
     Hover state re-syncs on scroll too — scrolling moves the page
     under a stationary cursor, so pointer events alone go stale. */
  if (finePointer && !reducedMotion) {
    root.classList.add("has-cursor");
    const cur = document.querySelector(".cursor");
    const dot = cur.querySelector(".cursor__dot");
    const ring = cur.querySelector(".cursor__ring");
    const label = cur.querySelector(".cursor__label");
    const peek = document.querySelector(".peek");
    const cover = peek.querySelector(".peek__cover");
    const desc = peek.querySelector(".peek__desc");

    const mouse = { x: -100, y: -100 };
    let rx = -100, ry = -100;
    let activeRow = null, on = false, px = 0, py = 0, tx = 0, ty = 0, peekRaf = null;

    function peekLoop() {
      px += (tx - px) * 0.16;
      py += (ty - py) * 0.16;
      const rot = Math.max(-7, Math.min(7, (tx - px) * 0.06));
      peek.style.transform = `translate(${px}px, ${py}px) rotate(${rot}deg) scale(${on ? 1 : 0.86})`;
      if (on || Math.abs(tx - px) > 0.5) peekRaf = requestAnimationFrame(peekLoop);
      else peekRaf = null;
    }

    function peekTarget() {
      const w = peek.offsetWidth || 380;
      const flip = mouse.x + w + 60 > window.innerWidth;
      tx = flip ? mouse.x - w - 30 : mouse.x + 26;
      ty = Math.min(mouse.y + 24, window.innerHeight - (peek.offsetHeight || 300) - 20);
    }

    function setRow(row) {
      if (row === activeRow) return;
      activeRow = row;
      const p = row && C.projects[Number(row.dataset.peek)];
      if (!p) {
        on = false;
        peek.classList.remove("is-on");
        return;
      }
      cover.setAttribute("style", coverStyle(p));
      cover.textContent = p.image ? "" : (p.title || "?")[0].toUpperCase();
      desc.textContent = p.description || "";
      desc.style.display = p.description ? "" : "none";
      const wasOn = on;
      on = true;
      peekTarget();
      if (!wasOn) {
        // snap to the cursor so the card doesn't fly in from an old spot
        px = tx;
        py = ty;
      }
      peek.classList.add("is-on");
      if (!peekRaf) peekRaf = requestAnimationFrame(peekLoop);
    }

    function syncHover() {
      if (mouse.x < 0) return;
      const el = document.elementFromPoint(mouse.x, mouse.y);
      const hot = el && el.closest && el.closest("a, button, [data-cursor]");
      cur.classList.toggle("is-hover", Boolean(hot));
      const labelled = el && el.closest && el.closest("[data-cursor]");
      if (labelled) {
        label.textContent = labelled.dataset.cursor;
        cur.classList.add("has-label");
      } else {
        cur.classList.remove("has-label");
      }
      const row =
        has(C.projects) && window.innerWidth > 900 && el && el.closest
          ? el.closest("[data-peek]")
          : null;
      setRow(row);
      if (on) {
        peekTarget();
        if (!peekRaf) peekRaf = requestAnimationFrame(peekLoop);
      }
    }

    window.addEventListener(
      "pointermove",
      (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        dot.style.transform = `translate(${mouse.x}px, ${mouse.y}px)`;
        syncHover();
      },
      { passive: true }
    );

    let hoverTick = false;
    window.addEventListener(
      "scroll",
      () => {
        if (hoverTick) return;
        hoverTick = true;
        requestAnimationFrame(() => {
          syncHover();
          hoverTick = false;
        });
      },
      { passive: true }
    );

    (function cursorLoop() {
      rx += (mouse.x - rx) * 0.18;
      ry += (mouse.y - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      label.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(cursorLoop);
    })();
  }

  /* ============================================================
     PARTICLE HERO
     ============================================================ */

  const heroEl = document.querySelector(".hero");
  const canvas = document.querySelector(".hero__canvas");
  let field = null;

  if (reducedMotion || !canvas.getContext) {
    heroEl.classList.add("no-canvas");
  } else {
    field = createField();
  }

  function createField() {
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0;
    let particles = [];
    let colors = { ink: "#ece8df", accent };
    let running = false, visible = true, rafId = null;
    const pointer = { x: -9999, y: -9999, last: 0 };

    function cssVar(name) {
      return getComputedStyle(root).getPropertyValue(name).trim();
    }

    function refreshColors() {
      colors.ink = cssVar("--text") || colors.ink;
    }

    /* Pick the largest text that fits: full name → first name → initials */
    function pickText() {
      const name = C.name.trim().toUpperCase();
      const first = name.split(/\s+/)[0];
      const candidates = [name, first, initials(C.name)];
      ctx.font = `900 100px ${dpr ? "" : ""}Archivo, sans-serif`;
      for (const text of candidates) {
        const w100 = ctx.measureText(text).width || 1;
        const size = Math.min((W * 0.92) / w100 * 100, H * 0.5);
        if (size > 64 || text === candidates[candidates.length - 1]) {
          return { text, size: Math.max(size, 40) };
        }
      }
      return { text: name, size: 60 };
    }

    function build() {
      W = heroEl.clientWidth;
      H = heroEl.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      refreshColors();

      const { text, size } = pickText();
      const off = document.createElement("canvas");
      off.width = W;
      off.height = H;
      const octx = off.getContext("2d");
      octx.fillStyle = "#fff";
      octx.textAlign = "center";
      octx.textBaseline = "middle";
      octx.font = `900 ${size}px Archivo, sans-serif`;
      if ("fontStretch" in octx) octx.fontStretch = "expanded";
      octx.fillText(text, W / 2, H / 2);

      const data = octx.getImageData(0, 0, W, H).data;
      const isSmall = W < 700;
      let gap = isSmall ? 4 : 5;
      const cap = isSmall ? 1400 : 3200;

      let pts = [];
      do {
        pts = [];
        for (let y = 0; y < H; y += gap) {
          for (let x = 0; x < W; x += gap) {
            if (data[(y * W + x) * 4 + 3] > 128) pts.push([x, y]);
          }
        }
        gap++;
      } while (pts.length > cap && gap < 14);

      particles = pts.map(([hx, hy], i) => ({
        hx,
        hy,
        x: W / 2 + (Math.random() - 0.5) * W * 1.4,
        y: H / 2 + (Math.random() - 0.5) * H * 1.4,
        vx: 0,
        vy: 0,
        accent: i % 13 === 0,
      }));
    }

    function step() {
      ctx.clearRect(0, 0, W, H);
      const now = performance.now();
      const influence = Math.max(0, 1 - (now - pointer.last) / 700);
      const R = 110;

      ctx.fillStyle = colors.ink;
      let accentBatch = [];
      for (const p of particles) {
        let ax = (p.hx - p.x) * 0.06;
        let ay = (p.hy - p.y) * 0.06;
        if (influence > 0) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < R * R && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const f = ((R - d) / R) * 7 * influence;
            ax += (dx / d) * f;
            ay += (dy / d) * f;
          }
        }
        p.vx = (p.vx + ax) * 0.86;
        p.vy = (p.vy + ay) * 0.86;
        p.x += p.vx;
        p.y += p.vy;
        if (p.accent) accentBatch.push(p);
        else ctx.fillRect(p.x, p.y, 2, 2);
      }
      ctx.fillStyle = colors.accent;
      for (const p of accentBatch) ctx.fillRect(p.x, p.y, 2.5, 2.5);

      if (running && visible && !document.hidden) rafId = requestAnimationFrame(step);
      else rafId = null;
    }

    function start() {
      if (!rafId) {
        running = true;
        rafId = requestAnimationFrame(step);
      }
    }

    canvas.addEventListener("pointermove", (e) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.last = performance.now();
    }, { passive: true });

    canvas.addEventListener("pointerdown", (e) => {
      const r = canvas.getBoundingClientRect();
      const bx = e.clientX - r.left;
      const by = e.clientY - r.top;
      for (const p of particles) {
        const dx = p.x - bx;
        const dy = p.y - by;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        if (d < 170) {
          const f = ((170 - d) / 170) * 22;
          p.vx += (dx / d) * f;
          p.vy += (dy / d) * f;
        }
      }
    });

    new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      if (visible) start();
    }).observe(heroEl);

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) start();
    });

    let lastW = window.innerWidth, lastH = window.innerHeight, resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const dw = Math.abs(window.innerWidth - lastW);
        const dh = Math.abs(window.innerHeight - lastH);
        if (dw > 2 || dh > 150) {
          lastW = window.innerWidth;
          lastH = window.innerHeight;
          build();
          start();
        }
      }, 200);
    });

    /* Wait for the display font so the sampled text matches the design */
    const boot = () => {
      build();
      start();
    };
    if (document.fonts && document.fonts.load) {
      Promise.all([document.fonts.load('900 100px "Archivo"')]).then(boot).catch(boot);
    } else {
      boot();
    }

    return { refreshColors };
  }
})();

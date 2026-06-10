/* ============================================================
   ✦ PORTFOLIO CONFIG — this is the only file you need to edit.
   Fill in your info below, open index.html, and you're done.
   Delete any section's content (e.g. projects: []) to hide it.
   ============================================================ */

window.PORTFOLIO = {

  /* ---- Basics ------------------------------------------------ */
  name: "Alex Carter",
  // Shown in the nav. Leave "" to auto-generate from your initials.
  logo: "",

  /* ---- Theme ------------------------------------------------- */
  theme: {
    accent: "#ff4d00",   // any hex color — drives the whole palette
    mode: "dark",        // "dark" (ink) | "light" (paper) | "auto"
  },

  /* ---- Browser tab / SEO ------------------------------------- */
  meta: {
    title: "",           // leave "" for "Name — Role"
    description: "Personal portfolio of Alex Carter, full-stack developer.",
  },

  /* ---- Hero -------------------------------------------------- */
  hero: {
    greeting: "Hi, my name is",
    // Rotating words after "I build things as a …"
    roles: ["Full-Stack Developer", "UI Engineer", "Open-Source Tinkerer"],
    tagline:
      "I design and build fast, accessible web experiences with an obsessive eye for detail — currently crafting products people actually enjoy using.",
    // Availability pill. Set show: false to hide it.
    availability: { show: true, text: "Open to new opportunities" },
  },

  location: "Toronto, Canada",
  email: "hello@alexcarter.dev",

  // Optional resume button (in the About card). Leave url "" to hide.
  resume: { url: "", label: "Download résumé" },

  /* ---- About ------------------------------------------------- */
  about: {
    // Optional photo path e.g. "assets/me.jpg". Leave "" for an
    // auto-generated initials avatar.
    photo: "",
    paragraphs: [
      "I'm a developer who cares about the details — the easing curve on a hover state, the empty state nobody tested, the 200ms that makes an app feel instant instead of sluggish.",
      "Over the last six years I've shipped products across fintech, dev-tools and e-commerce, working everywhere from two-person startups to platform teams serving millions of users.",
      "When I'm not coding, I'm probably hiking, making coffee far too seriously, or contributing to open source.",
    ],
    stats: [
      { value: 6, suffix: "+", label: "Years of experience" },
      { value: 40, suffix: "+", label: "Projects shipped" },
      { value: 12, suffix: "", label: "Open-source contribs" },
    ],
  },

  /* ---- Skills ------------------------------------------------ */
  skills: [
    {
      category: "Frontend",
      items: ["TypeScript", "React", "Next.js", "Vue", "Tailwind CSS", "CSS / Animations"],
    },
    {
      category: "Backend",
      items: ["Node.js", "Python", "PostgreSQL", "Redis", "GraphQL", "REST APIs"],
    },
    {
      category: "Tools & Platform",
      items: ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform", "Git"],
    },
  ],

  /* ---- Experience -------------------------------------------- */
  experience: [
    {
      role: "Senior Software Engineer",
      company: "Northwind Labs",
      companyUrl: "https://example.com",
      period: "2023 — Present",
      summary:
        "Lead engineer on the design-system and web-platform team. Cut page-load times 45% and shipped a component library now used by 9 product teams.",
      tech: ["TypeScript", "React", "Node.js", "AWS"],
    },
    {
      role: "Software Engineer",
      company: "Brightpath",
      companyUrl: "",
      period: "2021 — 2023",
      summary:
        "Built the payments and onboarding flows for a fintech serving 200k+ users. Owned the migration from a legacy monolith to a typed service architecture.",
      tech: ["Vue", "Python", "PostgreSQL", "Docker"],
    },
    {
      role: "Frontend Developer",
      company: "Studio Form",
      companyUrl: "",
      period: "2019 — 2021",
      summary:
        "Crafted award-nominated marketing sites and interactive experiences for clients in fashion and music — heavy on motion, light on load time.",
      tech: ["JavaScript", "GSAP", "WebGL", "Sanity"],
    },
  ],

  /* ---- Projects ----------------------------------------------
     image: optional path e.g. "assets/project.png". Leave "" for an
     auto-generated gradient cover. featured: true makes a card span
     the full row. link = live demo, repo = source code (either
     optional). ----------------------------------------------- */
  projects: [
    {
      title: "Pulseboard",
      description:
        "Real-time analytics dashboard with sub-second updates over WebSockets, custom charting engine, and a query builder non-engineers actually use.",
      tech: ["Next.js", "TypeScript", "WebSockets", "ClickHouse"],
      link: "https://example.com",
      repo: "https://github.com",
      image: "",
      featured: true,
    },
    {
      title: "Driftnotes",
      description:
        "Local-first markdown notes app with end-to-end encrypted sync, offline support, and instant full-text search across 10k+ notes.",
      tech: ["React", "CRDTs", "IndexedDB", "Rust/WASM"],
      link: "",
      repo: "https://github.com",
      image: "",
      featured: false,
    },
    {
      title: "Shipcheck",
      description:
        "CLI + GitHub Action that catches accessibility and performance regressions in CI before they reach production. 1.2k stars on GitHub.",
      tech: ["Node.js", "Lighthouse", "GitHub Actions"],
      link: "",
      repo: "https://github.com",
      image: "",
      featured: false,
    },
    {
      title: "Mosaic UI",
      description:
        "An open-source component library with 40+ accessible, themeable components — full keyboard support, RTL, and dark mode out of the box.",
      tech: ["React", "TypeScript", "Storybook", "Radix"],
      link: "https://example.com",
      repo: "https://github.com",
      image: "",
      featured: false,
    },
  ],

  /* ---- Contact ------------------------------------------------ */
  contact: {
    heading: "Let's build something great.",
    text:
      "I'm currently open to new roles and interesting freelance projects. My inbox is always open — whether you have a question or just want to say hi, I'll get back to you.",
  },

  /* ---- Socials -------------------------------------------------
     Supported platforms (icon is automatic): github, linkedin, x,
     twitter, instagram, youtube, dribbble, behance, mastodon,
     website. Anything else gets a letter icon. ------------------ */
  socials: [
    { platform: "github", url: "https://github.com/yourhandle" },
    { platform: "linkedin", url: "https://linkedin.com/in/yourhandle" },
    { platform: "x", url: "https://x.com/yourhandle" },
    { platform: "website", url: "https://yourdomain.dev" },
  ],

  /* ---- Footer -------------------------------------------------- */
  footer: {
    // Leave "" for the default "© year · name".
    note: "Designed & built with far too many cups of coffee.",
  },
};

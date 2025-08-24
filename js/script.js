window.addEventListener("load", () => {
  document.getElementById("y").textContent = new Date().getFullYear();

  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  /* Cinematic intro: letterbox bars close, hero reveals */
  const tl = gsap.timeline({ defaults:{ ease:"power4.out" }});

  tl.fromTo(".letterbox.top", { yPercent:0 }, { yPercent:-100, duration:1.1, delay:0.15 })
    .fromTo(".letterbox.bottom", { yPercent:0 }, { yPercent:100, duration:1.1 }, "<")
    .from(".brand", { y: -20, opacity:0, duration:0.6 }, "-=0.6")
    .from(".menu a", { y: -12, opacity:0, stagger:0.06, duration:0.5 }, "-=0.45")
    .from(".hero-grid", { opacity:0, duration:0.8 }, "-=0.5")
    .from(".headline span", { yPercent:120, opacity:0, stagger:0.12, duration:1.0 }, "-=0.3")
    .from(".lead", { y: 12, opacity:0, duration:0.7 }, "-=0.5")
    .from(".btn", { y: 10, opacity:0, stagger:0.08, duration:0.5 }, "-=0.5");

  /* Subtle parallax on background grid */
  gsap.to("body::before", {
    // Workaround: animate body pseudo via scroll by proxy element
    // We'll animate body background by moving a fixed overlay element instead.
  });

  /* Parallax shift of body::before – implemented via wrapper */
  const bg = document.body;
  ScrollTrigger.create({
    start:0, end: "max",
    onUpdate: (self) => {
      const y = self.progress * -120; // move upward slightly
      bg.style.setProperty("--bg-shift", y.toFixed(2) + "px");
    }
  });
  // Apply transform using CSS variable through inline style (fallback handled by transform below)
  const beforeShim = document.createElement("div");
  beforeShim.style.position="fixed";
  beforeShim.style.inset="0";
  beforeShim.style.zIndex="-2";
  beforeShim.style.transform="translateY(0)";
  document.body.appendChild(beforeShim);
  ScrollTrigger.create({
    start:0, end:"max", scrub: true,
    onUpdate: self => {
      beforeShim.style.transform = `translateY(${(-120* self.progress).toFixed(1)}px)`;
    }
  });

  /* About panels reveal */
  gsap.utils.toArray(".about .panel").forEach((el, i) => {
    gsap.from(el, {
      opacity:0, y: 24, duration:0.8, ease:"power3.out",
      scrollTrigger:{
        trigger: el, start:"top 80%", toggleActions:"play none none reverse"
      }
    });
  });

  /* Projects cards stagger in with a cinematic drift */
  gsap.utils.toArray(".projects .card").forEach((card, i) => {
    gsap.from(card, {
      opacity:0,
      y: 40,
      rotateX: 6,
      transformOrigin:"50% 100%",
      duration:0.9,
      ease:"power4.out",
      delay: i * 0.05,
      scrollTrigger:{
        trigger: card,
        start:"top 85%",
        toggleActions:"play none none reverse"
      }
    });

    // Ambient sheen sweep on media when entering view
    const media = card.querySelector(".media");
    if(media){
      gsap.fromTo(media, { clipPath: "inset(0 100% 0 0)" }, {
        clipPath: "inset(0 0% 0 0)",
        duration:1.1, ease:"power4.out",
        scrollTrigger:{ trigger: card, start:"top 80%" }
      });
    }
  });

  /* Statement marquee: slow drift + fade in */
  const mq = document.querySelector(".marquee");
  if(mq){
    gsap.fromTo(mq, { opacity:0, xPercent:-5 }, { opacity:0.06, xPercent:0, duration:1.2, ease:"power3.out",
      scrollTrigger:{ trigger: mq, start:"top 90%" }});
    gsap.to(mq, {
      x: "-50%",
      ease: "none",
      duration: 30,
      repeat: -1
    });
  }

  /* Header background intensity on scroll */
  ScrollTrigger.create({
    start: 0, end: 300,
    onUpdate: self => {
      const op = Math.min(0.95, 0.4 + self.progress*0.55);
      document.querySelector(".nav").style.background = `linear-gradient(180deg, rgba(14,14,15,${op}), rgba(14,14,15,${op*0.7}) 60%, rgba(14,14,15,0))`;
    }
  });

  /* Mobile Nav Toggle */
  const nav = document.querySelector(".nav");
  const menuBtn = document.querySelector(".menu-btn");
  const menuLinks = document.querySelectorAll(".menu a");

  menuBtn.addEventListener("click", () => {
    nav.classList.toggle("is-open");
    document.body.classList.toggle("is-frozen");
  });

  menuLinks.forEach(link => {
    link.addEventListener("click", () => {
      if (nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        document.body.classList.remove("is-frozen");
      }
    });
  });

  /* Back to Top Button Logic */
  const backToTopBtn = document.querySelector(".back-to-top");

  ScrollTrigger.create({
    start: "top -800", // When scrolling 800px down
    end: "max",
    toggleClass: {
      className: "is-visible",
      targets: backToTopBtn
    }
  });

  backToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    gsap.to(window, {
      scrollTo: { y: 0, autoKill: false },
      duration: 1.2,
      ease: "power3.inOut"
    });
  });
});

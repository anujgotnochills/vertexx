/* ============================================
   VERTEX — Cinematic Scroll Animation Engine
   Lenis • GSAP ScrollTrigger • SplitText

   KEY: Every section uses start: 'top bottom', end: 'center center'
   so animations COMPLETE when content is centered on screen.
   ============================================ */

(function () {
    'use strict';

    /* ─── LENIS SMOOTH SCROLL ─── */
    const lenis = new Lenis({
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    gsap.registerPlugin(ScrollTrigger, SplitText);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    const isMobile = window.innerWidth <= 768;


    /* ─── SCROLL PROGRESS BAR ─── */
    const progressBar = document.getElementById('scrollProgress');
    const scrollHint = document.getElementById('scrollHint');

    ScrollTrigger.create({
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
            progressBar.style.width = (self.progress * 100) + '%';
            if (self.progress > 0.02 && scrollHint) {
                scrollHint.classList.add('hidden');
            }
        }
    });


    /* ─── SMOOTH ANCHOR SCROLLING ─── */
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener('click', (e) => {
            const id = a.getAttribute('href');
            if (id === '#') return;
            const el = document.querySelector(id + '-wrap') || document.querySelector(id);
            if (el) { e.preventDefault(); lenis.scrollTo(el, { offset: -80 }); }
        });
    });


    /*
     * TRIGGER PATTERN:
     * start: 'top 80%'   → animation BEGINS when section top reaches 80% from viewport top
     * end: 'center center' → animation ENDS (complete) when section center hits viewport center
     * This means the animation finishes exactly when the content is centered on screen.
     */


    /* ═══════════════════════════════════════════
       SECTION 1 — HERO (special: starts visible)
       ═══════════════════════════════════════════ */
    const heroDot = document.getElementById('heroDot');
    const heroFrame = document.getElementById('heroFrame');
    const heroTitle = document.getElementById('heroTitle');
    const heroSub = document.getElementById('heroSub');

    gsap.set(heroTitle, { opacity: 0 });
    gsap.set(heroSub, { opacity: 0 });

    const heroTL = gsap.timeline({
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: '+=100%',
            scrub: 0.5,
            pin: true,
            pinSpacing: true,
        }
    });

    // Dot stretches into line
    heroTL.to(heroDot, {
        width: 200, height: 2, borderRadius: '1px',
        duration: 0.15, ease: 'power3.inOut'
    });

    // Line expands to frame
    heroTL.to(heroDot, {
        width: 700, maxWidth: '85vw', height: 440,
        borderRadius: '12px', backgroundColor: 'transparent',
        border: '1px solid rgba(255,255,255,0.15)',
        duration: 0.2, ease: 'power3.inOut',
    });

    // Swap to real frame
    heroTL.to(heroDot, { opacity: 0, duration: 0.05 });
    heroTL.to(heroFrame, { opacity: 1, duration: 0.05 }, '<');

    // Headline
    heroTL.to(heroTitle, { opacity: 1, duration: 0.2, ease: 'power2.out' });

    // Subtext
    heroTL.to(heroSub, { opacity: 1, duration: 0.15, ease: 'power2.out' });

    // Hold everything visible while still pinned
    heroTL.to({}, { duration: 0.2 });


    /* ═══════════════════════════════════════════
       SECTION 2 — PHILOSOPHY
       ═══════════════════════════════════════════ */
    const philWords = gsap.utils.toArray('.philosophy__word');
    const philLines = document.getElementById('philLines');
    const philStatement = document.getElementById('philStatement');

    const scatterPositions = [
        { x: -180, y: -100, rotation: -8 },
        { x: 200, y: -60, rotation: 12 },
        { x: -150, y: 80, rotation: -5 },
        { x: 220, y: 120, rotation: 10 },
    ];

    philWords.forEach((word, i) => {
        gsap.set(word, { x: scatterPositions[i].x, y: scatterPositions[i].y, rotation: scatterPositions[i].rotation, opacity: 0 });
    });
    gsap.set(philStatement, { y: 20, opacity: 0 });

    const philTL = gsap.timeline({
        scrollTrigger: {
            trigger: '#philosophy-wrap',
            start: 'top 80%',
            end: 'center center',
            scrub: 0.5,
        }
    });

    // Words appear
    philTL.to(philWords, { opacity: 1, stagger: 0.03, duration: 0.1, ease: 'power2.out' });

    // Words align
    philWords.forEach((word, i) => {
        philTL.to(word, { x: 0, y: 0, rotation: 0, duration: 0.2, ease: 'power3.inOut' }, 0.1 + i * 0.02);
    });

    // Lines draw
    philTL.to(philLines, { opacity: 1, duration: 0.05 }, 0.3);
    philTL.to('.philosophy__lines line', {
        strokeDashoffset: 0, stagger: 0.03, duration: 0.1, ease: 'power2.inOut'
    }, 0.32);

    // Statement
    philTL.to(philStatement, { opacity: 1, y: 0, duration: 0.15, ease: 'power2.out' }, 0.5);


    /* ═══════════════════════════════════════════
       SECTION 3 — IDEATION
       ═══════════════════════════════════════════ */
    const ideationHeadline = document.getElementById('ideationHeadline');
    const ideationWireframe = document.getElementById('ideationWireframe');
    const wirePaths = gsap.utils.toArray('.wire-path');

    gsap.set(ideationHeadline, { y: 30, opacity: 0 });
    gsap.set(ideationWireframe, { opacity: 0 });

    const ideaTL = gsap.timeline({
        scrollTrigger: {
            trigger: '#ideation-wrap',
            start: 'top 80%',
            end: 'center center',
            scrub: 0.5,
        }
    });

    // Headline
    ideaTL.to(ideationHeadline, { opacity: 1, y: 0, duration: 0.1, ease: 'power2.out' });

    // Wireframe
    ideaTL.to(ideationWireframe, { opacity: 1, duration: 0.05 }, 0.08);

    // Paths draw
    wirePaths.forEach((path, i) => {
        const len = path.getTotalLength ? path.getTotalLength() : 1000;
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        ideaTL.to(path, {
            strokeDashoffset: 0, duration: 0.05, ease: 'power1.inOut'
        }, 0.12 + i * 0.02);
    });

    // Lines brighten
    ideaTL.to(wirePaths, {
        stroke: 'rgba(255,255,255,0.5)', duration: 0.1, ease: 'power1.inOut'
    }, 0.7);


    /* ═══════════════════════════════════════════
       SECTION 4 — STRATEGY
       ═══════════════════════════════════════════ */
    const strategyHeadline = document.getElementById('strategyHeadline');
    const hLines = gsap.utils.toArray('.strategy__line--h');
    const vLines = gsap.utils.toArray('.strategy__line--v');
    const cells = gsap.utils.toArray('.strategy__cell');

    gsap.set(strategyHeadline, { y: 30, opacity: 0 });

    const stratTL = gsap.timeline({
        scrollTrigger: {
            trigger: '#strategy-wrap',
            start: 'top 80%',
            end: 'center center',
            scrub: 0.5,
        }
    });

    // Headline
    stratTL.to(strategyHeadline, { opacity: 1, y: 0, duration: 0.1, ease: 'power2.out' });

    // Grid lines
    stratTL.to(hLines, { scaleX: 1, stagger: 0.03, duration: 0.12, ease: 'power3.inOut' }, 0.1);
    stratTL.to(vLines, { scaleY: 1, stagger: 0.03, duration: 0.12, ease: 'power3.inOut' }, 0.15);

    // Cells snap in
    cells.forEach((cell, i) => {
        gsap.set(cell, { y: 20 + i * 5, scale: 0.9 });
        stratTL.to(cell, {
            opacity: 1, y: 0, scale: 1, duration: 0.08, ease: 'back.out(1.2)'
        }, 0.3 + i * 0.04);
    });

    // Grid fades subtly
    stratTL.to([hLines, vLines], { opacity: 0.04, duration: 0.08 }, 0.75);


    /* ═══════════════════════════════════════════
       SECTION 5 — DESIGN & MOTION
       ═══════════════════════════════════════════ */
    const designHeadline = document.getElementById('designHeadline');
    const uiLayer = document.getElementById('uiLayer');
    const uiTexts = gsap.utils.toArray('.design__ui-hero-text');

    gsap.set(designHeadline, { y: 30, opacity: 0 });

    const designTL = gsap.timeline({
        scrollTrigger: {
            trigger: '#design-motion-wrap',
            start: 'top 80%',
            end: 'center center',
            scrub: 0.5,
        }
    });

    // Headline
    designTL.to(designHeadline, { opacity: 1, y: 0, duration: 0.1, ease: 'power2.out' });

    // Hold wireframe
    designTL.to({}, { duration: 0.1 });

    // UI morphs in
    designTL.to(uiLayer, { opacity: 1, duration: 0.2, ease: 'power2.inOut' }, 0.2);

    // Typography
    uiTexts.forEach((text, i) => {
        designTL.to(text, {
            opacity: 1, y: 0, duration: 0.1, ease: 'power3.out'
        }, 0.4 + i * 0.05);
    });


    /* ═══════════════════════════════════════════
       SECTION 6 — DEVELOPMENT
       ═══════════════════════════════════════════ */
    const devHeadline = document.getElementById('devHeadline');
    const devComps = gsap.utils.toArray('.dev__component');
    const devConnections = document.getElementById('devConnections');
    const devLineEls = gsap.utils.toArray('.dev-line');
    const devTags = gsap.utils.toArray('.dev__tag');

    gsap.set(devHeadline, { y: 30, opacity: 0 });

    const compOffsets = [
        { y: -80 }, { x: -120 }, { x: 120 },
        { y: 80 }, { y: 80 }, { y: 80 },
    ];
    devComps.forEach((comp, i) => gsap.set(comp, { ...compOffsets[i], opacity: 0 }));
    devTags.forEach((tag) => gsap.set(tag, { y: 15, opacity: 0 }));

    const devTL = gsap.timeline({
        scrollTrigger: {
            trigger: '#development-wrap',
            start: 'top 80%',
            end: 'center center',
            scrub: 0.5,
        }
    });

    // Headline
    devTL.to(devHeadline, { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out' });

    // Components
    devComps.forEach((comp, i) => {
        devTL.to(comp, {
            x: 0, y: 0, opacity: 1, duration: 0.06, ease: 'power3.out'
        }, 0.08 + i * 0.03);
    });

    // Connections
    devTL.to(devConnections, { opacity: 1, duration: 0.03 }, 0.3);
    devLineEls.forEach((line, i) => {
        const len = line.getTotalLength ? line.getTotalLength() : 200;
        gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
        devTL.to(line, {
            strokeDashoffset: 0, duration: 0.05, ease: 'power1.inOut'
        }, 0.32 + i * 0.02);
    });

    // Tags
    devTags.forEach((tag, i) => {
        devTL.to(tag, {
            opacity: 1, y: 0, duration: 0.05, ease: 'power2.out'
        }, 0.5 + i * 0.03);
    });


    /* ═══════════════════════════════════════════
       SECTION 7 — PORTFOLIO
       ═══════════════════════════════════════════ */
    const portfolioLine = document.getElementById('portfolioLine');
    const portfolioTitle = document.getElementById('portfolioTitle');
    const portfolioTrack = document.getElementById('portfolioTrack');

    gsap.set(portfolioTitle, { opacity: 0 });

    if (!isMobile) {
        // Desktop: pin the section and scroll horizontally
        const portTL = gsap.timeline({
            scrollTrigger: {
                trigger: '#portfolio-wrap',
                start: 'top top',
                end: () => '+=' + (portfolioTrack.scrollWidth - window.innerWidth + 200),
                scrub: 0.5,
                pin: '#portfolio .scroll-section__inner' !== null ? false : false,
            }
        });

        portTL.to(portfolioLine, { width: 80, duration: 0.05, ease: 'power2.inOut' });
        portTL.to(portfolioTitle, { opacity: 1, duration: 0.05, ease: 'power2.out' }, 0.02);
        portTL.to(portfolioTrack, {
            x: () => -(portfolioTrack.scrollWidth - window.innerWidth + 100),
            duration: 0.9, ease: 'none'
        }, 0.08);
    } else {
        const portTL = gsap.timeline({
            scrollTrigger: {
                trigger: '#portfolio-wrap',
                start: 'top 80%',
                end: 'center center',
                scrub: 0.5,
            }
        });
        portTL.to(portfolioLine, { width: 80, duration: 0.05, ease: 'power2.inOut' });
        portTL.to(portfolioTitle, { opacity: 1, duration: 0.05, ease: 'power2.out' }, 0.02);

        const projects = gsap.utils.toArray('.portfolio__project');
        projects.forEach((proj, i) => {
            gsap.set(proj, { opacity: 0, y: 40 });
            portTL.to(proj, {
                opacity: 1, y: 0, duration: 0.12, ease: 'power2.out'
            }, 0.1 + i * 0.15);
        });
    }


    /* ═══════════════════════════════════════════
       SECTION 8 — LAUNCH & RESULTS
       ═══════════════════════════════════════════ */
    const launchHeadline = document.getElementById('launchHeadline');
    const launchDevices = document.getElementById('launchDevices');
    const statBars = [
        document.getElementById('statBar1'),
        document.getElementById('statBar2'),
        document.getElementById('statBar3'),
    ];
    const statValues = gsap.utils.toArray('.launch__stat-value');

    gsap.set(launchHeadline, { y: 30, opacity: 0 });
    gsap.set(launchDevices, { scale: 1.4, y: 40, opacity: 0 });

    const launchTL = gsap.timeline({
        scrollTrigger: {
            trigger: '#launch-wrap',
            start: 'top 80%',
            end: 'center center',
            scrub: 0.5,
        }
    });

    // Headline
    launchTL.to(launchHeadline, { opacity: 1, y: 0, duration: 0.1, ease: 'power2.out' });

    // Devices
    launchTL.to(launchDevices, {
        opacity: 1, scale: 1, y: 0, duration: 0.2, ease: 'power3.out'
    }, 0.1);

    // Stat bars
    const barHeights = [80, 50, 100];
    statBars.forEach((bar, i) => {
        launchTL.to(bar, {
            height: barHeights[i], duration: 0.1, ease: 'power2.out'
        }, 0.35 + i * 0.04);
    });

    // Stat values
    statValues.forEach((val, i) => {
        launchTL.to(val, {
            opacity: 1, duration: 0.06, ease: 'power2.out'
        }, 0.55 + i * 0.03);
    });


    /* ═══════════════════════════════════════════
       SECTION 9 — ABOUT
       ═══════════════════════════════════════════ */
    const aboutHeadline = document.getElementById('aboutHeadline');
    const aboutDesc = document.getElementById('aboutDesc');

    gsap.set(aboutHeadline, { y: 30, opacity: 0 });
    gsap.set(aboutDesc, { y: 20, opacity: 0 });

    const aboutTL = gsap.timeline({
        scrollTrigger: {
            trigger: '#about-wrap',
            start: 'top 80%',
            end: 'center center',
            scrub: 0.5,
        }
    });

    aboutTL.to(aboutHeadline, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' });
    aboutTL.to(aboutDesc, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }, 0.15);


    /* ═══════════════════════════════════════════
       SECTION 10 — CTA
       ═══════════════════════════════════════════ */
    const ctaContent = document.getElementById('ctaContent');
    const ctaDot = document.getElementById('ctaDot');

    gsap.set(ctaContent, { y: 40, opacity: 0 });

    const ctaTL = gsap.timeline({
        scrollTrigger: {
            trigger: '#cta-wrap',
            start: 'top 80%',
            end: 'bottom bottom',
            scrub: 0.5,
        }
    });

    // Content appears
    ctaTL.to(ctaContent, { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' });

    // Hold
    ctaTL.to({}, { duration: 0.3 });

    // Collapse to dot
    ctaTL.to(ctaContent, {
        scale: 0.3, opacity: 0, duration: 0.25, ease: 'power3.inOut'
    }, 0.55);

    ctaTL.to(ctaDot, {
        opacity: 1, duration: 0.12, ease: 'power2.out',
        onComplete: () => { ctaDot.classList.add('cta__dot--pulsing'); }
    }, 0.7);


    /* ─── MAGNETIC HOVER ON BUTTONS ─── */
    if (!isMobile) {
        document.querySelectorAll('.cta__button, .nav__cta').forEach((btn) => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                gsap.to(btn, { x: x * 0.15, y: y * 0.15, duration: 0.3, ease: 'power2.out' });
            });
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
            });
        });
    }

    /* ═══════════════════════════════════════════
       FULLSCREEN KINETIC NAVIGATION MENU
       Adapted from React component → vanilla GSAP
       ═══════════════════════════════════════════ */
    const menuToggle = document.getElementById('menuToggle');
    const menuOverlay = document.getElementById('menuOverlay');
    const menuOverlayBg = document.getElementById('menuOverlayBg');
    const menuToggleLabels = document.querySelectorAll('.menu-toggle__label');
    const menuToggleSvg = document.querySelector('.menu-toggle__svg');
    const menuBackdrops = document.querySelectorAll('.menu-backdrop');
    const menuLinks = document.querySelectorAll('.menu-link');
    const menuFadeTargets = document.querySelectorAll('[data-menu-fade]');
    const menuPanel = document.querySelector('.menu-panel');

    let isMenuOpen = false;

    function openMenu() {
        isMenuOpen = true;
        menuOverlay.setAttribute('data-nav', 'open');

        const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } });

        tl.set(menuOverlay, { display: 'block' })
            // Button text swap: "Menu" slides up, "Close" slides in
            .to(menuToggleLabels, { yPercent: -100, stagger: 0.15, duration: 0.5 })
            // Icon rotates to X
            .to(menuToggleSvg, { rotation: 315, duration: 0.5 }, '<')
            // Dark overlay fades in
            .to(menuOverlayBg, { autoAlpha: 1, duration: 0.4 }, '<')
            // Backdrop panels slide in staggered
            .fromTo(menuBackdrops, { xPercent: 101 }, { xPercent: 0, stagger: 0.1, duration: 0.5 }, '<')
            // Menu links fly in from below with rotation
            .fromTo(menuLinks,
                { yPercent: 140, rotation: 10 },
                { yPercent: 0, rotation: 0, stagger: 0.05, duration: 0.6 },
                '<+=0.3'
            );

        // Footer fades in
        if (menuFadeTargets.length) {
            tl.fromTo(menuFadeTargets,
                { autoAlpha: 0, yPercent: 50 },
                { autoAlpha: 1, yPercent: 0, stagger: 0.04, duration: 0.5, clearProps: 'all' },
                '<+=0.15'
            );
        }

        // Pause smooth scroll when menu is open
        lenis.stop();
    }

    function closeMenu() {
        isMenuOpen = false;
        menuOverlay.setAttribute('data-nav', 'closed');

        const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } });

        tl.to(menuOverlayBg, { autoAlpha: 0, duration: 0.35 })
            .to(menuPanel, { xPercent: 120, duration: 0.45 }, '<')
            // Button text slides back
            .to(menuToggleLabels, { yPercent: 0, duration: 0.4 }, '<')
            // Icon rotates back
            .to(menuToggleSvg, { rotation: 0, duration: 0.4 }, '<')
            // Hide overlay
            .set(menuOverlay, { display: 'none' })
            // Reset panel position for next open
            .set(menuPanel, { xPercent: 0 });

        // Resume smooth scroll
        lenis.start();
    }

    // Toggle
    menuToggle.addEventListener('click', () => {
        if (isMenuOpen) closeMenu();
        else openMenu();
    });

    // Click overlay to close
    menuOverlayBg.addEventListener('click', closeMenu);

    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) closeMenu();
    });

    // Menu link clicks → scroll to section & close
    document.querySelectorAll('.menu-link').forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            const target = document.querySelector(href);
            if (target) {
                closeMenu();
                // Slight delay to let menu close, then scroll
                setTimeout(() => {
                    lenis.start();
                    lenis.scrollTo(target, { offset: -80 });
                }, 600);
            }
        });
    });


    /* ─── ABSTRACT SHAPE HOVER EFFECTS ─── */
    const menuShapesContainer = document.querySelector('.menu-shapes');

    document.querySelectorAll('.menu-list__item[data-shape]').forEach((item) => {
        const shapeIndex = item.getAttribute('data-shape');
        const shape = menuShapesContainer ? menuShapesContainer.querySelector('.menu-shape-' + shapeIndex) : null;
        if (!shape) return;

        const shapeEls = shape.querySelectorAll('.shape-el');

        item.addEventListener('mouseenter', () => {
            // Deactivate all shapes
            if (menuShapesContainer) {
                menuShapesContainer.querySelectorAll('.menu-shape').forEach((s) => s.classList.remove('active'));
            }
            // Activate this shape
            shape.classList.add('active');

            gsap.fromTo(shapeEls,
                { scale: 0.5, opacity: 0, rotation: -10 },
                { scale: 1, opacity: 1, rotation: 0, duration: 0.6, stagger: 0.08, ease: 'back.out(1.7)', overwrite: 'auto' }
            );
        });

        item.addEventListener('mouseleave', () => {
            gsap.to(shapeEls, {
                scale: 0.8, opacity: 0, duration: 0.3, ease: 'power2.in',
                onComplete: () => shape.classList.remove('active'),
                overwrite: 'auto'
            });
        });
    });

})();

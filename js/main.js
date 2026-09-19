/* ============================================================
   APARAJAYAH TECHNOLOGIES — MAIN JAVASCRIPT
============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ============================================================
     1. MOBILE MENU
  ============================================================ */
  const mobileNav = document.getElementById('mobileNav');
  const mobileToggle = document.getElementById('mobileToggle');
  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileNav.style.display === 'block';
      mobileNav.style.display = isOpen ? 'none' : 'block';
    });
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => { mobileNav.style.display = 'none'; });
    });
  }

  /* ============================================================
     2. NAV SCROLL EFFECT
  ============================================================ */
  const mainNav = document.getElementById('mainNav');
  if (mainNav) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY > 20;
      mainNav.style.boxShadow = scrolled ? '0 1px 20px rgba(0,0,0,.06)' : 'none';
    });
  }

  /* ============================================================
     3. REVEAL ANIMATIONS
  ============================================================ */
  const reveals = document.querySelectorAll('.reveal-aparajayah');
  if (reveals.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });
    reveals.forEach(el => observer.observe(el));
  }

  /* ============================================================
     4. FAQ ACCORDIONS
  ============================================================ */
  document.querySelectorAll('[data-faq]').forEach(item => {
    const btn = item.querySelector('.faq-question-aparajayah');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('[data-faq]').forEach(f => {
        f.classList.remove('open');
        const q = f.querySelector('.faq-question-aparajayah');
        if (q) q.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ============================================================
     5. APARAJAYAH JOURNEY — HORIZONTAL SCROLL (Apple-style)
  ============================================================ */
  (function initAjourney() {
    const track = document.getElementById('ajourneyTrack');
    const rail = document.getElementById('ajourneyRail');
    const cards = document.querySelectorAll('.ajourney-card');
    const dots = document.querySelectorAll('.ajourney-dot');
    const progressFill = document.getElementById('ajourneyProgressFill');
    const hint = document.getElementById('ajourneyHint');
    const prevBtn = document.getElementById('ajourneyPrev');
    const nextBtn = document.getElementById('ajourneyNext');

    if (!track || !rail || !cards.length) return;

    const totalPhases = cards.length;
    let currentIndex = 0;

    /* Compute how far the rail needs to translate horizontally */
    function getRailTravel() {
      return Math.max(0, rail.scrollWidth - window.innerWidth + 80);
    }

    /* Update active states (card + dot) */
    function setActivePhase(index) {
      index = Math.max(0, Math.min(totalPhases - 1, index));
      if (index === currentIndex) return;
      currentIndex = index;

      cards.forEach((card, i) => {
        card.classList.toggle('active', i === index);
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });

      if (prevBtn) prevBtn.disabled = index === 0;
      if (nextBtn) nextBtn.disabled = index === totalPhases - 1;
    }

    /* Main scroll handler */
    function updateScroll() {
      const rect = track.getBoundingClientRect();
      const trackHeight = track.offsetHeight;
      const viewportHeight = window.innerHeight;
      const scrollableDistance = trackHeight - viewportHeight;

      let progress = -rect.top / scrollableDistance;
      progress = Math.max(0, Math.min(1, progress));

      /* Move rail horizontally */
      const travel = getRailTravel();
      rail.style.transform = `translate3d(${-progress * travel}px, 0, 0)`;

      /* Determine active phase */
      const phaseIndex = Math.min(
        totalPhases - 1,
        Math.floor(progress * totalPhases)
      );
      setActivePhase(phaseIndex);

      /* Update progress bar */
      if (progressFill) {
        progressFill.style.width = (progress * 100) + '%';
      }

      /* Hide scroll hint after user scrolls */
      if (hint) {
        if (progress > 0.02) hint.classList.remove('visible');
        else hint.classList.add('visible');
      }
    }

    /* Jump to a specific phase (dots + arrows) */
    function goToPhase(index) {
      index = Math.max(0, Math.min(totalPhases - 1, index));
      const trackRect = track.getBoundingClientRect();
      const trackTop = window.scrollY + trackRect.top;
      const trackHeight = track.offsetHeight;
      const viewportHeight = window.innerHeight;
      const scrollableDistance = trackHeight - viewportHeight;
      /* Land in the middle of that phase's scroll range */
      const phaseProgress = (index + 0.5) / totalPhases;
      const targetScroll = trackTop + scrollableDistance * phaseProgress;
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }

    /* Dots click */
    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.dataset.index, 10);
        goToPhase(idx);
      });
    });

    /* Arrow click */
    if (prevBtn) {
      prevBtn.addEventListener('click', () => goToPhase(currentIndex - 1));
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => goToPhase(currentIndex + 1));
    }

    /* Passive scroll listener with requestAnimationFrame throttle */
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateScroll();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    /* Resize handler */
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateScroll, 100);
    });

    /* Initialize */
    if (prevBtn) prevBtn.disabled = true;
    updateScroll();
  })();

});



/* ============================================================
   6. INDUSTRIES — TAB SWITCHER
============================================================ */
(function initIndustryTabs() {
  const tabButtons = document.querySelectorAll('.industry-tab-btn');
  const panels = document.querySelectorAll('.industry-panel');

  if (!tabButtons.length || !panels.length) return;

  function activateTab(targetId) {
    // Toggle buttons
    tabButtons.forEach(btn => {
      const isActive = btn.dataset.tab === targetId;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Toggle panels
    panels.forEach(panel => {
      const isActive = panel.id === targetId;
      panel.classList.toggle('active', isActive);
    });
  }

  // Button click
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      activateTab(target);
      // Update URL hash without jumping
      history.replaceState(null, '', '#' + target);
    });
  });

  // Deep-link support: open a tab if URL has #hash matching a panel id
  const initialHash = window.location.hash.replace('#', '');
  if (initialHash) {
    const targetPanel = document.getElementById(initialHash);
    if (targetPanel && targetPanel.classList.contains('industry-panel')) {
      activateTab(initialHash);
      // Scroll the tabs into view (optional)
      setTimeout(() => {
        const tabsSection = document.querySelector('.industry-tabs');
        if (tabsSection) {
          tabsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }

  // Keyboard navigation (arrow keys on tab buttons)
  tabButtons.forEach((btn, idx) => {
    btn.addEventListener('keydown', (e) => {
      let nextIndex = null;
      if (e.key === 'ArrowRight') nextIndex = (idx + 1) % tabButtons.length;
      if (e.key === 'ArrowLeft') nextIndex = (idx - 1 + tabButtons.length) % tabButtons.length;
      if (nextIndex !== null) {
        e.preventDefault();
        tabButtons[nextIndex].focus();
        tabButtons[nextIndex].click();
      }
    });
  });
})();




/* ============================================================
   7. SOLUTIONS PAGE — TAB SWITCHERS (Deep dive + Info tabs)
============================================================ */
(function initSolutionsTabs() {

  /* ---------- Solution Deep-Dive Tabs ---------- */
  const solButtons = document.querySelectorAll('.sol-tab-btn');
  const solPanels = document.querySelectorAll('.sol-panel');

  if (solButtons.length && solPanels.length) {
    function activateSolTab(id) {
      solButtons.forEach(b => {
        b.classList.toggle('active', b.dataset.solTab === id);
      });
      solPanels.forEach(p => {
        p.classList.toggle('active', p.id === 'sol-' + id);
      });
    }

    solButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        activateSolTab(btn.dataset.solTab);
        history.replaceState(null, '', '#' + btn.dataset.solTab);
      });
    });

    /* Jump links from bento cards */
    document.querySelectorAll('.jump-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const jumpId = link.dataset.jump;
        if (!jumpId) return;
        activateSolTab(jumpId);
        const tabsSection = document.getElementById('solutions-tabs');
        if (tabsSection) tabsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', '#' + jumpId);
      });
    });

    /* In-panel links that switch tab (e.g. "Explore Open Banking") */
    document.querySelectorAll('[data-sol-tab]').forEach(el => {
      if (el.classList.contains('sol-tab-btn')) return;
      el.addEventListener('click', (e) => {
        const target = el.dataset.solTab;
        if (!target) return;
        e.preventDefault();
        activateSolTab(target);
        history.replaceState(null, '', '#' + target);
      });
    });

    /* Deep link support */
    const initialHash = window.location.hash.replace('#', '');
    if (initialHash) {
      const matchPanel = document.getElementById('sol-' + initialHash);
      if (matchPanel) {
        activateSolTab(initialHash);
      }
    }

    /* Keyboard nav */
    solButtons.forEach((btn, idx) => {
      btn.addEventListener('keydown', (e) => {
        let next = null;
        if (e.key === 'ArrowRight') next = (idx + 1) % solButtons.length;
        if (e.key === 'ArrowLeft') next = (idx - 1 + solButtons.length) % solButtons.length;
        if (next !== null) {
          e.preventDefault();
          solButtons[next].focus();
          solButtons[next].click();
        }
      });
    });
  }

  /* ---------- Info Tabs (Use Cases / Architecture / Safety / Pilots) ---------- */
  const infoButtons = document.querySelectorAll('.info-tab-btn');
  const infoPanels = document.querySelectorAll('.info-panel');

  if (infoButtons.length && infoPanels.length) {
    function activateInfoTab(id) {
      infoButtons.forEach(b => {
        b.classList.toggle('active', b.dataset.infoTab === id);
      });
      infoPanels.forEach(p => {
        p.classList.toggle('active', p.id === 'info-' + id);
      });
    }

    infoButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        activateInfoTab(btn.dataset.infoTab);
      });
    });
  }

})();








 document.addEventListener('DOMContentLoaded', function() {
    // Mega menu hover persistence for all mega panels
    const triggers = document.querySelectorAll('.mega-trigger');
    const panels = document.querySelectorAll('.mega-panel');

    triggers.forEach((trigger) => {
      const panel = trigger.nextElementSibling;
      if (!panel || !panel.classList.contains('mega-panel')) return;

      let closeTimeout;

      const openPanel = () => {
        clearTimeout(closeTimeout);
        panel.style.opacity = '1';
        panel.style.visibility = 'visible';
        panel.style.pointerEvents = 'auto';
        panel.style.transform = 'translateX(-50%) translateY(0) scale(1)';
      };

      const closePanel = () => {
        closeTimeout = setTimeout(() => {
          if (!panel.matches(':hover')) {
            panel.style.opacity = '0';
            panel.style.visibility = 'hidden';
            panel.style.pointerEvents = 'none';
            panel.style.transform = 'translateX(-50%) translateY(10px) scale(0.98)';
          }
        }, 140);
      };

      trigger.addEventListener('mouseenter', openPanel);
      trigger.addEventListener('mouseleave', closePanel);

      panel.addEventListener('mouseenter', () => {
        clearTimeout(closeTimeout);
        openPanel();
      });
      panel.addEventListener('mouseleave', closePanel);
    });

    // Mobile nav toggle
    const toggle = document.getElementById('mobileToggle');
    const mobileNav = document.getElementById('mobileNav');
    if (toggle && mobileNav) {
      toggle.addEventListener('click', function() {
        const isOpen = mobileNav.style.display === 'block';
        mobileNav.style.display = isOpen ? 'none' : 'block';
      });
    }
  });
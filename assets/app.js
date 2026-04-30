const navToggle = document.querySelector("[data-nav-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const toast = document.querySelector("[data-easter-toast]");
const secretPanel = document.querySelector("[data-secret-panel]");
const logoSecret = document.querySelector("[data-logo-secret]");
const footerSecret = document.querySelector("[data-footer-secret]");
const consoleDots = document.querySelectorAll("[data-console-dot]");
let toastTimer;
let logoClicks = 0;
let consoleClicks = 0;
let keyBuffer = "";

const showToast = (message) => {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 3200);
};

const revealSecretPanel = () => {
  if (!secretPanel) return;

  secretPanel.hidden = false;
  showToast("Architect mode unlocked. Complexity must now justify the rent.");
};

if (window.lucide) {
  window.lucide.createIcons();
} else {
  window.addEventListener("load", () => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  });
}

if (navToggle && mobileMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  mobileMenu.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      mobileMenu.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open navigation");
    }
  });
}

if (logoSecret) {
  logoSecret.addEventListener("click", () => {
    logoClicks += 1;
    if (logoClicks === 3) {
      showToast("Three logo taps. Good instincts. The useful details are usually near the edges.");
      logoClicks = 0;
    }
  });
}

consoleDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    consoleClicks += 1;
    if (consoleClicks >= 4) {
      revealSecretPanel();
      consoleClicks = 0;
    }
  });
});

if (footerSecret) {
  footerSecret.addEventListener("click", () => {
    showToast("Static hosting, dynamic opinions. Also: zero build minutes were spent here.");
  });
}

document.addEventListener("keydown", (event) => {
  if (event.metaKey || event.ctrlKey || event.altKey || event.key.length !== 1) return;

  keyBuffer = `${keyBuffer}${event.key.toLowerCase()}`.slice(-12);

  if (keyBuffer.endsWith("shipit")) {
    showToast("Ship it, then watch the logs like someone who has met production before.");
  }

  if (keyBuffer.endsWith("latency")) {
    document.body.classList.toggle("latency-mode");
    showToast("Latency mode toggled. Every millisecond is now applying for budget approval.");
  }
});

console.info("Tiny portfolio easter eggs: try shipit, latency, the logo, or the console dots.");

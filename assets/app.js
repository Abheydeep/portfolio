const navToggle = document.querySelector("[data-nav-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const toast = document.querySelector("[data-toast]");
const logoSecret = document.querySelector("[data-logo-secret]");
const footerSecret = document.querySelector("[data-footer-secret]");
const commandInput = document.querySelector("[data-command-input]");
const commandRun = document.querySelector("[data-command-run]");
const commandOutput = document.querySelector("[data-command-output]");
const redrawMap = document.querySelector("[data-redraw-map]");
const canvas = document.querySelector("#signal-map");
const diagramTabs = document.querySelectorAll("[data-diagram-tab]");
const diagramPanels = document.querySelectorAll("[data-diagram-panel]");
const inPageLinks = document.querySelectorAll('a[href^="#"]');

let toastTimer;
let keyBuffer = "";
let logoClicks = 0;
let mapSeed = 7;

const messages = {
  latency: "Latency mode: on. Somewhere, a query plan just sat up straighter.",
  shipit: "Ship it, then watch the logs like a person who has met production before.",
  coffee: "Coffee ring added. Proof that this site was allegedly worked on after midnight.",
  oracle: "AWR reports, EXPLAIN PLAN, and the quiet joy of deleting a bad index assumption.",
  wins: "The Win List rule: three honest wins beat seventeen decorative intentions.",
  logo: "Logo note: AD secretly expands to architect, debug, deploy. Extremely convenient. Suspiciously so.",
  help: "Commands: latency, shipit, coffee, oracle, wins, logo, reset."
};

const showToast = (message) => {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 3600);
};

const setOutput = (message) => {
  if (commandOutput) {
    commandOutput.textContent = message;
  }
  showToast(message);
};

const runCommand = (rawValue) => {
  const value = rawValue.trim().toLowerCase();

  if (!value) {
    setOutput("The console waits. Dramatically, but respectfully.");
    return;
  }

  if (value === "latency") {
    document.body.classList.toggle("latency-mode");
    setOutput(messages.latency);
    return;
  }

  if (value === "coffee") {
    document.body.classList.toggle("coffee-mode");
    setOutput(messages.coffee);
    return;
  }

  if (value === "reset") {
    document.body.classList.remove("latency-mode", "coffee-mode");
    setOutput("Visual experiments reset. The logs remain emotionally available.");
    return;
  }

  setOutput(messages[value] || `Unknown command: ${value}. Try help if the machine is being theatrical.`);
};

const openFoldForTarget = (target) => {
  if (!target) return;

  const section = target.classList?.contains("fold-section") ? target : target.closest?.(".fold-section");
  const details = section?.querySelector(".fold-details");

  if (details) {
    details.open = true;
  }
};

const openFoldFromHash = () => {
  if (!window.location.hash) return;

  const target = document.querySelector(window.location.hash);
  openFoldForTarget(target);
};

const randomFromSeed = () => {
  mapSeed = (mapSeed * 9301 + 49297) % 233280;
  return mapSeed / 233280;
};

const drawSignalMap = () => {
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#080d12";
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "rgba(104, 216, 197, 0.12)";
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  const nodes = [
    { label: "feeds", x: 110, y: 132, color: "#8bd17c" },
    { label: "news", x: 150, y: 360, color: "#8bd17c" },
    { label: "cluster", x: 360, y: 230, color: "#f3c969" },
    { label: "scanner", x: 540, y: 145, color: "#82aaff" },
    { label: "script", x: 610, y: 380, color: "#f3c969" },
    { label: "portal", x: 760, y: 245, color: "#68d8c5" },
    { label: "wins", x: 430, y: 492, color: "#e36f64" }
  ];

  const lines = [
    [0, 2],
    [1, 2],
    [2, 3],
    [2, 4],
    [3, 5],
    [4, 5],
    [4, 6],
    [6, 5]
  ];

  lines.forEach(([from, to], index) => {
    const a = nodes[from];
    const b = nodes[to];
    const wobble = (randomFromSeed() - 0.5) * 44;
    ctx.strokeStyle = index % 2 === 0 ? "rgba(104, 216, 197, 0.58)" : "rgba(243, 201, 105, 0.52)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.bezierCurveTo(a.x + 90, a.y + wobble, b.x - 90, b.y - wobble, b.x, b.y);
    ctx.stroke();
  });

  nodes.forEach((node) => {
    ctx.fillStyle = "rgba(8, 11, 15, 0.94)";
    ctx.strokeStyle = node.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(node.x - 48, node.y - 25, 96, 50, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#f0efe7";
    ctx.font = "700 15px ui-sans-serif, system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(node.label, node.x, node.y);
  });

  ctx.fillStyle = "rgba(240, 239, 231, 0.34)";
  ctx.font = "700 12px ui-monospace, monospace";
  ctx.textAlign = "left";
  ctx.fillText("deterministic sketch / redraws with a tiny wobble", 26, height - 24);
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

diagramTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.diagramTab;

    diagramTabs.forEach((item) => {
      item.setAttribute("aria-selected", String(item === tab));
    });

    diagramPanels.forEach((panel) => {
      const isActive = panel.dataset.diagramPanel === target;
      panel.hidden = !isActive;
      panel.classList.toggle("is-active", isActive);
    });
  });
});

if (commandRun && commandInput) {
  commandRun.addEventListener("click", () => {
    runCommand(commandInput.value);
    commandInput.value = "";
  });

  commandInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      runCommand(commandInput.value);
      commandInput.value = "";
    }
  });
}

inPageLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const targetId = link.getAttribute("href");
    if (!targetId || targetId === "#") return;

    openFoldForTarget(document.querySelector(targetId));
  });
});

if (redrawMap) {
  redrawMap.addEventListener("click", () => {
    mapSeed += 17;
    drawSignalMap();
    showToast("Signal map redrawn. Same system, slightly different handwriting.");
  });
}

if (logoSecret) {
  logoSecret.addEventListener("click", () => {
    logoClicks += 1;
    if (logoClicks === 3) {
      showToast("AD stamp unlocked: architect, debug, deploy. Also: always document the weird part.");
      logoClicks = 0;
    }
  });
}

if (footerSecret) {
  footerSecret.addEventListener("click", () => {
    showToast("Built slowly enough to have opinions. Deployed quickly enough to forgive typos.");
  });
}

document.addEventListener("keydown", (event) => {
  if (event.metaKey || event.ctrlKey || event.altKey || event.key.length !== 1) return;
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;

  keyBuffer = `${keyBuffer}${event.key.toLowerCase()}`.slice(-12);

  ["latency", "shipit", "coffee", "oracle", "wins", "logo"].forEach((command) => {
    if (keyBuffer.endsWith(command)) {
      runCommand(command);
    }
  });
});

drawSignalMap();
openFoldFromHash();
window.addEventListener("hashchange", openFoldFromHash);
console.info("Portfolio console commands: help, latency, shipit, coffee, oracle, wins, logo, reset.");

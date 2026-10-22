
const colorBox = document.getElementById("colorBox");
const colorCode = document.getElementById("colorCode");
const changeBtn = document.getElementById("changeBtn");
const copyBtn = document.getElementById("copyBtn");
const saveBtn = document.getElementById("saveBtn");
const presetPalette = document.getElementById("presetPalette");
const favoritesList = document.getElementById("favoritesList");
const favoriteCount = document.getElementById("favoriteCount");
const emptyMessage = document.getElementById("emptyMessage");
const searchInput = document.getElementById("searchInput");

// Preset colors
const presets = [
  { name: "Lavender", color: "#C4B5FD" },
  { name: "Rose", color: "#FDA4AF" },
  { name: "Mint", color: "#6EE7B7" },
  { name: "Sky Blue", color: "#7DD3FC" },
  { name: "Peach", color: "#FDBA74" },
  { name: "Lemon", color: "#FDE68A" },
  { name: "Lilac", color: "#D8B4FE" },
  { name: "Coral", color: "#FB7185" },
  { name: "Ocean", color: "#38BDF8" },
  { name: "Sage", color: "#A3B18A" },
  { name: "Plum", color: "#C084FC" },
  { name: "Teal", color: "#2DD4BF" }
];

let currentColor = "#F3E8FF";
let favorites = [];

// Load saved favorites
try {
  const savedFavorites = localStorage.getItem(
    "color-studio-favorites"
  );

  if (savedFavorites) {
    const parsedFavorites = JSON.parse(savedFavorites);

    if (Array.isArray(parsedFavorites)) {
      favorites = parsedFavorites.filter(
        color =>
          typeof color === "string" &&
          /^#[0-9A-F]{6}$/i.test(color)
      );
    }
  }
} catch (error) {
  console.log("Could not load saved colors.");
}

// Display selected color
function displayColor(color) {
  currentColor = color;

  colorBox.style.backgroundColor = color;
  colorCode.textContent = color;

  // Highlight selected preset
  document.querySelectorAll(".preset-btn").forEach(button => {
    button.classList.toggle(
      "selected",
      button.dataset.color === color
    );
  });

  // Update save button text
  const alreadySaved = favorites.includes(color);

  saveBtn.textContent = alreadySaved
    ? "♥ Saved to Favorites"
    : "♡ Save to Favorites";
}

// Generate random HEX color
function generateColor() {
  const randomNumber = Math.floor(
    Math.random() * 16777215
  );

  const randomColor =
    "#" + randomNumber.toString(16).padStart(6, "0");

  displayColor(randomColor.toUpperCase());
}

// Render preset colors
function renderPresets() {
  presetPalette.innerHTML = "";

  presets.forEach(item => {
    const button = document.createElement("button");

    button.className = "preset-btn";
    button.style.backgroundColor = item.color;
    button.dataset.color = item.color;
    button.title = item.name;
    button.setAttribute(
      "aria-label",
      item.name + " " + item.color
    );

    button.addEventListener("click", () => {
      displayColor(item.color);
    });

    presetPalette.appendChild(button);
  });
}

// Save favorites to browser storage
function saveFavorites() {
  try {
    localStorage.setItem(
      "color-studio-favorites",
      JSON.stringify(favorites)
    );
  } catch (error) {
    alert("Colors could not be saved in browser storage.");
  }
}

// Render and search favorites
function renderFavorites() {
  favoritesList.innerHTML = "";

  const searchTerm = searchInput
    ? searchInput.value.trim().toUpperCase()
    : "";

  const filteredFavorites = favorites.filter(color =>
    color.toUpperCase().includes(searchTerm)
  );

  favoriteCount.textContent = favorites.length;

  filteredFavorites.forEach(color => {
    const favoriteItem = document.createElement("div");
    favoriteItem.className = "favorite-item";

    // Color preview
    const swatch = document.createElement("div");
    swatch.className = "favorite-swatch";
    swatch.style.backgroundColor = color;
    swatch.title = "Apply " + color;

    swatch.addEventListener("click", () => {
      displayColor(color);
    });

    // HEX code
    const codeButton = document.createElement("button");
    codeButton.className = "favorite-code";
    codeButton.textContent = color;
    codeButton.title = "Click to use this color";

    codeButton.addEventListener("click", () => {
      displayColor(color);
    });

    // Remove favorite
    const removeButton = document.createElement("button");
    removeButton.className = "remove-favorite";
    removeButton.textContent = "×";
    removeButton.title = "Remove " + color;
    removeButton.setAttribute("aria-label", "Remove " + color);

    removeButton.addEventListener("click", () => {
      favorites = favorites.filter(
        favorite => favorite !== color
      );

      saveFavorites();
      renderFavorites();
      displayColor(currentColor);
    });

    favoriteItem.appendChild(swatch);
    favoriteItem.appendChild(codeButton);
    favoriteItem.appendChild(removeButton);

    favoritesList.appendChild(favoriteItem);
  });

  // Empty and search messages
  if (favorites.length === 0) {
    emptyMessage.textContent =
      "No favorites yet. Save a color you love!";
    emptyMessage.style.display = "block";
  } else if (filteredFavorites.length === 0) {
    emptyMessage.textContent =
      "No matching colors found. Try another code.";
    emptyMessage.style.display = "block";
  } else {
    emptyMessage.style.display = "none";
  }
}

// Change random color
changeBtn.addEventListener("click", generateColor);

// Save or unsave current color
saveBtn.addEventListener("click", () => {
  if (favorites.includes(currentColor)) {
    favorites = favorites.filter(
      color => color !== currentColor
    );
  } else {
    favorites.push(currentColor);
  }

  saveFavorites();
  renderFavorites();
  displayColor(currentColor);
});

// Copy HEX code
copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(currentColor);

    copyBtn.textContent = "Copied! ✓";

    setTimeout(() => {
      copyBtn.textContent = "Copy HEX";
    }, 1500);
  } catch (error) {
    // Fallback for browsers where clipboard access is blocked
    const temporaryInput = document.createElement("textarea");
    temporaryInput.value = currentColor;
    document.body.appendChild(temporaryInput);
    temporaryInput.select();

    const copied = document.execCommand("copy");
    temporaryInput.remove();

    copyBtn.textContent = copied ? "Copied! ✓" : "Copy failed";

    setTimeout(() => {
      copyBtn.textContent = "Copy HEX";
    }, 1500);
  }
});

// Search updates immediately while typing
if (searchInput) {
  searchInput.addEventListener("input", renderFavorites);
}

// Start the app
renderPresets();
renderFavorites();
displayColor(currentColor);


/* ===== Gradient Studio JavaScript ===== */

const gradientColor1 = document.getElementById("gradientColor1");
const gradientColor2 = document.getElementById("gradientColor2");
const gradientDirection = document.getElementById("gradientDirection");
const gradientPreview = document.getElementById("gradientPreview");
const copyGradientBtn = document.getElementById("copyGradientBtn");
const gradientCode = document.getElementById("gradientCode");

// Create and display the gradient

function updateGradient() {
  const color1 = gradientColor1.value;
  const color2 = gradientColor2.value;
  const direction = gradientDirection.value;

  const cssCode =
    `linear-gradient(${direction}, ${color1}, ${color2})`;

  gradientPreview.style.background = cssCode;
  gradientCode.textContent = `background: ${cssCode};`;
}

// Update gradient when either color changes
gradientColor1.addEventListener("input", updateGradient);
gradientColor2.addEventListener("input", updateGradient);
gradientDirection.addEventListener("change", updateGradient);

// Copy gradient CSS
copyGradientBtn.addEventListener("click", async () => {
  const cssText = gradientCode.textContent;

  try {
    await navigator.clipboard.writeText(cssText);
    copyGradientBtn.textContent = "Copied! ✓";
  } catch (error) {
    const textArea = document.createElement("textarea");
    textArea.value = cssText;
    document.body.appendChild(textArea);
    textArea.select();

    const copied = document.execCommand("copy");
    textArea.remove();

    copyGradientBtn.textContent = copied
      ? "Copied! ✓"
      : "Please copy the CSS manually";
  }

  setTimeout(() => {
    copyGradientBtn.textContent = "📋 Copy Gradient CSS";
  }, 1800);
});

// Show initial gradient
updateGradient();

/* ===== Color History JavaScript ===== */

const colorHistory = document.getElementById("colorHistory");
const historyEmpty = document.getElementById("historyEmpty");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

const HISTORY_KEY = "color-studio-history";
const MAX_HISTORY = 12;

let colorHistoryItems = [];

try {
  const savedHistory = localStorage.getItem(HISTORY_KEY);

  if (savedHistory) {
    const parsedHistory = JSON.parse(savedHistory);

    if (Array.isArray(parsedHistory)) {
      colorHistoryItems = parsedHistory
        .filter(color =>
          typeof color === "string" &&
          /^#[0-9A-F]{6}$/i.test(color)
        )
        .map(color => color.toUpperCase())
        .slice(0, MAX_HISTORY);
    }
  }
} catch (error) {
  console.log("Could not load color history.");
}

function saveColorHistory() {
  try {
    localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify(colorHistoryItems)
    );
  } catch (error) {
    console.log("Could not save color history.");
  }
}

function addToColorHistory(color) {
  if (!/^#[0-9A-F]{6}$/i.test(color)) return;

  color = color.toUpperCase();

  // Move the latest color to the beginning
  colorHistoryItems = [
    color,
    ...colorHistoryItems.filter(item => item !== color)
  ].slice(0, MAX_HISTORY);

  saveColorHistory();
  renderColorHistory();
}

function renderColorHistory() {
  colorHistory.innerHTML = "";

  colorHistoryItems.forEach(color => {
    const item = document.createElement("button");
    item.className = "history-color";
    item.type = "button";
    item.title = "Use " + color;

    const swatch = document.createElement("span");
    swatch.className = "history-swatch";
    swatch.style.backgroundColor = color;

    const code = document.createElement("span");
    code.className = "history-code";
    code.textContent = color;

    item.appendChild(swatch);
    item.appendChild(code);

    item.addEventListener("click", () => {
      displayColor(color);
      addToColorHistory(color);
    });

    colorHistory.appendChild(item);
  });

  historyEmpty.style.display =
    colorHistoryItems.length === 0 ? "block" : "none";

  clearHistoryBtn.disabled = colorHistoryItems.length === 0;
}

clearHistoryBtn.addEventListener("click", () => {
  colorHistoryItems = [];
  saveColorHistory();
  renderColorHistory();
});

// Track colors selected through the existing app
const originalDisplayColor = displayColor;

displayColor = function (color) {
  originalDisplayColor(color);
  addToColorHistory(color);
};

// Track generated random colors
changeBtn.addEventListener("click", () => {
  addToColorHistory(currentColor);
});

// Load history when the page opens
renderColorHistory();
addToColorHistory(currentColor);


/* ===== Favorite Gradients JavaScript ===== */

const saveGradientBtn = document.getElementById("saveGradientBtn");
const favoriteGradientsList = document.getElementById("favoriteGradientsList");
const emptyGradientFavorites = document.getElementById("emptyGradientFavorites");
const gradientFavoriteCount = document.getElementById("gradientFavoriteCount");

const GRADIENT_FAVORITES_KEY = "color-studio-favorite-gradients";

let favoriteGradients = [];

try {
  const savedGradients = localStorage.getItem(GRADIENT_FAVORITES_KEY);

  if (savedGradients) {
    const parsed = JSON.parse(savedGradients);

    if (Array.isArray(parsed)) {
      favoriteGradients = parsed.filter(item =>
        item &&
        /^#[0-9A-F]{6}$/i.test(item.color1) &&
        /^#[0-9A-F]{6}$/i.test(item.color2) &&
        typeof item.direction === "string" &&
        /^(135deg|90deg|180deg|45deg|to left|to top)$/.test(item.direction)
      );
    }
  }
} catch (error) {
  console.log("Could not load favorite gradients.");
}

function saveFavoriteGradientsToStorage() {
  try {
    localStorage.setItem(
      GRADIENT_FAVORITES_KEY,
      JSON.stringify(favoriteGradients)
    );
  } catch (error) {
    alert("Favorite gradients could not be saved.");
  }
}

function renderFavoriteGradients() {
  favoriteGradientsList.innerHTML = "";

  gradientFavoriteCount.textContent =
    `${favoriteGradients.length} gradients`;

  emptyGradientFavorites.style.display =
    favoriteGradients.length === 0 ? "block" : "none";

  favoriteGradients.forEach((gradient, index) => {
    const css = `linear-gradient(${gradient.direction}, ${gradient.color1}, ${gradient.color2})`;

    const card = document.createElement("div");
    card.className = "favorite-gradient-card";

    const preview = document.createElement("div");
    preview.className = "favorite-gradient-preview";
    preview.style.background = css;

    const code = document.createElement("p");
    code.className = "favorite-gradient-code";
    code.textContent = css;

    const actions = document.createElement("div");
    actions.className = "favorite-gradient-actions";

    const applyBtn = document.createElement("button");
    applyBtn.textContent = "Apply";

    applyBtn.addEventListener("click", () => {
      gradientColor1.value = gradient.color1;
      gradientColor2.value = gradient.color2;
      gradientDirection.value = gradient.direction;
      updateGradient();
    });

    const copyBtn = document.createElement("button");
    copyBtn.textContent = "Copy CSS";

    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(`background: ${css};`);
        copyBtn.textContent = "Copied ✓";
      } catch (error) {
        code.textContent = `background: ${css}; Select and copy this CSS.`;
      }

      setTimeout(() => {
        copyBtn.textContent = "Copy CSS";
      }, 1500);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";

    deleteBtn.addEventListener("click", () => {
      favoriteGradients.splice(index, 1);
      saveFavoriteGradientsToStorage();
      renderFavoriteGradients();
    });

    actions.appendChild(applyBtn);
    actions.appendChild(copyBtn);
    actions.appendChild(deleteBtn);

    card.appendChild(preview);
    card.appendChild(code);
    card.appendChild(actions);

    favoriteGradientsList.appendChild(card);
  });
}

saveGradientBtn.addEventListener("click", () => {
  const newGradient = {
    color1: gradientColor1.value.toUpperCase(),
    color2: gradientColor2.value.toUpperCase(),
    direction: gradientDirection.value
  };

  const alreadyExists = favoriteGradients.some(item =>
    item.color1 === newGradient.color1 &&
    item.color2 === newGradient.color2 &&
    item.direction === newGradient.direction
  );

  if (alreadyExists) {
    alert("This gradient is already in your favorites!");
    return;
  }

  favoriteGradients.unshift(newGradient);
  saveFavoriteGradientsToStorage();
  renderFavoriteGradients();

  saveGradientBtn.textContent = "Saved! ✓";

  setTimeout(() => {
    saveGradientBtn.textContent = "♡ Save Current Gradient";
  }, 1500);
});

renderFavoriteGradients();

const downloadPaletteBtn = document.getElementById("downloadPaletteBtn");

downloadPaletteBtn.addEventListener("click", () => {
  const favorites = JSON.parse(
    localStorage.getItem("color-studio-favorites")
  ) || [];

  if (favorites.length === 0) {
    alert("Please save some favorite colors first! 🎨");
    return;
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = 1000;
  canvas.height = 300 + Math.ceil(favorites.length / 4) * 170;

  // Background
  const background = ctx.createLinearGradient(0, 0, 1000, canvas.height);
  background.addColorStop(0, "#1e1535");
  background.addColorStop(1, "#100c1c");

  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Title
  ctx.fillStyle = "#c4b5fd";
  ctx.font = "bold 48px Arial";
  ctx.fillText("Color Studio", 50, 75);

  ctx.fillStyle = "#e9d5ff";
  ctx.font = "22px Arial";
  ctx.fillText("My Favorite Color Palette", 50, 115);

  // Color cards
  const columns = 4;
  const cardWidth = 210;
  const cardHeight = 125;
  const gap = 25;
  const startX = 50;
  const startY = 160;

  favorites.forEach((color, index) => {
    const x = startX + (index % columns) * (cardWidth + gap);
    const y = startY + Math.floor(index / columns) * 170;

    // Card background
    ctx.fillStyle = "#302447";
    ctx.beginPath();
    ctx.roundRect(x, y, cardWidth, cardHeight, 16);
    ctx.fill();

    // Color swatch
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x + 10, y + 10, cardWidth - 20, 65, 10);
    ctx.fill();

    // HEX code
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px Arial";
    ctx.fillText(color, x + 12, y + 105);
  });

  // Footer
  ctx.fillStyle = "#b8a8d9";
  ctx.font = "18px Arial";
  ctx.fillText("Created with Color Studio ♡", 50, canvas.height - 35);

  // Download PNG
  const link = document.createElement("a");
  link.download = "my-color-palette.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

const randomGradientBtn = document.getElementById("randomGradientBtn");

randomGradientBtn.addEventListener("click", () => {
  const randomColors = [
    "#C4B5FD",
    "#FDA4AF",
    "#6EE7B7",
    "#7DD3FC",
    "#FDBA74",
    "#FDE68A",
    "#D8B4FE",
    "#FB7185",
    "#38BDF8",
    "#A3B18A",
    "#C084FC",
    "#2DD4BF",
    "#F472B6",
    "#818CF8",
    "#34D399",
    "#FBBF24"
  ];

  let color1 = randomColors[
    Math.floor(Math.random() * randomColors.length)
  ];

  let color2 = randomColors[
    Math.floor(Math.random() * randomColors.length)
  ];

  // Dono colors ko different rakhna
  while (color1 === color2) {
    color2 = randomColors[
      Math.floor(Math.random() * randomColors.length)
    ];
  }

  // Existing Gradient Studio controls update karo
  gradientColor1.value = color1;
  gradientColor2.value = color2;

  // Random direction select karo
  const directions = [
    "135deg",
    "90deg",
    "180deg",
    "45deg",
    "to left",
    "to top"
  ];

  gradientDirection.value =
    directions[Math.floor(Math.random() * directions.length)];

  // Existing gradient preview update karo
  updateGradient();
});

const harmonyColor = document.getElementById("harmonyColor");
const harmonyType = document.getElementById("harmonyType");
const generateHarmonyBtn = document.getElementById("generateHarmonyBtn");
const harmonyPalette = document.getElementById("harmonyPalette");

function harmonyHexToHsl(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));

    switch (max) {
      case r:
        h = 60 * (((g - b) / delta) % 6);
        break;
      case g:
        h = 60 * ((b - r) / delta + 2);
        break;
      case b:
        h = 60 * ((r - g) / delta + 4);
        break;
    }
  }

  if (h < 0) h += 360;

  return [h, s * 100, l * 100];
}

function harmonyHslToHex(h, s, l) {
  h = ((h % 360) + 360) % 360;
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (h < 60) {
    r = c; g = x;
  } else if (h < 120) {
    r = x; g = c;
  } else if (h < 180) {
    g = c; b = x;
  } else if (h < 240) {
    g = x; b = c;
  } else if (h < 300) {
    r = x; b = c;
  } else {
    r = c; b = x;
  }

  const toHex = value =>
    Math.round((value + m) * 255)
      .toString(16)
      .padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function generateHarmony() {
  const [h, s, l] = harmonyHexToHsl(harmonyColor.value);
  const style = harmonyType.value;

  let angles;

  if (style === "complementary") {
    angles = [0, 180];
  } else if (style === "analogous") {
    angles = [-40, -20, 0, 20, 40];
  } else if (style === "triadic") {
    angles = [0, 120, 240];
  } else {
    angles = [0, 150, 210];
  }

  harmonyPalette.innerHTML = "";

  angles.forEach((angle, index) => {
    const lightness = Math.max(
      15,
      Math.min(85, l + (index - (angles.length - 1) / 2) * 4)
    );

    const color = harmonyHslToHex(h + angle, s, lightness);

    const card = document.createElement("div");
    card.className = "harmony-color";

    const swatch = document.createElement("div");
    swatch.className = "harmony-swatch";
    swatch.style.backgroundColor = color;
    swatch.title = "Click to copy " + color;

    const hexCode = document.createElement("div");
    hexCode.className = "harmony-hex";
    hexCode.textContent = color;

    swatch.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(color);
        alert(color + " copied!");
      } catch (error) {
        alert("Copy is unavailable here. HEX code: " + color);
      }
    });

    card.append(swatch, hexCode);
    harmonyPalette.appendChild(card);
  });
}

generateHarmonyBtn.addEventListener("click", generateHarmony);
harmonyColor.addEventListener("input", generateHarmony);
harmonyType.addEventListener("change", generateHarmony);

// Show the first palette automatically
generateHarmony();

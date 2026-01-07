document.onselectstart = (e) => e.preventDefault();

function grille(numero) {
  localStorage.setItem("selectedGridId", String(numero));
}

function findSign(signs, row, col, orientation) {
  for (let i = 0; i < signs.length; i++) {
    const s = signs[i];
    if (s.row === row && s.col === col && s.orientation === orientation)
      return s;
  }
  return null;
}

function onCellInput(e) {
  const el = e.currentTarget;
  let text = el.textContent.replace(/[^\d]/g, "");
  if (text.length > 1) text = text.charAt(0);
  const num = parseInt(text, 10);
  const size =
    parseInt(getComputedStyle(el.parentElement).getPropertyValue("--size")) ||
    5;
  if (!num || num < 1 || num > size) {
    el.textContent = "";
  } else {
    el.textContent = String(num);
  }
}

function validateGrid() {
  const gridContainer = document.querySelector(".futo-grid");
  if (!gridContainer) return;

  const idStr = localStorage.getItem("selectedGridId");
  const id = idStr ? parseInt(idStr, 10) : 1;
  const grid = grilles.find((g) => g.id === id) || grilles[0];
  const size = grid.size;

  const cells = Array.from(gridContainer.querySelectorAll(".cell"));
  const values = [];

  // Construire la matrice des valeurs actuelles
  for (let r = 0; r < size; r++) {
    values[r] = [];
    for (let c = 0; c < size; c++) {
      const idx = r * size + c;
      const cell = cells[idx];
      const val = parseInt(cell.textContent, 10);
      values[r][c] = isNaN(val) ? null : val;
    }
  }

  let isValid = true;
  let errors = [];

  // Vérifier si toutes les cellules sont remplies
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (values[r][c] === null) {
        isValid = false;
        errors.push("Grille incomplète");
        break;
      }
    }
    if (!isValid) break;
  }

  if (isValid) {
    // Vérifier les lignes (pas de doublons)
    for (let r = 0; r < size; r++) {
      const seen = new Set();
      for (let c = 0; c < size; c++) {
        if (seen.has(values[r][c])) {
          isValid = false;
          errors.push(`Doublon dans la ligne ${r + 1}`);
          break;
        }
        seen.add(values[r][c]);
      }
      if (!isValid) break;
    }
  }

  if (isValid) {
    // Vérifier les colonnes (pas de doublons)
    for (let c = 0; c < size; c++) {
      const seen = new Set();
      for (let r = 0; r < size; r++) {
        if (seen.has(values[r][c])) {
          isValid = false;
          errors.push(`Doublon dans la colonne ${c + 1}`);
          break;
        }
        seen.add(values[r][c]);
      }
      if (!isValid) break;
    }
  }

  if (isValid) {
    // Vérifier les contraintes d'inégalité
    for (const sign of grid.signs) {
      const { row, col, sign: sym, orientation } = sign;
      if (orientation === "h") {
        const left = values[row][col];
        const right = values[row][col + 1];
        if (sym === "<" && left >= right) {
          isValid = false;
          errors.push(`Inégalité non respectée: ligne ${row + 1}`);
          break;
        } else if (sym === ">" && left <= right) {
          isValid = false;
          errors.push(`Inégalité non respectée: ligne ${row + 1}`);
          break;
        }
      } else if (orientation === "v") {
        const top = values[row][col];
        const bottom = values[row + 1][col];
        if (sym === "^" && top >= bottom) {
          isValid = false;
          errors.push(`Inégalité non respectée: colonne ${col + 1}`);
          break;
        } else if (sym === "v" && top <= bottom) {
          isValid = false;
          errors.push(`Inégalité non respectée: colonne ${col + 1}`);
          break;
        }
      }
    }
  }

  if (isValid) {
    alert("✅ Félicitations ! La grille est correcte !");
  } else {
    alert("❌ Erreur : " + errors[0]);
  }
}

function resetGrid() {
  const section = document.querySelector(".puzzle-grid");
  if (!section) return;
  const idStr = localStorage.getItem("selectedGridId");
  const id = idStr ? parseInt(idStr, 10) : 1;
  const grid = grilles.find((g) => g.id === id) || grilles[0];
  renderGrid(section, grid);
}

function renderGrid(containerSection, grid) {
  const gridContainer = document.createElement("div");
  gridContainer.className = "futo-grid";
  gridContainer.style.setProperty("--size", grid.size);
  for (let r = 0; r < grid.size; r++) {
    for (let c = 0; c < grid.size; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      const val = grid.cells[r][c];
      if (val != null) {
        cell.textContent = val;
        cell.classList.add("prefilled");
        cell.contentEditable = "false";
      } else {
        cell.contentEditable = "true";
        cell.addEventListener("input", onCellInput);
      }
      cell.dataset.row = String(r);
      cell.dataset.col = String(c);
      gridContainer.appendChild(cell);
      if (c < grid.size - 1) {
        const signH = findSign(grid.signs, r, c, "h");
        const spacerH = document.createElement("div");
        spacerH.className = "sign sign-h";
        spacerH.textContent = signH ? signH.sign : "";
        gridContainer.appendChild(spacerH);
      }
    }
    if (r < grid.size - 1) {
      for (let c = 0; c < grid.size; c++) {
        const signV = findSign(grid.signs, r, c, "v");
        const spacerV = document.createElement("div");
        spacerV.className = "sign sign-v";
        spacerV.textContent = signV ? signV.sign : "";
        gridContainer.appendChild(spacerV);
        if (c < grid.size - 1) {
          const filler = document.createElement("div");
          filler.className = "filler";
          gridContainer.appendChild(filler);
        }
      }
    }
  }
  const existing = containerSection.querySelector(".futo-grid");
  if (existing) existing.remove();
  containerSection.appendChild(gridContainer);
}

function initPuzzle() {
  const section = document.querySelector(".puzzle-grid");
  if (!section) return;
  const idStr = localStorage.getItem("selectedGridId");
  const id = idStr ? parseInt(idStr, 10) : 1;
  const grid = grilles.find((g) => g.id === id) || grilles[0];
  const title = section.querySelector("h2");
  if (title) title.textContent = grid.name + " — " + grid.level;
  renderGrid(section, grid);
}

document.addEventListener("DOMContentLoaded", () => {
  const isIndex =
    location.pathname.endsWith("index.html") ||
    location.pathname === "/" ||
    location.pathname.endsWith("/");
  if (isIndex) {
    const tiles = Array.from(document.querySelectorAll(".grille"));
    tiles.forEach((tile, idx) => {
      const id = idx + 1;
      tile.addEventListener("click", () => {
        localStorage.setItem("selectedGridId", String(id));
        window.location.href = "grille.html";
      });
    });
  } else {
    initPuzzle();

    // Ajouter les gestionnaires pour les boutons
    const validateBtn = document.getElementById("validateBtn");
    const resetBtn = document.getElementById("resetBtn");

    if (validateBtn) {
      validateBtn.addEventListener("click", validateGrid);
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", resetGrid);
    }
  }
});

const grilles = [
  {
    id: 1,
    name: "Grille 1",
    level: "Facile",
    size: 5,
    cells: [
      [null, null, 1, null, null],
      [null, null, null, 4, 2],
      [null, 1, null, 5, null],
      [null, 2, null, null, 4],
      [3, null, null, null, null],
    ],
    signs: [
      { row: 0, col: 3, sign: "^", orientation: "v" },
      { row: 1, col: 4, sign: "^", orientation: "v" },
      { row: 2, col: 0, sign: "^", orientation: "v" },
      { row: 2, col: 2, sign: "^", orientation: "v" },
      { row: 2, col: 4, sign: "^", orientation: "v" },
      { row: 3, col: 2, sign: "^", orientation: "v" },
      { row: 3, col: 1, sign: "<", orientation: "h" },
      { row: 4, col: 1, sign: ">", orientation: "h" },
    ],
  },
  {
    id: 2,
    name: "Grille 2",
    level: "Facile",
    size: 5,
    cells: [
      [5, null, null, null, 4],
      [null, null, 5, null, null],
      [null, null, 2, null, 5],
      [2, 3, null, null, null],
      [null, null, null, 1, null],
    ],
    signs: [
      { row: 0, col: 4, sign: "v", orientation: "v" },
      { row: 2, col: 2, sign: "^", orientation: "v" },
      { row: 3, col: 0, sign: "^", orientation: "v" },
      { row: 1, col: 3, sign: "<", orientation: "h" },
      { row: 2, col: 1, sign: "<", orientation: "h" },
      { row: 3, col: 2, sign: "<", orientation: "h" },
      { row: 4, col: 0, sign: "<", orientation: "h" },
      { row: 4, col: 1, sign: ">", orientation: "h" },
    ],
  },
  {
    id: 3,
    name: "Grille 3",
    level: "Moyen",
    size: 5,
    cells: [
      [5, null, null, null, 1],
      [null, null, 5, 4, null],
      [null, null, null, null, 2],
      [null, null, null, 5, null],
      [4, 3, null, null, null],
    ],
    signs: [
      { row: 1, col: 3, sign: "v", orientation: "v" },
      { row: 2, col: 0, sign: "^", orientation: "v" },
      { row: 3, col: 0, sign: "^", orientation: "v" },
      { row: 3, col: 2, sign: "^", orientation: "v" },
      { row: 3, col: 4, sign: "^", orientation: "v" },
      { row: 2, col: 3, sign: ">", orientation: "h" },
    ],
  },
  {
    id: 4,
    name: "Grille 4",
    level: "Moyen",
    size: 5,
    cells: [
      [null, 4, 5, null, null],
      [null, null, null, 4, null],
      [null, null, null, null, 1],
      [null, null, 3, 1, null],
      [5, null, null, null, null],
    ],
    signs: [
      { row: 1, col: 0, sign: "^", orientation: "v" },
      { row: 1, col: 1, sign: "^", orientation: "v" },
      { row: 1, col: 2, sign: "^", orientation: "v" },
      { row: 1, col: 3, sign: "^", orientation: "v" },
      { row: 2, col: 2, sign: "^", orientation: "v" },
      { row: 3, col: 2, sign: "^", orientation: "v" },
      { row: 3, col: 4, sign: "v", orientation: "v" },
      { row: 4, col: 3, sign: "<", orientation: "h" },
    ],
  },
  {
    id: 5,
    name: "Grille 5",
    level: "Moyen",
    size: 5,
    cells: [
      [5, 1, null, null, null],
      [3, 4, null, null, null],
      [null, null, null, null, 3],
      [null, null, 3, null, null],
      [null, null, null, 2, null],
    ],
    signs: [
      { row: 0, col: 4, sign: "v", orientation: "v" },
      { row: 1, col: 4, sign: "^", orientation: "v" },
      { row: 2, col: 2, sign: "v", orientation: "v" },
      { row: 2, col: 4, sign: "v", orientation: "v" },
      { row: 3, col: 3, sign: "v", orientation: "v" },
      { row: 2, col: 0, sign: "<", orientation: "h" },
      { row: 4, col: 0, sign: ">", orientation: "h" },
      { row: 4, col: 1, sign: ">", orientation: "h" },
      { row: 4, col: 2, sign: "<", orientation: "h" },
    ],
  },
  {
    id: 6,
    name: "Grille 6",
    level: "Difficile",
    size: 5,
    cells: [
      [1, 4, null, null, null],
      [2, null, null, null, null],
      [null, null, null, null, 5],
      [null, null, 1, null, null],
      [null, null, 5, 3, null],
    ],
    signs: [
      { row: 0, col: 4, sign: "v", orientation: "v" },
      { row: 1, col: 0, sign: "^", orientation: "v" },
      { row: 1, col: 3, sign: "^", orientation: "v" },
      { row: 3, col: 0, sign: "v", orientation: "v" },
      { row: 3, col: 3, sign: "^", orientation: "v" },
      { row: 3, col: 3, sign: "<", orientation: "h" },
      { row: 4, col: 3, sign: ">", orientation: "h" },
    ],
  },
  {
    id: 7,
    name: "Grille 7",
    level: "Difficile",
    size: 5,
    cells: [
      [null, null, null, null, null],
      [null, 5, null, null, null],
      [null, null, 4, null, null],
      [1, null, null, null, null],
      [null, null, null, null, 3],
    ],
    signs: [
      { row: 0, col: 0, sign: "^", orientation: "v" },
      { row: 2, col: 1, sign: "^", orientation: "v" },
      { row: 2, col: 3, sign: "^", orientation: "v" },
      { row: 3, col: 4, sign: "^", orientation: "v" },
      { row: 2, col: 0, sign: "<", orientation: "h" },
      { row: 3, col: 1, sign: "<", orientation: "h" },
      { row: 4, col: 1, sign: "<", orientation: "h" },
    ],
  },
  {
    id: 8,
    name: "Grille 8",
    level: "Expert",
    size: 5,
    cells: [
      [null, null, 4, 3, null],
      [null, null, null, null, 4],
      [3, null, null, null, null],
      [null, 5, null, null, null],
      [null, null, 3, null, null],
    ],
    signs: [
      { row: 0, col: 3, sign: "v", orientation: "v" },
      { row: 2, col: 0, sign: "^", orientation: "v" },
      { row: 2, col: 4, sign: "^", orientation: "v" },
      { row: 3, col: 2, sign: "^", orientation: "v" },
      { row: 0, col: 0, sign: "<", orientation: "h" },
      { row: 3, col: 2, sign: ">", orientation: "h" },
      { row: 4, col: 1, sign: ">", orientation: "h" },
      { row: 4, col: 2, sign: "<", orientation: "h" },
    ],
  },
  {
    id: 9,
    name: "Grille 9",
    level: "Maître",
    size: 5,
    cells: [
      [4, 2, null, null, null],
      [null, null, 4, null, null],
      [null, null, null, 1, null],
      [null, null, null, null, 5],
      [5, null, null, null, null],
    ],
    signs: [
      { row: 1, col: 4, sign: "^", orientation: "v" },
      { row: 2, col: 0, sign: "v", orientation: "v" },
      { row: 2, col: 1, sign: "^", orientation: "v" },
      { row: 1, col: 2, sign: ">", orientation: "h" },
      { row: 2, col: 0, sign: "<", orientation: "h" },
      { row: 4, col: 1, sign: "<", orientation: "h" },
    ],
  },
];

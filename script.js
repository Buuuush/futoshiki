document.onselectstart = (e) => e.preventDefault();

function grille(numero) {
    let 
}







const grilles = [
  // facile
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
      // verticaux
      { row: 0, col: 3, sign: "^", orientation: "v" },
      { row: 1, col: 4, sign: "^", orientation: "v" },
      { row: 2, col: 0, sign: "^", orientation: "v" },
      { row: 2, col: 2, sign: "^", orientation: "v" },
      { row: 2, col: 4, sign: "^", orientation: "v" },
      { row: 3, col: 2, sign: "^", orientation: "v" },
      // horizontaux
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
      // verticaux
      { row: 0, col: 4, sign: "v", orientation: "v" },
      { row: 2, col: 2, sign: "^", orientation: "v" },
      { row: 3, col: 0, sign: "^", orientation: "v" },
      // horizontaux
      { row: 1, col: 3, sign: "<", orientation: "h" },
      { row: 2, col: 1, sign: "<", orientation: "h" },
      { row: 3, col: 2, sign: "<", orientation: "h" },
      { row: 4, col: 0, sign: "<", orientation: "h" },
      { row: 4, col: 1, sign: ">", orientation: "h" },
    ],
  },

  // moyen
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
      // verticaux
      { row: 1, col: 3, sign: "v", orientation: "v" },
      { row: 2, col: 0, sign: "^", orientation: "v" },
      { row: 3, col: 0, sign: "^", orientation: "v" },
      { row: 3, col: 2, sign: "^", orientation: "v" },
      { row: 3, col: 4, sign: "^", orientation: "v" },
      // horizontaux
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
      // verticaux
      { row: 1, col: 0, sign: "^", orientation: "v" },
      { row: 1, col: 1, sign: "^", orientation: "v" },
      { row: 1, col: 2, sign: "^", orientation: "v" },
      { row: 1, col: 3, sign: "^", orientation: "v" },
      { row: 2, col: 2, sign: "^", orientation: "v" },
      { row: 3, col: 2, sign: "^", orientation: "v" },
      { row: 3, col: 4, sign: "v", orientation: "v" },
      // horizontaux
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
      // verticaux
      { row: 0, col: 4, sign: "v", orientation: "v" },
      { row: 1, col: 4, sign: "^", orientation: "v" },
      { row: 2, col: 2, sign: "v", orientation: "v" },
      { row: 2, col: 4, sign: "v", orientation: "v" },
      { row: 3, col: 3, sign: "v", orientation: "v" },
      // horizontaux
      { row: 2, col: 0, sign: "<", orientation: "h" },
      { row: 4, col: 0, sign: ">", orientation: "h" },
      { row: 4, col: 1, sign: ">", orientation: "h" },
      { row: 4, col: 2, sign: "<", orientation: "h" },
    ],
  },

  // difficile
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
      // verticaux
      { row: 0, col: 4, sign: "v", orientation: "v" },
      { row: 1, col: 0, sign: "^", orientation: "v" },
      { row: 1, col: 3, sign: "^", orientation: "v" },
      { row: 3, col: 0, sign: "v", orientation: "v" },
      { row: 3, col: 3, sign: "^", orientation: "v" },
      // horizontaux
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
      // verticaux
      { row: 0, col: 0, sign: "^", orientation: "v" },
      { row: 2, col: 1, sign: "^", orientation: "v" },
      { row: 2, col: 3, sign: "^", orientation: "v" },
      { row: 3, col: 4, sign: "^", orientation: "v" },
      // horizontaux
      { row: 2, col: 0, sign: "<", orientation: "h" },
      { row: 3, col: 1, sign: "<", orientation: "h" },
      { row: 4, col: 1, sign: "<", orientation: "h" },
    ],
  },

  // expert
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
      // verticaux
      { row: 0, col: 3, sign: "v", orientation: "v" },
      { row: 2, col: 0, sign: "^", orientation: "v" },
      { row: 2, col: 4, sign: "^", orientation: "v" },
      { row: 3, col: 2, sign: "^", orientation: "v" },
      // horizontaux
      { row: 0, col: 0, sign: "<", orientation: "h" },
      { row: 3, col: 2, sign: ">", orientation: "h" },
      { row: 4, col: 1, sign: ">", orientation: "h" },
      { row: 4, col: 2, sign: "<", orientation: "h" },
    ],
  },

  // maitre
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
      // verticaux
      { row: 1, col: 4, sign: "^", orientation: "v" },
      { row: 2, col: 0, sign: "v", orientation: "v" },
      { row: 2, col: 1, sign: "^", orientation: "v" },
      // horizontaux
      { row: 1, col: 2, sign: ">", orientation: "h" },
      { row: 2, col: 0, sign: "<", orientation: "h" },
      { row: 4, col: 1, sign: "<", orientation: "h" },
    ],
  },
];

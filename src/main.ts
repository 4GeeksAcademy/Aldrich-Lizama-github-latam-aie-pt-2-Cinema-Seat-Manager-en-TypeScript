/* ============================================================
   Cinema Seat Manager — Prototipo funcional en TypeScript
   Basado en los requisitos de context.txt
   ============================================================ */

type SeatMatrix = number[][];
type SeatPosition = [number, number];
type AdjacentPair = [SeatPosition, SeatPosition];

const ROWS = 8;
const COLUMNS = 10;

/* ---------- Funciones principales (requisito) ---------- */

/* Inicializa una matriz de asientos (arreglo bidimensional) de 8 filas x 10 columnas.
   Todos los asientos comienzan en 0 (disponibles). */
function initializeSeatMatrix(rows: number, columns: number): SeatMatrix {
  return Array.from({ length: rows }, () => Array(columns).fill(0));
}

/* Muestra el estado actual de la sala imprimiendo la matriz en consola.
   Usa X para ocupados y L para libres. Incluye números de fila y columna. */
function displayRoom(seats: SeatMatrix, title: string): void {
  console.log(`\n${title}`);
  console.log(`   ${Array.from({ length: seats[0].length }, (_, i) => i).join(" ")}`);

  for (let row = 0; row < seats.length; row += 1) {
    const visualRow = seats[row].map((s) => (s === 1 ? "X" : "L")).join(" ");
    console.log(`${row.toString().padStart(2, " ")}  ${visualRow}`);
  }
}

/* Reserva un asiento dado un número de fila y columna (cambia valor de 0 a 1).
   Valida límites y disponibilidad antes de reservar. */
function reserveSeat(seats: SeatMatrix, row: number, column: number): string {
  if (row < 0 || row >= seats.length || column < 0 || column >= seats[row].length) {
    return `No se pudo reservar el asiento (${row}, ${column}) porque está fuera de la sala.`;
  }

  if (seats[row][column] === 1) {
    return `No se pudo reservar el asiento (${row}, ${column}) porque ya está ocupado.`;
  }

  seats[row][column] = 1;
  return `Reserva confirmada para el asiento (${row}, ${column}).`;
}

/* Cuenta y devuelve cuántos asientos están ocupados y cuántos disponibles. */
function countSeats(seats: SeatMatrix): [number, number] {
  let occupied = 0;
  let available = 0;

  for (const row of seats) {
    for (const seat of row) {
      if (seat === 1) {
        occupied += 1;
      } else {
        available += 1;
      }
    }
  }

  return [occupied, available];
}

/* Busca el primer par de asientos libres contiguos horizontalmente (misma fila).
   Devuelve sus posiciones como un par de coordenadas, o null si no hay. */
function findAdjacentPair(seats: SeatMatrix): AdjacentPair | null {
  for (let row = 0; row < seats.length; row += 1) {
    for (let column = 0; column < seats[row].length - 1; column += 1) {
      if (seats[row][column] === 0 && seats[row][column + 1] === 0) {
        return [[row, column], [row, column + 1]];
      }
    }
  }

  return null;
}

/* Reporta el estado completo de la sala en consola: conteo + búsqueda de par contiguo. */
function reportRoomStatus(seats: SeatMatrix): void {
  const [occupied, available] = countSeats(seats);
  const adjacentPair = findAdjacentPair(seats);

  console.log(`Asientos ocupados: ${occupied}`);
  console.log(`Asientos disponibles: ${available}`);

  if (adjacentPair) {
    const [[r1, c1], [r2, c2]] = adjacentPair;
    console.log(`Primer par contiguo encontrado en (${r1}, ${c1}) y (${r2}, ${c2}).`);
  } else {
    console.log("No hay pares de asientos contiguos disponibles.");
  }
}

/* ---------- Escenarios de prueba (requisito) ---------- */

function runConsoleScenarios(): void {
  console.log("==========================================");
  console.log("  CINEMA SEAT MANAGER — PRUEBAS");
  console.log("==========================================");

  // Escenario 1: Sala vacía (todos los asientos disponibles)
  const emptyRoom = initializeSeatMatrix(ROWS, COLUMNS);
  displayRoom(emptyRoom, "Escenario 1: Sala vacía");
  reportRoomStatus(emptyRoom);
  console.log(reserveSeat(emptyRoom, 2, 4));
  console.log(reserveSeat(emptyRoom, 2, 4)); // Debe fallar: ya ocupado

  // Escenario 2: Sala parcialmente ocupada
  const partialRoom = initializeSeatMatrix(ROWS, COLUMNS);
  const partialSeats: SeatPosition[] = [
    [0, 1], [0, 4], [0, 5], [0, 8],
    [1, 0], [1, 3], [1, 6], [1, 7], [1, 9],
    [2, 2], [2, 4], [2, 8],
    [3, 1], [3, 5], [3, 6], [3, 9],
    [4, 0], [4, 3], [4, 4], [4, 7],
    [5, 2], [5, 5], [5, 8], [5, 9],
    [6, 1], [6, 4], [6, 6],
    [7, 0], [7, 3], [7, 7], [7, 8],
  ];
  for (const [r, c] of partialSeats) {
    partialRoom[r][c] = 1;
  }
  displayRoom(partialRoom, "Escenario 2: Sala parcialmente ocupada");
  reportRoomStatus(partialRoom);

  // Escenario 3: Sala casi llena (solo asientos sueltos disponibles)
  const isolatedAvailables: SeatPosition[] = [
    [0, 0], [1, 3], [2, 6], [3, 9], [4, 1], [5, 4], [6, 7], [7, 2],
  ];
  const nearlyFullRoom = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(1));
  for (const [r, c] of isolatedAvailables) {
    nearlyFullRoom[r][c] = 0;
  }
  displayRoom(nearlyFullRoom, "Escenario 3: Sala casi llena (solo asientos sueltos)");
  reportRoomStatus(nearlyFullRoom);

  // Escenario 4: Sala completamente llena
  const fullRoom = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(1));
  displayRoom(fullRoom, "Escenario 4: Sala completamente llena");
  reportRoomStatus(fullRoom);

  // Prueba de validación: fuera de límites
  console.log(reserveSeat(emptyRoom, 20, 5));

  console.log("\n==========================================");
  console.log("  FIN DE PRUEBAS");
  console.log("==========================================");
}

/* Ejecuta las pruebas de consola siempre */
runConsoleScenarios();

/* ============================================================
   EXTRA OPCIONAL: Interfaz web con selección visual de asientos
   ============================================================ */

/* Conjunto de asientos seleccionados temporalmente (pendientes de reservar en la web). */
const selectedSeats = new Set<string>();

function seatKey(row: number, column: number): string {
  return `${row}-${column}`;
}

/* Alterna selección de un asiento libre. */
function toggleSelection(row: number, column: number): string {
  const key = seatKey(row, column);
  if (selectedSeats.has(key)) {
    selectedSeats.delete(key);
    return `Asiento (${row}, ${column}) deseleccionado.`;
  }
  selectedSeats.add(key);
  return `Asiento (${row}, ${column}) seleccionado.`;
}

/* Reserva todos los asientos seleccionados. */
function confirmSelection(seats: SeatMatrix): string {
  if (selectedSeats.size === 0) {
    return "No hay asientos seleccionados para reservar.";
  }

  const reserved: string[] = [];
  const alreadyTaken: string[] = [];

  for (const key of selectedSeats) {
    const [r, c] = key.split("-").map(Number);
    if (seats[r][c] === 1) {
      alreadyTaken.push(`(${r}, ${c})`);
    } else {
      seats[r][c] = 1;
      reserved.push(`(${r}, ${c})`);
    }
  }

  selectedSeats.clear();

  let msg = "";
  if (reserved.length > 0) msg += `${reserved.length} reservado(s): ${reserved.join(", ")}. `;
  if (alreadyTaken.length > 0) msg += `${alreadyTaken.length} ya ocupado(s): ${alreadyTaken.join(", ")}.`;
  return msg || "No se realizaron reservas.";
}

/* Limpia toda la sala y la selección. */
function resetRoom(seats: SeatMatrix): string {
  for (let r = 0; r < seats.length; r += 1) {
    for (let c = 0; c < seats[r].length; c += 1) {
      seats[r][c] = 0;
    }
  }
  selectedSeats.clear();
  return "Todos los asientos han sido liberados. La sala está completamente vacía.";
}

/* Construye la interfaz web visual. */
function renderCinema(container: HTMLElement, seats: SeatMatrix): void {
  const [occupied, available] = countSeats(seats);
  const adjacentPair = findAdjacentPair(seats);
  const adjacentKeys = adjacentPair
    ? adjacentPair.map(([r, c]) => seatKey(r, c))
    : [];

  const seatRows = seats
    .map((row, ri) => {
      const buttons = row
        .map((seat, ci) => {
          const key = seatKey(ri, ci);
          const isOccupied = seat === 1;
          const isSelected = selectedSeats.has(key);
          const isAdjacent = adjacentKeys.includes(key) && !isOccupied;

          let variant = "available";
          let symbol = "L";
          if (isOccupied) { variant = "occupied"; symbol = "X"; }
          else if (isSelected) { variant = "selected"; symbol = "●"; }
          else if (isAdjacent) { variant = "adjacent"; symbol = "◎"; }

          return `<button class="seat seat--${variant}" data-row="${ri}" data-col="${ci}">${symbol}</button>`;
        })
        .join("");
      return `<div class="seat-row"><span class="seat-row__label">${ri}</span><div class="seat-row__grid">${buttons}</div></div>`;
    })
    .join("");

  const adjMsg = adjacentPair
    ? `Par contiguo: fila ${adjacentPair[0][0]}, cols ${adjacentPair[0][1]} y ${adjacentPair[1][1]}`
    : "No hay pares contiguos disponibles.";

  container.innerHTML = `
    <section class="cinema-shell">
      <div class="cinema-card">
        <div class="cinema-copy">
          <p class="eyebrow">🎬 Cinema Seat Manager</p>
          <h1>Gestor de asientos</h1>
          <p class="lead">Sala de ${ROWS} filas × ${COLUMNS} columnas. Selecciona asientos libres y presiona "Reservar".</p>
          <div class="summary-grid">
            <article><span>Ocupados</span><strong>${occupied}</strong></article>
            <article><span>Disponibles</span><strong>${available}</strong></article>
            <article><span>Seleccionados</span><strong>${selectedSeats.size}</strong></article>
          </div>
          <div class="actions">
            <button id="btn-reserve" class="btn btn--primary">✓ Reservar seleccionados</button>
            <button id="btn-reset" class="btn btn--secondary">↺ Resetear sala</button>
          </div>
          <p id="status-message" class="status-message">${adjMsg}</p>
        </div>
        <div class="hall-panel">
          <div class="screen">PANTALLA</div>
          <div class="column-labels">
            <span class="corner"></span>
            ${Array.from({ length: COLUMNS }, (_, c) => `<span>${c}</span>`).join("")}
          </div>
          <div class="seat-layout">${seatRows}</div>
          <div class="legend">
            <span class="legend-item"><span class="seat seat--available">L</span> Libre</span>
            <span class="legend-item"><span class="seat seat--selected">●</span> Seleccionado</span>
            <span class="legend-item"><span class="seat seat--occupied">X</span> Ocupado</span>
            <span class="legend-item"><span class="seat seat--adjacent">◎</span> Par contiguo</span>
          </div>
        </div>
      </div>
    </section>
  `;

  const msgEl = container.querySelector<HTMLElement>("#status-message");

  /* Clic en asientos */
  for (const btn of container.querySelectorAll<HTMLButtonElement>(".seat")) {
    btn.addEventListener("click", () => {
      const r = Number(btn.dataset.row);
      const c = Number(btn.dataset.col);
      if (seats[r][c] === 1) {
        if (msgEl) msgEl.textContent = `El asiento (${r}, ${c}) ya está ocupado.`;
        return;
      }
      const res = toggleSelection(r, c);
      if (msgEl) msgEl.textContent = res;
      renderCinema(container, seats);
      const nm = container.querySelector<HTMLElement>("#status-message");
      if (nm) nm.textContent = res;
    });
  }

  /* Botón Reservar */
  const reserveBtn = container.querySelector<HTMLButtonElement>("#btn-reserve");
  if (reserveBtn) {
    reserveBtn.addEventListener("click", () => {
      const res = confirmSelection(seats);
      if (msgEl) msgEl.textContent = res;
      renderCinema(container, seats);
      const nm = container.querySelector<HTMLElement>("#status-message");
      if (nm) nm.textContent = res;
    });
  }

  /* Botón Reset */
  const resetBtn = container.querySelector<HTMLButtonElement>("#btn-reset");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      const res = resetRoom(seats);
      if (msgEl) msgEl.textContent = res;
      renderCinema(container, seats);
      const nm = container.querySelector<HTMLElement>("#status-message");
      if (nm) nm.textContent = res;
    });
  }
}

/* Inicializa la web si estamos en un navegador */
if (typeof document !== "undefined") {
  import("./style.css").then(() => {
    const app = document.querySelector<HTMLElement>("#app");
    const room = initializeSeatMatrix(ROWS, COLUMNS);
    if (app) renderCinema(app, room);
  });
}

export {};

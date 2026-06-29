type SeatMatrix = number[][];
type SeatPosition = [number, number];
type AdjacentPair = [SeatPosition, SeatPosition];

const ROWS = 8;
const COLUMNS = 10;

const PARTIAL_OCCUPIED_SEATS: SeatPosition[] = [
  [0, 1], [0, 4], [0, 5], [0, 8],
  [1, 0], [1, 3], [1, 6], [1, 7], [1, 9],
  [2, 2], [2, 4], [2, 8],
  [3, 1], [3, 5], [3, 6], [3, 9],
  [4, 0], [4, 3], [4, 4], [4, 7],
  [5, 2], [5, 5], [5, 8], [5, 9],
  [6, 1], [6, 4], [6, 6],
  [7, 0], [7, 3], [7, 7], [7, 8],
];

const ISOLATED_AVAILABLE_SEATS: SeatPosition[] = [
  [0, 0], [1, 3], [2, 6], [3, 9], [4, 1], [5, 4], [6, 7], [7, 2],
];

/* Inicializa la sala con todas las posiciones libres usando una matriz bidimensional. */
function initializeSeatMatrix(rows: number, columns: number): SeatMatrix {
  return Array.from({ length: rows }, () => Array(columns).fill(0));
}

/* Devuelve una copia de la sala para probar escenarios sin mutar la matriz original. */
function cloneSeatMatrix(seats: SeatMatrix): SeatMatrix {
  return seats.map((row) => [...row]);
}

/* Marca como ocupadas las posiciones indicadas en la lista de coordenadas. */
function occupySeats(seats: SeatMatrix, positions: SeatPosition[]): void {
  for (const [row, column] of positions) {
    seats[row][column] = 1;
  }
}

/* Convierte toda la sala en ocupada y luego libera solo los asientos indicados. */
function createNearlyFullRoom(rows: number, columns: number, freeSeats: SeatPosition[]): SeatMatrix {
  const seats = Array.from({ length: rows }, () => Array(columns).fill(1));

  for (const [row, column] of freeSeats) {
    seats[row][column] = 0;
  }

  return seats;
}

/* Muestra la sala en consola con coordenadas y el estado visual L o X para cada asiento. */
function displayRoom(seats: SeatMatrix, title: string): void {
  console.log(`\n${title}`);
  console.log(`    ${Array.from({ length: seats[0].length }, (_, index) => index).join(" ")}`);

  for (let row = 0; row < seats.length; row += 1) {
    const visualRow = seats[row].map((seat) => (seat === 1 ? "X" : "L")).join(" ");
    console.log(`${row.toString().padStart(2, " ")}  ${visualRow}`);
  }
}

/* Intenta reservar un asiento validando límites y disponibilidad antes de ocuparlo. */
function reserveSeat(seats: SeatMatrix, row: number, column: number): string {
  const rowExists = row >= 0 && row < seats.length;
  const columnExists = rowExists && column >= 0 && column < seats[row].length;

  if (!rowExists || !columnExists) {
    return `No se pudo reservar el asiento (${row}, ${column}) porque está fuera de la sala.`;
  }

  if (seats[row][column] === 1) {
    return `No se pudo reservar el asiento (${row}, ${column}) porque ya está ocupado.`;
  }

  seats[row][column] = 1;
  return `Reserva confirmada para el asiento (${row}, ${column}).`;
}

/* Cuenta cuántos asientos están ocupados y cuántos siguen disponibles en toda la sala. */
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

/* Busca el primer par horizontal de asientos libres y devuelve sus dos posiciones. */
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

/* Informa en consola el conteo total y el resultado de la búsqueda de asientos contiguos. */
function reportRoomStatus(seats: SeatMatrix): void {
  const [occupied, available] = countSeats(seats);
  const adjacentPair = findAdjacentPair(seats);

  console.log(`Asientos ocupados: ${occupied}`);
  console.log(`Asientos disponibles: ${available}`);

  if (adjacentPair) {
    const [[firstRow, firstColumn], [secondRow, secondColumn]] = adjacentPair;
    console.log(
      `Primer par contiguo encontrado en (${firstRow}, ${firstColumn}) y (${secondRow}, ${secondColumn}).`,
    );
    return;
  }

  console.log("No hay pares de asientos contiguos disponibles.");
}

/* Ejecuta varios escenarios para comprobar la lógica principal pedida en la consigna. */
function runConsoleScenarios(): void {
  const emptyRoom = initializeSeatMatrix(ROWS, COLUMNS);
  displayRoom(emptyRoom, "Escenario 1: Sala vacia");
  reportRoomStatus(emptyRoom);
  console.log(reserveSeat(emptyRoom, 2, 4));
  console.log(reserveSeat(emptyRoom, 2, 4));

  const partiallyOccupiedRoom = initializeSeatMatrix(ROWS, COLUMNS);
  occupySeats(partiallyOccupiedRoom, PARTIAL_OCCUPIED_SEATS);
  displayRoom(partiallyOccupiedRoom, "Escenario 2: Sala parcialmente ocupada");
  reportRoomStatus(partiallyOccupiedRoom);

  const nearlyFullRoom = createNearlyFullRoom(ROWS, COLUMNS, ISOLATED_AVAILABLE_SEATS);
  displayRoom(nearlyFullRoom, "Escenario 3: Sala casi llena con asientos sueltos");
  reportRoomStatus(nearlyFullRoom);

  const fullRoom = createNearlyFullRoom(ROWS, COLUMNS, []);
  displayRoom(fullRoom, "Escenario 4: Sala completamente llena");
  reportRoomStatus(fullRoom);
}

/* Construye la interfaz web usando la misma matriz para mostrar, contar y reservar asientos. */
function renderCinema(container: HTMLElement, seats: SeatMatrix): void {
  const adjacentPair = findAdjacentPair(seats);
  const [occupied, available] = countSeats(seats);

  const adjacentSeatKeys = adjacentPair
    ? adjacentPair.map(([row, column]) => `${row}-${column}`)
    : [];

  const seatRows = seats
    .map((row, rowIndex) => {
      const seatButtons = row
        .map((seat, columnIndex) => {
          const seatState = seat === 1 ? "occupied" : "available";
          const isAdjacentSeat = adjacentSeatKeys.includes(`${rowIndex}-${columnIndex}`);
          const variant = isAdjacentSeat ? "adjacent" : seatState;
          const symbol = seat === 1 ? "X" : "L";
          const status = seat === 1 ? "Ocupado" : "Libre";

          return `
            <button
              class="seat seat--${variant}"
              data-row="${rowIndex}"
              data-column="${columnIndex}"
              aria-label="Fila ${rowIndex}, asiento ${columnIndex}, ${status}"
            >
              ${symbol}
            </button>
          `;
        })
        .join("");

      return `
        <div class="seat-row">
          <span class="seat-row__label">${rowIndex}</span>
          <div class="seat-row__grid">${seatButtons}</div>
        </div>
      `;
    })
    .join("");

  const adjacentMessage = adjacentPair
    ? `Par contiguo sugerido: fila ${adjacentPair[0][0]}, columnas ${adjacentPair[0][1]} y ${adjacentPair[1][1]}.`
    : "No hay pares contiguos disponibles en este momento.";

  container.innerHTML = `
    <section class="cinema-shell">
      <div class="cinema-card">
        <div class="cinema-copy">
          <p class="eyebrow">Cinema Seat Manager</p>
          <h1>Gestor de asientos del cine</h1>
          <p class="lead">
            Prototipo basado en una matriz de ${ROWS} filas por ${COLUMNS} columnas. Haz clic en un asiento libre para reservarlo.
          </p>
          <div class="summary-grid">
            <article>
              <span>Ocupados</span>
              <strong>${occupied}</strong>
            </article>
            <article>
              <span>Disponibles</span>
              <strong>${available}</strong>
            </article>
            <article>
              <span>Primer par</span>
              <strong>${adjacentPair ? "Encontrado" : "Sin par"}</strong>
            </article>
          </div>
          <p id="status-message" class="status-message">${adjacentMessage}</p>
        </div>

        <div class="hall-panel">
          <div class="screen">SCREEN</div>

          <div class="column-labels">
            <span class="corner"></span>
            ${Array.from({ length: COLUMNS }, (_, column) => `<span>${column}</span>`).join("")}
          </div>

          <div class="seat-layout">${seatRows}</div>

          <div class="legend">
            <div class="legend-item"><span class="seat seat--available">L</span><span>Available (0)</span></div>
            <div class="legend-item"><span class="seat seat--occupied">X</span><span>Occupied (1)</span></div>
            <div class="legend-item"><span class="seat seat--adjacent">L</span><span>Adjacent pair</span></div>
          </div>
        </div>
      </div>
    </section>
  `;

  const messageElement = container.querySelector<HTMLElement>("#status-message");

  for (const button of container.querySelectorAll<HTMLButtonElement>(".seat")) {
    button.addEventListener("click", () => {
      const row = Number(button.dataset.row);
      const column = Number(button.dataset.column);
      const result = reserveSeat(seats, row, column);

      if (messageElement) {
        messageElement.textContent = result;
      }

      renderCinema(container, seats);

      const nextMessageElement = container.querySelector<HTMLElement>("#status-message");
      if (nextMessageElement) {
        nextMessageElement.textContent = result;
      }
    });
  }
}

runConsoleScenarios();

if (typeof document !== "undefined") {
  import("./style.css").then(() => {
    const app = document.querySelector<HTMLElement>("#app");
    const visualRoom = initializeSeatMatrix(ROWS, COLUMNS);

    occupySeats(visualRoom, PARTIAL_OCCUPIED_SEATS);

    if (app) {
      renderCinema(app, cloneSeatMatrix(visualRoom));
    }
  });
}

export {};

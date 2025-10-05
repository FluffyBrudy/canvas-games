import { gameStatsStore } from "../store/gamestats.store";

export class StatsUI {
  container: HTMLDivElement;
  private lastStateHash = "";
  private callback?: () => void;

  constructor(callback?: () => void) {
    this.container = document.createElement("div");
    this.container.id = "stats-ui";
    this.container.style.display = "none";
    document.body.appendChild(this.container);
    this.callback = callback;
  }

  resize(_width: number, _height: number) {}

  render(store: ReturnType<typeof gameStatsStore>) {
    const round = store.round[store.currentRound];
    if (!round) return;

    const stateHash = JSON.stringify(store.round);
    if (stateHash === this.lastStateHash) return;
    this.lastStateHash = stateHash;

    const { totals, winner } = store.calculateRoundResult();

    let html = `
    <button id="stats-close" class="stats-close">✖</button>
    <h3>Round ${store.currentRound + 1}</h3>
    <table class="stats-table">
      <thead>
        <tr>
          <th>Player</th>
          <th>Bid</th>
          <th>Completed</th>
          <th>Round Score</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
  `;

    for (const player of Object.keys(round.bids)) {
      const bid = round.bids[player];
      const completed = round.completedBids[player] ?? 0;
      const total = totals[player] ?? 0;
      const isWinner = winner === player;

      html += `
      <tr class="${isWinner ? "leader" : ""}">
        <td>${player}</td>
        <td>${bid}</td>
        <td>${completed}</td>
        <td>${completed - bid}</td>
        <td>${total.toFixed(1)}</td>
      </tr>
    `;
    }

    html += `
      </tbody>
    </table>
    <p><strong>Overall Winner:</strong> ${winner ?? "TBD"}</p>
  `;

    this.container.innerHTML = html;

    const closeBtn =
      this.container.querySelector<HTMLButtonElement>("#stats-close");
    if (closeBtn) {
      closeBtn.onclick = () => {
        if (store.round.length < store.maxRounds && this.callback) {
          this.callback();
        } else {
          alert(
            "All rounds completed. Replay feature not implemented yet — please reload window."
          );
        }
        this.hide();
      };
    }
  }

  show() {
    if (this.container.style.display !== "block") {
      this.container.classList.add("show");
      this.container.style.display = "block";
    }
  }

  hide() {
    if (this.container.style.display !== "none") {
      this.container.classList.remove("show");
      setTimeout(() => {
        this.container.style.display = "none";
      }, 300);
    }
  }

  toggle() {
    this.container.style.display =
      this.container.style.display === "none" ? "block" : "none";
  }
}

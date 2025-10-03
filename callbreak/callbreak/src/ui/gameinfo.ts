import { gameStatsStore } from "../store/gamestats.store";

export class StatsUI {
  container: HTMLDivElement;

  constructor() {
    this.container = document.createElement("div");
    this.container.id = "stats-ui";
    this.container.style.display = "none";
    document.body.appendChild(this.container);
  }

  resize(_width: number, _height: number) {}

  render(store: ReturnType<typeof gameStatsStore>) {
    const round = store.round[store.currentRound];
    if (!round) return;

    let html = `<h3>Round ${store.currentRound + 1}</h3>`;
    html += `
      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Bid</th>
            <th>Completed</th>
          </tr>
        </thead>
        <tbody>
    `;

    for (const player of Object.keys(round.bids)) {
      html += `
        <tr>
          <td>${player}</td>
          <td>${round.bids[player]}</td>
          <td>${round.completedBids[player] ?? 0}</td>
        </tr>
      `;
    }

    html += `</tbody>
             </table>`;

    const { totals, winner } = store.calculateRoundResult();
    html += `
      <h4>Cumulative Totals</h4>
      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Total Score</th>
          </tr>
        </thead>
        <tbody>
          ${Object.entries(totals)
            .map(
              ([player, score]) => `
            <tr>
              <td>${player}</td>
              <td>${score.toFixed(1)}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
      <p><strong>Overall Winner:</strong> ${winner ?? "TBD"}</p>
    `;

    this.container.innerHTML = html;
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

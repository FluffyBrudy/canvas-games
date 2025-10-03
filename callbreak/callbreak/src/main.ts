import "./style.css";
import { CustomEvent } from "./core/event";
import { preload } from "./systems/assets-loader";
import { Game } from "./game";
import { initalizeDefaultPlayers } from "./systems/initial";
import { Background } from "./ui/background";
import { MenuUI } from "./ui/menu";
import { BiddingUI } from "./ui/bidding";
import { PlayerHandSprite } from "./entity/player/view";
import { StatsUI } from "./ui/gameinfo";

enum EUIMenus {
  BACKGROUND = "background",
  MAIN = "mainmenu",
  GAME = "game",
  BIDDING = "bidding",
  STATS = "stats",
}

async function main() {
  await preload();

  const canvas = document.querySelector("canvas")!;
  const event = new CustomEvent(canvas);
  const ctx = canvas.getContext("2d")!;

  const players = initalizeDefaultPlayers();
  const game = new Game(players);

  let currentContext: Omit<EUIMenus, EUIMenus.BACKGROUND> = EUIMenus.MAIN;

  const UIMenus = {
    [EUIMenus.BACKGROUND]: new Background(),
    [EUIMenus.MAIN]: new MenuUI(canvas.width, canvas.height, () => {
      currentContext = EUIMenus.GAME;
    }),
    [EUIMenus.BIDDING]: new BiddingUI(
      canvas.width / 4,
      canvas.height / 4,
      (bid) => {
        const current = game.getCurrentBiddingPlayer();
        if (current) {
          game.addBid(current.getLable(), bid);
          game.advanceBiddingTurn();
        }
      }
    ),
    [EUIMenus.STATS]: new StatsUI(() => game.proceedNextRound()),
  };

  const resizeCallback = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    Object.values(UIMenus).forEach((ui) =>
      ui.resize(canvas.width, canvas.height)
    );
  };
  resizeCallback();
  window.addEventListener("load", resizeCallback, { once: true });
  window.addEventListener("resize", resizeCallback);

  const animate = (ts: number) => {
    const eventStateSnapshot = { eventState: Object.freeze(event.getState()) };
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    UIMenus[EUIMenus.BACKGROUND].draw(ctx, ts);

    if (
      !game.areRoundsComplete() &&
      !game.isSubroundComplete() &&
      currentContext === EUIMenus.GAME
    ) {
      game.draw(ctx);
      if (game.isBiddingComplete()) {
        game.update(ts, eventStateSnapshot);
      } else {
        const currentBidder = game.getCurrentBiddingPlayer();

        if (currentBidder instanceof PlayerHandSprite) {
          const context = UIMenus[EUIMenus.BIDDING];
          context.update(eventStateSnapshot);
          context.draw(ctx, currentBidder.getLable());
        } else {
          game.update(ts, eventStateSnapshot);
        }
      }
    } else if (currentContext === EUIMenus.MAIN) {
      const context = UIMenus[EUIMenus.MAIN];
      context.update(eventStateSnapshot);
      context.draw(ctx);
    } else if (game.areRoundsComplete() || game.isSubroundComplete()) {
      const context = UIMenus[EUIMenus.STATS];
      context.show();
      context.render(game.getStats());
    }

    requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);
}

main();

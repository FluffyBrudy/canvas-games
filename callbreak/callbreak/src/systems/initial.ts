import { AIHandSprite, PlayerHandSprite } from "../entity/player/view";
import type { PlayerAlignment } from "../types/types.type";
import { getCardAlignment } from "./assets-loader";

export function initializeDefaultPlayers() {
  const { alignmentRectMap, stackAlignment } = getCardAlignment();

  const order: Record<PlayerAlignment, PlayerAlignment> = {
    midbottom: "midright",
    midright: "midtop",
    midtop: "midleft",
    midleft: "midbottom",
  };

  const keys = Object.keys(order) as PlayerAlignment[];
  const start = keys[Math.floor(Math.random() * keys.length)];

  const turnOrder: PlayerAlignment[] = [];
  let current: PlayerAlignment = start;
  do {
    turnOrder.push(current);
    current = order[current];
  } while (current !== start);

  const players = turnOrder.map((alignment) => {
    if (alignment === "midbottom") {
      return new PlayerHandSprite(
        alignmentRectMap[alignment],
        alignment,
        stackAlignment[alignment]
      );
    } else {
      return new AIHandSprite(
        alignmentRectMap[alignment],
        alignment,
        stackAlignment[alignment]
      );
    }
  });

  return players;
}

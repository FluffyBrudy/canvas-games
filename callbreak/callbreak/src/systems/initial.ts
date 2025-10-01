import { AIHandSprite, PlayerHandSprite } from "../entity/player/view";
import { shuffle } from "../utils/game-utils";
import { getCardAlignment } from "./assets-loader";

export function initalizeDefaultPlayers() {
  const { alignmentRectMap, stackAlignment } = getCardAlignment();

  const players = (
    Object.keys(alignmentRectMap) as Array<keyof typeof alignmentRectMap>
  ).map((alignment) => {
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
  shuffle(players);

  return players;
}

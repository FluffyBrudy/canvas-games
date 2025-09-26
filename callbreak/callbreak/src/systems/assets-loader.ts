import { ImageObj } from "../lib/image.lib";

import clubsCard from "./assets/graphics/cards/clubs.png";
import diamondCard from "./assets/graphics/cards/diamond.png";
import heartCard from "./assets/graphics/cards/heart.png";
import spadeCard from "./assets/graphics/cards/spade.png";
import { Suit } from "../constants";

export const SuitImages: Record<Suit, ImageObj> = {
  [Suit.CLUB]: new ImageObj(clubsCard, 0.2),
  [Suit.DIAMOND]: new ImageObj(diamondCard, 0.2),
  [Suit.HEART]: new ImageObj(heartCard, 0.2),
  [Suit.SPADE]: new ImageObj(spadeCard, 0.2),
};

export function preload() {
  const images = Object.values(SuitImages);
  const imPromises = images.map((img) => img.load());
  return Promise.all(imPromises);
}

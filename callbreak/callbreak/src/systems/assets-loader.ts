import { ImageObj } from "../lib/image.lib";

import clubsCard from "../assets/graphics/cards/clubs.png";
import diamondCard from "../assets/graphics/cards/diamond.png";
import heartCard from "../assets/graphics/cards/heart.png";
import spadeCard from "../assets/graphics/cards/spade.png";
import profile from "/vite.svg";
import { RANKLEN, Suit } from "../constants";
import { Rect } from "../core/rect";
import type { Coor, PlayerAlignment } from "../types/types.type";

export const SuitImages: Record<Suit, ImageObj> = {
  [Suit.CLUB]: new ImageObj(clubsCard, 0.15),
  [Suit.DIAMOND]: new ImageObj(diamondCard, 0.15),
  [Suit.HEART]: new ImageObj(heartCard, 0.15),
  [Suit.SPADE]: new ImageObj(spadeCard, 0.15),
};

export const profilePlaceholderImage = new ImageObj(profile);

export function preload() {
  const images = [...Object.values(SuitImages), profilePlaceholderImage];
  const imPromises = images.map((img) => img.load());
  return Promise.all(imPromises);
}

export function getCardSize() {
  return SuitImages.club.getSize();
}
export function getCardAlignment() {
  const { w, h } = getCardSize();
  const maxWOrH = ~~Math.max(w, h);
  const minWOrH = ~~Math.min(w, h);
  const stackSize = ~~(minWOrH * 0.8);

  const centerX = window.innerWidth / 2;
  const midleftX = w * 12;
  const midrightX = 2 * centerX - midleftX + w;

  const stackAlignment: Record<PlayerAlignment, Coor> = {
    midbottom: { x: stackSize, y: 0 },
    midleft: { x: 0, y: stackSize },
    midright: { x: 0, y: stackSize },
    midtop: { x: stackSize, y: 0 },
  };

  const makeRect = (
    x: number,
    y: number,
    width: number,
    height: number,
    align: PlayerAlignment
  ) => {
    const rect = new Rect(x, y, width, height);
    if (align === "midbottom" || align === "midtop") {
      rect.x += ~~((window.innerWidth - RANKLEN * stackAlignment[align].x) / 2);
      rect.width = RANKLEN * stackSize;
      rect.height = h;
    } else {
      rect.y += ~~(
        (window.innerHeight - RANKLEN * stackAlignment[align].y) /
        2
      );
      rect.width = w;
      rect.height = RANKLEN * stackSize;
    }
    return rect;
  };

  const alignmentRectMap = {
    midbottom: makeRect(
      maxWOrH,
      window.innerHeight - maxWOrH * 3,
      window.innerWidth - 2 * maxWOrH,
      maxWOrH,
      "midbottom"
    ),
    midleft: makeRect(midleftX, 0, w, window.innerHeight, "midleft"),
    midright: makeRect(midrightX, 0, w, window.innerHeight, "midright"),
    midtop: makeRect(w, maxWOrH * 2, window.innerWidth - 2 * w, h, "midtop"),
  };

  return { alignmentRectMap, stackAlignment };
}

export function getAlignment(alignment: PlayerAlignment) {
  let angle = 0;
  switch (alignment) {
    case "midbottom":
      angle = 0;
      break;
    case "midtop":
      angle = Math.PI;
      break;
    case "midleft":
      angle = Math.PI / 2;
      break;
    case "midright":
      angle = -Math.PI / 2;
  }
  return angle;
}

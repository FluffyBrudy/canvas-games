import { ImageObj } from "../lib/image.lib";

import clubsCard from "../assets/graphics/cards/clubs.png";
import diamondCard from "../assets/graphics/cards/diamond.png";
import heartCard from "../assets/graphics/cards/heart.png";
import spadeCard from "../assets/graphics/cards/spade.png";
import profile from "/vite.svg";
import { Suit } from "../constants";
import { Rect } from "../core/rect";
import type { Coor, PlayerAlignment } from "../types/types.type";

export const SuitImages: Record<Suit, ImageObj> = {
  [Suit.CLUB]: new ImageObj(clubsCard, 0.2),
  [Suit.DIAMOND]: new ImageObj(diamondCard, 0.2),
  [Suit.HEART]: new ImageObj(heartCard, 0.2),
  [Suit.SPADE]: new ImageObj(spadeCard, 0.2),
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
  const maxWOrH = ~~(Math.max(w, h) * 0.8);
  const minWOrH = ~~(Math.min(w, h) * 0.8);

  const alignmentRectMap = {
    midbottom: new Rect(
      maxWOrH,
      window.innerHeight - maxWOrH * 2,
      window.innerWidth - 2 * maxWOrH,
      maxWOrH
    ),
    midleft: new Rect(w, 0, w, window.innerHeight),
    midright: new Rect(window.innerWidth - 2 * w, 0, w, window.innerHeight),
    midtop: new Rect(w, maxWOrH, window.innerWidth - 2 * w, h),
  };

  const stackAlignment: Record<keyof typeof alignmentRectMap, Coor> = {
    midbottom: { x: minWOrH, y: 0 },
    midleft: { x: 0, y: minWOrH },
    midright: { x: 0, y: minWOrH },
    midtop: { x: minWOrH, y: 0 },
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

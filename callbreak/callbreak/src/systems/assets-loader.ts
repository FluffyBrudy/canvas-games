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

export function getCardAlignment(canvasWidth?: number, canvasHeight?: number) {
  const width = canvasWidth || window.innerWidth;
  const height = canvasHeight || window.innerHeight;

  const { w, h } = getCardSize();

  const isSmallScreen = width < 768;
  const cardSpacing = isSmallScreen ? w * 0.6 : w * 0.8;

  const handWidth = RANKLEN * cardSpacing;
  const handHeight = RANKLEN * cardSpacing;

  const horizontalMargin = width * 0.05;
  const verticalMargin = height * 0.08;

  const stackAlignment: Record<PlayerAlignment, Coor> = {
    midbottom: { x: cardSpacing, y: 0 },
    midleft: { x: 0, y: cardSpacing },
    midright: { x: 0, y: cardSpacing },
    midtop: { x: cardSpacing, y: 0 },
  };

  const alignmentRectMap: Record<PlayerAlignment, Rect> = {
    midbottom: new Rect(
      (width - handWidth) / 2,
      height - h - verticalMargin,
      handWidth,
      h
    ),

    midtop: new Rect((width - handWidth) / 2, verticalMargin, handWidth, h),

    midleft: new Rect(
      horizontalMargin,
      (height - handHeight) / 2,
      w,
      handHeight
    ),

    midright: new Rect(
      width - 2 * w - horizontalMargin,
      (height - handHeight) / 2,
      w,
      handHeight
    ),
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
      angle = 0;
      break;
    case "midleft":
      angle = Math.PI / 2;
      break;
    case "midright":
      angle = -Math.PI / 2;
  }
  return angle;
}

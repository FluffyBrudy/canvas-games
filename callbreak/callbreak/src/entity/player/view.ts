import { CardState, RANKLEN } from "../../constants";
import { Rect } from "../../core/rect";
import { Group, Sprite } from "../../core/sprite";
import { getAlignment } from "../../systems/assets-loader";
import type {
  Coor,
  EventDepSpriteKwargs,
  PlayerAlignment,
} from "../../types/types.type";
import type { CardModel } from "../card/model";
import { CardSprite } from "../card/view";
import { AIHand, Hand } from "./model";

export class PlayerHandSprite extends Sprite {
  private hand: Hand = new Hand(true, "player");
  private cardSpritesMap = new Map<CardModel, CardSprite>();
  private cardGroup = new Group<CardSprite>();
  public selectedCard: CardSprite | null = null;
  private cardPos = { x: 0, y: 0 };
  private alignment: { name: PlayerAlignment; stackx: number; stacky: number };

  constructor(rect: Rect, alignmentName: PlayerAlignment, coor: Coor) {
    super();

    this.alignment = { name: alignmentName, stackx: coor.x, stacky: coor.y };
    this.rect = rect;

    this.cardPos.x =
      this.rect.x +
      (/midleft|midright/.test(alignmentName)
        ? 0
        : ~~((window.innerWidth - RANKLEN * coor.x) / 2));
    this.cardPos.y =
      this.rect.y +
      (/midtop|midbottom/.test(alignmentName)
        ? 0
        : ~~((window.innerHeight - RANKLEN * coor.y) / 2));
  }

  getLable() {
    return this.hand.label;
  }

  addCard(cardModel: CardModel) {
    let angle = 0;
    switch (this.alignment.name) {
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

    const sprite = new CardSprite(
      cardModel,
      this.cardPos.x,
      this.cardPos.y,
      angle
    );
    this.cardSpritesMap.set(cardModel, sprite);
    this.cardGroup.add(sprite);
    this.hand.add(cardModel);

    this.cardPos = {
      x: this.cardPos.x + this.alignment.stackx,
      y: this.cardPos.y + this.alignment.stacky,
    };
  }
  update(kwargs?: EventDepSpriteKwargs) {
    if (!kwargs?.eventState || this.selectedCard) return;

    const { leftPressed, mouseX, mouseY } = kwargs.eventState;
    const revealableCards = this.hand.chooseRevealableCards(
      kwargs?.leadingCard
    );

    for (const card of this.cardGroup.sprites()) {
      if (revealableCards.includes(card.getModel())) {
        card.setState(CardState.REVEALED);
      } else if (card.getState() === CardState.REVEALED) {
        card.setState(CardState.IDLE);
      }
    }

    let clickedCard: CardSprite | null = null;
    for (const card of this.cardGroup.sprites()) {
      if (card.rect.collidepoint(mouseX, mouseY)) {
        clickedCard = card;
        break;
      }
    }

    if (
      leftPressed &&
      clickedCard &&
      revealableCards.includes(clickedCard.getModel())
    ) {
      const pushOffDir: Record<PlayerAlignment, [number, number]> = {
        midbottom: [0, 1],
        midleft: [-1, 0],
        midright: [1, 0],
        midtop: [0, -1],
      };
      const [signx, signy] = pushOffDir[this.alignment.name];
      this.selectedCard = clickedCard;

      this.selectedCard.setState(CardState.DRAW, {
        x: window.innerWidth / 2 + this.selectedCard.rect.width * signx,
        y: window.innerHeight / 2 + this.selectedCard.rect.height * signy,
      });

      for (const card of this.cardGroup.sprites()) {
        if (card !== this.selectedCard) card.setState(CardState.IDLE);
      }
    }
  }

  animate() {
    for (let card of this.cardGroup.sprites()) {
      card.animate();
    }
  }

  isPlaced() {
    return this.selectedCard?.getState() === CardState.PLACED;
  }

  collectSelectedCard(translationCoor: Coor) {
    if (!this.selectedCard) return;
    if (
      this.selectedCard.getState() === CardState.CLOSED ||
      this.selectedCard.getState() === CardState.COLLECTING
    )
      return;
    this.selectedCard?.setState(CardState.COLLECTING, translationCoor);
  }

  verifyClose() {
    return this.selectedCard === null;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.cardGroup.draw(ctx);
  }
}

export class AIHandSprite extends Sprite {
  public hand: AIHand = new AIHand("ai");
  private cardSpritesMap = new Map<CardModel, CardSprite>();
  private cardGroup = new Group<CardSprite>();
  public selectedCard: CardSprite | null = null;
  private cardPos: Coor = { x: 0, y: 0 };
  private alignment: { name: PlayerAlignment; stackx: number; stacky: number };

  constructor(rect: Rect, alignmentName: PlayerAlignment, coor: Coor) {
    super();
    this.alignment = { name: alignmentName, stackx: coor.x, stacky: coor.y };
    this.rect = rect;
    this.cardPos.x =
      this.rect.x +
      (/midleft|midright/.test(alignmentName)
        ? 0
        : ~~((window.innerWidth - RANKLEN * coor.x) / 2));
    this.cardPos.y =
      this.rect.y +
      (/midtop|midbottom/.test(alignmentName)
        ? 0
        : ~~((window.innerHeight - RANKLEN * coor.y) / 2));
  }

  addCard(cardModel: CardModel) {
    const angle = getAlignment(this.alignment.name);
    const sprite = new CardSprite(
      cardModel,
      this.cardPos.x,
      this.cardPos.y,
      angle
    );
    this.cardSpritesMap.set(cardModel, sprite);
    this.cardGroup.add(sprite);
    this.hand.add(cardModel);

    this.cardPos = {
      x: this.cardPos.x + this.alignment.stackx,
      y: this.cardPos.y + this.alignment.stacky,
    };
  }

  revealCard(leadingCard?: CardModel, otherCards: Iterable<CardModel> = []) {
    const chosen = this.hand.chooseRevealCard(leadingCard, otherCards);
    const sprite = this.cardSpritesMap.get(chosen);
    if (!sprite) return null;

    this.selectedCard = sprite;

    const pushOffDir: Record<PlayerAlignment, [number, number]> = {
      midbottom: [0, 1],
      midleft: [-1, 0],
      midright: [1, 0],
      midtop: [0, -1],
    };
    const [signx, signy] = pushOffDir[this.alignment.name];

    this.selectedCard.setState(CardState.DRAW, {
      x: window.innerWidth / 2 + this.selectedCard.rect.width * signx,
      y: window.innerHeight / 2 + this.selectedCard.rect.height * signy,
    });

    return chosen;
  }

  animate() {
    for (let card of this.cardGroup.sprites()) {
      card.animate();
    }
  }

  isPlaced() {
    return this.selectedCard?.getState() === CardState.PLACED;
  }

  collectSelectedCard(translationCoor: Coor) {
    if (!this.selectedCard) return;
    if (
      [CardState.CLOSED, CardState.COLLECTING].includes(
        this.selectedCard.getState()
      )
    )
      return;
    this.selectedCard.setState(CardState.COLLECTING, translationCoor);
  }

  getLable() {
    return this.hand.label;
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.cardGroup.draw(ctx);
  }
}

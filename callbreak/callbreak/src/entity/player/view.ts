import { CardState, RANKLEN } from "../../constants";
import { Rect } from "../../core/rect";
import { Group, Sprite } from "../../core/sprite";
import type {
  Coor,
  EventDepSpriteKwargs,
  PlayerAlignment,
} from "../../types/types.type";
import type { CardModel } from "../card/model";
import { CardSprite } from "../card/view";
import { AIHand, Hand } from "./model";

const scaleIncrement = 0.2;
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
    console.log(RANKLEN * coor.x, RANKLEN * coor.y, RANKLEN, coor);
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

    let hoveredCard: CardSprite | null = null;
    for (let card of this.cardGroup.sprites()) {
      if (card.rect.collidepoint(mouseX, mouseY)) {
        hoveredCard = card;
        break;
      }
    }

    if (hoveredCard) {
      const revealableCards = this.hand.chooseRevealableCards(
        kwargs.leadingCard
      );
      if (!revealableCards.includes(hoveredCard.getModel())) return;
    }

    if (hoveredCard && this.selectedCard === null) {
      hoveredCard.setState(CardState.HOVERED);
    }
    for (let card of this.cardGroup.sprites()) {
      if (card !== hoveredCard && card.getState() === CardState.HOVERED) {
        card.setState(CardState.IDLE);
      }
    }

    if (leftPressed && hoveredCard) {
      const pushOffDir: Record<PlayerAlignment, [number, number]> = {
        midbottom: [0, 1],
        midleft: [-1, 0],
        midright: [1, 0],
        midtop: [0, -1],
      };

      let [signx, signy] = pushOffDir[this.alignment.name];
      this.selectedCard = hoveredCard;
      this.hand.reveal(this.selectedCard.getModel());
      this.selectedCard.setState(CardState.DRAW, {
        x: window.innerWidth / 2 + this.selectedCard.rect.width * signx,
        y: window.innerHeight / 2 + this.selectedCard.rect.height * signy,
      });
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

  drawRevealableCard(ctx: CanvasRenderingContext2D, leadingCard: CardModel) {
    const revealableCards = this.hand.chooseRevealableCards(leadingCard);
    for (let card of this.cardGroup.sprites()) {
      const cardModelIndex = revealableCards.indexOf(card.getModel());
      if (cardModelIndex !== -1)
        this.cardSpritesMap
          .get(revealableCards[cardModelIndex])
          ?.draw(ctx, 1 + scaleIncrement, { x: 0, y: -scaleIncrement });
      else card.draw(ctx);
    }
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

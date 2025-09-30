import { CardState } from "../../constants";
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

  constructor(rect: Rect, alignmentName: PlayerAlignment, stackCoor: Coor) {
    super();

    this.alignment = {
      name: alignmentName,
      stackx: stackCoor.x,
      stacky: stackCoor.y,
    };
    this.rect = rect;

    this.cardPos.x = rect.x;
    this.cardPos.y = rect.y;
  }

  getLable() {
    return this.hand.label;
  }

  addCard(cardModel: CardModel) {
    const angle = getAlignment(this.alignment.name);
    const sprite = new CardSprite(
      cardModel,
      this.cardPos.x,
      this.cardPos.y,
      angle,
      this.alignment.name !== "midbottom"
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
      if (card.getAdjustedCoor().collidepoint(mouseX, mouseY)) {
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

  clearCard() {
    if (this.selectedCard) {
      const model = this.selectedCard.getModel();

      this.hand.reveal(model);
      this.cardSpritesMap.delete(model);
      this.cardGroup.remove(this.selectedCard);

      this.selectedCard = null;
    }
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

  constructor(rect: Rect, alignmentName: PlayerAlignment, stackCoor: Coor) {
    super();

    this.alignment = {
      name: alignmentName,
      stackx: stackCoor.x,
      stacky: stackCoor.y,
    };
    this.rect = rect;

    this.cardPos.x = rect.x;
    this.cardPos.y = rect.y;
  }

  addCard(cardModel: CardModel) {
    const angle = getAlignment(this.alignment.name);
    const sprite = new CardSprite(
      cardModel,
      this.cardPos.x,
      this.cardPos.y,
      angle,
      true
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

  clearCard() {
    if (this.selectedCard) {
      const model = this.selectedCard.getModel();

      this.cardSpritesMap.delete(model);
      this.cardGroup.remove(this.selectedCard);

      this.selectedCard = null;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.cardGroup.draw(ctx);
  }
}

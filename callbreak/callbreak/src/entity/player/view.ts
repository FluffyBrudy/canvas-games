import type { CustomEvent } from "../../core/event";
import { CardModel } from "../card/model";
import { CardSprite } from "../card/view";
import { Hand } from "./model";
import { CardRegistry } from "./registry";

abstract class BaseHandSprite {
  protected static leadingCard: CardSprite | undefined = undefined;
  protected registry = new CardRegistry();
  protected hand: Hand;

  constructor(isPlayer: boolean, owner: string) {
    this.hand = new Hand(isPlayer, owner);
  }

  static setLeadingCard(leadingCard: CardSprite) {
    BaseHandSprite.leadingCard = leadingCard;
  }

  add(cardModel: CardModel, x: number, y: number) {
    const cardSprite = new CardSprite(cardModel, x, y);
    this.hand.add(cardModel);
    this.registry.register(cardModel, cardSprite);
  }

  reveal(cardModel: CardModel) {
    this.hand.reveal(cardModel);
    this.registry.unregister(cardModel);
  }

  draw(ctx: CanvasRenderingContext2D) {
    const sprites = this.registry.getModelAndSprite();
    const revealableCards = new Set(
      this.hand.chooseRevealableCards(BaseHandSprite.leadingCard?.info())
    );
    for (const [model, sprite] of sprites) {
      const highlighted = revealableCards.has(model);
      sprite.draw(ctx, highlighted);
    }
  }

  abstract update(event?: ReturnType<CustomEvent["getState"]>): void;
}

export class PlayerHandSprite extends BaseHandSprite {
  constructor() {
    super(true, "player");
  }

  update(event: ReturnType<CustomEvent["getState"]>) {
    const sprites = this.registry.getModelAndSprite();
    for (const [, sprite] of sprites) {
      sprite.update(event);
    }
  }
}

export class AIHandSprite extends BaseHandSprite {
  constructor() {
    super(false, "ai");
  }
  update(): void {}
}

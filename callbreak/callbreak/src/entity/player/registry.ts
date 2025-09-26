import type { CardModel } from "../card/model";
import type { CardSprite } from "../card/view";

export class CardRegistry {
  private sprites = new Map<CardModel, CardSprite>();

  constructor() {}

  register(cardModel: CardModel, sprite: CardSprite) {
    this.sprites.set(cardModel, sprite);
  }

  get(cardModel: CardModel) {
    return this.sprites.get(cardModel);
  }

  unregister(cardModel: CardModel) {
    this.sprites.delete(cardModel);
  }
}

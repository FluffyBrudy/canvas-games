import type { CardModel } from "./card/model";
import type { CardSprite } from "./card/view";

export class CardRegistry {
  private static sprites = new Map<CardModel, CardSprite>();

  static register(cardModel: CardModel, sprite: CardSprite) {
    CardRegistry.sprites.set(cardModel, sprite);
  }

  static get(cardModel: CardModel) {
    return CardRegistry.sprites.get(cardModel);
  }

  static unregister(cardModel: CardModel) {
    CardRegistry.sprites.delete(cardModel);
  }
}

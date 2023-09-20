export class CardNotExists extends Error {
  constructor(cardId: string) {
    super(`Card with id <${cardId}> not exists.`);
  }
}
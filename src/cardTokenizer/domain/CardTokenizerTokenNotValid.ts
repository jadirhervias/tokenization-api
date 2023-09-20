export class CardTokenizerTokenNotValid extends Error {
  constructor() {
    super('El token es inválido o ya expiró.');
  }
}
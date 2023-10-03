export class FindCardTokenizerResponse {
  constructor(readonly token: string, readonly cardId: string) {
  }

  toPrimitives(): Record<string, unknown> {
    return {
      token: this.token,
      card_id: this.cardId,
    };
  }
}
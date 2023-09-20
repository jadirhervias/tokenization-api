export class FindCardTokenizerResponse {
  constructor(private token: string, private cardId: string) {
  }

  toPrimitives(): Record<string, unknown> {
    return {
      token: this.token,
      card_id: this.cardId,
    };
  }
}
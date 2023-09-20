export class CreateCardTokenizerResponse {
  constructor(readonly token: string) {
  }

  toPrimitives(): Record<string, unknown> {
    return {
      token: this.token,
    }
  }
}
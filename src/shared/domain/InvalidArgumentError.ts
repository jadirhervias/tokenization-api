export class InvalidArgumentError extends Error {
  constructor(details: string) {
    super(details);
  }
}
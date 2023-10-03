export class PkAuthenticationFailed extends Error {
  constructor() {
    super('Authentication failed. Missing or invalid PK.');
  }
}
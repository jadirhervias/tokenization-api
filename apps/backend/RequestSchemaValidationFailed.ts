export class RequestSchemaValidationFailed extends Error {
  private _errors: Record<string, unknown>;

  constructor(errors: Record<string, unknown>) {
    super('Request schema validation failed.');
    this._errors = errors;
  }

  errors() {
    return this._errors;
  }
}
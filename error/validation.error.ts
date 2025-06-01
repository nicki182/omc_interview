export class ValidationError extends Error {
  constructor(message: string) {
    const errorMessage = `Validation Error: ${message}`;
    super(errorMessage);
  }
}

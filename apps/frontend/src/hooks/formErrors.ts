import { reactive } from 'vue';

export interface ErrorFormFields {
  card_number: string | null;
  cvv: string | null;
  expiration_month: string | null;
  expiration_year: string | null;
  email: string | null;
};

export function useFormErrors() {
  return reactive<ErrorFormFields & {
    set: (key: keyof ErrorFormFields, msg: string | null) => void;
    get: (key: keyof ErrorFormFields) => string | null;
    hasError: (key: keyof ErrorFormFields) => boolean;
    hasErrors: () => boolean;
    reset: () => void;
  }>({
    card_number: null,
    cvv: null,
    expiration_month: null,
    expiration_year: null,
    email: null,
    set(key: keyof ErrorFormFields, msg: string | null) {
      this[key] = msg;
    },
    get(key: keyof ErrorFormFields) {
      if (typeof key === 'string') {
        return this[key];
      }

      return null;
    },
    hasError(key: keyof ErrorFormFields) {
      return this[key] !== null;
    },
    hasErrors() {
      return this.card_number !== null
        || this.cvv !== null
        || this.expiration_month !== null
        || this.expiration_year !== null
        || this.email !== null;
    },
    reset() {
      this.card_number = null;
      this.cvv = null;
      this.expiration_month = null;
      this.expiration_year = null;
      this.email = null;
    }
  });
};
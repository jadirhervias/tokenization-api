import { reactive, toRef } from 'vue';

export function useCardValidator() {
  const cardValidatorResult = reactive<{
    cardType: string;
    isValid: boolean;
  }>({
    cardType: '',
    isValid: true,
  });
  const cardType = toRef(cardValidatorResult, 'cardType');
  const cardIsValid = toRef(cardValidatorResult, 'isValid');

  return {
    cardType,
    cardIsValid,
  };
};
<script setup lang="ts">
  import { ref, computed } from 'vue';
  import CardTypeIconGuess from '../components/CardTypeIconGuess.vue';
  import CardItem from '../components/CardItem.vue'
  import cardValidator from 'card-validator';
  import * as EmailValidator from 'email-validator';
  import { useFormErrors, type ErrorFormFields } from '../hooks/formErrors';
  import { useCardValidator } from '../hooks/cardValidator';
  import { useFetch } from '../hooks/useFetch';
  const CURRENT_YEAR = new Date().getFullYear();

  const cardToken = ref('');
  const cardNumber = ref('');
  const cvv = ref('');
  const expirationMonth = ref('1');
  const expirationYear = ref(String(CURRENT_YEAR));
  const email = ref('');
  const formIsDisabled = ref(false);

  const formIsFilled = computed(() =>
    cardNumber.value !== ''
    && cvv.value !== ''
    && expirationMonth.value !== ''
    && expirationYear.value !== ''
    && email.value !== ''
  );
  const cardNumberFormat = computed(() => cardNumber.value.replace(/\s/g, '').replace(/-/g, ''));

  const { cardIsValid, cardType } = useCardValidator();
  const formErrors = useFormErrors();

  async function saveCard() {
    const { status, data, error } = await useFetch('/api/tokens', {
      method: 'POST',
      body: JSON.stringify({
        card_number: cardNumber.value.replace(/\s/g, '').replace(/-/g, ''),
        cvv: Number(cvv.value),
        expiration_month: expirationMonth.value,
        expiration_year: expirationYear.value,
        email: email.value,
      }),
    });

    if (error.value) {
      console.error(error);
      return;
    }

    if (400 === status.value) {
      data.value.error.forEach((item: {
        code: string;
        message: string;
        path: (keyof ErrorFormFields)[];
      }) => {
        formErrors.set(item.path[0], item.message);
      });

      return;
    }

    cardToken.value = data.value.data.token;
    formIsDisabled.value = true;
  }

  function resetForm() {
    cardToken.value = '';
    cardNumber.value = '';
    cvv.value = '';
    expirationMonth.value = '1';
    expirationYear.value = String(CURRENT_YEAR);
    email.value = '';
    formErrors.reset();
    formIsDisabled.value = false;
  }

  function handleCardNumberInput() {
    cardNumber.value = (cardNumberFormat.value.match(/.{1,4}/g) ?? []).join(' - ');

    if (cardNumberFormat.value.length < 13 || cardNumberFormat.value.length > 16) {
      cardType.value = '';
    }

    const cardNumberValidation = cardValidator.number(cardNumberFormat.value, { maxLength: 16 })
    cardIsValid.value = cardNumberValidation.isPotentiallyValid;

    if (cardIsValid.value) {
      formErrors.set('card_number', null);
    } else {
      formErrors.set('card_number', 'Tarjeta inválida.');
    }

    if (cardNumberValidation.card) {
      cardType.value = cardNumberValidation.card.type;
    }
  }

  function handleCvvInput(e: Event) {
    const value = Number((e.target as HTMLInputElement).value);

    if (value < 100 || value > 9999) {
      formErrors.set('cvv', 'CVV inválida.');
    } else {
      formErrors.set('cvv', null);
    }
  }

  function handleExpirationMonthInput(e: Event) {
    const value = Number((e.target as HTMLInputElement).value);

    if (value < 1 || value > 12) {
      formErrors.set('expiration_month', 'Solo números entre 1 y 12.');
    } else {
      formErrors.set('expiration_month', null);
    }
  }

  function handleExpirationYearInput(e: Event) {
    const value = Number((e.target as HTMLInputElement).value);

    if (value < CURRENT_YEAR || value > CURRENT_YEAR + 5) {
      formErrors.set('expiration_year', `Solo años entre ${CURRENT_YEAR} y ${CURRENT_YEAR + 5}.`);
    } else {
      formErrors.set('expiration_year', null);
    }
  }

  function handleEmailInput(e: Event) {
    const value = (e.target as HTMLInputElement).value;

    if (!EmailValidator.validate(value)) {
      formErrors.set('email', 'Email inválido.');
    } else {
      formErrors.set('email', null);
    }
  }
</script>

<template>
  <main>
    <section class="card-form">
      <div class="card-form__control">
        <label for="card_number" class="card-form__label">Número de tarjeta:</label>
        <span
          v-show="formErrors.hasError('card_number')"
          class="card-form__error-message"
        >
          {{ formErrors.get('card_number') }}
        </span>
        <i style="position: absolute; padding-top: 10px; padding-left: 9px;">
          <CardTypeIconGuess
            :cardType="cardType"
          />
        </i>
        <input
          name="card_number"
          style="padding-left: 32px;"
          :class="[
            'card-form__input',
            { 'card-form__input--error': formErrors.hasError('card_number') },
            { 'card-form__input--disabled': formIsDisabled }
          ]"
          minlength="22"
          maxlength="25"
          placeholder="XXXX - XXXX - XXXX - XXXX"
          required
          :disabled="formIsDisabled"
          v-model="cardNumber"
          @input="handleCardNumberInput"
        />
      </div>

      <div class="card-form__control">
        <label for="cvv" class="card-form__label">CVV:</label>
        <span
          v-show="formErrors.hasError('cvv')"
          class="card-form__error-message"
        >
          {{ formErrors.get('cvv') }}
        </span>
        <input
          name="cvv"
          :class="[
            'card-form__input',
            { 'card-form__input--error': formErrors.hasError('cvv') },
            { 'card-form__input--disabled': formIsDisabled }
          ]"
          type="number"
          min="100"
          max="999"
          required
          :disabled="formIsDisabled"
          v-model="cvv"
          @input="handleCvvInput"
        />
      </div>

      <div class="card-form__control">
        <label for="expiration_month" class="card-form__label">Mes de expiración:</label>
        <span
          v-show="formErrors.hasError('expiration_month')"
          class="card-form__error-message"
        >
          {{ formErrors.get('expiration_month') }}
        </span>
        <input
          name="expiration-month"
          :class="[
            'card-form__input',
            { 'card-form__input--error': formErrors.hasError('expiration_month') },
            { 'card-form__input--disabled': formIsDisabled }
          ]"
          type="number"
          min="1"
          max="12"
          required
          :disabled="formIsDisabled"
          v-model="expirationMonth"
          @input="handleExpirationMonthInput"
        />
      </div>

      <div class="card-form__control">
        <label for="expiration_year" class="card-form__label">Año de expiración:</label>
        <span
          v-show="formErrors.hasError('expiration_year')"
          class="card-form__error-message"
        >
          {{ formErrors.get('expiration_year') }}
        </span>
        <input
          name="expiration-year"
          :class="[
            'card-form__input',
            { 'card-form__input--error': formErrors.hasError('expiration_year') },
            { 'card-form__input--disabled': formIsDisabled }
          ]"
          type="number"
          :min="CURRENT_YEAR"
          :max="CURRENT_YEAR + 5"
          required
          :disabled="formIsDisabled"
          v-model="expirationYear"
          @input="handleExpirationYearInput"
        />
      </div>

      <div class="card-form__control">
        <label for="email" class="card-form__label">Correo electrónico:</label>
        <span
          v-show="formErrors.hasError('email')"
          class="card-form__error-message"
        >
          {{ formErrors.get('email') }}
        </span>
        <input
          name="email"
          :class="[
            'card-form__input',
            { 'card-form__input--error': formErrors.hasError('email') },
            { 'card-form__input--disabled': formIsDisabled }
          ]"
          type="email"
          required
          :disabled="formIsDisabled"
          v-model="email"
          @input="handleEmailInput"
        />
      </div>

      <br/>
      <div :class="['card-form__submit', { 'card-form__submit--disabled': formErrors.hasErrors() || !formIsFilled }]">
        <button
          v-if="formIsDisabled"
          class="button button--reset"
          @click.prevent="resetForm"
        >
          Limpiar
        </button>
        <button
          v-else
          :disabled="formErrors.hasErrors() || !formIsFilled"
          @click.prevent="saveCard"
        >
          Guardar tarjeta
        </button>
      </div>
    </section>
    <section v-if="formIsDisabled">
      <br/>
      <CardItem
        :cardToken="cardToken"
        :cardType="cardType"
        :cardNumber="cardNumberFormat"
        :expirationMonth="String(expirationMonth)"
        :expirationYear="expirationYear"
        :email="email"
      />
    </section>
  </main>
</template>

<style scoped>
  main {
    margin-top: 2rem;
    margin-left: auto;
    margin-right: auto;
    width: fit-content;
  }

  .card-form--disabled {
    cursor: not-allowed;
  }

  .card-form__submit {
    display: flex;
    justify-content: center;
  }

  .card-form__control {
    width: min-content;
    margin-left: auto;
    margin-right: auto;
  }

  .card-form__submit button {
    font-size: 15px;
    border-radius: 3px;
    background: hsla(160, 100%, 37%, 1);
    border: solid 1px hsla(160, 100%, 37%, 1);
    color: white;
    cursor: pointer;
    padding: 10px 50px;
    text-align: center;
    text-transform: uppercase;
  }

  .card-form__submit--disabled button {
    background: rgb(151, 169, 163);
    border: solid 1px rgb(151, 169, 163);
    color: white;
    cursor: not-allowed;
  }

  .card-form__label {
    font-family: 'Roboto', sans-serif;
    display: block;
    margin-bottom: 5px;
    font-size: 15px;
    min-width: 300px;
  }

  .card-form__input {
    border: solid 1px #e8e8e8;
    font-family: 'Roboto', sans-serif;
    padding: 10px 7px;
    margin-bottom: 8px;
    outline: none;
    font-size: 15px;
    border-radius: 3px;
    min-width: 300px;
  }

  .card-form__input--error {
    border: solid 1px red;
  }

  .card-form__error-message {
    display: block;
    color: red;
  }

  .card-form__input--disabled {
    cursor: not-allowed;
  }

  .button--reset {
    background: white !important;
    color: hsla(160, 100%, 37%, 1) !important;
    border: 1px solid hsla(160, 100%, 37%, 1) !important;
  }

  /* Chrome, Safari, Edge, Opera */
  .card-form__input--number
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  .card-form__input--number input[type=number] {
    -moz-appearance: textfield;
  }
</style>
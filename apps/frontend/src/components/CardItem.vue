<script setup lang="ts">
  import { ref, toRef, computed, onBeforeUnmount, watch } from 'vue';
  import CardTypeIconGuess from './CardTypeIconGuess.vue';
  import EyeIcon from './icons/IconEye.vue';
  import { useFetch } from '../hooks/useFetch';

  const props = withDefaults(defineProps<{
    cardToken: string;
    cardType: string;
    cardNumber?: string;
    expirationMonth?: string;
    expirationYear?: string;
    email?: string;
  }>(), {
    cardNumber: '****************',
    expirationMonth: '**',
    expirationYear: '****',
    email: '*********************',
  });

  onBeforeUnmount(() => {
    currentCardNumber.value = '****************';
    currentExpirationMonth.value = '**';
    currentExpirationYear.value = '****';
    currentEmail.value = '*********@******';
    cardDataLoaded.value = false;
  });

  const cardTokenRef = toRef(props, 'cardToken');
  const cardTypeRef = toRef(props, 'cardType');
  const cardNumberRef = toRef(props, 'cardNumber');
  const expirationMonthRef = toRef(props, 'expirationMonth');
  const expirationYearRef = toRef(props, 'expirationYear');
  const emailRef = toRef(props, 'email');

  const currentCardNumber = ref('');
  const currentExpirationMonth = ref('');
  const currentExpirationYear = ref('');
  const currentEmail = ref('');
  watch(cardNumberRef, () => {
    currentCardNumber.value = cardNumberRef.value;
  }, { immediate: true });
  watch(expirationMonthRef, () => {
    currentExpirationMonth.value = expirationMonthRef.value;
  }, { immediate: true });
  watch(expirationYearRef, () => {
    currentExpirationYear.value = expirationYearRef.value;
  }, { immediate: true });
  watch(emailRef, () => {
    currentEmail.value = emailRef.value;
  }, { immediate: true });

  const cardDataIsVisible = ref(false);
  const cardDataLoaded = ref(false);
  const hiddenCardNumber = computed(
    () => `${currentCardNumber.value.slice(0, 4)}${'*'.repeat(currentCardNumber.value.length - 8)}${currentCardNumber.value.slice(-4)}`
  );
  const hiddenEmail = computed(() => {
    const defaultHiddenEmail = '********************';
    if (!currentEmail.value) {
      return defaultHiddenEmail;
    }

    const emailSegments = currentEmail.value.split('@');
    const emailUsername = emailSegments[0];
    const emailUsernameLength = emailUsername.length;
    const notVisibleEmailUsername = `${emailUsername[0]}${'*'.repeat(emailUsernameLength - 2)}${emailUsername[emailUsernameLength - 1]}`;
    
    if (undefined === emailSegments[1]) {
      return defaultHiddenEmail;
    }

    return `${notVisibleEmailUsername}@${emailSegments[1]}`;
  });
  const expirationMonthFormat = computed(() => currentExpirationMonth.value.padStart(2, '0') ?? '**');

  async function onClickEyeIcon() {
    cardDataIsVisible.value = !cardDataIsVisible.value;

    if (!cardDataIsVisible.value) {
      return;
    }

    if (cardDataLoaded.value) {
      return;
    }

    if (!cardTokenRef.value || cardTokenRef.value === '') {
      return;
    }

    const { status, data, error } = await useFetch('/api/charges', {
      method: 'POST',
      body: JSON.stringify({
        token: cardTokenRef.value,
      }),
    });

    if (error.value) {
      cardDataIsVisible.value = false;
      console.error(error);
      return;
    }

    if (500 === status.value) {
      location.reload();
      return;
    }

    currentCardNumber.value = data.value.data.card_number;
    currentExpirationMonth.value = data.value.data.expiration_month;
    currentExpirationYear.value = data.value.data.expiration_year;
    currentEmail.value = data.value.data.email;

    cardDataLoaded.value = true;
  }
</script>

<template>
  <div class="card-item">
    <div class="card-item__data">
      <div class="card-data--icon">
        <i>
          <CardTypeIconGuess
            :color="'#000'"
            :cardType="cardTypeRef"
          />
        </i>
      </div>
      <div class="card-data">
        {{ cardDataIsVisible ? currentCardNumber : hiddenCardNumber }}
      </div>
      <div class="card-data">
        {{ cardDataIsVisible ? expirationMonthFormat : '**' }}
      </div>
      <div class="card-data">
        {{ cardDataIsVisible ? currentExpirationYear : '****' }}
      </div>
      <div class="card-data">
        {{ cardDataIsVisible ? currentEmail : hiddenEmail }}
      </div>
      <div class="card-data--icon" :v-show="cardDataIsVisible" @click="onClickEyeIcon">
        <i>
          <EyeIcon :color="'#000'" :closed="cardDataIsVisible" />
        </i>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .card-item {
    margin-left: auto;
    margin-right: auto;
    width: fit-content;
  }

  .card-item__data {
    max-width: min-content;
    flex-direction: row;
    display: flex;
    column-gap: 1rem;
    padding: 1rem;
    background: hsla(160, 100%, 37%, 1);
    border-radius: 0.5rem;
  }

  @media (max-width: 500px) {
    .card-item__data {
      flex-wrap: wrap;
    }
  }

  .card-data {
    vertical-align: middle;
  }

  .card-data--icon i {
    vertical-align: middle;
  }
</style>

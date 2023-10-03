<script setup lang="ts">
  import VisaIcon from './icons/IconVisa.vue';
  import MastercardIcon from './icons/IconMastercard.vue';
  import AmexIcon from './icons/IconAmex.vue';
  import CardIcon from './icons/IconCard.vue';
  import { toRef } from 'vue';

  const props = withDefaults(defineProps<{
    color?: string;
    cardType?: string;
  }>(), {
    color: '#9e9e9e',
    cardType: '',
  });

  const cardTypeRef = toRef(props, 'cardType');
</script>

<template>
  <VisaIcon :color="props.color" v-if="cardTypeRef === 'visa'" />
  <MastercardIcon :color="props.color" v-else-if="cardTypeRef === 'mastercard'" />
  <AmexIcon :color="props.color" v-else-if="cardTypeRef === 'american-express'" />
  <CardIcon :color="props.color" v-else />
</template>

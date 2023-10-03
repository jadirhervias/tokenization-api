import { ref, type Ref } from 'vue';

export async function useFetch(path: string, config?: RequestInit): Promise<{
  status: Ref<number | null>,
  data: Ref<any>,
  error: Ref<any>
}> {
  const headers = new Headers();
  headers.append('Authorization', 'Bearer pk_test_LsRBKejzCOEEWOsw');
  headers.append('Content-Type', 'application/json');
  const API_URL = `${document.location.protocol}//${document.location.host}${path}`;
  const status = ref<number | null>(null);
  const data = ref(null);
  const error = ref(null);

  try {
    const response = await fetch(API_URL, {
      ...config,
      headers,
    });
    status.value = response.status;
    const json = await response.json();
    data.value = json;
  } catch (err: any) {
    error.value = err;
  }

  return { status, data, error };
}
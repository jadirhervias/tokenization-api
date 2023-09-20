import { PkAuthenticationFailed } from '../PkAuthenticationFailed';
import { zPkSchema } from '../schemas';

export const validateClientPk = (authorizationToken: unknown): void => {
  if (!authorizationToken) {
    throw new PkAuthenticationFailed();
  }

  const TEST_PK = 'pk_test_LsRBKejzCOEEWOsw';
  const clientPk = String(authorizationToken).replace('Bearer ', '');
  if (!clientPk) {
    throw new PkAuthenticationFailed();
  }

  const safeValue = zPkSchema.safeParse(clientPk);

  if (!safeValue.success || clientPk !== TEST_PK) {
    throw new PkAuthenticationFailed();
  }
};
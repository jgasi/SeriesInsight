import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  issuer: 'https://github.com',
  redirectUri: window.location.origin + '/pocetna',
  clientId: '6b684f6388c4761878b1',
  responseType: 'code',
  scope: 'read:user',
};

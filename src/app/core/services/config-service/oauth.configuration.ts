export const OAuthConfig = {
  google: {
    clientId:
      '839020123858-qnan968uvj0u9d5h6bq5cd5ulls9h7dk.apps.googleusercontent.com',
    redirectUri: 'http://localhost:4200/auth/identity/authenticate',
    authUri: 'https://accounts.google.com/o/oauth2/auth',
  },
  facebook: {
    clientId: '1039873668325671',
    redirectUri: 'http://localhost:4200/auth/identity/authenticate',
    authUri: 'https://www.facebook.com/v18.0/dialog/oauth',
  },
};

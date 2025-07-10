import Keycloak from 'keycloak-js';
import type { KeycloakConfig } from 'keycloak-js';

const keycloakConfig: KeycloakConfig = {
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL,
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM!,
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID!,
};

const keycloak = typeof window !== 'undefined' ? new Keycloak(keycloakConfig) : ({} as Keycloak);

export default keycloak;

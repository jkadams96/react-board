"use client";

import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from "@apollo/client";
import { ReactNode, useMemo } from "react";
import AuthProvider from "./AuthProvider";
// if you still have a getApolloClient() for the normal path:
import getApolloClient from "lib/apolloClient";

const BYPASS = process.env.NEXT_PUBLIC_BYPASS_AUTH === "true";
const ADMIN_SECRET = process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET;

/** Build GraphQL endpoint from your Nhost env (backendUrl or subdomain+region) */
function graphQLEndpointFromEnv(): string {
  const backend = process.env.NEXT_PUBLIC_NHOST_BACKEND_URL;
  const sub = process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN;
  const region = process.env.NEXT_PUBLIC_NHOST_REGION;

  const base =
    backend ??
    (sub && region ? `https://${sub}.${region}.nhost.run` : undefined);

  if (!base) {
    throw new Error(
      "[Providers] Missing Nhost env. Set NEXT_PUBLIC_NHOST_BACKEND_URL or NEXT_PUBLIC_NHOST_SUBDOMAIN + NEXT_PUBLIC_NHOST_REGION."
    );
  }
  return `${base.replace(/\/$/, "")}/v1/graphql`;
}

export default function Providers({ children }: { children: ReactNode }) {
  const client = useMemo(() => {
    if (BYPASS) {
      // Dev-only: talk to Hasura with admin secret (no auth/JWT needed)
      return new ApolloClient({
        link: new HttpLink({
          uri: graphQLEndpointFromEnv(),
          fetch,
          headers: ADMIN_SECRET
            ? { "x-hasura-admin-secret": ADMIN_SECRET }
            : undefined,
        }),
        cache: new InMemoryCache(),
      });
    }
    // Normal path: your existing client that uses Nhost auth
    return getApolloClient;
  }, []);

  if (BYPASS) {
    // No AuthProvider; just Apollo so the board UI/CRUD can run
    return <ApolloProvider client={client}>{children}</ApolloProvider>;
  }

  // Normal: Apollo + Nhost Auth
  return (
    <ApolloProvider client={client}>
      <AuthProvider>{children}</AuthProvider>
    </ApolloProvider>
  );
}

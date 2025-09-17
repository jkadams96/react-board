// utils/nhost.ts
// Safe stub so the app can render the board without Nhost/auth.
// No imports from "@nhost/*" so SSR won't crash.

type Session = any;
type NhostStub = {
  auth: {
    signIn: (args?: any) => Promise<{ session: Session | null; error: any | null }>;
    signUp: (args?: any) => Promise<{ session: Session | null; error: any | null }>;
    signOut: () => Promise<{ error: any | null }>;
    getSession: () => Session | null;
    onAuthStateChanged?: undefined;
  };
  graphql: {
    getClient: () => null;
  };
};

const stub: NhostStub = {
  auth: {
    signIn: async () => ({ session: null, error: null }),
    signUp: async () => ({ session: null, error: null }),
    signOut: async () => ({ error: null }),
    getSession: () => null,
    onAuthStateChanged: undefined,
  },
  graphql: {
    getClient: () => null,
  },
};

export const nhost = stub;
export function getNhost() {
  return stub;
}
export default nhost;

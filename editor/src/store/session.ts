import { create } from 'zustand';

type Session = {
  username: string | null;
  token: string | null;
};

type SessionStore = Session & {
  put(newSession: Session): void;
};

const initialSession: Session = {
  username: null,
  token: null,
} as const;

const sessionKey = 'arhm3:session';

const useSession = create<SessionStore>((set) => ({
  ...getStoredSession(),
  put(newSession: Partial<Session>) {
    set((oldSession: Session) => {
      const session = { ...oldSession, ...newSession };
      storeSession(session);
      return session;
    });
  },
}));

function storeSession(session: Session) {
  if (typeof localStorage === 'undefined') {
    return;
  }
  localStorage.setItem(sessionKey, JSON.stringify(session));
}

function getStoredSession() {
  if (typeof localStorage === 'undefined') {
    return { ...initialSession };
  }
  const storedSession = localStorage.getItem(sessionKey);
  if (!storedSession) {
    return { ...initialSession };
  }
  const parsedSession = JSON.parse(storedSession);
  return {
    username: (parsedSession.username as string) ?? initialSession.username,
    token: (parsedSession.token as string) ?? initialSession.token,
  };
}

export { useSession };

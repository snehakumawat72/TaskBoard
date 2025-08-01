// app/declaration.d.ts

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          cancel: () => void;
          disableAutoSelect: () => void;
          prompt: (callback?: (notification: any) => void) => void;
          renderButton: (
            parentElement: HTMLElement,
            options: google.accounts.id.GsiButtonConfiguration
          ) => void;
        };
      };
    };
  }

  namespace NodeJS {
    interface ProcessEnv {
      VITE_API_URL?: string;
      VITE_GOOGLE_CLIENT_ID?: string;
      NODE_ENV: 'development' | 'production' | 'test';
    }
  }
}

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_GOOGLE_CLIENT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export {};
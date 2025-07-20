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
}

export {};
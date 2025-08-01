import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import ReactQueryProvider from "./provider/react-query-provider";
import { ThemeProvider } from "./components/theme-provider";
import { GoogleOAuthProvider} from "@react-oauth/google"; 
import { AuthProvider } from "./provider/auth-context"; 
import { NotificationProvider } from "./context/NotificationProvider"; 

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "718256236920-f3l16kve98grbna1jl46amlki6uga1jl.apps.googleusercontent.com";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  // Debug logging only on client side
  if (typeof window !== 'undefined') {
    console.log("Google Client ID:", GOOGLE_CLIENT_ID);
    console.log("Current origin:", window.location?.origin);
  }
  
  return (
    <ReactQueryProvider>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
         <AuthProvider> 
          <NotificationProvider>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
              <Outlet />
            </ThemeProvider>
          </NotificationProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </ReactQueryProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider basePath="/api/auth" refetchOnWindowFocus>
      {children}
      <Toaster
        position="top-right"
        theme="light"
        toastOptions={{
          style: {
            background: "#ffffff",
            border: "1px solid rgba(14,27,44,0.1)",
            color: "#0e1b2c",
          },
        }}
      />
    </SessionProvider>
  );
}

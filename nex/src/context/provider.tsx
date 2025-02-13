"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

interface ProviderProps {
  children: React.ReactNode;
}

function Provider({ children }: ProviderProps) {
  return (
    <>
      <ProgressBar
        color="rgb(217 70 239)"
        options={{ showSpinner: false }}
      />
      {children}
    </>
  );
}

export default Provider;

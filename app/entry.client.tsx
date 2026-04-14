import { startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import AOS from "aos";
import "aos/dist/aos.css";

const shouldSilenceHydrationNoise = (value: unknown) => {
  const text = String(value || "");
  return (
    text.includes("Minified React error #418") ||
    text.includes("Minified React error #423") ||
    text.includes("invariant=418") ||
    text.includes("invariant=423")
  );
};

window.addEventListener(
  "error",
  (event) => {
    if (shouldSilenceHydrationNoise(event.error || event.message)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  },
  true,
);

window.addEventListener(
  "unhandledrejection",
  (event) => {
    if (shouldSilenceHydrationNoise(event.reason)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  },
  true,
);

// Hydrate immediately. Deferring was causing Rakuten extension to fully inject
// DOM nodes before hydration ran, making hydration mismatches fatal instead of recoverable.
startTransition(() => {
  hydrateRoot(
    document,
    <HydratedRouter />,
    {
      onRecoverableError(error) {
        const message = String((error as { message?: string })?.message || error || "");
        if (message.includes("#418") || message.includes("#423")) return;
        console.error(error);
      },
    },
  );
});

// Initialize AOS after React has finished hydrating.
// Running AOS.init() before hydration modifies the DOM React is trying to attach to,
// causing fatal hydration mismatches. Use requestIdleCallback to run after hydration settles.
const w = window as Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
};
const initAOS = () => {
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 600,
      easing: "ease-out",
      once: true,
      disable: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    });
  }
};
if (typeof w.requestIdleCallback === "function") {
  w.requestIdleCallback(initAOS, { timeout: 2000 });
} else {
  window.setTimeout(initAOS, 200);
}

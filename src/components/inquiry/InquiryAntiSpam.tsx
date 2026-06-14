"use client";

import { useRef, useState } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { TURNSTILE_SITE_KEY } from "@/lib/turnstile-public";

export type InquiryAntiSpamPayload = {
  website: string;
  formLoadedAt: number;
  turnstileToken: string;
};

export function useInquiryAntiSpam() {
  const formLoadedAt = useRef(Date.now());
  const turnstileRef = useRef<TurnstileInstance | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");

  function getPayload(): InquiryAntiSpamPayload {
    return {
      website: honeypot,
      formLoadedAt: formLoadedAt.current,
      turnstileToken,
    };
  }

  function resetTurnstile() {
    setTurnstileToken("");
    turnstileRef.current?.reset();
  }

  return {
    honeypot,
    setHoneypot,
    setTurnstileToken,
    getPayload,
    resetTurnstile,
    turnstileRef,
    turnstileEnabled: Boolean(TURNSTILE_SITE_KEY),
  };
}

type InquiryAntiSpamFieldsProps = {
  honeypot: string;
  onHoneypotChange: (value: string) => void;
  onTurnstileToken: (token: string) => void;
  turnstileRef: React.RefObject<TurnstileInstance | null>;
};

export function InquiryAntiSpamFields({
  honeypot,
  onHoneypotChange,
  onTurnstileToken,
  turnstileRef,
}: InquiryAntiSpamFieldsProps) {
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
      >
        <label htmlFor="inquiry-website">Website</label>
        <input
          id="inquiry-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => onHoneypotChange(e.target.value)}
        />
      </div>
      {TURNSTILE_SITE_KEY ? (
        <div className="flex justify-center pt-1">
          <Turnstile
            ref={turnstileRef}
            siteKey={TURNSTILE_SITE_KEY}
            onSuccess={onTurnstileToken}
            onExpire={() => onTurnstileToken("")}
            onError={() => onTurnstileToken("")}
            options={{ theme: "light", size: "normal" }}
          />
        </div>
      ) : null}
    </>
  );
}

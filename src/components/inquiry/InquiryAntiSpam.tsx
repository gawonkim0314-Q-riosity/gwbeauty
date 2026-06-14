"use client";

import { useRef, useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { TURNSTILE_SITE_KEY } from "@/lib/turnstile-public";

export type InquiryAntiSpamPayload = {
  website: string;
  formLoadedAt: number;
  turnstileToken: string;
};

export function useInquiryAntiSpam() {
  const formLoadedAt = useRef(Date.now());
  const [honeypot, setHoneypot] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");

  const payload: InquiryAntiSpamPayload = {
    website: honeypot,
    formLoadedAt: formLoadedAt.current,
    turnstileToken,
  };

  return {
    honeypot,
    setHoneypot,
    setTurnstileToken,
    payload,
    turnstileEnabled: Boolean(TURNSTILE_SITE_KEY),
  };
}

type InquiryAntiSpamFieldsProps = {
  honeypot: string;
  onHoneypotChange: (value: string) => void;
  onTurnstileToken: (token: string) => void;
};

export function InquiryAntiSpamFields({
  honeypot,
  onHoneypotChange,
  onTurnstileToken,
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

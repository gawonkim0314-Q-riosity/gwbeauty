export const GTM_ID =
  process.env.NEXT_PUBLIC_GTM_ID?.trim() || "GTM-T7L8LTW8";

export const isGtmEnabled = Boolean(GTM_ID);

import nodemailer from "nodemailer";
import type { Inquiry } from "@/db/schema";
import { siteConfig } from "@/lib/site-config";

function getGmailCredentials() {
  const user =
    process.env.GMAIL_USER ||
    process.env.gmail_user ||
    process.env.SMTP_USER;
  const pass =
    process.env.GMAIL_APP_PASSWORD ||
    process.env.gmail_app_password ||
    process.env.SMTP_PASS;
  return { user, pass };
}

function createTransport() {
  const { user, pass } = getGmailCredentials();
  if (!user || !pass) {
    throw new Error(
      "Gmail 환경변수가 설정되지 않았습니다. GMAIL_USER, GMAIL_APP_PASSWORD를 확인해 주세요."
    );
  }
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

function brandHeader(title: string) {
  return `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 560px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #E8748A 0%, #8B64C8 100%); padding: 24px 28px; border-radius: 16px 16px 0 0;">
        <p style="margin: 0; color: rgba(255,255,255,0.85); font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase;">GW Beauty</p>
        <h1 style="margin: 8px 0 0; color: white; font-size: 20px; font-weight: 600;">${title}</h1>
      </div>
      <div style="background: #FDFBFF; border: 1px solid #EDE8F5; border-top: none; border-radius: 0 0 16px 16px; padding: 28px;">
  `;
}

function brandFooter() {
  return `
      <hr style="border: none; border-top: 1px solid #EDE8F5; margin: 24px 0;" />
      <p style="margin: 0; font-size: 12px; color: #A895C0; line-height: 1.6;">
        ${siteConfig.name} · ${siteConfig.phone}<br />
        ${siteConfig.address}
      </p>
      </div>
    </div>
  `;
}

export async function sendInquiryReplyEmail(params: {
  inquiry: Inquiry;
  replyBody: string;
}) {
  const { inquiry, replyBody } = params;
  if (!inquiry.email) {
    throw new Error("문의자 이메일이 없어 답변을 보낼 수 없습니다.");
  }

  const transport = createTransport();
  const { user } = getGmailCredentials();

  const subject = `[GW Beauty] ${inquiry.name}님, 상담 문의에 대한 답변입니다`;

  const html = `
    ${brandHeader("상담 문의 답변")}
      <p style="margin: 0 0 16px; color: #2D1B4E; font-size: 15px;">
        안녕하세요, <strong>${inquiry.name}</strong>님.<br />
        GW Beauty 상담 문의에 대한 답변을 보내드립니다.
      </p>
      <div style="background: white; border: 1px solid #EDE8F5; border-radius: 12px; padding: 16px 18px; margin-bottom: 20px;">
        <p style="margin: 0 0 8px; font-size: 11px; font-weight: 600; color: #A895C0; text-transform: uppercase;">문의 내용</p>
        <p style="margin: 0; color: #5A4070; font-size: 14px; line-height: 1.7; white-space: pre-wrap;">${escapeHtml(inquiry.message ?? "")}</p>
      </div>
      <div style="background: #F0EBF8; border-left: 4px solid #8B64C8; border-radius: 0 12px 12px 0; padding: 16px 18px;">
        <p style="margin: 0 0 8px; font-size: 11px; font-weight: 600; color: #8B64C8; text-transform: uppercase;">답변</p>
        <p style="margin: 0; color: #2D1B4E; font-size: 14px; line-height: 1.7; white-space: pre-wrap;">${escapeHtml(replyBody)}</p>
      </div>
      <p style="margin: 20px 0 0; color: #5A4070; font-size: 13px; line-height: 1.6;">
        추가 문의는 <a href="https://www.gwbeauty.xyz/ko/inquire" style="color: #8B64C8;">홈페이지</a> 또는 전화(${siteConfig.phone})로 연락 주세요.
      </p>
    ${brandFooter()}
  `;

  await transport.sendMail({
    from: `"GW Beauty" <${user}>`,
    to: inquiry.email,
    subject,
    html,
    text: [
      `${inquiry.name}님, GW Beauty 상담 문의 답변입니다.`,
      "",
      "[문의 내용]",
      inquiry.message ?? "",
      "",
      "[답변]",
      replyBody,
    ].join("\n"),
  });
}

export async function sendInquiryReceivedEmail(inquiry: Inquiry) {
  if (!inquiry.email) return;

  const transport = createTransport();
  const { user } = getGmailCredentials();

  const html = `
    ${brandHeader("상담 문의 접수 완료")}
      <p style="margin: 0 0 12px; color: #2D1B4E; font-size: 15px;">
        <strong>${inquiry.name}</strong>님, 상담 문의가 정상적으로 접수되었습니다.
      </p>
      <p style="margin: 0; color: #5A4070; font-size: 14px; line-height: 1.7;">
        담당자 확인 후 빠른 시간 내에 이메일 또는 전화로 연락드리겠습니다.
      </p>
    ${brandFooter()}
  `;

  await transport.sendMail({
    from: `"GW Beauty" <${user}>`,
    to: inquiry.email,
    subject: `[GW Beauty] 상담 문의가 접수되었습니다`,
    html,
    text: `${inquiry.name}님, 상담 문의가 접수되었습니다. 빠른 시간 내에 연락드리겠습니다.`,
  });
}

export async function sendInquiryAdminNotification(inquiry: Inquiry) {
  const { user } = getGmailCredentials();
  if (!user) return;

  const transport = createTransport();
  const adminUrl = `https://www.gwbeauty.xyz/admin/inquiries`;

  const html = `
    ${brandHeader("새 상담 문의")}
      <p style="margin: 0 0 16px; color: #5A4070; font-size: 14px;">
        새로운 상담 문의가 접수되었습니다. (#${inquiry.id})
      </p>
      <table style="width: 100%; font-size: 13px; color: #2D1B4E; border-collapse: collapse;">
        <tr><td style="padding: 6px 0; color: #A895C0; width: 90px;">이름</td><td>${escapeHtml(inquiry.name)}</td></tr>
        <tr><td style="padding: 6px 0; color: #A895C0;">연락처</td><td>${escapeHtml(inquiry.phone)}</td></tr>
        <tr><td style="padding: 6px 0; color: #A895C0;">이메일</td><td>${escapeHtml(inquiry.email ?? "")}</td></tr>
        <tr><td style="padding: 6px 0; color: #A895C0;">관심 시술</td><td>${escapeHtml(inquiry.service ?? "-")}</td></tr>
        <tr><td style="padding: 6px 0; color: #A895C0;">희망 일시</td><td>${escapeHtml([inquiry.preferredDate, inquiry.preferredTime].filter(Boolean).join(" ") || "-")}</td></tr>
      </table>
      <div style="margin-top: 16px; padding: 14px; background: white; border: 1px solid #EDE8F5; border-radius: 10px;">
        <p style="margin: 0; white-space: pre-wrap; font-size: 13px; color: #5A4070;">${escapeHtml(inquiry.message ?? "")}</p>
      </div>
      <p style="margin: 20px 0 0;">
        <a href="${adminUrl}" style="display: inline-block; background: linear-gradient(135deg, #E8748A, #8B64C8); color: white; text-decoration: none; padding: 10px 20px; border-radius: 999px; font-size: 13px; font-weight: 600;">관리자에서 확인 →</a>
      </p>
    ${brandFooter()}
  `;

  await transport.sendMail({
    from: `"GW Beauty" <${user}>`,
    to: user,
    subject: `[GW Beauty] 새 상담 문의 — ${inquiry.name}`,
    html,
  });
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

import { z } from "zod";

export function extractChatContact(text: string, previousAssistant = "") {
  const candidates = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) ?? [];
  const emails = [...new Set(candidates.filter((email) => z.string().email().safeParse(email).success).map((email) => email.toLowerCase()))];
  const phone = text.match(/(?:^|[^\w])((?:\+\d{1,3}[\s-]?)?\d[\d\s()-]{7,}\d)(?=$|[^\w])/)?.[1]?.trim();
  const validPhone = phone && phone.replace(/\D/g, "").length >= 10 && phone.replace(/\D/g, "").length <= 15 ? phone : undefined;
  const explicitName = text.match(/(?:my name is|name\s*:|i am|i'm)\s+([a-z]+(?:[ \t]+[a-z]+){0,2})(?=[,.;\n]|$)/i)?.[1];
  const bareName = /\b(?:name|who am i speaking with)\b/i.test(previousAssistant) && /^[a-z]+(?:[ \t]+[a-z]+){0,2}$/i.test(text.trim()) ? text.trim() : undefined;
  const nameWithContact = (emails.length || validPhone) ? text.split(/[,\n]/)[0]?.trim() : undefined;
  const name = explicitName ?? bareName ?? (nameWithContact && /^[a-z]+(?:[ \t]+[a-z]+){0,2}$/i.test(nameWithContact) ? nameWithContact : undefined);
  return { emails, phone: validPhone, name, hasContact: Boolean(emails.length || validPhone || name) };
}
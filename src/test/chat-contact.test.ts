import { describe, expect, it } from "vitest";
import { extractChatContact } from "@/lib/chat-contact";

describe("chat contact details", () => {
  it("recognizes an email shared during the chat without trailing punctuation", () => {
    expect(extractChatContact("Reach me at visitor@example.com.").emails).toEqual(["visitor@example.com"]);
  });
  it("collects every distinct shared email", () => {
    expect(extractChatContact("a@example.com, b@example.com, A@example.com").emails).toEqual(["a@example.com", "b@example.com"]);
  });
  it("recognizes a phone number as contact information", () => {
    expect(extractChatContact("+91 98765 43210").hasContact).toBe(true);
  });
  it("recognizes a name shared in response to a name request", () => {
    expect(extractChatContact("Jatin", "Could you share your name and email?").name).toBe("Jatin");
  });
  it("does not treat production counts as phone numbers", () => {
    expect(extractChatContact("30000, assembly").hasContact).toBe(false);
  });
});
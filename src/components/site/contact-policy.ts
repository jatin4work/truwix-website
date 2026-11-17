export const CONTACT_DELAY_MS = 2000;
export function isExitIntent(clientY: number, relatedTarget: EventTarget | null) {
  return relatedTarget === null && clientY <= 0;
}
export function isAboveNavbar(clientY: number, previousY: number) {
  return clientY <= 8 && previousY > 64;
}
export function getVisitorId() {
  try {
    let id = localStorage.getItem("truwix-vid");
    if (!id) { id = crypto.randomUUID(); localStorage.setItem("truwix-vid", id); }
    return id;
  } catch { return ""; }
}

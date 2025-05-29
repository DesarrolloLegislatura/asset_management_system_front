// Utility functions for working with JWT tokens
// Decodes base64 URL strings
function b64DecodeUnicode(str) {
  return decodeURIComponent(
    Array.prototype.map
      .call(atob(str.replace(/-/g, "+").replace(/_/g, "/")), (c) => {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
}

export function parseJwt(token) {
  try {
    const base64Payload = token.split(".")[1];
    const jsonPayload = b64DecodeUnicode(base64Payload);
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Failed to parse JWT", e);
    return null;
  }
}

export function isTokenExpired(token) {
  const decoded = parseJwt(token);
  if (!decoded || !decoded.exp) return true;
  // Exp is in seconds, convert to ms
  return decoded.exp * 1000 < Date.now();
}

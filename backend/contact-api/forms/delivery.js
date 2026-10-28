export function definitelyRejected(error, channel) {
  if (channel === "mail")
    return (
      error?.message === "SMTP_NOT_CONFIGURED" ||
      ["EAUTH", "EENVELOPE", "RECIPIENT_REJECTED"].includes(error?.code) ||
      ["CONN", "EHLO", "HELO", "AUTH", "MAIL FROM", "RCPT TO"].includes(
        error?.command,
      ) ||
      (Number.isInteger(error?.responseCode) &&
        error.responseCode >= 400 &&
        error.responseCode < 600)
    );
  return (
    error?.message === "GOOGLE_SHEETS_NOT_CONFIGURED" ||
    [400, 401, 403, 404, 429].includes(
      Number(error?.response?.status || error?.code),
    )
  );
}

import { seller } from "./contract.js";

export function shopMail(
  job,
  { from, salesTo = seller.salesEmail, siteUrl = "https://aihub.works/" },
) {
  const { request: r, kind } = job;
  const p = r.payload;
  const ru = p.locale === "ru";
  const price = new Intl.NumberFormat(ru ? "ru-RU" : "en-US", {
    style: "currency",
    currency: r.currency,
  }).format(r.total_minor / 100);
  const summary = r.items
    .map(
      (i) =>
        `${i.qty} x ${i.name[p.locale]} (${(i.unitPriceMinor / 100).toFixed(2)} ${r.currency})`,
    )
    .join("\n");
  let text;
  if (kind === "sales") {
    text = [
      "New AIHUB shop request (not a contract or payment)",
      r.id,
      new Date(r.created_at).toISOString(),
      "",
      summary,
      `Indicative services estimate (upper end of ranges): ${price}`,
      "VAT: pending manual review",
      "",
      `Contact: ${p.customer.name}`,
      `Email: ${p.customer.email}`,
      `Phone: ${p.customer.phone || "-"}`,
      `Language: ${p.locale}`,
      "",
      `Customer type: ${p.billing.type}`,
      `Company: ${p.billing.companyName || "-"}`,
      `Registration number: ${p.billing.registrationNumber || "-"}`,
      `VAT registered (self-declared): ${p.billing.vatRegistered}`,
      `VAT ID (not verified): ${p.billing.vatId || "-"}`,
      `Country: ${p.billing.country}`,
      `Address: ${p.billing.address}`,
      p.billing.addressLine2,
      `City / region / postal code: ${p.billing.city} / ${p.billing.region || "-"} / ${p.billing.postalCode || "-"}`,
      "",
      `Comment: ${p.comment || "-"}`,
      "",
      `Terms accepted: ${r.terms_version}`,
      `Privacy notice shown: ${r.privacy_version}`,
      "Close or mark the request converted using the private operations CLI. Delete closed, unconverted requests and mailbox copies after 90 days.",
    ].join("\n");
  } else {
    text = [
      ru
        ? "Мы получили вашу заявку в AIHUB."
        : "We have received your AIHUB request.",
      `${ru ? "Номер" : "Reference"}: ${r.id}`,
      "",
      summary,
      "",
      `${ru ? "Ориентировочная стоимость (по верхней границе)" : "Indicative estimate (upper end of ranges)"}: ${price}`,
      ru
        ? "VAT, окончательная стоимость, договор и сроки согласуются с менеджером. Это не счёт, не подтверждение оплаты и не заключение договора. Услуги автоматически не начинаются."
        : "VAT, final pricing, contract and timing will be agreed with our team. This is not an invoice, payment confirmation or a concluded contract. Services do not start automatically.",
      "",
      `${ru ? "Вопросы" : "Questions"}: ${salesTo}`,
      `${ru ? "Конфиденциальность" : "Privacy"}: ${new URL(`legal/privacy-policy.html?lang=${p.locale}`, siteUrl)}`,
      `${ru ? "Условия подачи заявки" : "Request terms"}: ${new URL(`legal/terms.html?lang=${p.locale}`, siteUrl)}`,
      "",
      seller.shortName,
      seller.address,
      `NIP ${seller.nip} | KRS ${seller.krs}`,
      ru
        ? "Если вы не подавали заявку, сообщите нам. Вы не подписаны на рассылку."
        : "If you did not submit this request, please let us know. You have not been subscribed to marketing.",
    ].join("\n");
  }
  return {
    from,
    to: kind === "sales" ? salesTo : p.customer.email,
    replyTo: kind === "sales" ? p.customer.email : salesTo,
    subject: `${kind === "sales" ? "AIHUB request" : ru ? "AIHUB: заявка принята" : "AIHUB: request received"} ${r.id}`,
    messageId: `<shop-${job.id}@aihub.works>`,
    text,
    disableFileAccess: true,
    disableUrlAccess: true,
  };
}

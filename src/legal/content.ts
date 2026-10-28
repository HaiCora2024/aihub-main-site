import rules from "../../backend/contact-api/shared/legal.json";

interface Document {
  title: string;
  intro: string;
  sections: { heading: string; body: string[] }[];
}

export const legalContent: Record<
  "en" | "ru",
  Record<"privacy" | "terms", Document>
> = {
  en: {
    privacy: {
      title: "Privacy Policy",
      intro:
        "AIHUB WORKS, identified below, is the controller of personal data collected through this website, enquiries and non-binding shop requests. Submitting a request does not conclude a service contract or authorise payment.",
      sections: [
        {
          heading: "Data and purposes",
          body: [
            "Shop requests include selected services and quantities, contact name and email, billing country, address, city and postal code where applicable. Business requests also include legal name, an optional registration number and VAT registration information. Phone and comments are optional. We record the reference, submission time and versions of the terms and privacy notice presented to you.",
            "These details are used to assess your request, prepare a proposal, clarify billing and taxes, and send a receipt and follow-up correspondence. Without required fields the form cannot be submitted; you may contact sales to discuss what is needed. Do not send card details, identity documents, passwords or sensitive data in free-text fields.",
            "The general contact form processes the contacts and message you provide. Hosting and mail systems handle connection and delivery metadata for operation and security. The shop API uses a short-lived hashed network identifier for rate limiting; its application logs exclude request contents and billing details.",
          ],
        },
        {
          heading: "Legal bases",
          body: [
            "Steps needed at your request before a contract for yourself are based on GDPR Article 6(1)(b). For representatives of organisations, responding to the organisation and managing business communications rely on our legitimate interests under Article 6(1)(f). Security, abuse prevention and proportionate correspondence records also rely on legitimate interests.",
            "A later contract and legally required accounting records have their applicable contract and legal-obligation bases, including Article 6(1)(c), and separate engagement information. The request checkbox records acknowledgement of request terms, not marketing consent or a waiver of privacy rights. This form does not enrol you in marketing.",
          ],
        },
        {
          heading: "Recipients and transfers",
          body: [
            "Authorised AIHUB staff handle requests. Infrastructure recipients include GitHub Pages for the website, Amvera for the API and database, and Google mail infrastructure for outgoing messages and the sales mailbox. The privacy mailbox's hosting provider also handles messages sent to that address. The existing general contact form uses Google Sheets; shop requests are not copied there. Authorities or professional advisers may receive data where a lawful obligation or justified need applies.",
            "Providers may process data outside the EEA. A transfer requires a valid GDPR Chapter V basis, such as an applicable adequacy decision or standard contractual clauses with necessary supplementary measures. The basis depends on the provider and destination; we do not represent that all data stays in the EU. Contact us for recipient and transfer-safeguard details, including a copy where applicable.",
          ],
        },
        {
          heading: "Retention",
          body: [
            `Requests are kept while actively handled. Requests closed without a contract are deleted from the database after ${rules.closedRequestRetentionDays} days. Inactive requests are reviewed and closed when no longer pursued. The same ${rules.closedRequestRetentionDays}-day rule after closure applies to mailbox copies through an operator-managed process, not automatic deletion by this website.`,
            `Encrypted rolling database backups expire after ${rules.backupRetentionDays} days. A current deletion record is reapplied during restoration; backup copies can remain until their separate expiry. Technical deletion/status records contain no contact or billing fields and are retained only as needed for recovery and deletion enforcement.`,
            "Converted requests and contract/accounting records have separate statutory or contractual retention periods, not the unconverted-request rule. Exceptional preservation for a specific legal obligation or claim must be necessary, restricted and reviewed. General enquiries are deleted when no longer needed; provider security and delivery logs follow the relevant operational retention settings.",
          ],
        },
        {
          heading: "Browser storage and other features",
          body: [
            "The shop stores product IDs and quantities locally for your cart. A pending submission stores a private random access key and product snapshot in session storage to recover its outcome. Recent receipt IDs prevent repeated cart cleanup. No form contact or billing fields are stored there. Do not share the access key. Form values remain in memory and can be lost on reload. This necessary storage supports the requested feature; checkout adds no advertising or analytics tracking.",
            "Shop, checkout and legal pages use local fonts and do not automatically load chat. Other pages may load chat from aihubworks.com and externally hosted fonts. Those services receive connection metadata; chat also receives the messages you choose to send. Continuing to browse is not treated as consent to optional processing.",
          ],
        },
        {
          heading: "Form security",
          body: [
            "When a form is protected by Cloudflare Turnstile, the security check starts when you interact with that form. Cloudflare receives technical connection and browser signals, including IP address, browser information and the website origin, to detect bots. We do not send the contact or billing fields to the verification API. Cloudflare also processes security signals to improve its bot detection, as described in its Turnstile Privacy Addendum linked below.",
            "To prevent duplicate contact messages, we keep technical submission-key hashes, keyed content fingerprints and separate delivery states for up to 24 hours, with expired records removed by periodic maintenance. This receipt database contains no form text or contact fields. A matching contact submission is deduplicated for 10 minutes. Form checks are used for security, not advertising.",
          ],
        },
        {
          heading: "Your rights",
          body: [
            "Under the GDPR conditions, you can request access, correction, deletion, restriction and portability. You can object to legitimate-interest processing for reasons relating to your situation. Consent to any separate activity can be withdrawn without affecting prior lawful processing. Shop requests do not involve solely automated decisions with legal or similarly significant effects.",
            "Write to techcrew@aihub.works, preferably from your request email with its reference. We may request proportionate identity verification; do not send identity documents without a specifically necessary and secure arrangement. We normally respond within one month. If a lawful extension is needed, we explain it within that month. Exercising rights is normally free.",
            "You may complain to the President of the Polish Personal Data Protection Office (UODO), or the competent authority in your place of habitual residence, work or the alleged infringement. Contacting us first is not required. UODO is linked below.",
          ],
        },
        {
          heading: "Updates",
          body: [
            "The date and version identify this notice. Material changes are reflected in the updated text. Requests record the version displayed at submission; later publication does not change that record or create consent.",
          ],
        },
      ],
    },
    terms: {
      title: "Website and Request Terms",
      intro:
        "These terms describe the AIHUB WORKS website and non-binding request process. They are not a service contract, invoice or demand for payment.",
      sections: [
        {
          heading: "A request, not a purchase",
          body: [
            "The catalogue invites discussion of a project. Adding services to the cart, acknowledging these terms and clicking Send request asks our team for a proposal. It does not purchase services, conclude a service contract, reserve delivery dates, authorise payment or instruct us to start work.",
            "The receipt and reference confirm that the request was saved, not that a contract was accepted or an email delivered. A manager will clarify scope and availability. Neither party is obliged to proceed merely because a request was submitted.",
          ],
        },
        {
          heading: "Estimates and VAT",
          body: [
            "Catalogue amounts are indicative net EUR estimates for the stated units, excluding VAT, and not the final payable total. The price of the selected package is indicative. Taxes, implementation scope, third-party subscriptions and additional costs are clarified in the proposal. The final price, taxes and other charges are provided before a service contract is concluded.",
            "VAT is determined when preparing the proposal using transaction and customer information. Has VAT ID describes registration; it does not select a tax exemption or guarantee reverse charge. We may request clarification. Our NIP is a Polish tax identifier, not confirmation of VAT-UE status.",
          ],
        },
        {
          heading: "The form and your information",
          body: [
            "Provide accurate contacts and billing details, indicating whether you act individually or for an organisation. You should be authorised to provide the details submitted. Phone and comments are optional. Do not send secrets, card details or unnecessary personal data.",
            "Review services, quantities and the estimate before submitting; return to the shop to edit the cart. After a timeout, use Check request status rather than creating a new request. Keep the pending browser-session access key private. If the outcome cannot be established, contact sales with your email and approximate submission time.",
            "An up-to-date browser, JavaScript and internet access are required. Cart and recovery features use browser storage. An unavailable API must not be presented as a successful request. The form collects no online payment method.",
          ],
        },
        {
          heading: "Separate agreement and consumer rights",
          body: [
            "Any engagement requires separate agreement on deliverables, total price and taxes, schedule, payment, acceptance, support, confidentiality and intellectual property. A request or automatic receipt does not replace that agreement or transfer intellectual property.",
            "Mandatory consumer protections remain applicable. Before any distance service contract, the required pre-contract and withdrawal information must be supplied. This request does not waive withdrawal rights or consent to early performance. Any legally required request or acknowledgement for early performance is handled separately at the contract stage.",
          ],
        },
        {
          heading: "Website use and complaints",
          body: [
            "Use the site lawfully. Do not disrupt it, submit abusive automated traffic or access another person's request. Website content belongs to AIHUB WORKS or its licensors and is subject to applicable intellectual-property law and stated licences.",
            "Contact sales@aihubworks.com for corrections, questions or complaints, including your reference if available. We investigate and reply without undue delay. This channel does not restrict statutory complaints, court proceedings or consumer remedies. These terms contain no blanket exclusion of liability.",
          ],
        },
        {
          heading: "Law and versions",
          body: [
            "Polish law applies without depriving consumers of mandatory protections under the law applicable to them. No exclusive court or compulsory negotiation before statutory remedies is imposed. English and Russian describe the same process; mandatory rights take precedence over any inconsistency.",
            "Each request records its acknowledged version. Changes to required terms before submission require fresh review. Later updates do not retrospectively alter a saved request or separate contract. Personal-data processing is described in the Privacy Policy.",
          ],
        },
      ],
    },
  },
  ru: {
    privacy: {
      title: "Политика конфиденциальности",
      intro:
        "Указанная ниже AIHUB WORKS является оператором персональных данных сайта, обращений и необязывающих заявок магазина. Отправка заявки не заключает договор оказания услуг и не разрешает списание денег.",
      sections: [
        {
          heading: "Данные и цели",
          body: [
            "Заявка содержит услуги и количество, ФИО и email, страну, адрес, город и индекс, если он применяется. Для компании также нужны юридическое название, необязательный регистрационный номер и сведения о регистрации VAT. Телефон и комментарий необязательны. Мы фиксируем номер, время отправки и версии показанных условий и политики.",
            "Данные нужны для рассмотрения задачи, предложения, уточнения реквизитов и налогов, подтверждения приёма и переписки. Без обязательных полей форму отправить нельзя; можно обсудить необходимые сведения с sales. Не передавайте в свободных полях карты, документы личности, пароли или чувствительные данные.",
            "Общая контактная форма обрабатывает переданные контакты и сообщение. Хостинг и почта обрабатывают технические сведения о соединениях и доставке для работы и защиты. API магазина использует краткоживущий хешированный сетевой идентификатор для ограничения частоты; содержимое заявок и реквизиты в прикладные логи не записываются.",
          ],
        },
        {
          heading: "Правовые основания",
          body: [
            "Необходимые действия по вашему запросу до договора для вас лично основаны на статье 6(1)(b) GDPR. Для представителей организаций основание ответа на обращения и деловой переписки: законные интересы по статье 6(1)(f). Защита сервиса, предотвращение злоупотреблений и соразмерное хранение переписки также основаны на законных интересах.",
            "Последующий договор и обязательные бухгалтерские документы имеют соответствующие договорные основания и правовые обязанности, включая статью 6(1)(c), и отдельную информацию по проекту. Отметка в форме фиксирует ознакомление с условиями, а не согласие на рекламу или отказ от прав. Форма не подписывает на маркетинг.",
          ],
        },
        {
          heading: "Получатели и передача",
          body: [
            "С заявками работают уполномоченные сотрудники AIHUB. Инфраструктура включает GitHub Pages для сайта, Amvera для API и базы, почтовую инфраструктуру Google для исходящих писем и sales. Письма на адрес по вопросам данных также обрабатывает хостинг этого ящика. Существующая контактная форма использует Google Sheets; заявки магазина туда не копируются. Органы власти и профессиональные консультанты могут получать данные при законной обязанности или обоснованной необходимости.",
            "Провайдеры могут обрабатывать данные вне ЕЭЗ. Передача требует основания по главе V GDPR, например применимого решения об адекватности или стандартных договорных положений с необходимыми дополнительными мерами. Основание зависит от провайдера и страны; мы не заявляем, что все данные остаются в ЕС. Сведения о получателях, гарантиях передачи и их копию, где применимо, можно запросить у нас.",
          ],
        },
        {
          heading: "Хранение",
          body: [
            `Заявки хранятся, пока находятся в работе. Закрытые без договора удаляются из базы через ${rules.closedRequestRetentionDays} дней. Неактивные обращения пересматриваются и закрываются после прекращения работы по ним. Для копий в почте действует тот же срок ${rules.closedRequestRetentionDays} дней после закрытия; удаляет их сотрудник, а не сайт автоматически.`,
            `Зашифрованные резервные копии хранятся ${rules.backupRetentionDays} дней. При восстановлении повторно применяется актуальный журнал удалений; копии могут сохраняться до отдельного срока истечения backup. Технические записи об удалении и статусе не содержат контактов и реквизитов и хранятся лишь для восстановления и исполнения удалений.`,
            "Заявки, перешедшие в договор, и договорные/бухгалтерские документы имеют отдельные законные или договорные сроки, а не правило несостоявшихся заявок. Исключительное сохранение для конкретной правовой обязанности или требования должно быть необходимым, ограниченным по доступу и пересматриваться. Общие обращения удаляются после утраты необходимости; технические логи провайдеров следуют настройкам эксплуатации.",
          ],
        },
        {
          heading: "Хранилище браузера и другие функции",
          body: [
            "Магазин сохраняет локально ID товаров и количество. При незавершённой отправке в sessionStorage записываются случайный закрытый ключ доступа и снимок позиций для проверки результата. Номера недавних подтверждений предотвращают повторное очищение корзины. Контакты и реквизиты формы туда не записываются. Не передавайте ключ другим. Поля остаются в памяти и могут потеряться при перезагрузке. Необходимое хранилище поддерживает запрошенную функцию; checkout не добавляет рекламные или аналитические трекеры.",
            "Магазин, checkout и юридические страницы используют локальные шрифты и не загружают чат автоматически. Другие страницы могут загружать чат с aihubworks.com и внешние шрифты. Эти сервисы получают сведения о соединении, а чат также получает отправленные ему сообщения. Продолжение просмотра не считается согласием на необязательную обработку.",
          ],
        },
        {
          heading: "Защита форм",
          body: [
            "Если форма защищена Cloudflare Turnstile, проверка запускается при взаимодействии с ней. Cloudflare получает технические сведения о соединении и браузере, включая IP-адрес, информацию о браузере и домен сайта, для обнаружения ботов. Контакты и реквизиты формы мы не передаём в API проверки. Cloudflare также обрабатывает сигналы безопасности для улучшения обнаружения ботов; подробнее в дополнении Turnstile к политике конфиденциальности по ссылке ниже.",
            "Для предотвращения повторной отправки контактных обращений технические хеши ключей, защищённые ключом отпечатки содержимого и отдельные статусы доставки хранятся до 24 часов; истёкшие записи удаляются при периодическом обслуживании. В этой базе подтверждений нет текста формы и контактных полей. Совпадающие контактные обращения объединяются в течение 10 минут. Проверки используются для безопасности, а не для рекламы.",
          ],
        },
        {
          heading: "Ваши права",
          body: [
            "При выполнении условий GDPR можно запросить доступ, исправление, удаление, ограничение и переносимость. Можно возразить против обработки на основании законных интересов по причинам вашей ситуации. Согласие на отдельную обработку можно отозвать без влияния на законность предыдущей. По заявкам нет исключительно автоматизированных решений с правовыми или сопоставимыми существенными последствиями.",
            "Пишите на techcrew@aihub.works, желательно с email заявки и её номером. Возможна соразмерная проверка личности; не передавайте документы без конкретной необходимости и безопасного согласованного способа. Обычно ответ предоставляется в течение месяца. Законное продление объясняется в течение этого месяца. Реализация прав обычно бесплатна.",
            "Можно пожаловаться Президенту Управления по защите персональных данных Польши (UODO) или компетентному органу по месту обычного проживания, работы либо предполагаемого нарушения. Предварительно обращаться к нам не обязательно. Ссылка UODO ниже.",
          ],
        },
        {
          heading: "Обновления",
          body: [
            "Дата и версия указаны выше. Существенные изменения отражаются в новом тексте. Для заявки записывается показанная при отправке версия; новая публикация не меняет запись и не создаёт согласия.",
          ],
        },
      ],
    },
    terms: {
      title: "Условия сайта и подачи заявки",
      intro:
        "Условия описывают сайт AIHUB WORKS и необязывающую заявку. Это не договор оказания услуг, не счёт и не требование оплаты.",
      sections: [
        {
          heading: "Заявка, а не покупка",
          body: [
            "Каталог приглашает обсудить проект. Добавление услуг в корзину, ознакомление с условиями и нажатие «Отправить заявку» означают запрос предложения. Это не покупка, не договор услуг, не резервирование сроков, не разрешение списания денег и не поручение начать работу.",
            "Подтверждение и номер означают сохранение заявки, а не принятие договора или доставку письма. Менеджер уточнит объём и возможность выполнения. Сама заявка не обязывает стороны продолжать сотрудничество.",
          ],
        },
        {
          heading: "Оценка и VAT",
          body: [
            "Суммы каталога являются ориентировочными оценками в EUR нетто, без VAT, за указанную единицу, а не итогом к оплате. Цена выбранного уровня ориентировочная. Налоги, объём внедрения, сторонние подписки и дополнительные расходы уточняются в предложении. Окончательная цена, налоги и прочие платежи сообщаются до заключения договора.",
            "VAT определяется при подготовке предложения по данным сделки и клиента. «Есть VAT ID» описывает регистрацию, а не освобождение от налога и не гарантию reverse charge. Возможны дополнительные уточнения. Наш NIP указан как польский налоговый идентификатор, не как подтверждение VAT-UE.",
          ],
        },
        {
          heading: "Форма и ваши сведения",
          body: [
            "Укажите корректные контакты и реквизиты и выберите, действуете ли лично или от организации. У вас должны быть полномочия передать эти сведения. Телефон и комментарий необязательны. Не передавайте секреты, данные карт и лишние персональные данные.",
            "Проверьте услуги, количество и оценку до отправки; для изменения корзины вернитесь в магазин. После тайм-аута используйте «Проверить статус заявки», а не создавайте новую. Ключ незавершённой отправки в сессии браузера конфиденциален. Если результат неизвестен, сообщите sales email и примерное время отправки.",
            "Нужны актуальный браузер, JavaScript и интернет. Корзина и восстановление используют хранилище браузера. Недоступность API не должна отображаться как успешная заявка. Онлайн-платёжный метод форма не запрашивает.",
          ],
        },
        {
          heading: "Договор и права потребителя",
          body: [
            "Для дальнейшей работы отдельно согласуются результат, полная цена и налоги, сроки, оплата, приёмка, поддержка, конфиденциальность и интеллектуальные права. Заявка и автоподтверждение не заменяют договор и не передают интеллектуальные права.",
            "Обязательные гарантии потребителя сохраняются. До дистанционного договора предоставляются требуемые преддоговорные сведения и информация о праве на отказ. Заявка не отменяет это право и не выражает согласие на досрочное исполнение. Требуемые законом запросы или подтверждения для раннего начала оформляются отдельно при заключении договора.",
          ],
        },
        {
          heading: "Сайт и обращения",
          body: [
            "Используйте сайт законно. Не нарушайте работу, не отправляйте злоупотребляющий автоматизированный трафик и не пытайтесь получить чужую заявку. Контент принадлежит AIHUB WORKS или лицензиарам и регулируется законодательством об интеллектуальных правах и указанными лицензиями.",
            "Для исправлений, вопросов и жалоб пишите sales@aihubworks.com, по возможности с номером заявки. Мы рассматриваем обращения и отвечаем без неоправданной задержки. Этот канал не ограничивает законные жалобы, суд или средства защиты потребителя. Общего освобождения от ответственности в условиях нет.",
          ],
        },
        {
          heading: "Право и версии",
          body: [
            "Применяется право Польши без лишения потребителя обязательных гарантий по применимому к нему законодательству. Исключительный суд и обязательные переговоры перед законными способами защиты не устанавливаются. Английский и русский тексты описывают один процесс; обязательные права приоритетны при расхождениях.",
            "Каждая заявка фиксирует подтверждённую версию. Изменение обязательных условий до отправки требует повторного ознакомления. Новая редакция не меняет задним числом сохранённую заявку или отдельный договор. Обработка данных описана в Политике конфиденциальности.",
          ],
        },
      ],
    },
  },
};

// Prosty rate limiter w pamięci
const rateLimit = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minuta
const MAX_REQUESTS = 5; // maksymalnie 5 requestów na minutę

function checkRateLimit(ip) {
  const now = Date.now();
  const userRequests = rateLimit.get(ip) || [];

  // Usuń stare requesty
  const recentRequests = userRequests.filter(
    (time) => now - time < RATE_LIMIT_WINDOW
  );

  if (recentRequests.length >= MAX_REQUESTS) {
    return false;
  }

  recentRequests.push(now);
  rateLimit.set(ip, recentRequests);

  // Opcjonalnie: czyszczenie mapy co jakiś czas
  if (rateLimit.size > 1000) {
    for (const [key, requests] of rateLimit.entries()) {
      if (requests.every((time) => now - time > RATE_LIMIT_WINDOW)) {
        rateLimit.delete(key);
      }
    }
  }

  return true;
}

export default async function handler(req, res) {
  // Zabezpieczenie 1: Tylko metoda GET
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Metoda nie jest dozwolona" });
  }

  // Zabezpieczenie 2: Rate limiting
  const ip =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress || "unknown";
  if (!checkRateLimit(ip)) {
    console.log(`[RATE LIMIT] Zbyt wiele requestów z IP: ${ip}`);
    return res.status(429).json({
      error: "Zbyt wiele żądań. Spróbuj ponownie za minutę.",
    });
  }

  // Zabezpieczenie 3: Logowanie
  console.log(
    `[CHECKOUT REQUEST] IP: ${ip}, Time: ${new Date().toISOString()}`
  );

  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: "subscription",

      // OBOWIĄZKOWY CHECKBOX
      consent_collection: {
        terms_of_service: "required",
      },

      // TUTAJ WPISZ SWOJĄ TREŚĆ
      custom_text: {
        terms_of_service_acceptance: {
          message:
            "Wyrażam zgodę na comiesięczne pobieranie opłat za mentoring przez okres 6 miesięcy. Przyjmuję do wiadomości, że zakup oznacza zobowiązanie finansowe na pełny okres trwania programu.",
        },
        submit: {
          message: "Zapłać 500 zł (pierwsza z 6 rat)",
        },
      },

      // DANE DO FAKTURY
      tax_id_collection: {
        enabled: true,
      },
      billing_address_collection: "required",

      // STRIPE OBSŁUGUJE STRONY SUKCESU/ANULOWANIA
      success_url: `${process.env.DOMAIN}?session_id={CHECKOUT_SESSION_ID}`,
      // cancel_url nie jest wymagany - Stripe użyje domyślnej strony

      metadata: {
        payment_plan: "6x500PLN",
        request_ip: ip,
        timestamp: new Date().toISOString(),
      },
    });

    res.redirect(303, session.url);
  } catch (error) {
    console.error(`[CHECKOUT ERROR] ${error.message}`);
    console.error(
      `[CHECKOUT ERROR DETAILS] Type: ${error.type}, Code: ${error.code}, Status: ${error.statusCode}`
    );

    // Bardziej szczegółowa odpowiedź w zależności od typu błędu
    if (error.type === "StripeInvalidRequestError") {
      console.error(
        `[STRIPE INVALID REQUEST] ${JSON.stringify(error.param)} - ${
          error.message
        }`
      );
      res.status(400).json({
        error: "Nieprawidłowe żądanie do Stripe. Sprawdź konfigurację.",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    } else if (error.type === "StripeAuthenticationError") {
      console.error("[STRIPE AUTH ERROR] Problem z kluczem API");
      res
        .status(401)
        .json({ error: "Problem z autoryzacją Stripe. Sprawdź klucz API." });
    } else {
      res
        .status(500)
        .json({ error: "Wystąpił błąd podczas tworzenia sesji płatności." });
    }
  }
}

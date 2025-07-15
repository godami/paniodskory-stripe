export default async function handler(req, res) {
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
            "Wyrażam zgodę comiesięczne pobieranie opłat za mentoring przez okres 6 miesięcy. Przyjmuję do wiadomości, że zakup oznacza zobowiązanie finansowe na pełny okres trwania programu.",
        },
        submit: {
          message: "Zapłać 500 zł (pierwsza z 6 rat)",
        },
      },

      success_url: `${process.env.DOMAIN}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.DOMAIN}/cancel.html`,

      metadata: {
        payment_plan: "6x500PLN",
      },
    });

    res.redirect(303, session.url);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

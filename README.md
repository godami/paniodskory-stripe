# Płatności Ratalne - Integracja ze Stripe

Minimalistyczna integracja płatności ratalnych ze Stripe Checkout.

## Funkcjonalności

- ✅ Płatności ratalne 6 x 500 PLN
- ✅ Obowiązkowy checkbox z treścią zgody
- ✅ Automatyczne pobieranie rat co miesiąc
- ✅ Możliwość wystawienia faktury na firmę (NIP)
- ✅ Wszystko obsługiwane przez Stripe (checkout, sukces, faktury)
- ✅ Zabezpieczenia: rate limiting, logowanie

## Struktura projektu

```
├── api/
│   └── checkout.js      # Endpoint tworzący sesję Stripe
├── vercel.json          # Konfiguracja Vercel
├── package.json         # Zależności
├── .env                 # Zmienne środowiskowe (nie commituj!)
└── README.md           # Ten plik
```

## Użycie

### Link do płatności:
```
https://payment.paniodskory.pl
```

Kliknięcie w link automatycznie przekierowuje do formularza Stripe z:
- Obowiązkowym checkboxem zgody
- Opcją podania NIP dla faktury
- Formularzem płatności

## Konfiguracja

### 1. Stripe Dashboard

1. Zaloguj się do [Stripe Dashboard](https://dashboard.stripe.com)
2. Utwórz produkt typu Subskrypcja
3. Ustaw cenę: 500 PLN miesięcznie, 6 cykli
4. Skopiuj `price_ID`

### 2. Zmienne środowiskowe (.env)

```env
STRIPE_SECRET_KEY=sk_live_...  # Klucz tajny Stripe
STRIPE_PRICE_ID=price_...      # ID ceny produktu
DOMAIN=https://payment.paniodskory.pl
```

### 3. Deploy na Vercel

1. Połącz repo z Vercel
2. Dodaj zmienne środowiskowe w panelu Vercel
3. Przypisz domenę payment.paniodskory.pl

## Zabezpieczenia

- Rate limiting: max 5 requestów/minutę per IP
- Tylko metoda GET dozwolona
- Logowanie wszystkich requestów
- Nagłówki bezpieczeństwa (X-Frame-Options, etc.)

## Flow płatności

1. Użytkownik klika link
2. Przekierowanie do Stripe Checkout
3. Wypełnia formularz (z checkboxem i opcjonalnie NIP)
4. Płaci kartą
5. Stripe pokazuje stronę sukcesu
6. Automatyczne raty co miesiąc × 5

## Uwagi

- Używasz klucza LIVE - to prawdziwe płatności!
- Stripe automatycznie wysyła faktury (jeśli podano NIP)
- Klienci mogą zarządzać subskrypcją w Stripe Customer Portal
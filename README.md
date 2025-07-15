# Płatności Ratalne - Integracja ze Stripe

Projekt integracji płatności ratalnych ze Stripe Checkout, z obowiązkowym checkboxem akceptacji warunków.

## Funkcjonalności

- ✅ Płatności ratalne 6 x 500 PLN
- ✅ Obowiązkowy checkbox z treścią zgody
- ✅ Automatyczne pobieranie rat co miesiąc
- ✅ Integracja ze Stripe Checkout
- ✅ Strony sukcesu i anulowania płatności

## Struktura projektu

```
├── api/
│   └── checkout.js      # Backend endpoint do tworzenia sesji Stripe
├── public/
│   ├── index.html      # Strona główna z przyciskiem płatności
│   ├── success.html    # Strona potwierdzenia płatności
│   └── cancel.html     # Strona anulowania płatności
├── css/
│   └── style.css       # Style CSS (jeśli używane)
├── .env                # Konfiguracja Stripe (nie commituj!)
├── package.json        # Zależności projektu
└── README.md          # Ten plik
```

## Konfiguracja

### 1. Stripe Dashboard

1. Zaloguj się do [Stripe Dashboard](https://dashboard.stripe.com)
2. Utwórz nowy produkt:
   - Nazwa: np. "Mentoring - Plan Ratalny"
   - Typ: Subskrypcja
3. Dodaj cenę:
   - Kwota: 500 PLN
   - Okres rozliczeniowy: Miesięcznie
   - Liczba cykli: 6
4. Skopiuj `price_ID` (zaczyna się od `price_`)

### 2. Zmienne środowiskowe

Uzupełnij plik `.env`:

```env
STRIPE_SECRET_KEY=sk_test_... # Twój klucz tajny Stripe
STRIPE_PRICE_ID=price_...     # ID ceny z punktu 1
DOMAIN=https://twoja-domena.pl # Twoja domena (bez slasha na końcu)
```

### 3. Obowiązkowy checkbox

Checkbox jest już skonfigurowany w `api/checkout.js` z treścią:
> "Wyrażam zgodę na comiesięczne pobieranie opłat za mentoring przez okres 6 miesięcy. Przyjmuję do wiadomości, że zakup oznacza zobowiązanie finansowe na pełny okres trwania programu."

Użytkownik **musi** zaznaczyć checkbox, aby móc dokończyć płatność.

## Deployment

### Opcja 1: Vercel (zalecane)

1. Zainstaluj Vercel CLI: `npm i -g vercel`
2. W katalogu projektu: `vercel`
3. Dodaj zmienne środowiskowe w panelu Vercel
4. Deploy: `vercel --prod`

### Opcja 2: Netlify Functions

1. Utwórz `netlify.toml` z konfiguracją
2. Deploy przez panel Netlify
3. Dodaj zmienne środowiskowe

### Opcja 3: Własny serwer Node.js

Projekt wymaga Node.js do obsługi endpointu `/api/checkout`.

## Testowanie

1. Użyj testowych kluczy Stripe (zaczynają się od `_test_`)
2. Testowe numery kart: `4242 4242 4242 4242`
3. Dowolna przyszła data ważności i CVC

## Bezpieczeństwo

- ⚠️ **NIGDY** nie commituj pliku `.env`
- ⚠️ Używaj tylko kluczy `sk_live_` na produkcji
- ⚠️ Zabezpiecz endpoint przed nieautoryzowanym dostępem

## Wsparcie

W razie problemów sprawdź:
- [Dokumentacja Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Stripe API Reference](https://stripe.com/docs/api)
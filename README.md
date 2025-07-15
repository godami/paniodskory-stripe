# Pani od Skóry - Landing Page

Landing page dla gabinetu kosmetycznego z integracją płatności Stripe.

## Funkcjonalności

- Responsywny design
- Sekcja z usługami i cennikiem
- Integracja z Stripe Checkout
- Formularz kontaktowy
- Smooth scrolling między sekcjami

## Struktura projektu

```
├── index.html          # Główny plik HTML
├── css/
│   └── style.css      # Style CSS
├── js/
│   └── stripe-integration.js  # Integracja ze Stripe
├── img/               # Katalog na obrazy
└── README.md         # Ten plik
```

## Konfiguracja Stripe

1. Zastąp `STRIPE_PUBLIC_KEY` w pliku `js/stripe-integration.js` swoim kluczem publicznym Stripe
2. Utwórz backend endpoint `/create-checkout-session` do tworzenia sesji płatności
3. Skonfiguruj webhooki Stripe do obsługi zdarzeń płatności

## Wymagania backendu

Aby w pełni zintegrować płatności, potrzebujesz serwera backendowego z następującymi endpointami:

- `POST /create-checkout-session` - tworzenie sesji Stripe Checkout
- `POST /process-payment` - przetwarzanie płatności (opcjonalne dla Payment Request API)
- Webhook endpoint do obsługi zdarzeń Stripe

## Uruchomienie lokalne

1. Otwórz `index.html` w przeglądarce
2. Dla pełnej funkcjonalności płatności wymagany jest serwer HTTP (np. Live Server w VS Code)

## Technologie

- HTML5
- CSS3 (Flexbox, Grid)
- JavaScript (ES6+)
- Stripe.js v3

## Licencja

Wszystkie prawa zastrzeżone © 2025 Pani od Skóry
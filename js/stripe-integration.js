// Stripe Public Key - zastp swoim kluczem publicznym
const STRIPE_PUBLIC_KEY = 'pk_test_51QbSFkP8r5vzqKc4FLRBIaK3swQy5HJK0lm02xXjrCEP9OiUVkfb27ZoKfQkDVkz9LnkLZ68BwYPb9oNEqcdCBBV00yUf73O72';

// Inicjalizacja Stripe
const stripe = Stripe(STRIPE_PUBLIC_KEY);

// Funkcja do wy[wietlania komunikatów
function showMessage(message, isError = false) {
    const messageEl = isError ? document.getElementById('error-message') : document.getElementById('success-message');
    messageEl.textContent = message;
    messageEl.style.display = 'block';
    
    setTimeout(() => {
        messageEl.style.display = 'none';
    }, 5000);
}

// Funkcja do obsBugi pBatno[ci
async function handleCheckout(productId) {
    try {
        // Wy[lij |danie do backendu (musisz mie endpoint który utworzy sesj Stripe)
        const response = await fetch('/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                priceId: productId,
            }),
        });

        const session = await response.json();

        if (session.error) {
            showMessage(session.error, true);
            return;
        }

        // Przekieruj do Stripe Checkout
        const result = await stripe.redirectToCheckout({
            sessionId: session.id,
        });

        if (result.error) {
            showMessage(result.error.message, true);
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('WystpiB bBd podczas przetwarzania pBatno[ci. Spróbuj ponownie.', true);
    }
}

// Alternatywna implementacja - Payment Request Button (dla Apple Pay, Google Pay)
async function setupPaymentRequest() {
    const paymentRequest = stripe.paymentRequest({
        country: 'PL',
        currency: 'pln',
        total: {
            label: 'Zabieg kosmetyczny',
            amount: 15000, // 150 PLN w groszach
        },
        requestPayerName: true,
        requestPayerEmail: true,
        requestPayerPhone: true,
    });

    const elements = stripe.elements();
    const prButton = elements.create('paymentRequestButton', {
        paymentRequest,
    });

    // Sprawdz czy przegldarka obsBuguje Payment Request API
    const result = await paymentRequest.canMakePayment();
    if (result) {
        // Mo|esz doda przycisk Payment Request do strony
        // prButton.mount('#payment-request-button');
    }

    paymentRequest.on('paymentmethod', async (ev) => {
        // Przetwórz pBatno[ na backendzie
        const response = await fetch('/process-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                payment_method_id: ev.paymentMethod.id,
                amount: ev.total.amount,
            }),
        });

        const paymentResponse = await response.json();

        if (paymentResponse.error) {
            ev.complete('fail');
            showMessage(paymentResponse.error, true);
        } else {
            ev.complete('success');
            showMessage('PBatno[ zakoDczona sukcesem!', false);
        }
    });
}

// Inicjalizacja event listenerów po zaBadowaniu DOM
document.addEventListener('DOMContentLoaded', function() {
    // Dodaj event listenery do przycisków zakupu
    const buyButtons = document.querySelectorAll('.buy-button');
    
    buyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            
            // Tymczasowo wy[wietl alert - w produkcji u|yj handleCheckout
            alert(`Integracja z Stripe wymaga skonfigurowania backendu.\n\nAby wBczy pBatno[ci:\n1. Utwórz endpoint /create-checkout-session\n2. Skonfiguruj webhook dla Stripe\n3. Zastp klucz publiczny swoim kluczem\n\nID produktu: ${productId}`);
            
            // W produkcji odkomentuj poni|sz lini:
            // handleCheckout(productId);
        });
    });

    // Opcjonalnie - inicjalizuj Payment Request Button
    // setupPaymentRequest();
});

// PrzykBadowa funkcja do testowania poBczenia ze Stripe
async function testStripeConnection() {
    try {
        const paymentMethods = await stripe.paymentMethods.list({
            type: 'card',
            limit: 3,
        });
        console.log('Stripe connected successfully');
        return true;
    } catch (error) {
        console.error('Stripe connection error:', error);
        return false;
    }
}

// Eksportuj funkcje je[li u|ywasz moduBów
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        handleCheckout,
        showMessage,
        testStripeConnection
    };
}
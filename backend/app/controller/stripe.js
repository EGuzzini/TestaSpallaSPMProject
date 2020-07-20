const env = require("dotenv").config({ path: "./.env" });
const stripe = require("stripe")(env.parsed.STRIPE_SECRET);

exports.create_payment_intent = async (req, res) => {
    console.trace(req.headers)
    const { items, currency } = req.body;
    // Create or use a preexisting Customer to associate with the payment
    const customer = await stripe.customers.create({
        email:"pippo@gmail.com"
    });

    // Create a PaymentIntent with the order amount and currency and the customer id
    const paymentIntent = await stripe.paymentIntents.create({
        amount: 1000,
        currency: 'eur',
        customer: customer.id
    });

    // Send publishable key and PaymentIntent details to client
    res.send({
        publishableKey: env.parsed.STRIPE_PUBLIC,
        clientSecret: paymentIntent.client_secret,
        id: paymentIntent.id
    });
}


exports.webhook = async (req, res) => {
    if (env.parsed.STRIPE_WEBHOOK_SECRET) {
        // Retrieve the event by verifying the signature using the raw body and secret.
        let event;
        let signature = req.headers["stripe-signature"];
        try {
            event = stripe.webhooks.constructEvent(
                req.rawBody,
                signature,
                env.parsed.STRIPE_WEBHOOK_SECRET
            );
        } catch (err) {
            console.log(`⚠️  Webhook signature verification failed.`);
            return res.sendStatus(400);
        }
        data = event.data;
        eventType = event.type;
    } else {
        // Webhook signing is recommended, but if the secret is not configured in `config.js`,
        // we can retrieve the event data directly from the request body.
        data = req.body.data;
        eventType = req.body.type;
    }

    if (eventType === "payment_method.attached") {
        // The PaymentMethod is attached
        console.log("❗ PaymentMethod successfully attached to Customer");
    } else if (eventType === "payment_intent.succeeded") {
        if (data.object.setup_future_usage === null) {
            console.log("❗ Customer did not want to save the card. ");
        }

        // Funds have been captured
        // Fulfill any orders, e-mail receipts, etc
        // To cancel the payment after capture you will need to issue a Refund (https://stripe.com/docs/api/refunds)
        console.log("💰 Payment captured!");
    } else if (eventType === "payment_intent.payment_failed") {
        console.log("❌ Payment failed.");
    }
    res.sendStatus(200);
}
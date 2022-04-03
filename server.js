/**
 * ? Constants
 */
const PORT = process.env.PORT || 5000;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;

/**
 * ? Imports
 */
const express = require("express");
const bodyParser = require("body-parser");
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const stripe = require("stripe")(stripeSecretKey);
const { appUrl } = require("./config/config.json");

/**
 * ? Initialaize Server
 */
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * ? Source Code
 */
app.post("/buy", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Node JS Course",
            },
            unit_amount: 7000,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${appUrl}/success`,
      cancel_url: `${appUrl}/cancel`,
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(5000).send("Unexpected Error Occured!");
  }
});

/**
 * ? Listen to PORT
 */
app.listen(PORT, () => {
  console.log(`listening to port ${PORT}`);
});

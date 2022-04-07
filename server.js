//* Imports
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
//* Constants
const PORT = process.env.PORT || 5000;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

//* Imports
const { appUrl } = require("./config/config.json");
const stripe = require("stripe")(stripeSecretKey);
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");

//* Initialaize Server
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//* Source Code
app.post("/buy", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: req.body.name,
              images: [req.body.image],
            },
            unit_amount: req.body.price * 100,
          },
          quantity: req.body.amount,
        },
      ],
      mode: "payment",
      success_url: `${appUrl}/success`,
      cancel_url: `${appUrl}/cancel`,
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).send("Unexpected Error Occured!");
  }
});

//* Listen to PORT
app.listen(PORT, () => {
  console.log(`listening to port ${PORT}`);
});

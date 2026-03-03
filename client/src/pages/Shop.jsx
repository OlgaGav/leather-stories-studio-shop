import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_...");

export default function Shop() {
  const [productId, setProductId] = useState("wallet1");
  const [color, setColor] = useState("black");
  const [personalize, setPersonalize] = useState(false);
  const [text, setText] = useState("");
  const [email, setEmail] = useState("");

  const handleCheckout = async () => {
    const response = await fetch("http://localhost:5000/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId,
        color,
        personalizationText: personalize ? text : "",
        email
      })
    });

    const session = await response.json();
    const stripe = await stripePromise;

    await stripe.redirectToCheckout({
      sessionId: session.id,
    });
  };

  return (
    <div>
      <h1>Leather Wallet Shop</h1>

      <select onChange={(e) => setProductId(e.target.value)}>
        <option value="wallet1">Classic Wallet</option>
        <option value="wallet2">Slim Wallet</option>
      </select>

      <select onChange={(e) => setColor(e.target.value)}>
        <option>black</option>
        <option>brown</option>
        <option>tan</option>
      </select>

      <label>
        Personalization?
        <input
          type="checkbox"
          onChange={() => setPersonalize(!personalize)}
        />
      </label>

      {personalize && (
        <textarea
          style={{ fontSize: "18px" }}
          placeholder="Enter text..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      )}

      <input
        type="email"
        placeholder="Your email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={handleCheckout}>
        Checkout
      </button>
    </div>
  );
}
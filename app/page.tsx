"use client";

import { useState } from "react";
import "./app.css";

type User = {
  username: string;
  role: "admin" | "client";
};

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const allProducts = ["Patika", "Këpuca", "Sandale", "Çizme"];

  const handleLogin = (username: string, password: string) => {
    // Thjeshtësi për testim — pa backend
    if (username === "admin" && password === "1234") {
      setUser({ username, role: "admin" });
    } else if (
      ["klient1", "klient2", "klient3"].includes(username) &&
      password === "1234"
    ) {
      setUser({ username, role: "client" });
    } else {
      alert("Gabim në kredenciale!");
    }
  };

  const handleProductSelect = (product: string) => {
    setSelectedProducts((prev) =>
      prev.includes(product)
        ? prev.filter((p) => p !== product)
        : [...prev, product]
    );
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedProducts([]);
  };

  // ------------------- UI -----------------------
  if (!user) {
    return (
      <div className="login-container">
        <h2>Kyçu në sistem</h2>
        <input id="username" placeholder="Përdoruesi" />
        <input id="password" placeholder="Fjalëkalimi" type="password" />
        <button
          onClick={() =>
            handleLogin(
              (document.getElementById("username") as HTMLInputElement).value,
              (document.getElementById("password") as HTMLInputElement).value
            )
          }
        >
          Kyçu
        </button>
      </div>
    );
  }

  if (user.role === "client") {
    return (
      <div className="client-panel">
        <h2>Përshëndetje, {user.username} 👋</h2>
        <p>Zgjidh produktet që dëshiron të porosisësh:</p>

        <div className="products">
          {allProducts.map((product) => (
            <button
              key={product}
              className={selectedProducts.includes(product) ? "selected" : ""}
              onClick={() => handleProductSelect(product)}
            >
              {product}
            </button>
          ))}
        </div>

        <h3>Porosia jote:</h3>
        <ul>
          {selectedProducts.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>

        <button onClick={handleLogout}>Dil</button>
      </div>
    );
  }

  // ADMIN PANEL
  return (
    <div className="admin-panel">
      <h2>Admin Panel – {user.username}</h2>
      <p>Këtu do të shfaqen porositë e klientëve.</p>
      <p>
        (Në këtë version, porositë nuk ruhen ende – do ta lidhim me AWS DynamoDB
        në hapin tjetër 🔥)
      </p>
      <button onClick={handleLogout}>Dil</button>
    </div>
  );
}

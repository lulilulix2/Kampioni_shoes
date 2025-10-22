"use client";

import { useState, useEffect } from "react";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import awsExports from "../src/aws-exports";
import { createOrder } from "../src/graphql/mutations";
import { listOrders } from "../src/graphql/queries";

Amplify.configure(awsExports);

// Krijo klientin e ri për API
const client = generateClient();

export default function Home() {
  const [orderName, setOrderName] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleCreateOrder = async () => {
    if (!orderName) return;

    try {
      await client.graphql({
        query: createOrder,
        variables: { input: { clientName: orderName } },
      });
      setOrderName("");
      fetchOrders();
    } catch (error) {
      console.error("Gabim gjatë krijimit të porosisë:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const result = await client.graphql({ query: listOrders });
      setOrders(result.data.listOrders.items);
    } catch (error) {
      console.error("Gabim gjatë marrjes së porosive:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">Shto Porosi</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Emri i porosisë"
          value={orderName}
          onChange={(e) => setOrderName(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={handleCreateOrder}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Shto
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-2">Lista e porosive</h2>
      {loading ? (
        <p>Duke marrë porositë...</p>
      ) : (
        <ul className="w-full max-w-md">
          {orders.map((order) => (
            <li key={order.id} className="border-b py-1">
              {order.clientName}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Amplify } from "aws-amplify";
import { API } from "@aws-amplify/api";
import { graphqlOperation } from "@aws-amplify/api-graphql";
import awsExports from "../src/aws-exports";
import { createOrder } from "../src/graphql/mutations";
import { listOrders } from "../src/graphql/queries";


Amplify.configure(awsExports);

export default function Home() {
  const [orderName, setOrderName] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Funksioni për të krijuar porosi të re
  const handleCreateOrder = async () => {
    if (!orderName.trim()) return;

    try {
      await API.graphql(
        graphqlOperation(createOrder, { input: { clientName: orderName } })
      );
      setOrderName("");
      fetchOrders(); // rifreskon listën pas shtimit
    } catch (error) {
      console.error("Gabim gjatë krijimit të porosisë:", error);
    }
  };

  // Funksioni për të marrë të gjitha porositë
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const result: any = await API.graphql(graphqlOperation(listOrders));
      setOrders(result.data.listOrders.items || []);
    } catch (error) {
      console.error("Gabim gjatë marrjes së porosive:", error);
    } finally {
      setLoading(false);
    }
  };

  // Marr listën automatikisht kur ngarkohet faqja
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
          className="border p-2 rounded w-64"
        />
        <button
          onClick={handleCreateOrder}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Shto
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-2">Lista e porosive</h2>
      {loading ? (
        <p>Duke marrë porositë...</p>
      ) : (
        <ul className="w-full max-w-md">
          {orders.length === 0 ? (
            <li className="text-gray-500 italic">Nuk ka porosi.</li>
          ) : (
            orders.map((order) => (
              <li key={order.id} className="border-b py-1">
                {order.clientName}
              </li>
            ))
          )}
        </ul>
      )}
    </main>
  );
}

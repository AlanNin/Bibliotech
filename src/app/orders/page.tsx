"use client";
import { useEffect, useState } from "react";
import styles from "./index.module.css";
import ReactLoading from "react-loading";
import { getUserOrders } from "~/server/queries/sell.queries";
import { useUser } from "@clerk/nextjs";
import { Order } from "./item";

export default function OrderPage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [orders, setOrders] = useState<any>();
  const user = useUser();

  useEffect(() => {
    setIsLoading(true);
    const fetchOrders = async () => {
      try {
        if (user && user.user?.id) {
          const response = await getUserOrders(user.user?.id);
          setOrders(response);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
    setIsLoading(false);
  });

  return (
    <>
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <ReactLoading type="spin" color="#2c94dd" height={70} width={70} />
        </div>
      ) : (
        <main className={styles.main}>
          <h1 className={styles.title}>Your Orders</h1>
          <div className={styles.ordersContainer}>
            {orders?.map((order: any, index: number) => (
              <Order key={index} order={order} />
            ))}
          </div>
        </main>
      )}
    </>
  );
}

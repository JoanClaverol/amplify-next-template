import React, { useState, useEffect } from 'react';

export default function OrderTable() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch('https://vpwqmc0xli.execute-api.eu-west-3.amazonaws.com/Prod/fetch-orderlines/');
        const data = await response.json();
        console.log(data); // This will log the fetched data to the console
        setOrders(data.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    }

    fetchOrders();
  }, []);

  return (
    <div>
      <h1>Order Table</h1>
      {/* We'll add the table here in the next step */}
    </div>
  );
}
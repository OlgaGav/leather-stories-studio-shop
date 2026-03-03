import { useEffect, useState } from "react";

export default function Admin() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/admin/stats")
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Total Orders: {stats.totalOrders}</p>
      <p>Total Revenue: ${stats.totalRevenue / 100}</p>
    </div>
  );
}
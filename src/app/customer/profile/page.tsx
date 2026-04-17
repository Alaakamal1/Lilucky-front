"use client";
import { useEffect, useState } from "react";

const Page = () => {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState("");

  // 🔥 يمنع Hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const token = sessionStorage.getItem("token");

        if (!token) {
          setError("No token found. Please login again.");
          setLoading(false);
          return;
        }

        const [profileRes, ordersRes] = await Promise.all([
          fetch("http://localhost:5000/api/user/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch("http://localhost:5000/api/orders/my-orders", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const profileData = await profileRes.json();
        const ordersData = await ordersRes.json();

        console.log("Profile Response:", profileData);
        console.log("Orders Response:", ordersData);
        if (profileData.status === "error") {
          throw new Error(profileData.message);
        }

        setProfile(profileData.data);
        setOrders(ordersData.data || []);
      } catch (err: any) {
        console.error("ERROR:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mounted]);

  // 🔥 مهم جدًا: ما ترندرش قبل mount
  if (!mounted) return null;

  if (loading) return <h2>Loading...</h2>;

  if (error) return <h2 style={{ color: "red" }}>{error}</h2>;

  return (
    <div style={{ padding: "20px" }}>
      {/* 👤 PROFILE */}
      <h2>My Profile</h2>

      {profile ? (
        <div>
          <p>
            <strong>Name:</strong> {profile.firstName} {profile.lastName}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>Phone:</strong> {profile.phoneNumber}
          </p>
          <p>
            <strong>City:</strong> {profile.city}
          </p>
          <p>
            <strong>Address:</strong> {profile.address}
          </p>
        </div>
      ) : (
        <p>No profile data</p>
      )}

      <hr />

      {/* 📦 ORDERS */}
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px",
            }}
          >
            <p>
              <strong>Status:</strong>{" "}
              <span style={{ color: getStatusColor(order.orderStatus) }}>
                {order.orderStatus}
              </span>
            </p>

            <p>
              <strong>Total:</strong> {order.totalAmount} EGP
            </p>

            <h4>Items:</h4>
            <ul>
              {order.items.map((item: any, index: number) => (
                <li key={index}>
                  {item.name} - {item.quantity} × {item.price}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

// 🎨 Status colors
const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "orange";
    case "confirmed":
      return "blue";
    case "shipped":
      return "purple";
    case "delivered":
      return "green";
    case "cancelled":
      return "red";
    default:
      return "black";
  }
};

export default Page;
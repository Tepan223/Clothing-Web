// app/track/page.js
'use client'
import { useState, useEffect } from "react";
import styles from "../styles/main.module.css";
import { Input, Button, Typography, message, Card, Steps, Divider } from "antd";
import {
    ShoppingOutlined,
    CheckSquareOutlined,
    DashboardOutlined,
    HomeOutlined,
    SyncOutlined
} from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

export default function TrackOrder() {
    const [orderId, setOrderId] = useState("");
    const [email, setEmail] = useState("");
    const [isTracked, setIsTracked] = useState(false);
    const [orderData, setOrderData] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);

    // Cek apakah ada order yang di-track sebelumnya
    useEffect(() => {
        const lastTrackedOrder = localStorage.getItem('trackOrder');
        if (lastTrackedOrder) {
            try {
                const order = JSON.parse(lastTrackedOrder);
                setOrderData(order);

                // Transform items
                const transformedItems = order.items.map((item, index) => ({
                    key: index,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    color: item.color,
                    size: item.size,
                    image: item.image || '/images/default-product.jpg'
                }));

                setCartItems(transformedItems);
                setIsTracked(true);
                setOrderId(order.transactionId || order.orderId || '');

                // Cari email dari billing details jika ada
                if (order.billingDetails?.email) {
                    setEmail(order.billingDetails.email);
                }
            } catch (error) {
                console.error('Error loading tracked order:', error);
            }
        }
    }, []);

    const handleTrack = () => {
        if (!orderId || !email) {
            message.error("Order ID dan Email wajib diisi!");
            return;
        }

        setLoading(true);

        try {
            // Ambil data users dari localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');

            // Variabel untuk menyimpan order yang ditemukan
            let foundOrder = null;
            let foundUser = null;

            // Cari di semua users berdasarkan email billing (bukan email user)
            for (const user of users) {
                if (user.orders && user.orders.length > 0) {
                    // Cari order dengan ID yang cocok
                    const order = user.orders.find(order =>
                        (order.orderId === orderId || order.transactionId === orderId) &&
                        order.billingDetails?.email?.toLowerCase() === email.toLowerCase()
                    );

                    if (order) {
                        foundOrder = order;
                        foundUser = user;
                        break;
                    }
                }
            }

            if (!foundOrder) {
                message.error("Order tidak ditemukan atau email billing tidak sesuai");
                setLoading(false);
                return;
            }

            // Set order data
            setOrderData(foundOrder);

            // Transform items
            const transformedItems = foundOrder.items.map((item, index) => ({
                key: index,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                color: item.color,
                size: item.size,
                image: item.image || '/images/default-product.jpg'
            }));

            setCartItems(transformedItems);
            setIsTracked(true);

            // Simpan ke localStorage untuk referensi
            localStorage.setItem('trackOrder', JSON.stringify(foundOrder));

            message.success("Order found!");

        } catch (error) {
            console.error('Error tracking order:', error);
            message.error("Failed to track order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Function to determine current step based on order status
    const getCurrentStep = (status) => {
        switch (status?.toLowerCase()) {
            case 'processing':
                return 2; // In Progress
            case 'shipped':
                return 3; // On The Way
            case 'delivered':
                return 4; // Delivered
            case 'accepted':
                return 1; // Accepted
            case 'placed':
            default:
                return 0; // Order Placed
        }
    };

    // Format date function
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get status dates
    const getStatusDate = (status) => {
        if (!orderData) return "N/A";

        switch (status) {
            case 'placed':
                return formatDate(orderData.orderDate);
            case 'accepted':
                return orderData.acceptedDate ? formatDate(orderData.acceptedDate) : formatDate(orderData.orderDate);
            case 'progress':
                return orderData.progressDate ? formatDate(orderData.progressDate) : formatDate(orderData.orderDate);
            case 'way':
                return orderData.estimateDelivery || "Expected soon";
            case 'delivered':
                return orderData.deliveredDate || orderData.estimateDelivery || "Expected soon";
            default:
                return "N/A";
        }
    };

    // Handle back to track form
    const handleBackToTrack = () => {
        setIsTracked(false);
        setOrderData(null);
        setCartItems([]);
        setOrderId("");
        setEmail("");
        // Optionally clear the stored track order
        // localStorage.removeItem('trackOrder');
    };

    return (
        <div className={styles.main}>
            {!isTracked ? (
                <>
                    <Paragraph style={{margin:"0", fontSize:"28px"}} className={styles.desc_track}>
                        To track your order please enter your Order ID in the box below and press the "Track Order" button.
                        This was given to you on your receipt<br/>and in the confirmation email you should have received.
                    </Paragraph>
                    <div className={styles.input}>
                        <Title level={2} style={{ margin: "0" }} className={styles.title_track}>
                            Order ID *
                        </Title>
                        <Input
                            placeholder="Enter your Order ID"
                            className={styles.bar}
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <div className={styles.input} >
                        <Title level={2} style={{ margin: "0" }} className={styles.title_track}>
                            Billing Email *
                        </Title>
                        <Input
                            placeholder="Enter Email Address used in billing"
                            className={styles.bar}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <Button
                        className={styles.btn_track}
                        style={{ background: "#3c1900", color: "white" }}
                        onClick={handleTrack}
                        loading={loading}
                        disabled={loading}
                    >
                        Track Order
                    </Button>
                </>
            ) : (
                <div>
                    <div className={styles.side}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Title level={1} style={{ margin: "0" }} className={styles.title}>
                                Order Status
                            </Title>
                            <Button
                                onClick={handleBackToTrack}
                                className={styles.btn_another}
                                style={{background:"#3c1900", color:"white"}}
                            >
                                Track Another Order
                            </Button>
                        </div>
                        <Text style={{ fontSize: "24px" }} className={styles.orderid}>
                            Order ID: {orderId}
                        </Text>
                        <Text style={{ fontSize: "18px", color: "#666", marginBottom: "10px", display: "block" }}>
                            Billing Email: {email}
                        </Text>
                        <Card className={styles.track_container}>
                            <Steps
                                className={styles.customSteps}
                                orientation="horizontal"
                                current={getCurrentStep(orderData?.status)}
                                items={[
                                    {
                                        title: "Order Placed",
                                        content: getStatusDate('placed'),
                                        icon: <ShoppingOutlined />,
                                    },
                                    {
                                        title: "Accepted",
                                        content: getStatusDate('accepted'),
                                        icon: <CheckSquareOutlined />,
                                    },
                                    {
                                        title: "In Progress",
                                        content: getStatusDate('progress'),
                                        icon: orderData?.status === 'processing' ? <SyncOutlined spin /> : <SyncOutlined />,
                                    },
                                    {
                                        title: "On The Way",
                                        content: getStatusDate('way'),
                                        icon: <DashboardOutlined />,
                                    },
                                    {
                                        title: "Delivered",
                                        content: getStatusDate('delivered'),
                                        icon: <HomeOutlined />,
                                    },
                                ]}
                            />
                        </Card>
                        <Card className={styles.products}>
                            <Title level={2}>Products</Title>
                            <Divider />

                            {cartItems.map((item, index) => (
                                <div key={item.key}>
                                    <div className={styles.productItem}>
                                        <div className={styles.productImage}></div>
                                        <div className={styles.productInfo}>
                                            <Title style={{margin:"0"}}>{item.name}</Title>
                                            <div className={styles.text_pick}>
                                                <Text className={`${styles.text} ${styles.withBorder}`}>
                                                    Color : {item.color}
                                                </Text>
                                                <Text className={`${styles.text} ${styles.withBorder}`}>
                                                    Size : {item.size}
                                                </Text>
                                                <Text className={styles.text}>
                                                    Qty : {item.quantity}
                                                </Text>
                                            </div>
                                        </div>
                                    </div>
                                    {index !== cartItems.length - 1 && <Divider />}
                                </div>
                            ))}
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}
'use client'
import { Breadcrumb, Typography, Card, Button, Divider, message } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import Support from '../../components/support';
import styles from "../styles/complate.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;

const breadcrumbItems = [
    { title: <Link href="/">Home</Link> },
    { title: "Order Completed" },
];

export default function Complete() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [orderDetails, setOrderDetails] = useState(null);
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const fetchLastOrder = () => {
            try {
                // Get user from localStorage
                const userStr = localStorage.getItem('user');
                if (!userStr) {
                    router.push('/sign-in');
                    return;
                }

                const user = JSON.parse(userStr);

                // Get users data from localStorage
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                const currentUser = users.find(u => u.id === user.id);

                if (!currentUser) {
                    message.error('User tidak ditemukan');
                    router.push('/');
                    return;
                }

                // Get orders from user data
                if (currentUser.orders && currentUser.orders.length > 0) {
                    // Get the most recent order (last in the array)
                    const lastOrder = currentUser.orders[currentUser.orders.length - 1];

                    setOrderDetails(lastOrder);

                    // Transform order items to match the component's expected format
                    const transformedItems = lastOrder.items.map((item, index) => ({
                        key: index,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        color: item.color,
                        size: item.size
                    }));

                    setCartItems(transformedItems);
                } else {
                    // If no orders found, try to get from lastOrder in localStorage as fallback
                    const lastOrderFromStorage = localStorage.getItem('lastOrder');
                    if (lastOrderFromStorage) {
                        const order = JSON.parse(lastOrderFromStorage);
                        setOrderDetails(order);

                        const transformedItems = order.items.map((item, index) => ({
                            key: index,
                            name: item.name,
                            price: item.price,
                            quantity: item.quantity,
                            color: item.color,
                            size: item.size
                        }));

                        setCartItems(transformedItems);
                    } else {
                        message.warning('No orders found');
                        router.push('/');
                    }
                }
            } catch (error) {
                console.error('Error fetching order:', error);
                message.error('Gagal memuat data order');
                router.push('/');
            } finally {
                setLoading(false);
            }
        };

        fetchLastOrder();
    }, [router]);

    const formatPrice = (price) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(price);

    const subtotal = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    const shipping = 0;
    const taxes = subtotal * 0;
    const total = subtotal + shipping + taxes;

    // Format date function
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    // Format estimate delivery date
    const formatEstimateDelivery = (estimateDelivery) => {
        if (!estimateDelivery) return '24 March 2026';

        // If estimateDelivery is already formatted (like "Mar 24, 2026 - Mar 28, 2026")
        if (estimateDelivery.includes(' - ')) {
            return estimateDelivery;
        }

        // If it's a single date
        return formatDate(estimateDelivery);
    };

    if (loading) {
        return (
            <div className={styles.page}>
                <div className={styles.container}>
                    <Title style={{ fontSize: "48px" }} className={styles.title_bread}>
                        Order Completed
                    </Title>
                    <Breadcrumb
                        items={breadcrumbItems}
                        className={styles.breadcrumb}
                    />
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '400px'
                }}>
                    Loading...
                </div>
                <Support />
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <Title style={{ fontSize: "48px" }} className={styles.title_bread}>
                    Order Completed
                </Title>
                <Breadcrumb
                    items={breadcrumbItems}
                    className={styles.breadcrumb}
                />
            </div>
            <div className={styles.main_container}>
                <div className={styles.top_container}>
                    <CheckCircleFilled className={styles.icon} />
                    <div>
                        <Title style={{ margin: 0 }}>
                            Your order is completed!
                        </Title>
                        <Text style={{ fontSize: "20px", color: "#555" }}>
                            Thank you. Your order has been received.
                        </Text>
                    </div>
                </div>
                <Card
                    style={{
                        marginTop: "30px",
                        padding: "20px",
                        background: "#f6ad55",
                    }}
                >
                    <div className={styles.card_container}>
                        <div className={styles.text_container}>
                            <Text type="secondary" style={{ fontSize: "18px" }} >
                                Order ID
                            </Text>
                            <Title level={3} style={{margin:"0"}} className={styles.text}>
                                {orderDetails?.orderId || '#SDG123142AS'}
                            </Title>
                        </div>
                        <div className={styles.text_container}>
                            <Text type="secondary" style={{ fontSize: "18px" }}>
                                Payment Method
                            </Text>
                            <Title level={3} style={{margin:"0"}} className={styles.text}>
                                {orderDetails?.paymentMethod || 'Paypal'}
                            </Title>
                        </div>
                        <div className={styles.text_container}>
                            <Text type="secondary" style={{ fontSize: "18px" }}>
                                Transaction ID
                            </Text>
                            <Title level={3} style={{margin:"0"}} className={styles.text}>
                                {orderDetails?.transactionId || 'PKO9AKSID9'}
                            </Title>
                        </div>
                        <div className={styles.text_container}>
                            <Text type="secondary" style={{ fontSize: "18px" }}>
                                Estimated Delivery Date
                            </Text>
                            <Title level={3} style={{margin:"0"}} className={styles.text}>
                                {formatEstimateDelivery(orderDetails?.estimateDelivery)}
                            </Title>
                        </div>
                        <Button
                            className={styles.btn_invoice}
                            style={{
                                background: "#3c1900",
                                color: "white",
                                marginTop: "20px"
                            }}
                            onClick={() => {
                                // Generate invoice as text/print
                                const invoiceContent = `
                                    ORDER INVOICE
                                    =============
                                    Order ID: ${orderDetails?.orderId}
                                    Transaction ID: ${orderDetails?.transactionId}
                                    Payment Method: ${orderDetails?.paymentMethod}
                                    Date: ${formatDate(orderDetails?.orderDate)}
                                    
                                    PRODUCTS:
                                    ${cartItems.map(item =>
                                    `${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)}`
                                ).join('\n')}
                                    
                                    Subtotal: ${formatPrice(subtotal)}
                                    Shipping: ${formatPrice(shipping)}
                                    Taxes: ${formatPrice(taxes)}
                                    TOTAL: ${formatPrice(total)}
                                `;

                                // Create a blob and download
                                const blob = new Blob([invoiceContent], { type: 'text/plain' });
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `invoice-${orderDetails?.orderId || 'order'}.txt`;
                                a.click();
                            }}
                        >
                            Download Invoice
                        </Button>
                    </div>
                </Card>
                <Card
                    style={{
                        padding: "20px",
                        marginTop: "30px",
                        border: "1px solid #eee",
                    }}
                >
                    <div className={styles.card_container_main}>
                        <Title level={1} className={styles.title_detailsOrder} style={{margin:"0"}}>
                            Order Details
                        </Title>
                        <Divider />
                        <div className={styles.top_container_text}>
                            <Title level={2} style={{margin:"0"}} className={styles.details_title_top}>
                                Products
                            </Title>
                            <Title level={2} style={{margin:"0"}} className={styles.details_title_top}>
                                Sub Total
                            </Title>
                        </div>
                        <div className={styles.gap}>
                            {cartItems.map((item) => (
                                <div
                                    key={item.key}
                                    className={styles.product_container}
                                >
                                    <div className={styles.product}>
                                        <div className={styles.img_gray}></div>
                                        <div className={styles.text_img_product}>
                                            <Title level={2} style={{ margin: 0 }} className={styles.title_item}>
                                                {item.name} × {item.quantity}
                                            </Title>
                                            <Text style={{ fontSize: "24px" }} className={styles.text_item}>
                                                Color: {item.color} | Size: {item.size}
                                            </Text>
                                        </div>
                                    </div>
                                    <Title level={3} style={{ margin: 0 }} className={styles.price_item}>
                                        {formatPrice(item.price * item.quantity)}
                                    </Title>
                                </div>
                            ))}
                        </div>
                        <Divider />
                        <div className={styles.gap_price}>
                            <div className={styles.product_container}>
                                <Title level={3} style={{ margin: 0 }} className={styles.price}>
                                    Subtotal
                                </Title>
                                <Title level={3} style={{ margin: 0 }} className={styles.price}>
                                    {formatPrice(subtotal)}
                                </Title>
                            </div>
                            <div className={styles.product_container}>
                                <Title level={3} style={{ margin: 0 }} className={styles.price}>
                                    Shipping
                                </Title>
                                <Title level={3} style={{ margin: 0 }} className={styles.price}>
                                    {formatPrice(shipping)}
                                </Title>
                            </div>
                            <div className={styles.product_container}>
                                <Title level={3} style={{ margin: 0 }} className={styles.price}>
                                    Taxes
                                </Title>
                                <Title level={3} style={{ margin: 0 }} className={styles.price}>
                                    {formatPrice(taxes)}
                                </Title>
                            </div>
                            <div className={styles.product_container}>
                                <Title level={3} style={{ margin: 0 }} className={styles.price}>
                                    Total
                                </Title>
                                <Title level={3} style={{ margin: 0 }} className={styles.price}>
                                    {formatPrice(total)}
                                </Title>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
            <Support />
        </div>
    );
}
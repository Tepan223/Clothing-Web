// app/cart/page.js
'use client'
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumb, Typography, Card, Divider, Button, Table, Input, message, Spin, Form, Row, Col, Radio, Checkbox, Select } from "antd";
import { CloseOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import Link from "next/link";
import Support from '../components/support';
import styles from "./styles/cart.module.css";
import {FaCcPaypal, FaCcVisa, FaCreditCard, FaGoogle} from "react-icons/fa";
import {BsCash} from "react-icons/bs";

const { Option } = Select;

const countryOptions = [
    { value: "Indonesia", label: "Indonesia" },
    { value: "Singapore", label: "Singapore" },
    { value: "Malaysia", label: "Malaysia" },
    { value: "Thailand", label: "Thailand" },
    { value: "Vietnam", label: "Vietnam" },
    { value: "Philippines", label: "Philippines" },
    { value: "Japan", label: "Japan" },
    { value: "South Korea", label: "South Korea" },
    { value: "China", label: "China" },
    { value: "India", label: "India" },
    { value: "Australia", label: "Australia" },
    { value: "United States", label: "United States" }
];

const cityOptions = [
    { value: "Jakarta", label: "Jakarta" },
    { value: "Bandung", label: "Bandung" },
    { value: "Surabaya", label: "Surabaya" },
    { value: "Medan", label: "Medan" }
];

const stateOptions = [
    { value: "West Java", label: "West Java" },
    { value: "Central Java", label: "Central Java" },
    { value: "East Java", label: "East Java" },
    { value: "Bali", label: "Bali" }
];

const { Title, Text } = Typography;

const paymentMethods = [
    { id: 1, label: "Paypal", icon: <FaCcPaypal /> },
    { id: 2, label: "Visa", icon: <FaCcVisa /> },
    { id: 3, label: "Google Play", icon: <FaGoogle /> },
    { id: 4, label: "Cash On Delivery", icon: <BsCash /> },
    { id: 5, label: "Add New Credit/Debit Card", icon: <FaCreditCard />, dbLabel: "Credit/Debit Card" },
];

const nameFields = [
    { label: "First Name *", name: "firstName", required: true },
    { label: "Last Name *", name: "lastName", required: true },
];

export default function Cart() {
    const [selectedMethod, setSelectedMethod] = useState(1);
    const [isMobile, setIsMobile] = useState(false);
    const isMounted = useRef(true);

    // Check if mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 720);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const cleanLabel = (label) => label.replace("*", "").trim();

    const router = useRouter();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState("cart");
    const [couponCode, setCouponCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [updating, setUpdating] = useState(false);
    const [user, setUser] = useState(null);

    // State untuk form billing details
    const [billingForm, setBillingForm] = useState({
        firstName: "",
        lastName: "",
        company: "",
        country: "",
        street: "",
        city: "",
        state: "",
        zip: "",
        phone: "",
        email: "",
        deliveryAddress: 1
    });

    // Fungsi untuk update form
    const handleInputChange = (name, value) => {
        setBillingForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Fungsi untuk validasi form
    const isFormValid = () => {
        const requiredFields = [
            "firstName", "lastName", "country", "street",
            "city", "state", "zip", "phone", "email"
        ];

        for (const field of requiredFields) {
            if (!billingForm[field] || billingForm[field].trim() === "") {
                return false;
            }
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(billingForm.email)) {
            return false;
        }

        return true;
    };

    // Load cart from localStorage
    const loadCartFromStorage = useCallback(() => {
        try {
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                router.push('/sign-in?redirect=/cart');
                return;
            }

            const userData = JSON.parse(userStr);
            setUser(userData);

            // Load users data
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const currentUser = users.find(u => u.id === userData.id);

            if (currentUser && currentUser.cart) {
                const transformedItems = currentUser.cart.map((item, index) => ({
                    key: `${item.id}-${item.selectedColor}-${item.selectedSize}-${index}`,
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    color: item.selectedColor,
                    size: item.selectedSize,
                    image: item.image || '/images/default-product.jpg'
                }));
                setCartItems(transformedItems);
            } else {
                setCartItems([]);
            }
        } catch (error) {
            console.error('Error loading cart:', error);
            message.error('Gagal memuat cart');
        } finally {
            setLoading(false);
        }
    }, [router]);

    // Save cart to localStorage
    const saveCartToStorage = useCallback((updatedCart) => {
        try {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const userIndex = users.findIndex(u => u.id === user?.id);

            if (userIndex !== -1) {
                users[userIndex].cart = updatedCart.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    selectedColor: item.color,
                    selectedSize: item.size,
                    image: item.image
                }));
                localStorage.setItem('users', JSON.stringify(users));
            }
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }, [user]);

    useEffect(() => {
        isMounted.current = true;
        loadCartFromStorage();

        // Listen for cart updates
        const handleCartUpdate = (event) => {
            if (event.detail && isMounted.current) {
                const transformedItems = event.detail.map((item, index) => ({
                    key: `${item.id}-${item.selectedColor}-${item.selectedSize}-${index}`,
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    color: item.selectedColor,
                    size: item.selectedSize,
                    image: item.image || '/images/default-product.jpg'
                }));
                setCartItems(transformedItems);
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('cartUpdated', handleCartUpdate);
        }

        return () => {
            isMounted.current = false;
            if (typeof window !== 'undefined') {
                window.removeEventListener('cartUpdated', handleCartUpdate);
            }
        };
    }, [loadCartFromStorage]); // Hanya depend pada loadCartFromStorage

    const handleDelete = (key) => {
        try {
            setUpdating(true);
            const updatedCart = cartItems.filter(item => item.key !== key);
            setCartItems(updatedCart);
            saveCartToStorage(updatedCart);
            message.success('Item removed from cart');

            // Dispatch event for other components
            window.dispatchEvent(new CustomEvent('cartUpdated', {
                detail: updatedCart
            }));
        } catch (error) {
            console.error('Error deleting item:', error);
            message.error('Gagal menghapus item');
        } finally {
            setUpdating(false);
        }
    };

    const handleIncrease = (record) => {
        try {
            setUpdating(true);
            const updatedCart = cartItems.map(item =>
                item.key === record.key
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
            setCartItems(updatedCart);
            saveCartToStorage(updatedCart);
        } catch (error) {
            console.error('Error updating quantity:', error);
            message.error('Gagal update quantity');
        } finally {
            setUpdating(false);
        }
    };

    const handleDecrease = (record) => {
        try {
            setUpdating(true);
            const updatedCart = cartItems.map(item =>
                item.key === record.key && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            );
            setCartItems(updatedCart);
            saveCartToStorage(updatedCart);
        } catch (error) {
            console.error('Error updating quantity:', error);
            message.error('Gagal update quantity');
        } finally {
            setUpdating(false);
        }
    };

    const handleClearCart = () => {
        try {
            setUpdating(true);
            setCartItems([]);
            saveCartToStorage([]);
            message.success('Cart cleared');

            window.dispatchEvent(new CustomEvent('cartUpdated', {
                detail: []
            }));
        } catch (error) {
            console.error('Error clearing cart:', error);
            message.error('Gagal clear cart');
        } finally {
            setUpdating(false);
        }
    };

    const generateOrderId = () => {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `ORD-${timestamp}-${random}`;
    };

    const generateTransactionId = () => {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 10).toUpperCase();
        return `TXN-${timestamp}-${random}`;
    };

    const calculateEstimateDelivery = () => {
        const today = new Date();
        const minDays = 3;
        const maxDays = 7;

        const minDate = new Date(today);
        minDate.setDate(today.getDate() + minDays);

        const maxDate = new Date(today);
        maxDate.setDate(today.getDate() + maxDays);

        const formatDate = (date) => {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        };

        return `${formatDate(minDate)} - ${formatDate(maxDate)}`;
    };

    const handleConfirmPayment = () => {
        try {
            setUpdating(true);

            if (!user) {
                router.push('/sign-in');
                return;
            }

            const selectedPayment = paymentMethods.find(m => m.id === selectedMethod);
            const paymentMethod = selectedPayment?.dbLabel || selectedPayment?.label || 'Unknown';

            const newOrder = {
                orderId: generateOrderId(),
                transactionId: generateTransactionId(),
                paymentMethod: paymentMethod,
                orderDate: new Date().toISOString(),
                estimateDelivery: calculateEstimateDelivery(),
                status: "Processing",
                items: cartItems.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    color: item.color,
                    size: item.size,
                    image: item.image,
                    subtotal: item.price * item.quantity
                })),
                subtotal: subtotal,
                discount: discountAmount,
                total: total,
                billingDetails: {
                    ...billingForm,
                    deliveryAddress: billingForm.deliveryAddress === 1 ? "Same as shipping" : "Different billing"
                }
            };

            // Save order to user's account
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const userIndex = users.findIndex(u => u.id === user.id);

            if (userIndex !== -1) {
                if (!users[userIndex].orders) {
                    users[userIndex].orders = [];
                }
                users[userIndex].orders.push(newOrder);
                users[userIndex].cart = [];
                localStorage.setItem('users', JSON.stringify(users));
            }

            // Clear cart
            setCartItems([]);

            // Save last order
            localStorage.setItem('lastOrder', JSON.stringify(newOrder));

            message.success('Payment confirmed successfully!');
            router.push('/cart/complete-order');

        } catch (error) {
            console.error('Error confirming payment:', error);
            message.error('Failed to confirm payment');
        } finally {
            setUpdating(false);
        }
    };

    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    const discountAmount = (subtotal * discount) / 100;
    const total = subtotal - discountAmount;

    const pageTitle = { cart: "Shopping Cart", checkout: "Checkout", payment: "Payment" };

    const formatPrice = (price) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);

    const applyCoupon = () => {
        const coupons = {
            SAVE10: 10,
            DISCOUNT20: 20,
            FREESHIP: 15,
            A: 100
        };
        const code = couponCode.toUpperCase();
        if (coupons[code]) {
            setDiscount(coupons[code]);
            message.success(`Coupon applied! ${coupons[code]}% discount`);
        } else {
            setDiscount(0);
            message.error("Invalid coupon code");
        }
    };

    const breadcrumbItems = [
        { title: <Link href="/">Home</Link> },
        {
            title:
                mode !== "cart"
                    ? <span style={{ cursor: "pointer", color:"#666" }} onClick={() => setMode("cart")}>Shopping Cart</span>
                    : "Shopping Cart"
        },
        ...(mode === "checkout" || mode === "payment"
            ? [
                {
                    title:
                        mode === "payment"
                            ? <span style={{ cursor: "pointer", color:"#666" }} onClick={() => setMode("checkout")}>Checkout</span>
                            : "Checkout"
                }
            ]
            : []),
        ...(mode === "payment" ? [{ title: "Payment" }] : [])
    ];

    const columns = [
        {
            title: "",
            width: "5%",
            align: "center",
            render: (_, record) => (
                <CloseOutlined
                    style={{ cursor: "pointer", color: "#3c1900" }}
                    onClick={() => handleDelete(record.key)}
                />
            )
        },
        {
            title: "Product",
            width: "40%",
            render: (_, record) => (
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <img src={record.image} className={styles.img_table} alt={record.name} />
                    <div>
                        <div style={{ fontWeight: "bold", fontSize: "20px" }}>{record.name}</div>
                        <div style={{ fontSize: "16px", color: "#555" }}>
                            Color : {record.color} | Size : {record.size}
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "Price",
            dataIndex: "price",
            render: (price) => <Text style={{fontSize:"24px"}}>{formatPrice(price)}</Text>
        },
        {
            title: "Quantity",
            render: (_, record) => (
                <div style={{ display: "flex", alignItems: "center" }}>
                    <Button
                        className={styles.btn_qty}
                        size="small"
                        onClick={() => handleDecrease(record)}
                        icon={<MinusOutlined />}
                        disabled={cartItems.length === 0 || updating}
                    />
                    <span className={styles.text_qty}>{record.quantity}</span>
                    <Button
                        className={styles.btn_qty}
                        size="small"
                        onClick={() => handleIncrease(record)}
                        icon={<PlusOutlined />}
                        disabled={cartItems.length === 0 || updating}
                    />
                </div>
            )
        },
        {
            title: "Subtotal",
            width: "15%",
            render: (_, record) => <Text style={{fontSize:"24px"}}>{formatPrice(record.price * record.quantity)}</Text>
        }
    ];

    if (loading) {
        return (
            <div className={styles.page}>
                <div className={styles.container}>
                    <Title style={{ fontSize: "48px" }}>Shopping Cart</Title>
                    <Breadcrumb items={[{ title: <Link href="/">Home</Link> }, { title: "Shopping Cart" }]} className={styles.breadcrumb} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                    <Spin size="large" />
                </div>
                <Support />
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <Title style={{ fontSize: isMobile ? "32px" : "48px" }}>{pageTitle[mode]}</Title>
                <Breadcrumb items={breadcrumbItems} className={styles.breadcrumb} />
            </div>

            <div className={styles.main_container}>
                <div className={styles.left_container}>
                    {mode === "cart" && (
                        <>
                            {isMobile ? (
                                <div className={styles.mobileCartGrid}>
                                    {cartItems.length === 0 ? (
                                        <div className={styles.emptyCart}>
                                            <Text>Your cart is empty.</Text>
                                        </div>
                                    ) : (
                                        cartItems.map((item) => (
                                            <Card key={item.key} className={styles.mobileCartCard}>
                                                <div className={styles.mobileCartHeader}>
                                                    <CloseOutlined
                                                        style={{ cursor: "pointer", color: "#3c1900", fontSize: "18px" }}
                                                        onClick={() => handleDelete(item.key)}
                                                    />
                                                </div>
                                                <div className={styles.mobileCartContent}>
                                                    <img src={item.image} alt={item.name} className={styles.mobileCartImage} />
                                                    <div className={styles.mobileCartDetails}>
                                                        <div className={styles.mobileCartName}>{item.name}</div>
                                                        <div className={styles.mobileCartVariants}>
                                                            Color: {item.color} | Size: {item.size}
                                                        </div>
                                                        <Text strong style={{ fontSize: "18px", color: "#3c1900" }}>
                                                            {formatPrice(item.price)}
                                                        </Text>
                                                        <div className={styles.mobileCartQuantity}>
                                                            <Button
                                                                className={styles.mobileBtnQty}
                                                                size="small"
                                                                onClick={() => handleDecrease(item)}
                                                                icon={<MinusOutlined />}
                                                                disabled={updating}
                                                            />
                                                            <span className={styles.mobileTextQty}>{item.quantity}</span>
                                                            <Button
                                                                className={styles.mobileBtnQty}
                                                                size="small"
                                                                onClick={() => handleIncrease(item)}
                                                                icon={<PlusOutlined />}
                                                                disabled={updating}
                                                            />
                                                        </div>
                                                        <div className={styles.mobileCartSubtotal}>
                                                            Subtotal: <strong>{formatPrice(item.price * item.quantity)}</strong>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))
                                    )}
                                </div>
                            ) : (
                                <Table
                                    columns={columns}
                                    dataSource={cartItems}
                                    pagination={false}
                                    rowKey="key"
                                    locale={{ emptyText: "Your cart is empty." }}
                                />
                            )}

                            <div className={styles.bot_container}>
                                <div className={styles.coupon}>
                                    <Input
                                        placeholder="Coupon Code"
                                        className={styles.input}
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        disabled={cartItems.length === 0}
                                    />
                                    <Button
                                        className={styles.btn_input}
                                        style={{ color: "white", background: "#3c1900" }}
                                        onClick={applyCoupon}
                                        disabled={cartItems.length === 0}
                                    >
                                        Apply Coupon
                                    </Button>
                                </div>
                                <Text
                                    className={styles.clear}
                                    onClick={handleClearCart}
                                    style={{
                                        cursor: cartItems.length === 0 || updating ? "not-allowed" : "pointer",
                                        opacity: cartItems.length === 0 || updating ? 0.5 : 1
                                    }}
                                >
                                    Clear Shopping Cart
                                </Text>
                            </div>
                        </>
                    )}
                    {mode === "checkout" && (
                        <div className={styles.container_checkout}>
                            <Form layout="vertical" className={styles.form}>
                                <Title level={1} className={styles.title}>
                                    Billing Details
                                </Title>

                                <Row gutter={20}>
                                    {nameFields.map((field) => (
                                        <Col span={12} key={field.name}>
                                            <Form.Item
                                                label={field.label}
                                                className={styles.formItem}
                                            >
                                                <Input
                                                    className={styles.input_checkout}
                                                    placeholder={`Enter ${cleanLabel(field.label)}`}
                                                    value={billingForm[field.name]}
                                                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                                                />
                                            </Form.Item>
                                        </Col>
                                    ))}
                                </Row>

                                <Form.Item
                                    label="Company Name (Optional)"
                                    className={styles.formItem}
                                >
                                    <Input
                                        className={styles.input_checkout}
                                        placeholder="Enter Company Name"
                                        value={billingForm.company}
                                        onChange={(e) => handleInputChange('company', e.target.value)}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Country *"
                                    className={styles.formItem}
                                >
                                    <Select
                                        className={styles.input_checkout}
                                        placeholder="Select Country"
                                        value={billingForm.country || undefined}
                                        onChange={(value) => handleInputChange('country', value)}
                                        showSearch
                                    >
                                        {countryOptions.map(option => (
                                            <Option key={option.value} value={option.value}>
                                                {option.label}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    label="Street Address *"
                                    className={styles.formItem}
                                >
                                    <Input
                                        className={styles.input_checkout}
                                        placeholder="Enter Street Address"
                                        value={billingForm.street}
                                        onChange={(e) => handleInputChange('street', e.target.value)}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="City *"
                                    className={styles.formItem}
                                >
                                    <Select
                                        className={styles.input_checkout}
                                        placeholder="Select City"
                                        value={billingForm.city || undefined}
                                        onChange={(value) => handleInputChange('city', value)}
                                        showSearch
                                    >
                                        {cityOptions.map(option => (
                                            <Option key={option.value} value={option.value}>
                                                {option.label}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    label="State *"
                                    className={styles.formItem}
                                >
                                    <Select
                                        className={styles.input_checkout}
                                        placeholder="Select State"
                                        value={billingForm.state || undefined}
                                        onChange={(value) => handleInputChange('state', value)}
                                        showSearch
                                    >
                                        {stateOptions.map(option => (
                                            <Option key={option.value} value={option.value}>
                                                {option.label}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    label="Zip Code *"
                                    className={styles.formItem}
                                >
                                    <Input
                                        className={styles.input_checkout}
                                        placeholder="Enter Zip Code"
                                        value={billingForm.zip}
                                        onChange={(e) => handleInputChange('zip', e.target.value)}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Phone *"
                                    className={styles.formItem}
                                >
                                    <Input
                                        className={styles.input_checkout}
                                        placeholder="Enter Phone Number"
                                        value={billingForm.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Email *"
                                    className={styles.formItem}
                                >
                                    <Input
                                        className={styles.input_checkout}
                                        type="email"
                                        placeholder="Enter your email"
                                        value={billingForm.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                    />
                                </Form.Item>

                                <Title level={3} className={styles.title}>
                                    Delivery Address *
                                </Title>
                                <div>
                                    <Radio.Group
                                        className={styles.radio_group}
                                        onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                                        value={billingForm.deliveryAddress}
                                    >
                                        <Radio value={1} className={styles.radio}>Same as shipping address</Radio>
                                        <Radio value={2} className={styles.radio}>Use a different billing address</Radio>
                                    </Radio.Group>
                                </div>
                            </Form>
                        </div>
                    )}
                    {mode === "payment" && (
                        <div className={styles.container_payment}>
                            <Title level={1} className={styles.mainTitle}>
                                Select Payment Method
                            </Title>

                            <Radio.Group
                                onChange={(e) => setSelectedMethod(e.target.value)}
                                value={selectedMethod}
                                className={styles.radioGroup}
                            >
                                {paymentMethods.map((method) => (
                                    <Radio
                                        key={method.id}
                                        value={method.id}
                                        className={styles.radioItem}
                                    >
                                        <div className={styles.methodRow}>
                                            <span className={styles.icon}>
                                                {method.icon}
                                            </span>
                                            <Title level={3} className={styles.methodTitle}>
                                                {method.label}
                                            </Title>
                                        </div>
                                    </Radio>
                                ))}
                            </Radio.Group>

                            {selectedMethod === 5 && (
                                <Card className={styles.cardForm}>
                                    <div className={styles.container_card}>
                                        <div>
                                            <Title level={4} className={styles.label}>
                                                Card Holder Name *
                                            </Title>
                                            <Input
                                                placeholder="Card Holder Name"
                                                className={styles.input_payment}
                                            />
                                        </div>

                                        <div>
                                            <Title level={4} className={styles.label}>
                                                Card Number *
                                            </Title>
                                            <Input
                                                placeholder="Card Number"
                                                className={styles.input_payment}
                                            />
                                        </div>

                                        <Row gutter={16}>
                                            <Col span={12}>
                                                <Title level={4} className={styles.label}>
                                                    Expiry Date *
                                                </Title>
                                                <Input
                                                    placeholder="MM/YY"
                                                    className={styles.input_payment}
                                                />
                                            </Col>
                                            <Col span={12}>
                                                <Title level={4} className={styles.label}>
                                                    CVV *
                                                </Title>
                                                <Input
                                                    placeholder="CVV"
                                                    className={styles.input_payment}
                                                />
                                            </Col>
                                        </Row>

                                        <Checkbox style={{ fontSize: "20px" }}>
                                            Save card for future payments
                                        </Checkbox>

                                        <Button
                                            style={{
                                                fontSize: "24px",
                                                background: "#3c1900",
                                                color: "white"
                                            }}
                                            className={styles.btn_add}
                                        >
                                            Add Card
                                        </Button>
                                    </div>
                                </Card>
                            )}
                        </div>
                    )}
                </div>

                <div className={styles.right_container}>
                    <Card>
                        <div className={styles.card_container}>
                            <Title level={3} style={{ margin: 0 }}>Order Summary</Title>
                            <Divider />
                            <div className={styles.text_container_summary}>
                                <Text className={styles.space}>Items <span>{totalItems}</span></Text>
                                <Text className={styles.space}>Sub Total <span>{formatPrice(subtotal)}</span></Text>
                                <Text className={styles.space}>Shipping <span>$0.00</span></Text>
                                <Text className={styles.space}>Taxes <span>$0.00</span></Text>
                                <Text className={styles.space}>Coupon Discount <span>-{formatPrice(discountAmount)}</span></Text>
                            </div>
                            <Divider />
                            <Text className={styles.space}>Total <span>{formatPrice(total)}</span></Text>

                            {mode === "cart" ? (
                                <Button
                                    className={styles.btn_checkout}
                                    style={{ background: "#3c1900", color: "white", marginTop: "40px" }}
                                    onClick={() => {
                                        if (cartItems.length > 0) {
                                            setMode("checkout");
                                        }
                                    }}
                                    disabled={cartItems.length === 0 || updating}
                                >
                                    Proceed to Checkout
                                </Button>
                            ) : mode === "checkout" ? (
                                <Button
                                    className={styles.btn_checkout}
                                    style={{ background: "#3c1900", color: "white", marginTop: "40px" }}
                                    onClick={() => {
                                        if (isFormValid()) {
                                            setMode("payment");
                                        } else {
                                            message.error("Please fill in all required fields");
                                        }
                                    }}
                                    disabled={cartItems.length === 0 || updating || !isFormValid()}
                                >
                                    Continue to Payment
                                </Button>
                            ) : (
                                <Button
                                    className={styles.btn_checkout}
                                    style={{ background: "#3c1900", color: "white", marginTop: "40px" }}
                                    onClick={handleConfirmPayment}
                                    disabled={cartItems.length === 0 || updating}
                                    loading={updating}
                                >
                                    Confirm Payment
                                </Button>
                            )}
                        </div>
                    </Card>
                </div>
            </div>

            <Support />
        </div>
    );
}
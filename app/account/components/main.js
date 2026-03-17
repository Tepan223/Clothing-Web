'use client'
import styles from "../styles/main.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {Typography, Tabs, Avatar, Input, Select, Button, Card, Row, Col, Checkbox, Divider, Tag, message} from "antd";
import {
    UserOutlined
} from "@ant-design/icons";
import Link from "next/link";
import { FaPaypal, FaCcVisa } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { MdCreditCard } from "react-icons/md";

const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" }
];

const sort = [
    { value: "all", label: "All" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" }
];

const paymentMethods = [
    { id: 1, label: "Paypal", icon: <FaPaypal size={20} color="#003087" />, link: "Link Account" },
    { id: 2, label: "Visa", icon: <FaCcVisa size={20} color="#1a1f71" />, del: "Delete" },
    { id: 3, label: "Google Play", icon: <FcGoogle size={20} color="#34a853" />, link: "Link Account" },
    { id: 4, label: "Add New Credit/Debit Card", icon: <MdCreditCard size={20} /> },
];

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

const { Password } = Input;
const { Title, Text } = Typography;

export default function Account() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [addressLoading, setAddressLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [activeTab, setActiveTab] = useState("1");

    // Check if mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 720);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // State untuk orders
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [sortBy, setSortBy] = useState("all");

    // State untuk personal information
    const [personalInfo, setPersonalInfo] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        gender: ""
    });

    // State untuk password
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    // State untuk error password
    const [passwordErrors, setPasswordErrors] = useState({});

    // State untuk addresses
    const [addresses, setAddresses] = useState([]);

    // State untuk form address
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        company: "",
        country: "",
        street: "",
        city: "",
        state: "",
        zip: "",
        phone: "",
        email: ""
    });

    // State untuk payment method
    const [selectedMethod, setSelectedMethod] = useState(null);

    // Filter orders berdasarkan sort
    useEffect(() => {
        if (sortBy === "all") {
            setFilteredOrders(orders);
        } else {
            setFilteredOrders(orders.filter(order =>
                order.status?.toLowerCase() === sortBy.toLowerCase()
            ));
        }
    }, [sortBy, orders]);

    // Ambil data user dari localStorage
    useEffect(() => {
        const fetchUserData = () => {
            try {
                const userStr = localStorage.getItem('user');
                if (!userStr) {
                    router.push('/sign-in');
                    return;
                }

                const userData = JSON.parse(userStr);
                setUser(userData);

                // Ambil data lengkap dari localStorage users
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                const fullUserData = users.find(u => u.id === userData.id);

                if (fullUserData) {
                    // Personal info
                    setPersonalInfo({
                        firstName: fullUserData.firstName || "",
                        lastName: fullUserData.lastName || "",
                        email: fullUserData.email || "",
                        phone: fullUserData.phone || "",
                        gender: fullUserData.gender || ""
                    });

                    // Addresses
                    if (fullUserData.addresses && fullUserData.addresses.length > 0) {
                        setAddresses(fullUserData.addresses);
                    }

                    // Orders
                    if (fullUserData.orders && fullUserData.orders.length > 0) {
                        const transformedOrders = fullUserData.orders.map(order => ({
                            transactionId: order.orderId || order.transactionId,
                            totalPayment: order.total,
                            paymentMethod: order.paymentMethod,
                            estimatedDeliveryDate: order.estimateDelivery || formatDate(order.orderDate),
                            status: order.status || "Processing",
                            cancelOrder: order.status === "Processing",
                            items: order.items.map(item => ({
                                name: item.name,
                                color: item.color,
                                size: item.size,
                                qty: item.quantity,
                                price: item.price
                            }))
                        }));

                        setOrders(transformedOrders);
                        setFilteredOrders(transformedOrders);
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                message.error('Gagal mengambil data user');
            } finally {
                setLoading(false);
                setOrdersLoading(false);
            }
        };

        fetchUserData();
    }, [router]);

    // Format date function
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const handleUpdatePersonalInfo = () => {
        if (!user) return;

        try {
            // Ambil users dari localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');

            // Cari index user
            const userIndex = users.findIndex(u => u.id === user.id);

            if (userIndex !== -1) {
                // Update user data
                users[userIndex] = {
                    ...users[userIndex],
                    ...personalInfo
                };

                // Simpan kembali ke localStorage
                localStorage.setItem('users', JSON.stringify(users));

                // Update user yang login
                const updatedUser = { ...user, ...personalInfo };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);

                message.success('Personal information updated successfully');
            }
        } catch (error) {
            console.error('Error updating user:', error);
            message.error('Gagal mengupdate data');
        }
    };

    // Validasi password
    const validatePassword = () => {
        const errors = {};

        if (!passwordData.currentPassword) {
            errors.currentPassword = "Current password is required";
        }

        if (!passwordData.newPassword) {
            errors.newPassword = "New password is required";
        } else if (passwordData.newPassword.length < 8) {
            errors.newPassword = "Password must be at least 8 characters";
        } else if (!/[A-Z]/.test(passwordData.newPassword)) {
            errors.newPassword = "Password must contain at least one uppercase letter";
        } else if (!/[a-z]/.test(passwordData.newPassword)) {
            errors.newPassword = "Password must contain at least one lowercase letter";
        } else if (!/[0-9]/.test(passwordData.newPassword)) {
            errors.newPassword = "Password must contain at least one number";
        }

        if (!passwordData.confirmPassword) {
            errors.confirmPassword = "Please confirm your password";
        } else if (passwordData.newPassword !== passwordData.confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
        }

        setPasswordErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle reset password
    const handleResetPassword = () => {
        if (!validatePassword() || !user) return;

        setPasswordLoading(true);

        try {
            // Ambil users dari localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');

            // Cari user
            const userIndex = users.findIndex(u => u.id === user.id);

            if (userIndex === -1) {
                message.error('User not found');
                setPasswordLoading(false);
                return;
            }

            // Validasi current password
            if (users[userIndex].password !== passwordData.currentPassword) {
                setPasswordErrors({
                    ...passwordErrors,
                    currentPassword: "Current password is incorrect"
                });
                message.error('Current password is incorrect');
                setPasswordLoading(false);
                return;
            }

            // Update password
            users[userIndex].password = passwordData.newPassword;

            // Simpan ke localStorage
            localStorage.setItem('users', JSON.stringify(users));

            message.success('Password updated successfully');

            // Reset form
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
            setPasswordErrors({});

        } catch (error) {
            console.error('Error resetting password:', error);
            message.error('Failed to update password');
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        router.push("/sign-in");
    };

    // HANDLE ADDRESS
    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleAddAddress = () => {
        // Validasi
        if (!formData.firstName || !formData.lastName || !formData.street || !formData.city ||
            !formData.state || !formData.zip || !formData.phone || !formData.email) {
            message.error('Please fill all required fields');
            return;
        }

        if (!user) return;

        setAddressLoading(true);

        try {
            let updatedAddresses;
            let updatedUsers;

            // Ambil users dari localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const userIndex = users.findIndex(u => u.id === user.id);

            if (userIndex === -1) {
                message.error('User not found');
                setAddressLoading(false);
                return;
            }

            if (editingId) {
                // Update existing address
                updatedAddresses = addresses.map((addr) =>
                    addr.id === editingId ? { ...addr, ...formData } : addr
                );
            } else {
                // Cari ID tertinggi yang sudah ada
                const maxId = addresses.length > 0
                    ? Math.max(...addresses.map(addr => addr.id))
                    : 0;

                // Add new address dengan ID = maxId + 1
                const newAddress = {
                    id: maxId + 1,
                    ...formData
                };
                updatedAddresses = [...addresses, newAddress];
            }

            // Update users array
            users[userIndex].addresses = updatedAddresses;

            // Simpan ke localStorage
            localStorage.setItem('users', JSON.stringify(users));

            // Update state
            setAddresses(updatedAddresses);
            message.success(editingId ? 'Address updated successfully' : 'Address added successfully');

            // Reset form
            setFormData({
                firstName: "",
                lastName: "",
                company: "",
                country: "",
                street: "",
                city: "",
                state: "",
                zip: "",
                phone: "",
                email: ""
            });
            setEditingId(null);

        } catch (error) {
            console.error('Error saving address:', error);
            message.error('Failed to save address');
        } finally {
            setAddressLoading(false);
        }
    };

    const handleEdit = (address) => {
        setEditingId(address.id);
        setFormData({
            firstName: address.firstName || "",
            lastName: address.lastName || "",
            company: address.company || "",
            country: address.country || "",
            street: address.street || "",
            city: address.city || "",
            state: address.state || "",
            zip: address.zip || "",
            phone: address.phone || "",
            email: address.email || ""
        });
    };

    const handleDelete = (id) => {
        if (!user) return;

        try {
            const updatedAddresses = addresses.filter((addr) => addr.id !== id);

            // Ambil users dari localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const userIndex = users.findIndex(u => u.id === user.id);

            if (userIndex !== -1) {
                users[userIndex].addresses = updatedAddresses;
                localStorage.setItem('users', JSON.stringify(users));
                setAddresses(updatedAddresses);
                message.success('Address deleted successfully');
            }
        } catch (error) {
            console.error('Error deleting address:', error);
            message.error('Failed to delete address');
        }
    };

    const handleTrackOrder = (order) => {
        // Simpan order data ke localStorage untuk halaman track
        localStorage.setItem('trackOrder', JSON.stringify(order));
        router.push('/track');
    };

    const handleViewInvoice = (order) => {
        // Generate invoice
        const invoiceContent = `
            ORDER INVOICE
            =============
            Order ID: ${order.transactionId}
            Payment Method: ${order.paymentMethod}
            Date: ${order.estimatedDeliveryDate}
            
            PRODUCTS:
            ${order.items.map(item =>
            `${item.name} x${item.qty} - $${item.price * item.qty}`
        ).join('\n')}
            
            Total: $${order.totalPayment}
        `;

        // Create a blob and download
        const blob = new Blob([invoiceContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${order.transactionId}.txt`;
        a.click();
    };

    const handleCancelOrder = (orderId) => {
        if (!user) return;

        try {
            // Ambil users dari localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const userIndex = users.findIndex(u => u.id === user.id);

            if (userIndex === -1) {
                message.error('User not found');
                return;
            }

            // Update order status in user's orders
            const updatedOrders = users[userIndex].orders.map(order => {
                if (order.orderId === orderId || order.transactionId === orderId) {
                    return { ...order, status: "Cancelled" };
                }
                return order;
            });

            users[userIndex].orders = updatedOrders;
            localStorage.setItem('users', JSON.stringify(users));

            // Update orders state
            const updatedTransformedOrders = orders.map(order => {
                if (order.transactionId === orderId) {
                    return { ...order, status: "Cancelled", cancelOrder: false };
                }
                return order;
            });

            setOrders(updatedTransformedOrders);
            message.success('Order cancelled successfully');

        } catch (error) {
            console.error('Error cancelling order:', error);
            message.error('Failed to cancel order');
        }
    };

    // Mobile select options untuk tabs
    const mobileTabOptions = [
        { value: "1", label: "Personal Information" },
        { value: "2", label: "My Orders" },
        { value: "3", label: "Manage Address" },
        { value: "4", label: "Payment Method" },
        { value: "5", label: "Password Manager" },
        { value: "6", label: "Logout" }
    ];

    const items = [
        {
            key: "1",
            label: (
                <span style={{fontSize:"24px", fontWeight:"bold", color:"black"}}>
                    Personal Information
                </span>
            ),
            children: (
                <div className={styles.form_container}>
                    <Avatar size={160} icon={<UserOutlined />} />
                    <div className={styles.name_container}>
                        <div>
                            <Title level={3} className={styles.title_profile}>First Name *</Title>
                            <Input
                                placeholder="Enter first name"
                                value={personalInfo.firstName}
                                onChange={(e) => setPersonalInfo({...personalInfo, firstName: e.target.value})}
                            />
                        </div>
                        <div>
                            <Title level={3} className={styles.title_profile}>Last Name *</Title>
                            <Input
                                placeholder="Enter last name"
                                value={personalInfo.lastName}
                                onChange={(e) => setPersonalInfo({...personalInfo, lastName: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className={styles.email_container}>
                        <Title level={3} className={styles.title_profile}>Email *</Title>
                        <Input
                            placeholder="Enter email"
                            value={personalInfo.email}
                            onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                        />
                    </div>
                    <div className={styles.phone_container}>
                        <Title level={3} className={styles.title_profile}>Phone *</Title>
                        <Input
                            placeholder="Enter phone number"
                            value={personalInfo.phone}
                            onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                        />
                    </div>
                    <div className={styles.gender_container}>
                        <Title level={3} className={styles.title_profile}>Gender *</Title>
                        <Select
                            style={{ width: "100%", fontSize:"18px" }}
                            options={genderOptions}
                            placeholder="Select gender"
                            value={personalInfo.gender || undefined}
                            onChange={(value) => setPersonalInfo({...personalInfo, gender: value})}
                        />
                    </div>
                    <Button
                        style={{color:"white", background:"#3c1900"}}
                        className={styles.btn}
                        onClick={handleUpdatePersonalInfo}
                        loading={loading}
                    >
                        Update Changes
                    </Button>
                </div>
            )
        },
        {
            key: "2",
            label: (
                <span style={{fontSize:"24px", fontWeight:"bold", color:"black"}}>
                    My Orders
                </span>
            ),
            children: (
                <div>
                    <div className={styles.top_container}>
                        <Title className={styles.order_Title}>Orders</Title>
                        <div className={styles.sort}>
                            <Text style={{fontSize:"20px"}} className={styles.text_order}>Sort by :</Text>
                            <Select
                                style={{ width: "fit-content", fontSize:"18px" }}
                                options={sort}
                                value={sortBy}
                                onChange={(value) => setSortBy(value)}
                                placeholder="All"
                                className={styles.select_order}
                            />
                        </div>
                    </div>
                    <div className={styles.container}>
                        {ordersLoading ? (
                            <div style={{ textAlign: 'center', padding: '50px' }}>
                                <Text>Loading orders...</Text>
                            </div>
                        ) : filteredOrders.length > 0 ? (
                            filteredOrders.map((order) => (
                                <div key={order.transactionId}>
                                    <Card className={styles.header_card}>
                                        <div className={styles.header_text}>
                                            <Text type="secondary" style={{ fontSize: "20px" }} className={styles.text_secondary}>Order ID</Text>
                                            <Title level={3} style={{ margin: "0" }} className={styles.text_order_bold}>
                                                {order.transactionId}
                                            </Title>
                                        </div>
                                        <div className={styles.header_text}>
                                            <Text type="secondary" style={{ fontSize: "20px" }} className={styles.text_secondary}>Total Payment</Text>
                                            <Title level={3} style={{ margin: "0" }} className={styles.text_order_bold}>
                                                ${order.totalPayment}
                                            </Title>
                                        </div>
                                        <div className={styles.header_text}>
                                            <Text type="secondary" style={{ fontSize: "20px" }} className={styles.text_secondary}>Payment Method</Text>
                                            <Title level={3} style={{ margin: "0" }} className={styles.text_order_bold}>
                                                {order.paymentMethod}
                                            </Title>
                                        </div>
                                        <div className={styles.header_text}>
                                            <Text type="secondary" style={{ fontSize: "20px" }} className={styles.text_secondary}>
                                                {order.status === "Delivered"
                                                    ? "Delivered Date"
                                                    : "Estimated Delivery Date"}
                                            </Text>
                                            <Title level={3} style={{ margin: "0" }} className={styles.text_order_bold}>
                                                {order.estimatedDeliveryDate}
                                            </Title>
                                        </div>
                                    </Card>
                                    <Card className={styles.card_items}>
                                        {order.items.map((item, index) => (
                                            <div key={index}>
                                                <div className={styles.item_container}>
                                                    <div className={styles.image_container}></div>
                                                    <div className={styles.item_info}>
                                                        <Title style={{ margin: "0" }} className={styles.title_product}>
                                                            {item.name}
                                                        </Title>
                                                        <div className={styles.item_meta}>
                                                            <Text style={{ fontSize: "20px" }} className={styles.item_meta}>Color : {item.color}</Text>
                                                            |
                                                            <Text style={{ fontSize: "20px" }} className={styles.item_meta}>Size : {item.size}</Text>
                                                            |
                                                            <Text style={{ fontSize: "20px" }} className={styles.item_meta}>Qty : {item.qty}</Text>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Divider />
                                            </div>
                                        ))}
                                        <div className={styles.bot_container}>
                                            <div className={styles.bot_top_text}>
                                                <Tag
                                                    className={styles.tag}
                                                    color={order.status === "Accepted" || order.status === "Processing" ? "gold" :
                                                        order.status === "Shipped" ? "blue" :
                                                            order.status === "Delivered" ? "green" : "red"}
                                                    style={{ fontSize: "20px", padding: "10px" }}
                                                >
                                                    {order.status}
                                                </Tag>
                                                <Text strong style={{ fontSize: "20px" }} className={styles.text_order_product}>
                                                    Your Order has been {order.status}
                                                </Text>
                                            </div>
                                            <div className={styles.bot_bot_text}>
                                                <div className={styles.btn_container}>
                                                    <Button
                                                        style={{
                                                            color: "white",
                                                            background: "#3c1900",
                                                            border: "solid #3c1900"
                                                        }}
                                                        className={styles.btn}
                                                        onClick={() => order.status === "Processing" || order.status === "Shipped"
                                                            ? handleTrackOrder(order)
                                                            : handleViewInvoice(order)}
                                                    >
                                                        {order.status === "Processing" || order.status === "Shipped"
                                                            ? "Track Order"
                                                            : "Review"}
                                                    </Button>
                                                    <Button
                                                        style={{
                                                            color: "#3c1900",
                                                            background: "white",
                                                            border: "solid #3c1900"
                                                        }}
                                                        className={styles.btn}
                                                        onClick={() => handleViewInvoice(order)}
                                                    >
                                                        Invoice
                                                    </Button>
                                                </div>
                                                {order.cancelOrder && (
                                                    <Text
                                                        className={styles.order_action}
                                                        style={{
                                                            fontSize: "20px",
                                                            color: "red",
                                                            cursor: "pointer"
                                                        }}
                                                        onClick={() => handleCancelOrder(order.transactionId)}
                                                    >
                                                        Cancel Order
                                                    </Text>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', padding: '50px' }}>
                                <Text style={{ fontSize: '20px' }}>No orders found</Text>
                            </div>
                        )}
                    </div>
                </div>
            )
        },
        {
            key: "3",
            label: (
                <span style={{fontSize:"24px", fontWeight:"bold", color:"black"}}>
                    Manage Address
                </span>
            ),
            children: (
                <div>
                    <div className={styles.list_addres}>
                        {addresses.map((item) => (
                            <Card key={item.id} className={styles.address_card}>
                                <div className={styles.address_row}>
                                    <div>
                                        <Title level={4} style={{margin:0}}>
                                            {item.firstName} {item.lastName}
                                        </Title>
                                        <Text type="secondary" style={{fontSize:"18px"}}>
                                            {item.street}, {item.city}, {item.state} {item.zip}
                                        </Text>
                                    </div>
                                    <div className={styles.address_action}>
                                        <Text
                                            className={styles.edit}
                                            onClick={() => handleEdit(item)}
                                        >
                                            Edit
                                        </Text>
                                        <Text
                                            className={styles.delete}
                                            onClick={() => handleDelete(item.id)}
                                        >
                                            Delete
                                        </Text>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    <div className={styles.address_container}>
                        <Title style={{margin:0}} className={styles.title_address}>
                            {editingId ? "Edit Address" : "Add New Address"}
                        </Title>

                        <div className={styles.name_container}>
                            <div>
                                <Title level={3} className={styles.title_container_address}>First Name *</Title>
                                <Input
                                    placeholder="Enter First Name"
                                    value={formData.firstName}
                                    onChange={(e)=>handleChange("firstName", e.target.value)}
                                />
                            </div>
                            <div>
                                <Title level={3} className={styles.title_container_address}>Last Name *</Title>
                                <Input
                                    placeholder="Enter Last Name"
                                    value={formData.lastName}
                                    onChange={(e)=>handleChange("lastName", e.target.value)}
                                />
                            </div>
                        </div>

                        <div className={styles.company}>
                            <Title level={3} className={styles.title_container_address}>Company Name (Optional)</Title>
                            <Input
                                placeholder="Enter Company Name"
                                value={formData.company}
                                onChange={(e)=>handleChange("company", e.target.value)}
                            />
                        </div>

                        <div className={styles.country}>
                            <Title level={3} className={styles.title_container_address}>Country *</Title>
                            <Select
                                options={countryOptions}
                                value={formData.country}
                                onChange={(value)=>handleChange("country", value)}
                                style={{width:"100%"}}
                                placeholder="Select country"
                            />
                        </div>

                        <div className={styles.street}>
                            <Title level={3} className={styles.title_container_address}>Street Address *</Title>
                            <Input
                                placeholder="Enter Street Address"
                                value={formData.street}
                                onChange={(e)=>handleChange("street", e.target.value)}
                            />
                        </div>

                        <div className={styles.city}>
                            <Title level={3} className={styles.title_container_address}>City *</Title>
                            <Select
                                options={cityOptions}
                                value={formData.city}
                                onChange={(value)=>handleChange("city", value)}
                                style={{width:"100%"}}
                                placeholder="Select city"
                            />
                        </div>

                        <div className={styles.state}>
                            <Title level={3} className={styles.title_container_address}>State *</Title>
                            <Select
                                options={stateOptions}
                                value={formData.state}
                                onChange={(value)=>handleChange("state", value)}
                                style={{width:"100%"}}
                                placeholder="Select state"
                            />
                        </div>

                        <div className={styles.zip}>
                            <Title level={3} className={styles.title_container_address}>Zip Code *</Title>
                            <Input
                                placeholder="Enter Zip Code"
                                value={formData.zip}
                                onChange={(e)=>handleChange("zip", e.target.value)}
                            />
                        </div>

                        <div className={styles.phone_container}>
                            <Title level={3} className={styles.title_container_address}>Phone *</Title>
                            <Input
                                placeholder="Enter Phone Number"
                                value={formData.phone}
                                onChange={(e)=>handleChange("phone", e.target.value)}
                            />
                        </div>

                        <div className={styles.email_container}>
                            <Title level={3} className={styles.title_container_address}>Email *</Title>
                            <Input
                                placeholder="Enter Email Address"
                                value={formData.email}
                                onChange={(e)=>handleChange("email", e.target.value)}
                            />
                        </div>

                        <Button
                            style={{color:"white", background:"#3c1900"}}
                            className={styles.btn}
                            onClick={handleAddAddress}
                            loading={addressLoading}
                        >
                            {editingId ? "Update Address" : "Add Address"}
                        </Button>
                    </div>
                </div>
            )
        },
        {
            key: "4",
            label: (
                <span style={{fontSize:"24px", fontWeight:"bold", color:"black"}}>
                    Payment Method
                </span>
            ),
            children: (
                <div className={styles.payment_container}>
                    <div className={styles.payment_list}>
                        {paymentMethods.map((method) => (
                            <Card
                                key={method.id}
                                onClick={() => setSelectedMethod(method.id)}
                                className={`${styles.payment_card} ${
                                    selectedMethod === method.id ? styles.active : ""
                                }`}
                            >
                                <div className={styles.gap_text}>
                                    <div style={{display:"flex", alignItems:"center", gap:"12px"}} className={styles.text_icon}>
                                        {method.icon}
                                        <Text style={{ fontSize: "20px", fontWeight: "bold" }} className={styles.name_payment}>
                                            {method.label}
                                        </Text>
                                    </div>
                                    {method.link && (
                                        <Text
                                            style={{
                                                fontSize: "20px",
                                                fontWeight: "bold",
                                                color: "saddlebrown",
                                                textAlign: "right",
                                            }}
                                            className={styles.link_payment}
                                        >
                                            {method.link}
                                        </Text>
                                    )}
                                    {method.del && (
                                        <Text
                                            style={{
                                                fontSize: "20px",
                                                fontWeight: "bold",
                                                color: "red",
                                            }}
                                            className={styles.link_payment}
                                        >
                                            {method.del}
                                        </Text>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                    {selectedMethod === 4 && (
                        <Card className={styles.cardForm}>
                            <div className={styles.container_card}>
                                <div>
                                    <Title level={4}>Card Holder Name *</Title>
                                    <Input placeholder="Card Holder Name"/>
                                </div>
                                <div>
                                    <Title level={4}>Card Number *</Title>
                                    <Input placeholder="Card Number"/>
                                </div>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Title level={4}>Expiry Date *</Title>
                                        <Input placeholder="MM/YY"/>
                                    </Col>
                                    <Col span={12}>
                                        <Title level={4}>CVV *</Title>
                                        <Input placeholder="CVV"/>
                                    </Col>
                                </Row>
                                <Checkbox style={{fontSize:"18px"}}>
                                    Save card for future payments
                                </Checkbox>
                                <Button
                                    style={{fontSize:"22px", background:"#3c1900", color:"white"}}
                                    className={styles.btn_add}
                                >
                                    Add Card
                                </Button>
                            </div>
                        </Card>
                    )}
                </div>
            )
        },
        {
            key: "5",
            label: (
                <span style={{fontSize:"24px", fontWeight:"bold", color:"black"}}>
                    Password Manager
                </span>
            ),
            children: (
                <div className={styles.password_container}>
                    <div className={styles.password}>
                        <Title level={3} style={{margin:"0"}} className={styles.title_password}>Current Password *</Title>
                        <Password
                            placeholder="Enter current password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                            status={passwordErrors.currentPassword ? "error" : ""}
                        />
                        {passwordErrors.currentPassword && (
                            <Text type="danger" style={{ fontSize: "14px", marginTop: "5px" }}>
                                {passwordErrors.currentPassword}
                            </Text>
                        )}
                        <Link href="/forgot-password" className={styles.forgot}>Forgot Password?</Link>
                    </div>
                    <div className={styles.new_password}>
                        <Title level={3} style={{margin:"0"}} className={styles.title_password}>New Password</Title>
                        <Password
                            placeholder="Enter new password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                            status={passwordErrors.newPassword ? "error" : ""}
                        />
                        {passwordErrors.newPassword && (
                            <Text type="danger" style={{ fontSize: "14px", marginTop: "5px" }}>
                                {passwordErrors.newPassword}
                            </Text>
                        )}
                    </div>
                    <div className={styles.confirm_password}>
                        <Title level={3} style={{margin:"0"}} className={styles.title_password}>Confirm New Password</Title>
                        <Password
                            placeholder="Confirm password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                            status={passwordErrors.confirmPassword ? "error" : ""}
                        />
                        {passwordErrors.confirmPassword && (
                            <Text type="danger" style={{ fontSize: "14px", marginTop: "5px" }}>
                                {passwordErrors.confirmPassword}
                            </Text>
                        )}
                    </div>
                    <Button
                        style={{color:"white", background:"#3c1900"}}
                        className={styles.btn}
                        onClick={handleResetPassword}
                        loading={passwordLoading}
                    >
                        Update Password
                    </Button>
                </div>
            )
        },
        {
            key: "6",
            label: (
                <span style={{fontSize:"24px", fontWeight:"bold", color:"black"}}>
                    Logout
                </span>
            ),
            children: (
                <div className={styles.logout}>
                    <Title level={1} style={{margin:"0"}}>Logout</Title>
                    <Text style={{fontSize:"20px"}}>Are you sure you want to log out?</Text>
                    <Button
                        style={{color:"white", background:"#3c1900"}}
                        className={styles.btn}
                        onClick={handleLogout}
                    >
                        Yes, Logout
                    </Button>
                </div>
            )
        }
    ];

    return (
        <div className={styles.page}>
            {isMobile ? (
                // Mobile View - Select Dropdown
                <div className={styles.mobileTabContainer}>
                    <Select
                        className={styles.mobileTabSelect}
                        value={activeTab}
                        onChange={setActiveTab}
                        options={mobileTabOptions}
                        size="large"
                    />
                    <div className={styles.mobileTabContent}>
                        {items.find(item => item.key === activeTab)?.children}
                    </div>
                </div>
            ) : (
                // Desktop View - Tabs
                <Tabs
                    tabPlacement="left"
                    items={items}
                    style={{ width: "100%" }}
                />
            )}
        </div>
    );
}
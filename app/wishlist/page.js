'use client'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumb, Typography, Table, Button, message, Spin, Tag, Input, Card } from "antd";
import { CloseOutlined, HeartFilled, CopyOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import Link from "next/link";
import Support from '../components/support';
import styles from "./styles/wishlist.module.css";

const { Title, Text } = Typography;

export default function Wishlist() {
    const router = useRouter();
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [user, setUser] = useState(null);
    const [wishlistLink, setWishlistLink] = useState("");
    const [isMobile, setIsMobile] = useState(false);

    // Check if mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 720);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Generate wishlist link
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setWishlistLink(`${window.location.origin}/wishlist`);
        }
    }, []);

    // Fetch wishlist data dari localStorage
    const fetchWishlist = () => {
        try {
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                router.push('/sign-in?redirect=/wishlist');
                return;
            }

            const userData = JSON.parse(userStr);
            setUser(userData);

            // Ambil data users dari localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const currentUser = users.find(u => u.id === userData.id);

            if (!currentUser) {
                message.error('User tidak ditemukan');
                router.push('/sign-in');
                return;
            }

            // Ambil wishlist dari user
            const userWishlist = currentUser.wishlist || [];

            // Transform data untuk tabel
            const transformedItems = userWishlist.map((item, index) => ({
                key: `${item.id}-${item.selectedColor}-${item.selectedSize}-${index}`,
                id: item.id,
                name: item.name || item.title,
                price: item.price,
                originalPrice: item.oldPrice,
                color: item.selectedColor,
                size: item.selectedSize,
                image: item.image || '/images/default-product.jpg',
                category: item.category,
                inStock: item.inStock !== undefined ? item.inStock : true,
                rating: item.rating,
                addedAt: item.addedAt || new Date().toISOString()
            }));

            setWishlistItems(transformedItems);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
            message.error('Gagal mengambil data wishlist');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();

        // Listen untuk update wishlist dari komponen lain
        const handleWishlistUpdate = (event) => {
            if (event.detail) {
                const transformedItems = event.detail.map((item, index) => ({
                    key: `${item.id}-${item.selectedColor}-${item.selectedSize}-${index}`,
                    id: item.id,
                    name: item.name || item.title,
                    price: item.price,
                    originalPrice: item.oldPrice,
                    color: item.selectedColor,
                    size: item.selectedSize,
                    image: item.image || '/images/default-product.jpg',
                    category: item.category,
                    inStock: item.inStock !== undefined ? item.inStock : true,
                    rating: item.rating,
                    addedAt: item.addedAt || new Date().toISOString()
                }));
                setWishlistItems(transformedItems);
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('wishlistUpdated', handleWishlistUpdate);
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
            }
        };
    }, []);

    // Save wishlist to localStorage
    const saveWishlistToStorage = (updatedWishlist) => {
        try {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const userIndex = users.findIndex(u => u.id === user?.id);

            if (userIndex !== -1) {
                users[userIndex].wishlist = updatedWishlist.map(item => ({
                    id: item.id,
                    name: item.name,
                    title: item.name,
                    price: item.price,
                    oldPrice: item.originalPrice,
                    selectedColor: item.color,
                    selectedSize: item.size,
                    image: item.image,
                    category: item.category,
                    inStock: item.inStock,
                    rating: item.rating,
                    addedAt: item.addedAt
                }));
                localStorage.setItem('users', JSON.stringify(users));

                // Update user di localStorage
                const updatedUser = { ...user, wishlist: users[userIndex].wishlist };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
            }
        } catch (error) {
            console.error('Error saving wishlist:', error);
        }
    };

    // Hapus item dari wishlist
    const handleDelete = (key) => {
        try {
            setUpdating(true);
            const updatedWishlist = wishlistItems.filter(item => item.key !== key);
            setWishlistItems(updatedWishlist);
            saveWishlistToStorage(updatedWishlist);
            message.success('Item removed from wishlist');

            // Dispatch event untuk update komponen lain
            window.dispatchEvent(new CustomEvent('wishlistUpdated', {
                detail: updatedWishlist
            }));
        } catch (error) {
            console.error('Error deleting item:', error);
            message.error('Gagal menghapus item');
        } finally {
            setUpdating(false);
        }
    };

    // Clear all wishlist
    const handleClearWishlist = () => {
        try {
            setUpdating(true);
            setWishlistItems([]);
            saveWishlistToStorage([]);
            message.success('Wishlist cleared');

            window.dispatchEvent(new CustomEvent('wishlistUpdated', {
                detail: []
            }));
        } catch (error) {
            console.error('Error clearing wishlist:', error);
            message.error('Gagal clear wishlist');
        } finally {
            setUpdating(false);
        }
    };

    // Add to cart individual
    const handleAddToCart = (item) => {
        try {
            setUpdating(true);

            const userStr = localStorage.getItem('user');
            if (!userStr) {
                router.push('/sign-in');
                return;
            }

            const userData = JSON.parse(userStr);

            // Ambil users dari localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const userIndex = users.findIndex(u => u.id === userData.id);

            if (userIndex === -1) {
                message.error('User tidak ditemukan');
                setUpdating(false);
                return;
            }

            // Inisialisasi cart jika belum ada
            if (!users[userIndex].cart) {
                users[userIndex].cart = [];
            }

            const cartItem = {
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
                selectedColor: item.color,
                selectedSize: item.size,
                quantity: 1
            };

            // Cek apakah item sudah ada di cart
            const existingItemIndex = users[userIndex].cart.findIndex(
                cartItem => cartItem.id === item.id &&
                    cartItem.selectedColor === item.color &&
                    cartItem.selectedSize === item.size
            );

            if (existingItemIndex >= 0) {
                // Update quantity
                users[userIndex].cart[existingItemIndex].quantity += 1;
            } else {
                // Tambah item baru
                users[userIndex].cart.push(cartItem);
            }

            // Simpan ke localStorage
            localStorage.setItem('users', JSON.stringify(users));

            // Update user di localStorage
            const updatedUser = { ...userData, cart: users[userIndex].cart };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            message.success('Item added to cart successfully!');

            // Hapus dari wishlist
            handleDelete(item.key);

            // Dispatch event untuk update cart
            window.dispatchEvent(new CustomEvent('cartUpdated', {
                detail: users[userIndex].cart
            }));

        } catch (error) {
            console.error('Error adding to cart:', error);
            message.error('Gagal menambah ke cart');
        } finally {
            setUpdating(false);
        }
    };

    // Add all to cart
    const handleAddAllToCart = () => {
        try {
            setUpdating(true);

            const userStr = localStorage.getItem('user');
            if (!userStr) {
                router.push('/sign-in');
                return;
            }

            const userData = JSON.parse(userStr);

            // Filter hanya item yang in stock
            const inStockItems = wishlistItems.filter(item => item.inStock);

            if (inStockItems.length === 0) {
                message.warning('No in-stock items to add to cart');
                setUpdating(false);
                return;
            }

            // Ambil users dari localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const userIndex = users.findIndex(u => u.id === userData.id);

            if (userIndex === -1) {
                message.error('User tidak ditemukan');
                setUpdating(false);
                return;
            }

            // Inisialisasi cart jika belum ada
            if (!users[userIndex].cart) {
                users[userIndex].cart = [];
            }

            let successCount = 0;
            const itemsToRemove = [];

            for (const item of inStockItems) {
                const cartItem = {
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    image: item.image,
                    selectedColor: item.color,
                    selectedSize: item.size,
                    quantity: 1
                };

                // Cek apakah item sudah ada di cart
                const existingItemIndex = users[userIndex].cart.findIndex(
                    cartItem => cartItem.id === item.id &&
                        cartItem.selectedColor === item.color &&
                        cartItem.selectedSize === item.size
                );

                if (existingItemIndex >= 0) {
                    // Update quantity
                    users[userIndex].cart[existingItemIndex].quantity += 1;
                } else {
                    // Tambah item baru
                    users[userIndex].cart.push(cartItem);
                }

                successCount++;
                itemsToRemove.push(item.key);
            }

            // Simpan ke localStorage
            localStorage.setItem('users', JSON.stringify(users));

            // Update user di localStorage
            const updatedUser = { ...userData, cart: users[userIndex].cart };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            // Hapus item dari wishlist
            const updatedWishlist = wishlistItems.filter(item => !itemsToRemove.includes(item.key));
            setWishlistItems(updatedWishlist);
            saveWishlistToStorage(updatedWishlist);

            if (successCount > 0) {
                message.success(`${successCount} items added to cart successfully!`);
            }

            // Dispatch event untuk update cart
            window.dispatchEvent(new CustomEvent('cartUpdated', {
                detail: users[userIndex].cart
            }));

            // Dispatch event untuk update wishlist
            window.dispatchEvent(new CustomEvent('wishlistUpdated', {
                detail: updatedWishlist
            }));

        } catch (error) {
            console.error('Error adding all to cart:', error);
            message.error('Gagal menambah semua ke cart');
        } finally {
            setUpdating(false);
        }
    };

    // Copy wishlist link to clipboard dengan fallback
    const handleCopyLink = () => {
        // Cek apakah di environment browser
        if (typeof window === 'undefined') return;

        // Cek apakah clipboard API tersedia
        if (navigator?.clipboard?.writeText) {
            navigator.clipboard.writeText(wishlistLink).then(() => {
                message.success('Wishlist link copied to clipboard!');
            }).catch(() => {
                // Fallback jika clipboard API gagal
                fallbackCopyText();
            });
        } else {
            // Fallback untuk browser yang tidak mendukung clipboard API
            fallbackCopyText();
        }
    };

    // Fallback copy method
    const fallbackCopyText = () => {
        try {
            const textarea = document.createElement('textarea');
            textarea.value = wishlistLink;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);

            textarea.select();
            textarea.setSelectionRange(0, 99999); // Untuk mobile

            const successful = document.execCommand('copy');
            document.body.removeChild(textarea);

            if (successful) {
                message.success('Wishlist link copied to clipboard!');
            } else {
                message.error('Failed to copy link');
            }
        } catch (err) {
            console.error('Copy failed:', err);
            message.error('Failed to copy link');
        }
    };

    const formatPrice = (price) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);

    const breadcrumbItems = [
        { title: <Link href="/">Home</Link> },
        { title: "Wishlist" }
    ];

    const columns = [
        {
            title: "",
            align: "center",
            render: (_, record) => (
                <CloseOutlined
                    style={{
                        cursor: updating ? 'not-allowed' : 'pointer',
                        color: "black",
                        fontSize: "20px",
                        opacity: updating ? 0.5 : 1
                    }}
                    onClick={() => !updating && handleDelete(record.key)}
                />
            )
        },
        {
            title: "Product",
            render: (_, record) => (
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <img
                        src={record.image}
                        className={styles.img_table}
                        alt={record.name}
                        style={{
                            width: '110px',
                            height: '150px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            backgroundColor: '#f5f5f5'
                        }}
                    />
                    <div>
                        <div style={{ fontWeight: "bold", fontSize: "20px", marginBottom: '5px' }}>
                            {record.name}
                        </div>
                        <div style={{ fontSize: "16px", color: "#555", marginBottom: '5px' }}>
                            Color : {record.color} | Size : {record.size}
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "Price",
            render: (_, record) => (
                <div>
                    <Text strong style={{ fontSize: "22px", color: "#3c1900" }}>
                        {formatPrice(record.price)}
                    </Text>
                </div>
            )
        },
        {
            title: "Date Added",
            render: (_, record) => (
                <div>
                    <div style={{ fontSize: "20px" }}>
                        {new Date(record.addedAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })}
                    </div>
                </div>
            )
        },
        {
            title: "Stock Status",
            render: (_, record) => (
                <Tag
                    color={record.inStock ? "green" : "red"}
                    style={{ fontSize: "20px", padding: "4px 12px" }}
                >
                    {record.inStock ? 'In Stock' : 'Out of Stock'}
                </Tag>
            )
        },
        {
            title: "Action",
            render: (_, record) => (
                <Button
                    type="primary"
                    onClick={() => handleAddToCart(record)}
                    loading={updating}
                    disabled={!record.inStock}
                    style={{
                        background: "#3c1900",
                        border: "none",
                        padding: "20px 25px",
                        fontSize: "20px",
                        height: "auto",
                        borderRadius: "0",
                        color: "white",
                        opacity: !record.inStock ? 0.5 : 1,
                        cursor: !record.inStock ? 'not-allowed' : 'pointer'
                    }}
                >
                    Add to Cart
                </Button>
            )
        }
    ];

    if (loading) {
        return (
            <div className={styles.page}>
                <div className={styles.container}>
                    <Title style={{ fontSize: isMobile ? "32px" : "48px" }}>Wishlist</Title>
                    <Breadcrumb items={breadcrumbItems} className={styles.breadcrumb} />
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
                <Title style={{ fontSize: isMobile ? "32px" : "48px" }} className={styles.title_bread}>Wishlist</Title>
                <Breadcrumb items={breadcrumbItems} className={styles.breadcrumb} />
            </div>

            <div className={styles.table_container}>
                {wishlistItems.length === 0 ? (
                    <div className={styles.emptyState}>
                        <HeartFilled style={{ fontSize: isMobile ? '48px' : '64px', color: '#ddd', marginBottom: '20px' }} />
                        <Title level={isMobile ? 4 : 3}>Your wishlist is empty</Title>
                        <Text type="secondary" style={{ fontSize: isMobile ? '14px' : '16px', marginBottom: '30px', display: 'block' }}>
                            Save your favorite items from shop and they will appear here!
                        </Text>
                        <Link href="/shop">
                            <Button
                                type="primary"
                                style={{
                                    background: "#3c1900",
                                    borderColor: "#3c1900",
                                    padding: isMobile ? "12px 24px" : "20px 40px",
                                    fontSize: isMobile ? "14px" : "16px",
                                    height: "auto"
                                }}
                            >
                                Browse Products
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <>
                        {isMobile ? (
                            // Mobile View - Card Layout
                            <div className={styles.mobileGrid}>
                                {wishlistItems.map((item) => (
                                    <Card key={item.key} className={styles.mobileCard}>
                                        <div className={styles.mobileCardHeader}>
                                            <CloseOutlined
                                                style={{
                                                    cursor: updating ? 'not-allowed' : 'pointer',
                                                    color: "black",
                                                    fontSize: "16px"
                                                }}
                                                onClick={() => !updating && handleDelete(item.key)}
                                            />
                                        </div>
                                        <div className={styles.mobileCardContent}>
                                            <img src={item.image} alt={item.name} className={styles.mobileImage} />
                                            <div className={styles.mobileDetails}>
                                                <div className={styles.mobileName}>{item.name}</div>
                                                <div className={styles.mobileVariants}>
                                                    Color: {item.color} | Size: {item.size}
                                                </div>
                                                <div className={styles.mobilePrice}>
                                                    <Text strong style={{ fontSize: "18px", color: "#3c1900" }}>
                                                        {formatPrice(item.price)}
                                                    </Text>
                                                </div>
                                                <div className={styles.mobileDate}>
                                                    Added: {new Date(item.addedAt).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                                </div>
                                                <Tag
                                                    color={item.inStock ? "green" : "red"}
                                                    style={{ fontSize: "12px", padding: "2px 8px", marginBottom: "10px" }}
                                                    className={styles.tag}
                                                >
                                                    {item.inStock ? 'In Stock' : 'Out of Stock'}
                                                </Tag>
                                                <Button
                                                    type="primary"
                                                    onClick={() => handleAddToCart(item)}
                                                    loading={updating}
                                                    disabled={!item.inStock}
                                                    className={styles.mobileAddButton}
                                                    style={{
                                                        background: "#3c1900",
                                                        border: "none",
                                                        fontSize: "14px",
                                                        height: "auto",
                                                        borderRadius: "0",
                                                        color: "white",
                                                        opacity: !item.inStock ? 0.5 : 1,
                                                        width: "100%",
                                                        padding: "10px"
                                                    }}
                                                >
                                                    Add to Cart
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            // Desktop View - Table
                            <Table
                                columns={columns}
                                dataSource={wishlistItems}
                                loading={updating}
                                pagination={false}
                            />
                        )}

                        <div className={styles.bot_container}>
                            <div className={styles.left_container}>
                                <Text className={styles.text_link}>Wishlist link:</Text>
                                <div className={styles.container_link}>
                                    <Input
                                        placeholder="https://www.example.com"
                                        value={wishlistLink}
                                        className={styles.input_container}
                                        readOnly
                                    />
                                    <Button
                                        type="primary"
                                        onClick={handleCopyLink}
                                        loading={updating}
                                        style={{
                                            background: "#3c1900",
                                            border: "none",
                                            padding: isMobile ? "10px 20px" : "20px 25px",
                                            fontSize: isMobile ? "14px" : "20px",
                                            height: "auto",
                                            borderRadius: "0",
                                            color: "white",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px"
                                        }}
                                    >
                                        Copy
                                    </Button>
                                </div>
                            </div>

                            <div className={styles.right_container}>
                                <Text
                                    className={styles.clear}
                                    onClick={handleClearWishlist}
                                    style={{ fontSize: isMobile ? "16px" : "24px" }}
                                >
                                    Clear Wishlist
                                </Text>
                                <Button
                                    type="primary"
                                    onClick={handleAddAllToCart}
                                    loading={updating}
                                    style={{
                                        background: "#3c1900",
                                        border: "none",
                                        padding: isMobile ? "10px 20px" : "20px 25px",
                                        fontSize: isMobile ? "14px" : "20px",
                                        height: "auto",
                                        borderRadius: "0",
                                        color: "white",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px"
                                    }}
                                >
                                    Add All to Cart
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>
            <Support />
        </div>
    );
}
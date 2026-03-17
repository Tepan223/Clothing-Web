'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { products } from '@/app/data/data-product'
import styles from '../../style/detail-products.module.css'
import { Typography, Breadcrumb, Rate, Divider, Button, message } from "antd";
import { LeftOutlined, RightOutlined, TwitterOutlined, LinkedinFilled, PinterestFilled, FacebookFilled, HeartOutlined, HeartFilled, PlusOutlined, MinusOutlined, CloseOutlined } from "@ant-design/icons";
import Link from "next/link";
import Support from "@/app/components/support";
import Tabs from '../../section/tabs-detail'
import Relate from '../../section/relate-product'

const { Title, Text, Paragraph } = Typography;

export default function ProductDetail() {
    const params = useParams()
    const router = useRouter()

    const product = products.find(
        (item) => item.id === Number(params.id)
    )

    const [selectedColor, setSelectedColor] = useState("Brown")
    const [selectedSize, setSelectedSize] = useState("M")
    const [quantity, setQuantity] = useState(1)
    const [liked, setLiked] = useState(false)
    const [wishlistLoading, setWishlistLoading] = useState(false)
    const [cartLoading, setCartLoading] = useState(false)
    const [user, setUser] = useState(null)

    // Cek user login dan status wishlist
    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            const userData = JSON.parse(userStr);
            setUser(userData);
            checkWishlistStatus(userData.id);
        }
    }, [params.id]);

    const checkWishlistStatus = (userId) => {
        if (!userId || !product) return;

        try {
            // Ambil data users dari localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const currentUser = users.find(u => u.id === userId);

            if (currentUser && currentUser.wishlist) {
                // Cek apakah product dengan color dan size yang sama ada di wishlist
                const isInWishlist = currentUser.wishlist.some(
                    item => item.id === product.id &&
                        item.selectedColor === selectedColor &&
                        item.selectedSize === selectedSize
                );
                setLiked(isInWishlist);
            } else {
                setLiked(false);
            }
        } catch (error) {
            console.error('Error checking wishlist:', error);
            setLiked(false);
        }
    };

    // Update status wishlist ketika color/size berubah
    useEffect(() => {
        if (user) {
            checkWishlistStatus(user.id);
        }
    }, [selectedColor, selectedSize]);

    if (!product) {
        return <h1>Product Not Found</h1>
    }

    const colors = [
        { name: "Brown", className: styles.brown },
        { name: "Green", className: styles.green },
        { name: "Red", className: styles.red },
        { name: "Blue", className: styles.blue },
    ]

    const sizes = ["S", "M", "L", "XL", "XXL"]

    const breadcrumbItems = [
        { title: <Link href="/">Home</Link> },
        { title: <Link href="/shop">Shop</Link> },
        { title: product.label },
        { title: "Product Details"},
    ];

    const increaseQty = () => setQuantity(quantity + 1)
    const decreaseQty = () => {
        if (quantity > 1) setQuantity(quantity - 1)
    }

    // Toggle Wishlist - TETAP BISA walaupun out of stock
    const handleToggleWishlist = () => {
        try {
            // Cek login
            const userStr = localStorage.getItem("user");
            if (!userStr) {
                message.warning('Silakan login terlebih dahulu');
                router.push(`/sign-in?redirect=/shop/product-details/${product.id}`);
                return;
            }

            const userData = JSON.parse(userStr);
            setWishlistLoading(true);

            // Ambil data users dari localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const userIndex = users.findIndex(u => u.id === userData.id);

            if (userIndex === -1) {
                message.error('User tidak ditemukan');
                setWishlistLoading(false);
                return;
            }

            // Inisialisasi wishlist jika belum ada
            if (!users[userIndex].wishlist) {
                users[userIndex].wishlist = [];
            }

            // Data produk untuk wishlist dengan informasi lengkap
            const wishlistItem = {
                id: product.id,
                name: product.title,
                title: product.title,
                price: product.price,
                oldPrice: product.oldPrice,
                image: product.image || '/images/default-product.jpg',
                category: product.label,
                rating: product.rating,
                review: product.review,
                sku: product.sku,
                tags: product.tags,
                inStock: product.inStock,
                selectedColor: selectedColor,
                selectedSize: selectedSize,
                quantity: quantity,
                addedAt: new Date().toISOString()
            };

            // Cek apakah item sudah ada di wishlist
            const existingIndex = users[userIndex].wishlist.findIndex(
                item => item.id === product.id &&
                    item.selectedColor === selectedColor &&
                    item.selectedSize === selectedSize
            );

            let isInWishlist;

            if (existingIndex >= 0) {
                // Hapus dari wishlist
                users[userIndex].wishlist.splice(existingIndex, 1);
                isInWishlist = false;
                message.success(`Produk dihapus dari wishlist (${selectedColor}, ${selectedSize})`);
            } else {
                // Tambah ke wishlist
                users[userIndex].wishlist.push(wishlistItem);
                isInWishlist = true;
                message.success(`Produk ditambahkan ke wishlist (${selectedColor}, ${selectedSize})`);
            }

            // Simpan ke localStorage
            localStorage.setItem('users', JSON.stringify(users));
            setLiked(isInWishlist);

            // Update user di localStorage
            const updatedUser = { ...userData, wishlist: users[userIndex].wishlist };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);

            // Dispatch event untuk update wishlist di komponen lain
            window.dispatchEvent(new CustomEvent('wishlistUpdated', {
                detail: users[userIndex].wishlist
            }));

        } catch (error) {
            console.error('Error toggling wishlist:', error);
            message.error('Terjadi kesalahan. Silakan coba lagi');
        } finally {
            setWishlistLoading(false);
        }
    };

    // Add to Cart - TIDAK BISA jika out of stock
    const handleAddToCart = () => {
        // CEK STOCK: Jika out of stock, tampilkan pesan dan return
        if (product.inStock === false) {
            message.warning('Produk sedang tidak tersedia (Out of Stock)');
            return;
        }

        try {
            const userStr = localStorage.getItem("user");
            if (!userStr) {
                message.warning('Silakan login terlebih dahulu');
                router.push(`/sign-in?redirect=/shop/product-details/${product.id}`);
                return;
            }

            const userData = JSON.parse(userStr);
            setCartLoading(true);

            // Ambil data users dari localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const userIndex = users.findIndex(u => u.id === userData.id);

            if (userIndex === -1) {
                message.error('User tidak ditemukan');
                setCartLoading(false);
                return;
            }

            // Inisialisasi cart jika belum ada
            if (!users[userIndex].cart) {
                users[userIndex].cart = [];
            }

            const cartItem = {
                id: product.id,
                name: product.title,
                price: product.price,
                image: product.image || '/images/default-product.jpg',
                selectedColor,
                selectedSize,
                quantity
            };

            // Cek apakah item dengan color dan size yang sama sudah ada di cart
            const existingItemIndex = users[userIndex].cart.findIndex(
                item => item.id === product.id &&
                    item.selectedColor === selectedColor &&
                    item.selectedSize === selectedSize
            );

            if (existingItemIndex >= 0) {
                // Update quantity jika sudah ada
                users[userIndex].cart[existingItemIndex].quantity += quantity;
            } else {
                // Tambah item baru
                users[userIndex].cart.push(cartItem);
            }

            // Simpan ke localStorage
            localStorage.setItem('users', JSON.stringify(users));

            // Update user di localStorage
            const updatedUser = { ...userData, cart: users[userIndex].cart };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);

            message.success(`Produk ditambahkan ke cart (${selectedColor}, ${selectedSize})`);

            // Dispatch event untuk update cart di komponen lain
            window.dispatchEvent(new CustomEvent('cartUpdated', {
                detail: users[userIndex].cart
            }));

        } catch (error) {
            console.error('Error adding to cart:', error);
            message.error('Terjadi kesalahan. Silakan coba lagi');
        } finally {
            setCartLoading(false);
        }
    };

    // Buy Now - TIDAK BISA jika out of stock
    const handleBuyNow = async () => {
        // CEK STOCK: Jika out of stock, tampilkan pesan dan return
        if (product.inStock === false) {
            message.warning('Produk sedang tidak tersedia (Out of Stock)');
            return;
        }

        // Cek login
        const userStr = localStorage.getItem("user");
        if (!userStr) {
            message.warning('Silakan login terlebih dahulu');
            router.push(`/sign-in?redirect=/shop/product-details/${product.id}`);
            return;
        }

        // Tambah ke cart dulu
        handleAddToCart();

        // Redirect ke cart setelah 500ms (kasih waktu untuk cart update)
        setTimeout(() => {
            router.push('/cart');
        }, 500);
    };

    // Clear selected (reset ke default)
    const handleClear = () => {
        setSelectedColor("Brown");
        setSelectedSize("M");
        setQuantity(1);
        message.info('Reset to default');
    };

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <Title style={{fontSize: "48px"}} className={styles.title_bread}>Product Details</Title>
                <Breadcrumb items={breadcrumbItems} className={styles.breadcrumb}/>
            </div>
            <div className={styles.main_container}>
                <div className={styles.left_container}>
                    <div className={styles.image_swiper}>
                        <div className={styles.btn_swiper}>
                            <Button className={styles.btn_swp} style={{color:"black", background:"#f6ad55"}}><LeftOutlined /></Button>
                            <Button className={styles.btn_swp}><RightOutlined /></Button>
                        </div>
                    </div>
                    <div className={styles.img_child}>
                        <div className={styles.image_sub} style={{background:"red"}}></div>
                        <div className={styles.image_sub} style={{background:"blue"}}></div>
                        <div className={styles.image_sub} style={{background:"yellow"}}></div>
                        <div className={styles.image_sub} style={{background:"green"}}></div>
                    </div>
                </div>
                <div className={styles.right_container}>
                    <Text type="secondary" className={styles.label}>{product.label}</Text>
                    <Title className={styles.title_main}>{product.title}</Title>
                    <div className={styles.rate_container}>
                        <Rate disabled allowHalf value={product.rating} className={styles.star}/>
                        <Text className={styles.text_rate}>
                            {product.rating} ({product.review})
                        </Text>
                    </div>
                    <div className={styles.price_container}>
                        <Text className={styles.price} >${product.price}.00</Text>
                        <Text delete type="secondary" className={styles.price}>
                            ${product.oldPrice}.00
                        </Text>
                    </div>
                    <Paragraph className={styles.desc}>{product.desc}</Paragraph>
                    <div className={styles.section}>
                        <Text strong className={styles.text}>Color : <span style={{ color: '#3c1900', fontWeight: 'bold' }}>{selectedColor}</span></Text>
                        <div className={styles.color_container}>
                            {colors.map((color) => (
                                <div
                                    key={color.name}
                                    onClick={() => setSelectedColor(color.name)}
                                    className={`
                                        ${styles.color_circle}
                                        ${color.className}
                                        ${selectedColor === color.name ? styles.active_color : ""}
                                    `}
                                    title={color.name}
                                />
                            ))}
                        </div>
                    </div>
                    <div className={styles.section}>
                        <Text strong className={styles.text}>Size : <span style={{ color: '#3c1900', fontWeight: 'bold' }}>{selectedSize}</span></Text>
                        <div className={styles.size_container}>
                            {sizes.map((size) => (
                                <Button
                                    key={size}
                                    type={selectedSize === size ? "primary" : "default"}
                                    onClick={() => setSelectedSize(size)}
                                    className={styles.btn_size}
                                    style={{
                                        color: selectedSize === size ? "white" : "black",
                                        background: selectedSize === size ? "#3c1900" : "white",
                                        borderColor: selectedSize === size ? "#3c1900" : "#d9d9d9"
                                    }}
                                >
                                    {size}
                                </Button>
                            ))}
                        </div>
                        <Text className={styles.guide}>View Size Guide</Text>
                    </div>
                    <div className={styles.stock}>
                        <Text
                            className={styles.clear}
                            onClick={handleClear}
                            style={{ cursor: 'pointer' }}
                        >
                            Clear <CloseOutlined />
                        </Text>
                        <div className={styles.stock_label} style={{
                            color: product.inStock ? '#52c41a' : '#f5222d',
                            background: product.inStock ? '#f6ffed' : '#fff1f0',
                            border: product.inStock ? '#f6ffed' : '#fff1f0',
                        }}>
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </div>
                    </div>
                    <div className={styles.action_container}>
                        <div className={styles.quantity_container}>
                            <Button
                                onClick={decreaseQty}
                                className={styles.btn_qty}
                                disabled={quantity <= 1 || product.inStock === false}
                            >
                                <MinusOutlined />
                            </Button>
                            <Text className={styles.text_qty}>{quantity}</Text>
                            <Button
                                onClick={increaseQty}
                                className={styles.btn_qty}
                                disabled={product.inStock === false}
                            >
                                <PlusOutlined />
                            </Button>
                        </div>
                        <Button
                            className={styles.add_btn}
                            style={{
                                color: product.inStock ? "white" : "#999",
                                background: product.inStock ? "#3c1900" : "#f0f0f0",
                                border: product.inStock ? "none" : "1px solid #d9d9d9",
                                cursor: product.inStock ? "pointer" : "not-allowed"
                            }}
                            onClick={handleAddToCart}
                            loading={cartLoading}
                            disabled={product.inStock === false || cartLoading}
                        >
                            Add To Cart
                        </Button>
                        <Button
                            className={styles.buy_btn}
                            style={{
                                background: product.inStock ? "#f6ad55" : "#f0f0f0",
                                color: product.inStock ? "Black" : "#999",
                                border: product.inStock ? "none" : "1px solid #d9d9d9",
                                cursor: product.inStock ? "pointer" : "not-allowed"
                            }}
                            onClick={handleBuyNow}
                            loading={cartLoading}
                            disabled={product.inStock === false || cartLoading}
                        >
                            Buy Now
                        </Button>
                        <Button
                            className={styles.like_btn}
                            icon={liked ?
                                <HeartFilled style={{color:"red"}}/> :
                                <HeartOutlined style={{color:"black"}}/>
                            }
                            onClick={handleToggleWishlist}
                            loading={wishlistLoading}
                            style={{
                                border: liked ? '1px solid red' : '1px solid #d9d9d9',
                                backgroundColor: liked ? '#fff0f0' : 'white'
                            }}
                        />
                    </div>

                    <Divider/>
                    <div className={styles.bot_container}>
                        <Text className={styles.text_bot}>
                            <span>SKU</span> : {product.sku || 'N/A'}
                        </Text>
                        <Text className={styles.text_bot}>
                            <span>Tags</span> : {product.tags?.join(", ") || 'No tags'}
                        </Text>
                        <Text className={styles.text_bot}>
                            <span>Share</span> :
                            <FacebookFilled style={{fontSize:"24px", marginLeft:"10px", color:"#3b5998"}}/>
                            <PinterestFilled style={{fontSize:"24px", marginLeft:"10px", color:"#bd081c"}}/>
                            <LinkedinFilled style={{fontSize:"24px", marginLeft:"10px", color:"#0077b5"}}/>
                            <TwitterOutlined style={{fontSize:"24px", marginLeft:"10px", color:"#1da1f2"}}/>
                        </Text>
                    </div>
                </div>
            </div>
            <Tabs/>
            <Relate/>
            <Support />
        </div>
    );
}
'use client'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../style/relate-product.module.css";
import { Typography, Card } from "antd";
import { StarFilled } from "@ant-design/icons";
import { products } from "@/app/data/data-product";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';

const { Text, Title } = Typography;

const formatPrice = (price) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
    }).format(price);

export default function Sec3() {
    const router = useRouter();
    const [active, setActive] = useState("All");
    const [randomProducts, setRandomProducts] = useState([]);

    const shuffleProducts = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    useEffect(() => {
        const filtered = active === "All"
            ? products
            : products.filter((item) => item.category === active);

        const shuffled = shuffleProducts(filtered);
        setRandomProducts(shuffled.slice(0, 9));
    }, [active]);

    const handleCardClick = (productId) => {
        router.push(`/shop/product-details/${productId}`);
    };

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <Text style={{ fontSize: "30px" }} className={styles.headline}>Related Products</Text>
                <Title style={{ fontSize: "60px", marginTop: "15px" }} className={styles.title}>
                    Explore Related Products
                </Title>

                <div className={styles.main_container}>
                    <Swiper
                        spaceBetween={0}
                        slidesPerView={3}
                        grabCursor={true}
                        breakpoints={{
                            0: {
                                slidesPerView: 1
                            },
                            1024: {
                                slidesPerView: 3
                            }
                        }}
                    >
                        {randomProducts.map((product) => (
                            <SwiperSlide key={`${product.id}-${Math.random()}`}>
                                <Card
                                    className={styles.card}
                                    hoverable
                                    onClick={() => handleCardClick(product.id)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div
                                        className={styles.gambar}
                                        style={{
                                            backgroundImage: `url(${product.image})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center'
                                        }}
                                    />
                                    <div className={styles.container_text}>
                                        <div className={styles.left_container}>
                                            <Text className={styles.category}>
                                                {product.label}
                                            </Text>
                                            <Title level={4} className={styles.title_card}>
                                                {product.title}
                                            </Title>
                                            <div className={styles.price}>
                                                <Title level={5} className={styles.price_card}>
                                                    {formatPrice(product.price)}
                                                </Title>
                                                <Text delete className={styles.discount_card}>
                                                    {formatPrice(product.oldPrice)}
                                                </Text>
                                            </div>
                                        </div>
                                        <div className={styles.right_container}>
                                            <StarFilled style={{ color: "orange" }}/>
                                            {product.rating}
                                        </div>
                                    </div>
                                </Card>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </div>
    );
}
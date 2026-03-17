'use client'
import { useState } from "react";
import styles from "../../styles/sec3.module.css";
import { Typography, Button, Card } from "antd";
import { StarFilled } from "@ant-design/icons";
import { products } from "@/app/data/data-product";
// Import Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/autoplay';

const { Text, Title } = Typography;

const categoriesBtn = ["All", "Women", "Men", "Accessories"];

const formatPrice = (price) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
    }).format(price);

export default function Sec3() {
    const [active, setActive] = useState("All");

    const filteredProducts =
        active === "All"
            ? products
            : products.filter((item) => item.category === active);

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.top_contain}>
                    <Text className={styles.headline}>Our Products</Text>
                    <div className={styles.top_container}>
                        <Title style={{ fontSize: "60px", margin: 0 }} className={styles.title}>
                            Our Top Seller Products
                        </Title>
                        <div className={styles.top_btn}>
                            {categoriesBtn.map((item) => (
                                <Button
                                    key={item}
                                    className={`${styles.btn_link} ${
                                        active === item ? styles.active_btn : ""
                                    }`}
                                    onClick={() => setActive(item)}>
                                    {item}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={styles.main_container}>
                    <Swiper
                        slidesPerView={3}
                        grabCursor={true}
                        breakpoints={{
                            0: {
                                slidesPerView: 1
                            },
                            720: {
                                slidesPerView: 2
                            },
                            1024: {
                                slidesPerView: 3
                            }
                        }}
                    >
                        {filteredProducts.map((product) => (
                            <SwiperSlide key={product.id}>
                                <Card className={styles.card} hoverable>
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
                                            <StarFilled style={{ color: "orange" }} />
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
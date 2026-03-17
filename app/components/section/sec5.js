'use client'
import styles from "../../styles/sec5.module.css";
import { Typography, Card, Button } from "antd";
import { HeartOutlined, ArrowRightOutlined, FullscreenOutlined, ShoppingOutlined, StarFilled } from "@ant-design/icons";
import { products } from "@/app/data/data-product";
// Import Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/autoplay';

const promoCards = [
    {
        id: 1,
        discount: "Flat 20% Discount",
        title: "Men’s Latest Collection",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
        buttonColor: "#E5B454",
        backgroundColor: "#F5F5F5",
        textColor: "#000",
        image: "/sec5-1.png",
    },
    {
        id: 2,
        discount: "Flat 25% Discount",
        title: "Women’s Latest Fashion",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
        buttonColor: "#3c1800",
        backgroundColor: "#E5B454",
        textColor: "#000",
        image: "/sec5-2.png",
    },
];

const { Title, Paragraph, Text } = Typography;

export default function Sec5() {
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.top_container}>
                    <Text className={styles.headline}>Today Deals</Text>
                    <div className={styles.bot_top_container}>
                        <Title level={1} className={styles.title_top_container}>
                            Deals of the Day
                        </Title>
                        <Paragraph className={styles.desc_top_container}>
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                            <br />
                            accusantium doloremque laudantium, totam rem aperiam,
                        </Paragraph>
                    </div>
                </div>

                {/* Swiper untuk products */}
                <div className={styles.mid_container}>
                    <Swiper
                        slidesPerView={2}
                        grabCursor={true}
                        breakpoints={{
                            0: {
                                slidesPerView: 1
                            },
                            720: {
                                slidesPerView: 2
                            }
                        }}
                    >
                        {products.map((item) => (
                            <SwiperSlide key={item.id}>
                                <Card className={styles.card_1}>
                                    <div className={styles.card_container}>
                                        <div className={styles.left_container_card}>
                                            <div
                                                className={styles.background_img}
                                                style={{
                                                    backgroundImage: `url(${item.image})`,
                                                    backgroundSize: "cover",
                                                    backgroundPosition: "center",
                                                }}
                                            >
                                                <div className={styles.discount_label}>
                                                    {item.discount}% off
                                                </div>
                                                <div className={styles.icon_container}>
                                                    <div className={styles.icon}>
                                                        <HeartOutlined />
                                                    </div>
                                                    <div className={styles.icon}>
                                                        <FullscreenOutlined />
                                                    </div>
                                                    <div className={styles.icon}>
                                                        <ShoppingOutlined />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.right_container_card}>
                                            <div>
                                                <Text className={styles.category}>
                                                    {item.category}
                                                </Text>
                                                <Title level={3} className={styles.title_mid}>
                                                    {item.title}
                                                </Title>
                                            </div>
                                            <div className={styles.discount_text}>
                                                <Text className={styles.price}>
                                                    ${item.price}.00
                                                </Text>
                                                <Text delete className={styles.discount_price}>
                                                    ${item.oldPrice}.00
                                                </Text>
                                            </div>
                                            <Text className={styles.rate}>
                                                <StarFilled style={{ color: "#f6ad55" }} />{" "}
                                                {item.rating}
                                            </Text>
                                            <Paragraph className={styles.desc_mid}>
                                                {item.description}
                                            </Paragraph>
                                            <Button
                                                className={styles.btn_mid}
                                                style={{ color: "#3c1800", border: "none" }}
                                                href="/shop"
                                            >
                                                Shop Now <ArrowRightOutlined />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* Promo Cards dengan class img_promo berbeda */}
                <div className={styles.bot_container}>
                    <div className={styles.bot_container}>
                        {promoCards.map((item, index) => (
                            <Card
                                key={item.id}
                                className={styles.bot_card}
                                style={{ backgroundColor: item.backgroundColor }}
                            >
                                <div className={styles.card_bot}>
                                    <div className={styles.left}>
                                        <Text
                                            className={styles.discount_bot}
                                            style={{ color: item.textColor }}
                                        >
                                            {item.discount}
                                        </Text>
                                        <Title
                                            level={1}
                                            className={styles.title_bot}
                                            style={{ color: item.textColor }}
                                        >
                                            {item.title}
                                        </Title>
                                        <Paragraph
                                            className={styles.desc_bot}
                                            style={{ color: item.textColor }}
                                        >
                                            {item.description}
                                        </Paragraph>
                                        <Button
                                            href="/shop"
                                            style={{
                                                backgroundColor: item.buttonColor,
                                                color: "#fff",
                                                border: "none",
                                            }}
                                            className={styles.btn_bot}
                                        >
                                            Shop Now <ArrowRightOutlined />
                                        </Button>
                                    </div>
                                    <div className={styles.right}>
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className={index === 0 ? styles.img_promo1 : styles.img_promo2}
                                        />
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
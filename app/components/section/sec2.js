'use client'
import styles from "../../styles/sec2.module.css";
import { TruckOutlined, WalletOutlined, CustomerServiceOutlined } from '@ant-design/icons';
import { Typography, Card } from "antd";

const { Title, Text } = Typography;

const features = [
    {
        icon: <TruckOutlined />,
        title: "Free Shipping",
        text: "Free shipping for order above $180"
    },
    {
        icon: <WalletOutlined />,
        title: "Secure Payment",
        text: "Multi secure payment options"
    },
    {
        icon: <CustomerServiceOutlined />,
        title: "24/7 Support",
        text: "We support online all days"
    }
];

const categories = [
    {
        label: "2500+",
        title: "For Women's",
        image: "/sec2-1.png",
        imgClass: "img_women",
        description: (
            <>
                Lorem ipsum dolor sit amet,<br />
                Consectetur adipiscing elit, sed do
            </>
        ),
        items: [
            "Blazers",
            "T-Shirts and Blouses",
            "Dresses",
            "Jackets & Coats",
            "Jeans",
            "Knit",
            "Sarees"
        ]
    },
    {
        label: "1500+",
        title: "For Men's",
        image: "/sec2-2.png",
        imgClass: "img_men",
        items: [
            "Blazers",
            "T-Shirts and Shirts",
            "Jackets & Coats",
            "Jeans"
        ]
    },
    {
        label: "800+",
        title: "Accessories",
        image: "/sec2-3.png",
        imgClass: "img_accessories",
        items: [
            "Handbags",
            "Watches",
            "Shoes",
            "Belts"
        ]
    }
];

export default function Sec2() {
    return (
        <div className={styles.page}>
            <div className={styles.container}>

                {/* FEATURES */}
                <div className={styles.top_container}>
                    {features.map((item, index) => (
                        <div key={index} className={styles.card}>
                            <div className={styles.icon}>
                                {item.icon}
                            </div>
                            <div>
                                <Title level={4} className={styles.text_top}>
                                    {item.title}
                                </Title>

                                <Text type="secondary">
                                    {item.text}
                                </Text>
                            </div>
                        </div>
                    ))}
                </div>
                <div className={styles.main_container}>
                    <div className={styles.left_container}>
                        <Card
                            className={styles.card_left}
                            cover={
                                <img
                                    src={categories[0].image}
                                    alt={categories[0].title}
                                    className={`${styles.card_img} ${styles[categories[0].imgClass]}`}
                                />
                            }
                        >
                            <div className={styles.card_container}>

                                <div className={styles.label}>
                                    <Text className={styles.label_text}>
                                        <span>{categories[0].label}</span> Items
                                    </Text>
                                </div>
                                <Title level={2} className={styles.title}>
                                    {categories[0].title}
                                </Title>
                                <div className={styles.text_container_main}>
                                    <Text className={styles.description}>
                                        {categories[0].description}
                                    </Text>
                                    {categories[0].items.map((item) => (
                                        <Text key={item} className={styles.item_text}>
                                            {item}
                                        </Text>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </div>
                    <div className={styles.right_container}>
                        {categories.slice(1).map((cat) => (
                            <Card
                                key={cat.title}
                                className={styles.card_right}
                                cover={
                                    <img
                                        src={cat.image}
                                        alt={cat.title}
                                        className={`${styles.card_img} ${styles[cat.imgClass]}`}
                                    />
                                }
                            >
                                <div className={styles.card_container}>
                                    <div className={styles.label}>
                                        <Text className={styles.label_text}>
                                            <span>{cat.label}</span> Items
                                        </Text>
                                    </div>
                                    <Title level={2} className={styles.title}>
                                        {cat.title}
                                    </Title>
                                    <div className={styles.text_container_main}>
                                        {cat.items.map((item) => (
                                            <Text key={item} className={styles.item_text}>
                                                {item}
                                            </Text>
                                        ))}
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
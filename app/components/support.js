'use client'
import styles from "../styles/support.module.css";
import { Typography } from "antd";
import { }from "@ant-design/icons"
import { TruckOutlined, WalletOutlined, CustomerServiceOutlined } from '@ant-design/icons';


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

const {Title, Text, Paragraph} = Typography
export default function Support() {
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.top_container}>
                    {features.map((item, index) => (
                        <div key={index} className={styles.card}>
                            <div className={styles.icon}>
                                {item.icon}
                            </div>
                            <div>
                                <Title level={1} className={styles.text_top}>
                                    {item.title}
                                </Title>
                                <Text type="secondary" className={styles.text_top}>
                                    {item.text}
                                </Text>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

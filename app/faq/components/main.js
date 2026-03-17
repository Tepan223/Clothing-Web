'use client'
import { useState } from "react";
import styles from "../styles/main.module.css";
import { Typography, Button, Collapse } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";

const faq = [
    "General Information",
    "Ordering & Shipping",
    "Returns & Exchanges",
    "Payments & Discounts",
    "Account & Profile"
]

const faqData = [
    {
        key: "1",
        label: "How can I place an order?",
        children:
            "You can place an order by selecting your desired products, adding them to the cart, and proceeding to checkout.",
    },
    {
        key: "2",
        label: "What payment methods do you accept?",
        children:
            "We accept credit cards, debit cards, PayPal, and other secure payment methods.",
    },
    {
        key: "3",
        label: "Can I track my order after it’s been placed?",
        children:
            "Yes, after your order is shipped, you will receive a tracking number via email.",
    },
    {
        key: "4",
        label: "Do you offer customer support?",
        children:
            "Yes, our customer support team is available 24/7 via email and live chat.",
    },
    {
        key: "5",
        label: "What is your return policy?",
        children:
            "We offer a 30-day return policy for unused and original-condition products.",
    },
    {
        key: "6",
        label: "How to Create Account?",
        children:
            "Click on the Sign Up button and fill in your personal details to create an account.",
    },
];

const {Title, Text, Paragraph} = Typography
export default function Faq() {
    const [activeIndex, setActiveIndex] = useState(null);
    return (
        <div className={styles.main}>
            <div className={styles.left_container}>
                {faq.map((faq,index) => (
                    <Button
                        key={index}
                        className={`${styles.btn_left} ${
                            activeIndex === index ? styles.active : ""
                        }`}
                        onClick={() => setActiveIndex(index)}
                        style={{ color: "black" }}
                    >
                        {faq}
                    </Button>
                ))}
            </div>
            <div className={styles.right_container}>
                <Collapse
                    accordion
                    bordered={false}
                    expandIconPlacement="end"
                    expandIcon={({ isActive }) =>
                        isActive ? <MinusOutlined /> : <PlusOutlined />
                    }
                    items={faqData}
                    className={styles.faqCollapse}
                />
            </div>
        </div>
    );
}

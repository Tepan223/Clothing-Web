'use client'
import styles from "../styles/footer.module.css";
import { Typography, Divider } from "antd";
import {
    FacebookFilled,
    InstagramFilled,
    TwitterOutlined,
    YoutubeFilled,
    DownOutlined
} from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

export default function Footer() {

    const companyLinks = [
        { label: "About Us", href: "/about" },
        { label: "Blog", href: "/blog" },
        { label: "Contact Us", href: "/contact" },
        { label: "Career", href: "#" },
    ];

    const customerLinks = [
        { label: "My Account", href: "/account" },
        { label: "Track Your Order", href: "/track" },
        { label: "Return", href: "#" },
        { label: "FAQ", href: "/faq" },
    ];

    const infoLinks = [
        { label: "Privacy", href: "#" },
        { label: "User Terms & Condition", href: "#" },
        { label: "Return Policy", href: "#" },
    ];

    const contactInfo = [
        "+0123-456-789",
        "example@gmail.com",
        "8502 Preston Rd. Inglewood, Maine 98380",
    ];

    const socialIcons = [
        <FacebookFilled key="fb" />,
        <InstagramFilled key="ig" />,
        <TwitterOutlined key="tw" />,
        <YoutubeFilled key="yt" />,
    ];

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.main_container}>
                    <div className={styles.left_container}>
                        <Title level={3} className={styles.logo}>
                            Clothing<span>.</span>
                        </Title>
                        <Text className={styles.desc}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing<br/>elit,
                            sed do eiusmod tempor incididunt ut labore et <br/>dolore magna aliqua. Ut enim ad minim veniam
                        </Text>
                        <div className={styles.icon_container}>
                            {socialIcons.map((icon, index) => (
                                <div key={index} className={styles.icon}>
                                    {icon}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={styles.center_container}>
                        <Title level={2} className={styles.title}>Company</Title>
                        {companyLinks.map((item, index) => (
                            <a key={index} href={item.href} className={styles.link}>
                                {item.label}
                            </a>
                        ))}
                    </div>
                    <div className={styles.center_container}>
                        <Title level={2} className={styles.title}>Customer Services</Title>
                        {customerLinks.map((item, index) => (
                            <a key={index} href={item.href} className={styles.link}>
                                {item.label}
                            </a>
                        ))}
                    </div>
                    <div className={styles.center_container}>
                        <Title level={2} className={styles.title}>Our Information</Title>
                        {infoLinks.map((item, index) => (
                            <a key={index} href={item.href} className={styles.link}>
                                {item.label}
                            </a>
                        ))}
                    </div>
                    <div className={styles.right_container}>
                        <Title level={2} className={styles.title}>Contact Info</Title>
                        {contactInfo.map((item, index) => (
                            <Text key={index} className={styles.contact}>
                                {item}
                            </Text>
                        ))}
                    </div>
                </div>
                <Divider style={{border:"1 solid white"}}/>
                <div className={styles.bot_container}>
                    <Text className={styles.copy}>
                        Copyright © 2024 Clothing Website Design. All Rights Reserved.
                    </Text>
                    <div className={styles.translate}>
                        <Text className={styles.lang}>English <DownOutlined /></Text>
                        <span>|</span>
                        <Text className={styles.lang}>USD <DownOutlined /></Text>
                    </div>
                </div>
            </div>
        </div>
    );
}
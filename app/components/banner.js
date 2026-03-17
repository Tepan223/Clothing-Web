'use client'
import { useState } from 'react';
import styles from '../styles/Banner.module.css'
import { Typography } from "antd";
import { CloseOutlined } from '@ant-design/icons';

const { Text } = Typography;

export default function Banner() {
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = () => {
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className={styles.container}>
            <Text className={styles.contact_text}>Support (406) 555-0120</Text>
            <Text className={styles.mid_text}>
                Sign up and <span>GET 25% OFF</span> for your first order. <a href="/sign-up">Sign up now</a>
            </Text>
            <CloseOutlined
                className={styles.icon}
                onClick={handleClose}
                style={{ cursor: 'pointer' }}
            />
        </div>
    );
}
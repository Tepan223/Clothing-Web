'use client'
import styles from "./style/shop.module.css";
import { Typography, Breadcrumb } from "antd";
import Link from "next/link";
import Main from './section/main'
import Support from '../components/support'

const { Title } = Typography;

export default function Shop() {

    const breadcrumbItems = [
        {
            title: <Link href="/">Home</Link>,
        },
        {
            title: "Shop",
        },
    ];

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <Title level={1} style={{ fontSize: "60px" }} className={styles.title_bread}>
                    Shop
                </Title>
                <Breadcrumb
                    items={breadcrumbItems}
                    className={styles.breadcrumb}
                />
            </div>
            <Main/>
            <Support/>
        </div>

    );
}
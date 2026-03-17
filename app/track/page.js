'use client'
import styles from "../track/styles/track.module.css";
import {Breadcrumb, Typography} from "antd";
import { }from "@ant-design/icons"
import Link from "next/link";
import Support from '../components/support'
import Main from './components/main'

const {Title, Text, Paragraph} = Typography

const breadcrumbItems = [
    {
        title: <Link href="/">Home</Link>,
    },
    {
        title: "Track Your Order",
    },
];

export default function Track() {
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <Title level={1} style={{ fontSize: "60px" }} className={styles.title_bread}>
                    Track Your Order
                </Title>
                <Breadcrumb
                    items={breadcrumbItems}
                    className={styles.breadcrumb}
                />
            </div>
            <div className={styles.main_container}>
                <Main/>
            </div>
            <Support/>
        </div>
    );
}

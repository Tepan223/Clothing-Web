'use client'
import styles from "../faq/styles/faq.module.css";
import {Breadcrumb, Typography} from "antd";
import { }from "@ant-design/icons"
import Link from "next/link";
import Main from  "./components/main"
import Support from "../components/support"

const breadcrumbItems = [
    {
        title: <Link href="/">Home</Link>,
    },
    {
        title: "FAQs",
    },
];

const {Title, Text, Paragraph} = Typography
export default function Shop() {
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <Title level={1} style={{ fontSize: "60px" }} className={styles.title_bread}>
                    FAQs
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

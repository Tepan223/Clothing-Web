'use client'
import styles from "../about/styles/about.module.css";
import {Breadcrumb, Typography} from "antd";
import { }from "@ant-design/icons"
import Link from "next/link";
import Main from "./components/main"
import Support from  "../components/support"
import Team from "./components/team"

const breadcrumbItems = [
    {
        title: <Link href="/">Home</Link>,
    },
    {
        title: "About Us",
    },
];

const {Title, Text, Paragraph} = Typography
export default function About() {
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <Title level={1} style={{ fontSize: "60px" }} className={styles.title_bread}>
                    About Us
                </Title>
                <Breadcrumb
                    items={breadcrumbItems}
                    className={styles.breadcrumb}
                />
            </div>
            <div className={styles.main_container}>
                <Main/>
                <Team/>
            </div>
            <Support/>
        </div>
    );
}

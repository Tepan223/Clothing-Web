'use client'

import styles from "../../styles/details.module.css";
import { Breadcrumb, Typography } from "antd";
import Link from "next/link";
import Support from "../../../components/support";
import { use } from "react";
import { blogPosts } from "@/app/data/data-blog";
import Main from "../../component/details-main"
import Relate from "../../component/relate"

const { Title, Text, Paragraph } = Typography;

const breadcrumbItems = [
    {
        title: <Link href="/">Home</Link>,
    },
    {
        title: "Blog Details",
    },
];

export default function BlogDetails({ params }) {

    const { id } = use(params);

    const post = blogPosts.find((item) => item.id === Number(id));

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <Title level={1} style={{ fontSize: "60px" }} className={styles.title}>
                    Blog Details
                </Title>
                <Breadcrumb
                    items={breadcrumbItems}
                    className={styles.breadcrumb}
                />
            </div>
            <div className={styles.main_container}>
                <Main post={post}/>
            </div>
            <Relate/>
            <Support/>
        </div>
    );
}
'use client'

import styles from "../styles/main.module.css";
import { Typography, Pagination } from "antd";
import { useState } from "react";
import Link from "next/link";
import { blogPosts } from "@/app/data/data-blog"

const { Title, Paragraph } = Typography;

export default function Blog() {

    const pageSize = 9;
    const [currentPage, setCurrentPage] = useState(1);

    const startIndex = (currentPage - 1) * pageSize;
    const currentPosts = blogPosts.slice(startIndex, startIndex + pageSize);

    return (
        <div>
            <div className={styles.main_container}>
                {currentPosts.map((post) => (
                    <div key={post.id} className={styles.child_container}>

                        <div className={styles.image_container}>
                            <img src={post.image} alt="Photo" />
                            <div className={styles.date}>{post.date}</div>
                        </div>
                        <Title className={styles.title_main}>
                            {post.title}
                        </Title>
                        <Paragraph className={styles.desc}>
                            {post.description}
                        </Paragraph>
                        <Link
                            href={`/blog/blog-details/${post.id}`}
                            className={styles.link}
                        >
                            Read More
                        </Link>
                    </div>
                ))}
            </div>

            <div className={styles.pagination_contain}>
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={blogPosts.length}
                    onChange={(page) => setCurrentPage(page)}
                />
            </div>

        </div>
    );
}
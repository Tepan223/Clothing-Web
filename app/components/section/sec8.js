'use client'
import styles from "../../styles/sec8.module.css";
import {Typography} from "antd";
import { }from "@ant-design/icons"
const {Title, Text, Paragraph}=Typography
const blogPosts = [
    {
        id: 1,
        image: "#",
        date: "22 March 2024",
        title: "10 Fashion Trends for The Modern Woman",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
        link: "#",
    },
    {
        id: 2,
        image: "#",
        date: "21 March 2024",
        title: "Fashion Forward Tips, Trends, and Inspiration",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
        link: "#",
    },
    {
        id: 3,
        image: "#",
        date: "20 March 2024",
        title: "Fall Fashion Frenzy: The Ultimate Style Guide",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
        link: "#",
    },
];
export default function Sec8() {
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.top_container}>
                    <Text className={styles.headline}> News & Blog</Text>
                    <Title className={styles.title_top}>Our Latest News & Blogs</Title>
                </div>
                <div className={styles.main_container}>
                    {blogPosts.map((post) => (
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
                            <a href={post.link} className={styles.link}>
                                Read More
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

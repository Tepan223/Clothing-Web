'use client'
import styles from "../styles/relate.module.css";
import { Typography } from "antd";
import { }from "@ant-design/icons"

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

const {Title, Text, Paragraph} = Typography
export default function Shop() {
    return (
        <div className={styles.page}>
            <Text style={{fontSize:"30px"}} className={styles.headline}>Related Blogs</Text>
            <Title style={{fontSize:"50px", margin:"0"}} className={styles.title}>Latest Related Blogs</Title>
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

    );
}

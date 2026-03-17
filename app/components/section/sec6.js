'use client'
import styles from "../../styles/sec6.module.css";
import { Typography} from "antd";
import {InstagramOutlined }from "@ant-design/icons"

const instagramPosts = [
    {
        id: 1,
        image: "#",
    },
    {
        id: 2,
        image: "#",
        overlay: true,
    },
    {
        id: 3,
        image: "#",
    },
    {
        id: 4,
        image: "#",
    },
    {
        id: 5,
        image: "#",
    },
];
const{ Title, Text} = Typography
export default function Sec6() {
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.text_container}>
                    <Text className={styles.headline}>Follow Us</Text>
                    <Title className={styles.title}>Follow Us On Instagram</Title>
                </div>
                <div className={styles.main_container}>
                    {instagramPosts.map((post) => (
                        <div key={post.id} className={styles.gambar}>
                            <img src={post.image} alt="Photo" />

                            {post.overlay && (
                                <div className={styles.overlay}>
                                    <InstagramOutlined className={styles.icon} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

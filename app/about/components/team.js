'use client'
import styles from "../styles/team.module.css";
import { Typography } from "antd";
import { }from "@ant-design/icons"

const avatar = [
    { title: "Arlene McCoy", text: "Fashion Designer" },
    { title: "Bessie Cooper", text: "Founder & CEO" },
    { title: "Jenny Wilson+", text: "Fashion Designer" },
];

const {Title, Text, Paragraph} = Typography
export default function Shop() {
    return (
        <div className={styles.container}>
            <Text style={{fontSize:"24px"}} className={styles.headline}>Our Team</Text>
            <Title style={{margin:"0", fontSize:"50px"}} className={styles.title}>Meet Our Team</Title>
            <div className={styles.avatar_container}>
                {avatar.map((item,index) => (
                    <div key={index} className={styles.container_avatar}>
                        <div className={styles.avatar}></div>
                        <div className={styles.text_container}>
                            <Title style={{margin:"0"}}  className={styles.name}>{item.title}</Title>
                            <Text style={{fontSize:"24px"}} className={styles.job}>{item.text}</Text>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

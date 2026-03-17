'use client'
import styles from "../../styles/Hero.module.css";
import { TagFilled } from '@ant-design/icons';
import {Typography, Button} from "antd";
import { ArrowRightOutlined } from '@ant-design/icons';

const {Text, Title, Paragraph} = Typography
export default function Hero() {
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.left_container}>
                    <div className={styles.discount_label}>
                        <TagFilled style={{fontSize:"40px", color:"#3c1800"}}/>
                        <Text className={styles.label_text}><span>50% OFF</span> Summer Super Sale</Text>
                    </div>
                    <div>
                        <Title style={{fontSize: "60px"}} className={styles.title}>Step into Style: Your<br/>Ultimate Fashion Destination</Title>
                        <Paragraph style={{fontSize: "25px", color:"#808080"}} className={styles.subtitle}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod<br/>tempor incididunt ut labore et dolore</Paragraph>
                    </div>
                    <Button className={styles.btn} style={{border:"none", color:"white", background:"#3c1800"}} href="/shop"> Shop Now <ArrowRightOutlined /></Button>
                </div>
                <div className={styles.right_container}>
                    <img src="/hero.png" alt="" className={styles.image}/>
                </div>
            </div>
        </div>
    );
}

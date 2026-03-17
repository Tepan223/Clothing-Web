'use client'
import styles from "../../styles/sec4.module.css";
import { Typography, Button } from "antd";
import {ArrowRightOutlined} from "@ant-design/icons"

const {Text, Paragraph, Title} = Typography
export default function Sec4() {
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.left_container}>
                    <img src="/sec4.png" alt="Photo" className={styles.img_container}/>
                </div>
                <div className={styles.right_container}>
                    <Text className={styles.headeline}>Limited Time Offers</Text>
                    <Title className={styles.title}>25% Off All Fashion<br/>Favorites - Limited Time!</Title>
                    <Paragraph className={styles.desc}>Lorem ipsum dolor sit amet, consectetur adispiscing<br/>elit, sed do eiusmod tempor incididunt</Paragraph>
                    <Button className={styles.button} style={{border:"none", color:"white", background:"#3c1800"}} href="/shop"> Shop Now <ArrowRightOutlined /></Button>
                </div>
            </div>
        </div>
    );
}

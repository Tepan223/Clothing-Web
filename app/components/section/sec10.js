'use client'
import styles from "../../styles/sec10.module.css";
import { Typography, Input, Button} from "antd";
import {MailFilled }from "@ant-design/icons"
const {Title, Text}=Typography
export default function Sec10() {
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <Text className={styles.headline}>Our Newsletter</Text>
                <Title className={styles.title}>Subscribe to Our Newsletter to Get<br/>Updates to Our Latest Collection</Title>
                <Text className={styles.discount}>Get 20% off on your first order just by subscribing to our newsletter</Text>
                <div className={styles.input_container}>
                    <Input placeholder="Enter Email Address" prefix={<MailFilled style={{background:"#f6ad55", padding:"20px"}} className={styles.icon}/>} className={styles.input_data} />
                    <Button className={styles.button} style={{background:"#3c1800",color:"white"}}>Subscribe</Button>
                </div>
            </div>
        </div>
    );
}

'use client'
import styles from "./styles/error.module.css";
import { Typography, Button } from "antd";
import { }from "@ant-design/icons"

const {Title, Text, Paragraph} = Typography
export default function Error() {
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <Text strong className={styles.error}>404</Text>
                <Title style={{margin:"0", fontSize:"50px"}}>Oops! Page not Found</Title>
                <Text type={"secondary"} style={{fontSize:"20px"}}>The page you are looking for cannot be found.<br/>take a break before trying again</Text>
                <Button href="/" className={styles.btn} style={{color:"white", background:"#3c1900"}}>Go To Home Page</Button>
            </div>
        </div>
    );
}

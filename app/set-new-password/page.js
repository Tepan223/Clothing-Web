'use client'
import styles from "./styles/new-password.module.css";
import { Typography, Input, Button, Checkbox, Divider} from "antd";
import { }from "@ant-design/icons"
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";

const { Password } = Input;
const {Title, Text, Paragraph} = Typography
export default function NewPassword() {
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.left_container}>
                    <Title style={{margin:"0"}}>Clothing.</Title>
                    <div>
                        <Title style={{marginBottom:"10px"}}>Set new password</Title>
                        <Text style={{fontSize:"24px"}}>Must be at least 8 character</Text>
                    </div>
                    <div className={styles.login_container}>
                        <div className={styles.password}>
                            <Title level={3}>Password *</Title>
                            <Password placeholder="Enter Password"></Password>
                        </div>
                        <div className={styles.password}>
                            <Title level={3}>Confirm Password *</Title>
                            <Password placeholder="Enter Password"></Password>
                        </div>
                        <Button className={styles.sign_btn} style={{color:"white", background:"#3c1900"}}>Reset Password</Button>
                    </div>
                </div>
                <div className={styles.right_container}></div>
            </div>
        </div>
    );
}

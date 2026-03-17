'use client'
import styles from "./styles/forgot-password.module.css";
import { Typography, Input, Button, Checkbox, Divider} from "antd";
import { }from "@ant-design/icons"
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";

const { Password } = Input;
const {Title, Text, Paragraph} = Typography
export default function ForgotPass() {
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.left_container}>
                    <Title style={{margin:"0"}}>Clothing.</Title>
                    <div>
                        <Title style={{marginBottom:"10px"}}>Forgot Password?</Title>
                        <Text type={"secondary"} style={{fontSize:"24px"}}>Don't worry, We'll send you reset instructions.</Text>
                    </div>
                    <div className={styles.login_container}>
                        <div className={styles.email}>
                            <Title level={3}>Email *</Title>
                            <Input placeholder="Enter Email Here"></Input>
                        </div>
                        <Button className={styles.submit_btn} style={{color:"white", background:"#3c1900"}}>Submit</Button>
                        <Text style={{ fontSize: "18px" }} className={styles.already}>
                            Already have an account?
                            <Link href="/sign-in" className={styles.sign_in} style={{color:"black"}}>
                                Sign in
                            </Link>
                        </Text>
                    </div>
                </div>
                <div className={styles.right_container}></div>
            </div>
        </div>
    );
}

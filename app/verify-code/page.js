'use client'
import styles from "./style/verify.module.css";
import { Typography, Input, Button,} from "antd";
import { }from "@ant-design/icons"
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";

const { Password } = Input;
const {Title, Text, Paragraph} = Typography
export default function Verify() {
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.left_container}>
                    <Title style={{margin:"0"}}>Clothing.</Title>
                    <div>
                        <Title style={{marginBottom:"10px"}}>Verify Code</Title>
                        <Text type={"secondary"} style={{fontSize:"22px"}}>Please enter the code we just sent to email <span style={{color:"#3c1900"}}>Exmaple@gmail.com</span></Text>
                    </div>
                    <div className={styles.login_container}>
                        <div className={styles.code}>
                            <Title level={3}>Code *</Title>
                            <Input.OTP
                                length={6}
                                size="large"
                                style={{ width: "100%" }}
                                onChange={(value) => console.log("OTP:", value)}
                            />
                        </div>
                        <Button className={styles.submit_btn} style={{color:"white", background:"#3c1900"}}>Submit</Button>
                        <Text style={{ fontSize: "18px" }} className={styles.already}>
                            Didn't receive code?
                            <Link href="#" className={styles.sign_in} style={{color:"black"}}>
                                Resend Code
                            </Link>
                        </Text>
                    </div>
                </div>
                <div className={styles.right_container}></div>
            </div>
        </div>
    );
}

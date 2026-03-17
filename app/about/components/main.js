'use client'
import styles from "../styles/main.module.css";
import {Breadcrumb, Typography} from "antd";
import { }from "@ant-design/icons"
import Link from "next/link";

const stats = [
    { title: "25+", text: "Years" },
    { title: "180+", text: "Stores" },
    { title: "100k+", text: "Customers" },
    { title: "35+", text: "Awards" },
    { title: "98+", text: "Satisfied" },
];

const {Title, Text, Paragraph} = Typography
export default function About() {
    return (
        <div className={styles.page}>
            <div className={styles.top_text_container}>
                <Text style={{fontSize:"24px", fontWeight:"bold"}} className={styles.headline}>Our Story</Text>
                <Title style={{margin:"0"}} className={styles.title}>Crafted with Care: Fine <br/> Materials, Thoughtful Design</Title>
                <Paragraph style={{fontSize:"24px", margin:"0"}} className={styles.desc}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.<br/>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</Paragraph>
            </div>
            <div className={styles.main_container}>
                <Text style={{fontSize:"24px"}}>Jenny Alexander <span style={{color:"orange"}}>●</span> CEO</Text>
                <div className={styles.img_container}>
                    <div className={styles.left_img}></div>
                    <div className={styles.right_img}>
                        <div className={styles.img_right_2}></div>
                        <div className={styles.img_right_2}></div>
                    </div>
                </div>
                <div className={styles.part}>
                    {stats.map((item, index) => (
                        <div key={index}>
                            <Title style={{margin:"0"}}>{item.title}</Title>
                            <Text style={{fontSize:"24px"}}>{item.text}</Text>
                        </div>

                    ))}
                </div>
            </div>
            <div className={styles.product_quality}>
                <div className={styles.left_container}></div>
                <div className={styles.right_container}>
                    <Text style={{fontSize:"26px"}} className={styles.headline}>Our Product Quality</Text>
                    <Title style={{margin:"0", fontSize:"50px"}} className={styles.title}>We Make Things Comfy,<br/>Pretty, and Fancy</Title>
                    <Paragraph style={{margin:"0", fontSize:"24px", color:"#555"}} className={styles.desc}>Lorem ipsum dolor sit amet, consectetur adispiscing elit, sed do eiusmod<br/>tempor incididunt ut labore et dolore magna aliqua</Paragraph>
                    <div className={styles.child}>
                        <div className={styles.child_quailty}>
                            <Title level={2} style={{margin:"0"}} className={styles.subtitle}>100% Cotton</Title>
                            <Paragraph style={{margin:"0", fontSize:"24px", color:"#555"}} className={styles.desc}>Sed ut perspiciatis unde omnis iste<br/>natus error sit vaoluptatem accusa</Paragraph>
                        </div>
                        <div className={styles.child_quailty}>
                            <Title level={2} style={{margin:"0"}} className={styles.subtitle}>Breathable Fabric</Title>
                            <Paragraph style={{margin:"0", fontSize:"24px", color:"#555"}} className={styles.desc}>Sed ut perspiciatis unde omnis iste<br/>natus error sit vaoluptatem accusa</Paragraph>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

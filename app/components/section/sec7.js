'use client'
import styles from "../../styles/sec7.module.css";
import {Typography, Button, Card } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined, StarFilled}from "@ant-design/icons"
const {Title, Text, Paragraph}=Typography
export default function Sec7() {
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.top_container}>
                    <Text className={styles.headline}>Testimonial</Text>
                    <div className={styles.with_btn}>
                        <Title className={styles.title_with_btn}>What Our Clients Say</Title>
                        <div className={styles.btn_container}>
                            <Button style={{border:"none", color:"black", background:"#E5B454"}} className={styles.icon_btn}><ArrowLeftOutlined /></Button>
                            <Button style={{border:"none", color:"white", background:"#3c1800"}} className={styles.icon_btn}><ArrowRightOutlined /></Button>
                        </div>
                    </div>
                </div>
                <div className={styles.main_container}>
                    <Card className={styles.card_container}>
                        <div className={styles.child_container}>
                            <div className={styles.left_container}>
                                <div className={styles.image_container}>
                                    <img src="#" alt="Photo"/>
                                </div>
                            </div>
                            <div className={styles.right_container}>
                                <div className={styles.rate}>
                                    <StarFilled />
                                    <StarFilled />
                                    <StarFilled />
                                    <StarFilled />
                                    <StarFilled />
                                    <span style={{color:"black"}}>5.0</span>
                                </div>
                                <Paragraph className={styles.desc}>Sed ut perspiciatis unde omnis iste natus error site voluptatem<br/>accusanitum doloremque laudantium, totam rem aperiam,<br/> eaque ipsa quae ab illo inventore veritatis et quasi architecto</Paragraph>
                                <div className={styles.text_container}>
                                    <Title className={styles.name} level={2}>Leslie Alexander</Title>
                                    <Text className={styles.jobdesc}>Fashion Enthusiast</Text>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

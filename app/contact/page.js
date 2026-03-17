'use client'
import styles from "../contact/styles/contact.module.css";
import {Breadcrumb, Typography, Input, Button} from "antd";
import {FacebookFilled, PinterestFilled, YoutubeFilled, TwitterCircleFilled, InstagramFilled }from "@ant-design/icons"
import Link from "next/link";
import Support from "@/app/components/support";

const breadcrumbItems = [
    {
        title: <Link href="/">Home</Link>,
    },
    {
        title: "Contact Us",
    },
];

const socialMedia = [
    {
        name: "Facebook",
        icon: <FacebookFilled />,
    },
    {
        name: "Pinterest",
        icon: <PinterestFilled />,
    },
    {
        name: "YouTube",
        icon: <YoutubeFilled />,
    },
    {
        name: "Twitter",
        icon: <TwitterCircleFilled />,
    },
    {
        name: "Instagram",
        icon: <InstagramFilled />,
    },
];

const contactInfo = {
    address: "4517 Washington Ave. Manchester, Kentucky 39495",
    phone: "+0123-456-789",
    email: "example@gmail.com",
    openTime: {
        weekdays: "Monday - Friday : 10:00 - 20:00",
        weekend: "Saturday - Sunday : 11:00 - 18:00",
    },
};

const topFields = [
    {
        label: "Your Name *",
        name: "name",
        type: "text",
        placeholder: "Enter your name",
    },
    {
        label: "Email *",
        name: "email",
        type: "email",
        placeholder: "Enter your email",
    },
];

const otherFields = [
    {
        label: "Subject *",
        name: "subject",
        type: "text",
        placeholder: "Enter subject",
    },
    {
        label: "Your Message *",
        name: "message",
        type: "textarea",
        placeholder: "Write your message here...",
    },
];

const {Title, Text, Paragraph} = Typography
export default function Contact() {
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <Title level={1} style={{ fontSize: "60px" }} className={styles.title_bread}>
                    Contact Us
                </Title>
                <Breadcrumb
                    items={breadcrumbItems}
                    className={styles.breadcrumb}
                />
            </div>
            <div className={styles.main_container}>
                <div className={styles.left_container}>
                    <Title style={{ margin: "0" }} className={styles.title_contact}>Get in Touch</Title>
                    <Text style={{ fontSize: "24px", color: "#555" }} className={styles.text_contact}>
                        Your email address will not be published. Required fields are marked*
                    </Text>
                    <div className={styles.topRow}>
                        {topFields.map((field, index) => (
                            <div key={index} className={styles.field}>
                                <Title level={2} style={{margin:"0"}} className={styles.title_input}>{field.label}</Title>
                                <Input type={field.type} placeholder={field.placeholder} className={styles.input_bar}/>
                            </div>
                        ))}
                    </div>
                    <div className={styles.field}>
                        <Title level={2} style={{ margin: "0" }}  className={styles.title_input}>
                            {otherFields[0].label}
                        </Title>
                        <Input
                            className={styles.input_bar}
                            placeholder={otherFields[0].placeholder}
                        />
                    </div>
                    <div className={styles.field}>
                        <Title level={2} style={{ margin: "0" }}  className={styles.title_input}>
                            {otherFields[1].label}
                        </Title>
                        <Input.TextArea
                            className={styles.text_area}
                            rows={7}
                            placeholder={otherFields[1].placeholder}
                        />
                    </div>
                    <Button className={styles.btn_message} style={{color:"white", background:"#3c1900"}}>Send Message</Button>
                </div>
                <div className={styles.right_container}>
                    <div>
                        <Title level={1} className={styles.title_info}>Address</Title>
                        <Text style={{ fontSize: "24px", color: "#555" }} className={styles.text_info}>
                            {contactInfo.address}
                        </Text>
                    </div>
                    <div>
                        <Title level={1} className={styles.title_info}>Contact</Title>
                        <Text style={{ fontSize: "24px", color: "#555", display: "block" }} className={styles.text_info}>
                            Phone : {contactInfo.phone}
                        </Text>
                        <Text style={{ fontSize: "24px", color: "#555" }} className={styles.text_info}>
                            Email : {contactInfo.email}
                        </Text>
                    </div>
                    <div>
                        <Title level={1} className={styles.title_info}>Open Time</Title>
                        <Text style={{ fontSize: "24px", color: "#555", display: "block" }} className={styles.text_info}>
                            {contactInfo.openTime.weekdays}
                        </Text>
                        <Text style={{ fontSize: "24px", color: "#555" }} className={styles.text_info}>
                            {contactInfo.openTime.weekend}
                        </Text>
                    </div>
                    <div>
                        <Title level={1} className={styles.title_info}  >Stay Connected</Title>
                        <div className={styles.icon_container}>
                            {socialMedia.map((item, index) => (
                                <a
                                    key={index}
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.social_icon}
                                >
                                    {item.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.map}>
                <img src="https://placehold.net/map-1200x600.png" alt=""/>
            </div>
            <Support/>
        </div>
    );
}

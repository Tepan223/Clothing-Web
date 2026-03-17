"use client";
import styles from "./styles/complete-profile.module.css";
import { Typography, Input, Button, Select, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const uploadButton = (
    <div>
        <PlusOutlined style={{ fontSize:"18px" }}/>
        <div style={{ marginTop: 8, fontSize:"18px" }}>Upload</div>
    </div>
);

export default function CompleteProfile() {

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.left_container}>
                    <Title style={{ margin: 0 }}>Clothing.</Title>
                    <div>
                        <Title style={{ marginBottom: "10px" }}>
                            Complete Your Profile
                        </Title>
                        <Text style={{ fontSize: "23px" }}>
                            Dont worry, only you can see your personal data.
                        </Text>
                    </div>
                    <div className={styles.complete_container}>
                        <div>
                            <Title level={3}>Profile Photo (Optional)</Title>
                            <Upload
                                listType="picture-card"
                                maxCount={1}
                                beforeUpload={() => false}
                            >
                                {uploadButton}
                            </Upload>
                        </div>
                        <div>
                            <Title level={3}>Phone *</Title>
                            <Input placeholder="Enter Phone Number" />
                        </div>
                        <div>
                            <Title level={3}>Gender *</Title>
                            <Select
                                placeholder="Select Gender"
                                style={{ width: "100%", height: "40px" }}
                                options={[
                                    { value: "male", label: "Male" },
                                    { value: "female", label: "Female" },
                                    { value: "other", label: "Other" },
                                ]}
                                className={styles.gender}
                            />
                        </div>
                        <Button
                            className={styles.complete}
                            style={{ color: "white", background: "#3c1900" }}
                            block
                        >
                            Complete Profile
                        </Button>
                    </div>
                </div>
                <div className={styles.right_container}></div>
            </div>
        </div>
    );
}
'use client'
import styles from "./styles/account.module.css";
import { Breadcrumb, Typography } from "antd";
import Link from "next/link";
import Support from "../components/support";
import Main from './components/main';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const breadcrumbItems = [
    { title: <Link href="/">Home</Link> },
    { title: "My Account" },
];

const { Title } = Typography;

export default function Account() {
    const router = useRouter();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loggedUser = localStorage.getItem("user");

        if (!loggedUser) {
            // Redirect ke login + simpan halaman ini di query redirect
            router.push(`/sign-in?redirect=/account`);
        } else {
            setUser(JSON.parse(loggedUser));
        }
    }, []);

    if (!user) return <div>Loading...</div>; // sementara menunggu cek login

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <Title level={1} style={{ fontSize: "60px" }} className={styles.title_bread}>My Account</Title>
                <Breadcrumb items={breadcrumbItems} className={styles.breadcrumb} />
            </div>

            <div className={styles.main_container}>
                <Main user={user} />
            </div>

            <Support />
        </div>
    );
}
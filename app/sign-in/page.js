'use client'

import styles from "./styles/sign-in.module.css";
import { Typography, Input, Button, Checkbox, Divider, message, Spin } from "antd";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const { Password } = Input;
const { Title, Text } = Typography;

// Komponen terpisah untuk konten yang menggunakan useSearchParams
function SignInContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirect") || "/account";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isClient, setIsClient] = useState(false);

    // Effect untuk menandai bahwa komponen sudah di client-side
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Effect untuk cek login status
    useEffect(() => {
        // Hanya jalankan di client-side
        if (typeof window !== 'undefined') {
            const user = localStorage.getItem("user");
            if (user) {
                router.push(redirectTo);
            }
        }
    }, [router, redirectTo]);

    const handleLogin = () => {
        setEmailError("");
        setPasswordError("");

        // Validasi email
        if (!email) {
            setEmailError("Email wajib diisi");
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError("Email tidak valid");
            return;
        }

        // Validasi password
        if (!password) {
            setPasswordError("Password wajib diisi");
            return;
        }
        if (password.length < 8) {
            setPasswordError("Password minimal 8 karakter");
            return;
        }

        setLoading(true);

        try {
            // Ambil data users dari localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');

            // Cari user dengan email dan password yang cocok
            const user = users.find(u =>
                u.email === email.trim().toLowerCase() &&
                u.password === password
            );

            if (user) {
                // Hapus password sebelum disimpan ke localStorage
                const { password: _, ...userWithoutPassword } = user;

                // Simpan user yang login
                localStorage.setItem('user', JSON.stringify(userWithoutPassword));

                message.success('Login successful!');

                // redirect ke halaman asal sesuai query redirect
                router.push(redirectTo);
            } else {
                message.error('Email atau Password salah');
            }
        } catch (error) {
            console.error('Login error:', error);
            message.error('Terjadi kesalahan. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    // Handle Enter key
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !loading) {
            handleLogin();
        }
    };

    // Tampilkan loading saat di server atau sebelum client siap
    if (!isClient) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <>
            <div className={styles.left_container}>
                <Title style={{ margin: "0" }}>
                    <Link href="/" style={{ color: "black" }}>Clothing.</Link>
                </Title>

                <div>
                    <Title style={{ marginBottom: "10px" }}>Sign In</Title>
                    <Text style={{ fontSize: "24px" }}>
                        Please fill your detail to access your account
                    </Text>
                </div>

                <div className={styles.login_container}>
                    <div className={styles.email}>
                        <Title level={3}>Email *</Title>
                        <Input
                            placeholder="Enter Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={loading}
                        />
                        {emailError && <Text type="danger">{emailError}</Text>}
                    </div>

                    <div className={styles.password}>
                        <Title level={3}>Password *</Title>
                        <Password
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={loading}
                        />
                        {passwordError && <Text type="danger">{passwordError}</Text>}
                    </div>

                    <div className={styles.forgot}>
                        <Checkbox className={styles.check}>Remember me</Checkbox>
                        <Link href="/forgot-password" className={styles.forgot_pass}>
                            Forgot Password?
                        </Link>
                    </div>

                    <Button
                        className={styles.sign_btn}
                        style={{ color: "white", background: "#3c1900" }}
                        onClick={handleLogin}
                        loading={loading}
                        disabled={loading}
                    >
                        Sign In
                    </Button>

                    <Divider style={{ fontSize: "18px" }}>or Sign In with</Divider>

                    <Button
                        className={styles.sign_btn}
                        icon={<FcGoogle size={35} />}
                        style={{
                            color: "black",
                            background: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "10px"
                        }}
                        block
                        disabled={loading}
                    >
                        Sign In With Google
                    </Button>

                    <Text style={{ fontSize: "18px" }} className={styles.no_acc}>
                        Don't have an Account?
                        <Link href="/sign-up" className={styles.sign_up}>
                            Sign Up
                        </Link>
                    </Text>
                </div>
            </div>
            <div className={styles.right_container}></div>
        </>
    );
}

// Komponen utama dengan Suspense wrapper
export default function SignIn() {
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <Suspense fallback={
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                        <Spin size="large" />
                    </div>
                }>
                    <SignInContent />
                </Suspense>
            </div>
        </div>
    );
}
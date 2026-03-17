'use client'

import styles from "./styles/sign-up.module.css";
import { Typography, Input, Button, Checkbox, Divider, message } from "antd";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const { Password } = Input;
const { Title, Text } = Typography;

export default function SignUp() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [agreeTerms, setAgreeTerms] = useState(false);

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        let tempErrors = {};

        // Validasi First Name
        if (!firstName.trim()) {
            tempErrors.firstName = "First Name wajib diisi";
        } else if (firstName.length < 2) {
            tempErrors.firstName = "First Name minimal 2 karakter";
        }

        // Validasi Last Name
        if (!lastName.trim()) {
            tempErrors.lastName = "Last Name wajib diisi";
        } else if (lastName.length < 2) {
            tempErrors.lastName = "Last Name minimal 2 karakter";
        }

        // Validasi Email
        if (!email) {
            tempErrors.email = "Email wajib diisi";
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                tempErrors.email = "Email tidak valid";
            }
        }

        // Validasi Password
        if (!password) {
            tempErrors.password = "Password wajib diisi";
        } else if (password.length < 8) {
            tempErrors.password = "Password minimal 8 karakter";
        } else if (!/[A-Z]/.test(password)) {
            tempErrors.password = "Password harus mengandung huruf besar";
        } else if (!/[a-z]/.test(password)) {
            tempErrors.password = "Password harus mengandung huruf kecil";
        } else if (!/[0-9]/.test(password)) {
            tempErrors.password = "Password harus mengandung angka";
        }

        // Validasi Terms
        if (!agreeTerms) {
            tempErrors.agreeTerms = "Anda harus menyetujui Terms & Privacy";
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleRegister = () => {
        if (!validateForm()) return;

        setLoading(true);

        try {
            // Ambil data users dari localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');

            // Cek email sudah terdaftar
            if (users.find(u => u.email === email.trim().toLowerCase())) {
                message.error("Email sudah terdaftar. Gunakan email lain atau login.");
                setErrors({ ...errors, email: "Email sudah terdaftar" });
                setLoading(false);
                return;
            }

            // Buat user baru
            const newUser = {
                id: Date.now(), // Simple ID
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim().toLowerCase(),
                password: password,
                cart: [],
                wishlist: [],
                addresses: [],
                orders: [],
                createdAt: new Date().toISOString()
            };

            // Tambahkan ke array users
            users.push(newUser);

            // Simpan ke localStorage
            localStorage.setItem('users', JSON.stringify(users));

            // Jangan auto login, hanya tampilkan pesan sukses
            message.success({
                content: 'Registrasi berhasil! Silakan login dengan akun Anda.',
                duration: 2,
                style: {
                    marginTop: '20px',
                    fontSize: '16px'
                }
            });

            // Reset form
            setFirstName("");
            setLastName("");
            setEmail("");
            setPassword("");
            setAgreeTerms(false);

            // Redirect ke halaman sign-in setelah 1.5 detik
            setTimeout(() => {
                router.push("/sign-in");
            }, 1500);

        } catch (error) {
            console.error("Registration error:", error);
            message.error("Terjadi kesalahan. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    // Handle Enter key
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !loading) {
            handleRegister();
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.left_container}>
                    <Title style={{ margin: "0" }}>
                        <Link href="/" style={{color:"black"}}>Clothing.</Link>
                    </Title>

                    <div>
                        <Title style={{ marginBottom: "10px" }}>Sign Up</Title>
                        <Text style={{ fontSize: "23px" }}>
                            Fill your information below or register with your social account.
                        </Text>
                    </div>

                    <div className={styles.login_container}>
                        <div className={styles.name}>
                            <div className={styles.left_name}>
                                <Title level={3}>First Name *</Title>
                                <Input
                                    placeholder="Enter First Name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    status={errors.firstName ? "error" : ""}
                                    disabled={loading}
                                />
                                {errors.firstName && (
                                    <Text type="danger" style={{ fontSize: "12px" }}>
                                        {errors.firstName}
                                    </Text>
                                )}
                            </div>
                            <div className={styles.right_name}>
                                <Title level={3}>Last Name *</Title>
                                <Input
                                    placeholder="Enter Last Name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    status={errors.lastName ? "error" : ""}
                                    disabled={loading}
                                />
                                {errors.lastName && (
                                    <Text type="danger" style={{ fontSize: "12px" }}>
                                        {errors.lastName}
                                    </Text>
                                )}
                            </div>
                        </div>

                        <div className={styles.email}>
                            <Title level={3}>Email *</Title>
                            <Input
                                placeholder="Enter Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyPress={handleKeyPress}
                                status={errors.email ? "error" : ""}
                                disabled={loading}
                            />
                            {errors.email && (
                                <Text type="danger" style={{ fontSize: "12px" }}>
                                    {errors.email}
                                </Text>
                            )}
                        </div>

                        <div className={styles.password}>
                            <Title level={3}>Password *</Title>
                            <Password
                                placeholder="Enter Password (min. 8 characters)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyPress={handleKeyPress}
                                status={errors.password ? "error" : ""}
                                disabled={loading}
                            />
                            {errors.password && (
                                <Text type="danger" style={{ fontSize: "12px" }}>
                                    {errors.password}
                                </Text>
                            )}

                            {/* Password strength indicator */}
                            {password && !errors.password && (
                                <div style={{ marginTop: "5px" }}>
                                    <Text style={{ fontSize: "12px" }}>
                                        Password strength:
                                        {password.length >= 8 && /[A-Z]/.test(password) &&
                                        /[a-z]/.test(password) && /[0-9]/.test(password) ? (
                                            <span style={{ color: "green", marginLeft: "5px" }}>
                                                Strong
                                            </span>
                                        ) : password.length >= 8 ? (
                                            <span style={{ color: "orange", marginLeft: "5px" }}>
                                                Medium
                                            </span>
                                        ) : (
                                            <span style={{ color: "red", marginLeft: "5px" }}>
                                                Weak
                                            </span>
                                        )}
                                    </Text>
                                </div>
                            )}
                        </div>

                        <div>
                            <Checkbox
                                className={styles.check}
                                checked={agreeTerms}
                                onChange={(e) => setAgreeTerms(e.target.checked)}
                                disabled={loading}
                            >
                                Agree with
                                <span className={styles.under}> Terms & Condition </span>
                                and
                                <span className={styles.under}> Privacy Policy</span>
                            </Checkbox>
                            {errors.agreeTerms && (
                                <div>
                                    <Text type="danger" style={{ fontSize: "12px" }}>
                                        {errors.agreeTerms}
                                    </Text>
                                </div>
                            )}
                        </div>

                        <Button
                            className={styles.sign_btn}
                            style={{
                                color: "white",
                                background: "#3c1900",
                                height: "45px",
                                fontSize: "16px",
                                fontWeight: "bold"
                            }}
                            block
                            onClick={handleRegister}
                            loading={loading}
                            disabled={loading}
                        >
                            Sign Up
                        </Button>

                        <Divider style={{ fontSize: "18px" }}>
                            or Sign Up with
                        </Divider>

                        <Button
                            className={styles.sign_btn}
                            icon={<FcGoogle size={35} />}
                            style={{
                                color: "black",
                                background: "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "10px",
                                height: "45px",
                                fontSize: "16px",
                                border: "1px solid #d9d9d9"
                            }}
                            block
                            disabled={loading}
                        >
                            Sign Up With Google
                        </Button>

                        <Text style={{ fontSize: "18px" }} className={styles.no_acc}>
                            Already have an account?
                            <Link href="/sign-in" className={styles.sign_in}>
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
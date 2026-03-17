'use client'

import { Layout, Menu, Drawer } from 'antd'
import { useState } from 'react'
import { ShoppingCartOutlined, UserOutlined, SearchOutlined, HeartOutlined, MenuOutlined } from '@ant-design/icons'
import Link from 'next/link'
import styles from '../styles/Header.module.css'

const { Header } = Layout

export default function AppHeader() {

    const [open, setOpen] = useState(false)

    const closeDrawer = () => {
        setOpen(false)
    }

    const desktopMenuItems = [
        { key: '1', label: <Link href="/" className={styles.title}>Home</Link> },
        { key: '2', label: <Link href="/shop" className={styles.title}>Shop</Link> },
        { key: '3', label: <Link href="/shop" className={styles.title}>Women</Link> },
        { key: '4', label: <Link href="/shop" className={styles.title}>Men</Link> },
        { key: '5', label: <Link href="/shop" className={styles.title}>Accessories</Link> },
        { key: '6', label: <Link href="/about" className={styles.title}>About Us</Link> },
        { key: '7', label: <Link href="/contact" className={styles.title}>Contact Us</Link> },
        { key: '8', label: <Link href="/blog" className={styles.title}>Blog</Link> },
    ]

    const mobileMenuItems = [
        { key: '1', label: <Link href="/" className={styles.title} onClick={closeDrawer}>Home</Link> },
        { key: '2', label: <Link href="/shop" className={styles.title} onClick={closeDrawer}>Shop</Link> },
        { key: '3', label: <Link href="/shop" className={styles.title} onClick={closeDrawer}>Women</Link> },
        { key: '4', label: <Link href="/shop" className={styles.title} onClick={closeDrawer}>Men</Link> },
        { key: '5', label: <Link href="/shop" className={styles.title} onClick={closeDrawer}>Accessories</Link> },
        { key: '6', label: <Link href="/about" className={styles.title} onClick={closeDrawer}>About Us</Link> },
        { key: '7', label: <Link href="/contact" className={styles.title} onClick={closeDrawer}>Contact Us</Link> },
        { key: '8', label: <Link href="/blog" className={styles.title} onClick={closeDrawer}>Blog</Link> },
    ]

    return (
        <Header className={styles.header}>
            <div className={styles.container}>
                <div className={styles.logo}>
                    <Link href="/" onClick={closeDrawer}>Clothing.</Link>
                </div>

                <Menu
                    mode="horizontal"
                    defaultSelectedKeys={['1']}
                    className={styles.menu}
                    items={desktopMenuItems}
                />

                <div className={styles.mobileMenu}>
                    <MenuOutlined
                        className={styles.hamburger}
                        onClick={() => setOpen(true)}
                    />
                </div>

                <div className={styles.actions}>
                    <SearchOutlined className={styles.icon}/>
                    <Link href="/wishlist" style={{display:"flex"}} onClick={closeDrawer}>
                        <HeartOutlined className={styles.icon}/>
                    </Link>
                    <Link href="/cart" style={{display:"flex"}} onClick={closeDrawer}>
                        <ShoppingCartOutlined className={styles.icon} />
                    </Link>
                    <Link href="/account" style={{display:"flex"}} onClick={closeDrawer}>
                        <UserOutlined className={styles.icon} />
                    </Link>
                </div>
            </div>

            <Drawer
                title="Menu"
                placement="left"
                onClose={closeDrawer}
                open={open}
                className={styles.mobileDrawer}
            >
                <Menu
                    mode="vertical"
                    items={mobileMenuItems}
                    className={styles.drawerMenu}
                />
            </Drawer>
        </Header>
    )
}
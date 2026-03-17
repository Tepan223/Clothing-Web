'use client'
import styles from "../style/main.module.css";
import { Typography, Divider, Checkbox, Slider, Radio, Select, Card, Pagination, Drawer, Button } from "antd";
import { useState, useMemo, useEffect } from "react";
import { CloseOutlined, StarFilled, FilterOutlined } from '@ant-design/icons';
import { products } from "@/app/data/data-product";
import Link from "next/link";

// Mendapatkan kategori unik dari filterCategory produk
const getAllCategories = () => {
    const categories = new Set();
    products.forEach(product => {
        if (product.filterCategory) {
            categories.add(product.filterCategory);
        }
    });
    return Array.from(categories).sort();
};

// Mendapatkan warna unik dari semua produk (hanya warna yang diizinkan)
const getAllColors = () => {
    const colors = new Set();
    const allowedColors = ['black', 'grey', 'green', 'red', 'orange', 'blue', 'pink', 'white', 'brown', 'beige'];

    products.forEach(product => {
        if (product.colors && Array.isArray(product.colors)) {
            product.colors.forEach(color => {
                // Normalisasi warna (huruf kecil) dan hanya tambahkan jika diizinkan
                const colorLower = color.toLowerCase();
                if (allowedColors.includes(colorLower)) {
                    colors.add(color);
                }
            });
        }
    });
    return Array.from(colors).sort();
};

// Mendapatkan ukuran unik dari semua produk
const getAllSizes = () => {
    const sizes = new Set();
    products.forEach(product => {
        if (product.sizes && Array.isArray(product.sizes)) {
            product.sizes.forEach(size => {
                if (size !== "One Size") {
                    sizes.add(size);
                }
            });
        }
    });
    // Urutkan ukuran
    const sizeOrder = { 'XS': 1, 'S': 2, 'M': 3, 'L': 4, 'XL': 5, 'XXL': 6, 'XXXL': 7 };
    return Array.from(sizes).sort((a, b) => {
        return (sizeOrder[a] || 99) - (sizeOrder[b] || 99);
    });
};

// Mapping warna ke kode hex untuk tampilan
const colorToHex = {
    'black': '#000000',
    'grey': '#808080',
    'gray': '#808080',
    'green': '#008000',
    'red': '#ff0000',
    'orange': '#ffa500',
    'blue': '#0000ff',
    'pink': '#ffc0cb',
    'white': '#ffffff',
    'brown': '#8b4513',
    'beige': '#f5f5dc'
};

// Data untuk filter
const categories = getAllCategories();
const availableColors = getAllColors();
const availableSizes = getAllSizes();

// Format colors untuk Radio Group
const colorsForRadio = availableColors.map(color => ({
    name: color.charAt(0).toUpperCase() + color.slice(1),
    value: color,
    hex: colorToHex[color.toLowerCase()] || '#cccccc'
}));

const sortOptions = [
    { value: 'default', label: 'Default Sorting' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'newest', label: 'Newest' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' },
];

export default function Shop() {
    const { Title, Text } = Typography;

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 9;

    // State untuk drawer mobile
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Get min and max price from products
    const minPrice = Math.min(...products.map(p => p.price));
    const maxPrice = Math.max(...products.map(p => p.price));
    const defaultPrice = [minPrice, maxPrice];

    const [priceRange, setPriceRange] = useState(defaultPrice);
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [sortBy, setSortBy] = useState("default");

    // Deteksi ukuran layar untuk mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const formatPrice = (price) => {
        return `$${price}`;
    };

    // Filter products
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            // Filter kategori
            if (selectedCategory.length > 0) {
                if (!product.filterCategory) return false;
                const matchesCategory = selectedCategory.some(cat =>
                    product.filterCategory === cat
                );
                if (!matchesCategory) return false;
            }

            // Filter warna
            if (selectedColor) {
                if (!product.colors || !Array.isArray(product.colors)) return false;
                const productColorsLower = product.colors.map(c => c.toLowerCase());
                if (!productColorsLower.includes(selectedColor.toLowerCase())) {
                    return false;
                }
            }

            // Filter ukuran
            if (selectedSize) {
                if (!product.sizes || !Array.isArray(product.sizes)) return false;
                if (!product.sizes.includes(selectedSize)) {
                    return false;
                }
            }

            // Filter harga
            if (product.price < priceRange[0] || product.price > priceRange[1]) {
                return false;
            }

            return true;
        });
    }, [selectedCategory, selectedColor, selectedSize, priceRange]);

    // Sort products
    const sortedProducts = useMemo(() => {
        const sorted = [...filteredProducts];

        switch (sortBy) {
            case 'price_low':
                return sorted.sort((a, b) => a.price - b.price);
            case 'price_high':
                return sorted.sort((a, b) => b.price - a.price);
            case 'rating':
                return sorted.sort((a, b) => b.rating - a.rating);
            case 'popular':
                return sorted.sort((a, b) => {
                    const reviewA = parseInt(a.review) || 0;
                    const reviewB = parseInt(b.review) || 0;
                    return reviewB - reviewA;
                });
            case 'newest':
                return sorted.sort((a, b) => {
                    const dateA = new Date(a.dateAdded) || new Date(0);
                    const dateB = new Date(b.dateAdded) || new Date(0);
                    return dateB - dateA;
                });
            default:
                return sorted;
        }
    }, [filteredProducts, sortBy]);

    // Pagination
    const startIndex = (currentPage - 1) * pageSize;
    const currentProducts = sortedProducts.slice(
        startIndex,
        startIndex + pageSize
    );

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, selectedColor, selectedSize, priceRange, sortBy]);

    const clearAllFilters = () => {
        setSelectedCategory([]);
        setSelectedSize(null);
        setSelectedColor(null);
        setPriceRange(defaultPrice);
        setSortBy("default");
    };

    const isPriceChanged =
        priceRange[0] !== defaultPrice[0] ||
        priceRange[1] !== defaultPrice[1];

    const hasActiveFilters = selectedCategory.length > 0 ||
        selectedColor !== null ||
        selectedSize !== null ||
        isPriceChanged;

    // Komponen filter yang bisa digunakan ulang
    const FilterContent = () => (
        <>
            <Title level={1}>Category</Title>
            <Checkbox.Group
                options={categories}
                value={selectedCategory}
                onChange={setSelectedCategory}
                className={styles.list_category}
            />

            <Divider style={{ border: "1px solid", borderColor: "#d4d4d4d4" }} />

            <Title level={1}>Price</Title>
            <Text style={{ fontSize: "18px" }}>
                ${priceRange[0]} - ${priceRange[1]}
            </Text>
            <Slider
                range
                min={minPrice}
                max={maxPrice}
                value={priceRange}
                onChange={setPriceRange}
            />

            <Divider style={{ border: "1px solid", borderColor: "#d4d4d4d4" }} />

            <Title level={1}>Color</Title>
            <Radio.Group
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className={styles.color_pick}
            >
                {colorsForRadio.map((color) => (
                    <Radio
                        key={color.name}
                        value={color.value}
                        className={styles.text_color}
                    >
                        <span
                            className={`${styles.color_dot} ${
                                selectedColor === color.value ? styles.selected : ""
                            }`}
                            style={{ backgroundColor: color.hex }}
                        />
                        {color.name}
                    </Radio>
                ))}
                {colorsForRadio.length === 0 && (
                    <Text>No colors available</Text>
                )}
            </Radio.Group>

            <Divider style={{ border: "1px solid", borderColor: "#d4d4d4d4" }} />

            <Title level={1}>Size</Title>
            <div className={styles.size_pick}>
                {availableSizes.map((size) => (
                    <Checkbox
                        key={size}
                        checked={selectedSize === size}
                        onChange={() =>
                            setSelectedSize(
                                selectedSize === size ? null : size
                            )
                        }
                        className={styles.size_box}
                    >
                        {size}
                    </Checkbox>
                ))}
                {availableSizes.length === 0 && (
                    <Text>No sizes available</Text>
                )}
            </div>
        </>
    );

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                {/* Filter untuk desktop */}
                {!isMobile && (
                    <div className={styles.left_container}>
                        <Title level={1}>Filter Options</Title>
                        <Divider style={{ border: "1px solid", borderColor: "#d4d4d4d4" }} />
                        <FilterContent />
                    </div>
                )}

                <div className={styles.right_container}>
                    <div className={styles.top_container_main}>
                        <div className={styles.top_1}>
                            <Text className={styles.showing}>
                                Showing {startIndex + 1}-{Math.min(startIndex + pageSize, sortedProducts.length)} of {sortedProducts.length} products
                            </Text>
                            <div className={styles.menu_sort}>
                                {isMobile && (
                                    <Button
                                        icon={<FilterOutlined />}
                                        onClick={() => setDrawerVisible(true)}
                                        className={styles.filter_button}
                                    >
                                        Filter
                                    </Button>
                                )}
                                <div>
                                    <Text style={{fontSize:"20px"}} className={styles.sort_text}>Sort by : </Text>
                                    <Select
                                        value={sortBy}
                                        onChange={setSortBy}
                                        options={sortOptions}
                                        className={styles.sort_select}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={styles.filter_container}>
                            <Text style={{ fontSize: "24px" }} className={styles.text_filter}>
                                Active Filter:
                            </Text>
                            <div className={styles.filter}>
                                {!hasActiveFilters && (
                                    <div className={styles.no_filter}>
                                        No active filters
                                    </div>
                                )}

                                {selectedCategory.map((cat) => (
                                    <div key={cat} className={styles.filter_tag}>
                                        {cat}
                                        <span
                                            onClick={() =>
                                                setSelectedCategory(
                                                    selectedCategory.filter(
                                                        (c) => c !== cat
                                                    )
                                                )
                                            }
                                            className={styles.remove_btn}
                                        >
                                            <CloseOutlined />
                                        </span>
                                    </div>
                                ))}

                                {selectedColor && (
                                    <div className={styles.filter_tag}>
                                        {selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1)}
                                        <span
                                            onClick={() => setSelectedColor(null)}
                                            className={styles.remove_btn}
                                        >
                                            <CloseOutlined />
                                        </span>
                                    </div>
                                )}

                                {selectedSize && (
                                    <div className={styles.filter_tag}>
                                        {selectedSize}
                                        <span
                                            onClick={() => setSelectedSize(null)}
                                            className={styles.remove_btn}
                                        >
                                            <CloseOutlined />
                                        </span>
                                    </div>
                                )}

                                {isPriceChanged && (
                                    <div className={styles.filter_tag}>
                                        ${priceRange[0]} - ${priceRange[1]}
                                        <span
                                            onClick={() => setPriceRange(defaultPrice)}
                                            className={styles.remove_btn}
                                        >
                                            <CloseOutlined />
                                        </span>
                                    </div>
                                )}
                            </div>

                            {hasActiveFilters && (
                                <Text
                                    onClick={clearAllFilters}
                                    style={{
                                        cursor: "pointer",
                                        color: "#3c1900",
                                        fontWeight: "bold",
                                        textDecoration: "underline",
                                        fontSize: "24px"
                                    }}
                                >
                                    Clear All
                                </Text>
                            )}
                        </div>
                    </div>

                    <div className={styles.product_card}>
                        {currentProducts.length > 0 ? (
                            <>
                                <div className={styles.main_container}>
                                    {currentProducts.map((product) => (
                                        <Link
                                            key={product.id}
                                            href={`/shop/product-details/${product.id}`}
                                            style={{ textDecoration: "none" }}
                                        >
                                            <Card className={styles.card} hoverable>
                                                <div className={styles.gambar}>
                                                    {product.discount && (
                                                        <Text className={styles.label_discount}>
                                                            -{product.discount}% off
                                                        </Text>
                                                    )}
                                                </div>

                                                <div className={styles.container_text}>
                                                    <div className={styles.left_container_product}>
                                                        <Text className={styles.category}>
                                                            {product.label}
                                                        </Text>

                                                        <Title level={4} className={styles.title_card}>
                                                            {product.title}
                                                        </Title>

                                                        <div className={styles.price}>
                                                            <Title level={5} className={styles.price_card}>
                                                                {formatPrice(product.price)}
                                                            </Title>

                                                            {product.oldPrice && (
                                                                <Text delete className={styles.discount_card}>
                                                                    {formatPrice(product.oldPrice)}
                                                                </Text>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className={styles.right_container_product}>
                                                        <StarFilled style={{ color: "orange" }} />
                                                        {product.rating}
                                                    </div>
                                                </div>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>

                                <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
                                    <Pagination
                                        current={currentPage}
                                        pageSize={pageSize}
                                        total={sortedProducts.length}
                                        onChange={(page) => setCurrentPage(page)}
                                        showSizeChanger={false}
                                    />
                                </div>
                            </>
                        ) : (
                            <div style={{
                                textAlign: "center",
                                padding: "50px",
                                fontSize: "24px",
                                color: "#999"
                            }}>
                                No products found matching your filters.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Drawer untuk filter mobile */}
            <Drawer
                title="Filter Options"
                placement="left"
                onClose={() => setDrawerVisible(false)}
                open={drawerVisible}
                size={320}
                className={styles.filter_drawer}
            >
                <FilterContent />

                {/* Tombol Apply untuk mobile */}
                <div style={{ marginTop: 20, textAlign: 'center' }}>
                    <Button
                        type="primary"
                        onClick={() => setDrawerVisible(false)}
                        style={{ width: '100%', backgroundColor: '#3c1900' }}
                    >
                        Apply Filters
                    </Button>
                </div>
            </Drawer>
        </div>
    );
}
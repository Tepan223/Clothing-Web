'use client'
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import styles from "../style/tabs-details.module.css";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { products } from "@/app/data/data-product";
import { Typography, Tabs, Table, Rate, Progress, Avatar, Select, Divider, Input, Upload, Button, message, Image, Modal } from "antd";
import { EyeOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;

export default function TabsDetail() {
    const params = useParams();
    const productId = Number(params.id);

    const product = products.find(p => p.id === productId);

    const [reviews, setReviews] = useState([]);
    const [productRating, setProductRating] = useState(0);
    const [productReviewCount, setProductReviewCount] = useState(0);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    useEffect(() => {
        if (product) {
            setProductRating(product.rating || 0);
            setProductReviewCount(product.review || 0);

            const sampleReviews = generateSampleReviews(product);
            setReviews(sampleReviews);
        }
    }, [product]);

    const generateSampleReviews = (product) => {
        if (!product) return [];

        const baseRating = product.rating || 4;
        const totalReviews = product.review || 50;

        const reviewers = [
            { name: "Kristin Watson", avatar: "https://i.pravatar.cc/150?img=5", verified: true },
            { name: "John Doe", avatar: "https://i.pravatar.cc/150?img=3", verified: true },
            { name: "Sarah Johnson", avatar: "https://i.pravatar.cc/150?img=1", verified: false },
            { name: "Michael Chen", avatar: "https://i.pravatar.cc/150?img=8", verified: true },
            { name: "Emma Wilson", avatar: "https://i.pravatar.cc/150?img=9", verified: true },
            { name: "David Brown", avatar: "https://i.pravatar.cc/150?img=12", verified: false }
        ];

        const reviewTemplates = [
            {
                title: "Love It: My Recent Clothing Purchase",
                content: "I recently picked up some new clothes and I have to say, I'm loving them! From the fit to the fabric, everything about these pieces is just perfect.",
                images: ["https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200", "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=200"]
            },
            {
                title: "Great quality!",
                content: "The material is very comfortable and fits perfectly. Highly recommended!",
                images: ["https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200"]
            },
            {
                title: "Good value for money",
                content: "Decent quality for the price. Shipping was fast.",
                images: []
            },
            {
                title: "Perfect fit!",
                content: "The size chart was accurate and the fit is perfect. Will definitely buy again.",
                images: ["https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200"]
            },
            {
                title: "Excellent product",
                content: "Exceeded my expectations. The quality is outstanding and the color is exactly as shown.",
                images: ["https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200", "https://images.unsplash.com/photo-1470309864661-68328b2cd0a5?w=200"]
            },
            {
                title: "Very satisfied",
                content: "Great purchase! The fabric is soft and comfortable. Worth every penny.",
                images: []
            }
        ];

        // Generate reviews
        const generatedReviews = [];
        for (let i = 0; i < 6; i++) {
            const template = reviewTemplates[i % reviewTemplates.length];
            generatedReviews.push({
                id: i + 1,
                name: reviewers[i % reviewers.length].name,
                avatar: reviewers[i % reviewers.length].avatar,
                date: getRandomDate(),
                title: template.title,
                content: template.content,
                rating: Math.min(5, Math.max(1, Math.floor(baseRating) + (i % 3 - 1))),
                verified: reviewers[i % reviewers.length].verified,
                images: template.images
            });
        }

        return generatedReviews;
    };

    const getRandomDate = () => {
        const dates = ["1 month ago", "2 weeks ago", "3 days ago", "1 week ago", "2 months ago", "Just now"];
        return dates[Math.floor(Math.random() * dates.length)];
    };

    const [newReview, setNewReview] = useState({
        name: "",
        email: "",
        rating: 0,
        title: "",
        content: "",
        photos: []
    });

    const [sortBy, setSortBy] = useState("Newest");
    const [fileList, setFileList] = useState([]);

    const ratingStats = {
        total: reviews.length,
        average: productRating.toFixed(1),
        distribution: {
            5: reviews.filter(r => r.rating === 5).length,
            4: reviews.filter(r => r.rating === 4).length,
            3: reviews.filter(r => r.rating === 3).length,
            2: reviews.filter(r => r.rating === 2).length,
            1: reviews.filter(r => r.rating === 1).length
        }
    };

    const getPercentage = (star) => {
        if (ratingStats.total === 0) return 0;
        return (ratingStats.distribution[star] / ratingStats.total) * 100;
    };

    const getSortedReviews = () => {
        const sorted = [...reviews];
        if (sortBy === "Newest") {
            return sorted.sort((a, b) => {
                const dateOrder = { "Just now": 6, "3 days ago": 5, "1 week ago": 4, "2 weeks ago": 3, "1 month ago": 2, "2 months ago": 1 };
                return (dateOrder[b.date] || 0) - (dateOrder[a.date] || 0);
            });
        } else if (sortBy === "Oldest") {
            return sorted.sort((a, b) => {
                const dateOrder = { "Just now": 6, "3 days ago": 5, "1 week ago": 4, "2 weeks ago": 3, "1 month ago": 2, "2 months ago": 1 };
                return (dateOrder[a.date] || 0) - (dateOrder[b.date] || 0);
            });
        }
        return sorted;
    };

    const handleSortChange = (value) => {
        setSortBy(value);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewReview(prev => ({ ...prev, [name]: value }));
    };

    const handleRatingChange = (value) => {
        setNewReview(prev => ({ ...prev, rating: value }));
    };

    const handleUploadChange = ({ fileList }) => {
        setFileList(fileList);
        const imageUrls = fileList.map(file =>
            file.thumbUrl || (file.originFileObj ? URL.createObjectURL(file.originFileObj) : '')
        );
        setNewReview(prev => ({ ...prev, photos: imageUrls }));
    };

    const handleSubmitReview = () => {
        if (!newReview.name) {
            message.error('Name is required');
            return;
        }
        if (!newReview.email) {
            message.error('Email is required');
            return;
        }
        if (!newReview.rating) {
            message.error('Rating is required');
            return;
        }
        if (!newReview.title) {
            message.error('Review title is required');
            return;
        }
        if (!newReview.content) {
            message.error('Review content is required');
            return;
        }

        const newReviewItem = {
            id: reviews.length + 1,
            name: newReview.name,
            avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
            date: "Just now",
            title: newReview.title,
            content: newReview.content,
            rating: newReview.rating,
            verified: true,
            images: newReview.photos.length > 0 ? newReview.photos : []
        };

        setReviews([newReviewItem, ...reviews]);

        const newTotal = productRating * productReviewCount + newReview.rating;
        const newCount = productReviewCount + 1;
        const newAverage = (newTotal / newCount).toFixed(1);
        setProductRating(parseFloat(newAverage));
        setProductReviewCount(newCount);

        setNewReview({
            name: "",
            email: "",
            rating: 0,
            title: "",
            content: "",
            photos: []
        });
        setFileList([]);

        message.success('Review submitted successfully!');
    };

    const handlePreviewImage = (imageUrl) => {
        setPreviewImage(imageUrl);
        setPreviewVisible(true);
    };

    const columns = [
        {
            title: "Feature",
            dataIndex: "feature",
            key: "feature",
            width: "30%",
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
        },
    ];

    const data = [
        {
            key: "1",
            feature: "Material",
            description: "Cotton",
        },
        {
            key: "2",
            feature: "Size",
            description: "S,M,L,XL,XXL,XXXL",
        },
        {
            key: "3",
            feature: "Color",
            description: "Brown, Grey, Green, Red, Blue",
        },
        {
            key: "4",
            feature: "Country of Origin",
            description: "United States",
        },
        {
            key: "5",
            feature: "Brand",
            description: "KD Design",
        },
    ];

    const items = [
        {
            key: "1",
            label: "Description",
            children: (
                <div>
                    <Paragraph className={styles.desc}>
                        {product?.desc || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}
                    </Paragraph>

                    <Paragraph className={styles.desc}>
                        Sed ut perspiciatis unde omnis iste natus error site voluptatem accusantium doloremque laudatium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                    </Paragraph>

                    <ul className={styles.customList}>
                        <li>100% Lorem ipsum dolor sit amet, consectetur adipiscing elit</li>
                        <li>Ut at nunc vel nisi gravida dictum.</li>
                        <li>Donec non velit sed risus tincidunt suscipit.</li>
                        <li>Cras laoreet lacus in dui posuere fringilla.</li>
                    </ul>
                </div>
            ),
        },
        {
            key: "2",
            label: "Additional Information",
            children: (
                <Table
                    columns={columns}
                    dataSource={data}
                    pagination={false}
                    className={styles.goldTable}
                />
            ),
        },
        {
            key: "3",
            label: `Reviews`,
            children: (
                <div className={styles.reviewContainer}>
                    <div className={styles.ratingSummary}>
                        <div className={styles.ratingLeft}>
                            <Title level={1}>
                                {productRating} <span className={styles.out}>out of 5</span>
                            </Title>
                            <Rate defaultValue={productRating} disabled />
                            <div>({productReviewCount} Reviews)</div>
                        </div>

                        <div className={styles.ratingRight}>
                            <div className={styles.progressRow}>
                                <span>5 Star</span>
                                <Progress percent={getPercentage(5)} showInfo={false} strokeColor="#e2b457"/>
                            </div>
                            <div className={styles.progressRow}>
                                <span>4 Star</span>
                                <Progress percent={getPercentage(4)} showInfo={false} strokeColor="#e2b457"/>
                            </div>
                            <div className={styles.progressRow}>
                                <span>3 Star</span>
                                <Progress percent={getPercentage(3)} showInfo={false} strokeColor="#e2b457"/>
                            </div>
                            <div className={styles.progressRow}>
                                <span>2 Star</span>
                                <Progress percent={getPercentage(2)} showInfo={false} strokeColor="#e2b457"/>
                            </div>
                            <div className={styles.progressRow}>
                                <span>1 Star</span>
                                <Progress percent={getPercentage(1)} showInfo={false} strokeColor="#e2b457"/>
                            </div>
                        </div>
                    </div>

                    <Divider />

                    <div className={styles.reviewHeader}>
                        <Title level={3} style={{margin:"0"}}>Review List</Title>
                        <Select
                            defaultValue="Newest"
                            value={sortBy}
                            onChange={handleSortChange}
                            options={[
                                { value: "Newest", label: "Newest" },
                                { value: "Oldest", label: "Oldest" },
                            ]}
                            style={{ width: 120, fontSize:"20px" }}
                            className={styles.select}
                        />
                    </div>

                    {getSortedReviews().map((review) => (
                        <div key={review.id} className={styles.reviewItem}>
                            <div className={styles.reviewContent}>
                                <div className={styles.reviewTop}>
                                    <div className={styles.avatar_container}>
                                        <Avatar size={64} src={review.avatar} />
                                        <div>
                                            <Text style={{fontSize:"22px", fontWeight:"bold", margin:"0"}}>{review.name}</Text>
                                            {review.verified && (
                                                <div className={styles.verified}>Verified</div>
                                            )}
                                        </div>
                                    </div>
                                    <Text type="secondary" style={{fontSize:"24px"}} className={styles.review_date}>{review.date}</Text>
                                </div>

                                <Title style={{fontSize:"22px" , margin:"0"}}>{review.title}</Title>
                                <Paragraph style={{fontSize:"22px", margin:"0"}} className={styles.desc_review}>
                                    {review.content}
                                </Paragraph>

                                {review.images && review.images.length > 0 && (
                                    <div className={styles.image_review_container}>
                                        {review.images.map((img, idx) => (
                                            <div
                                                key={idx}
                                                className={styles.review_image_wrapper}
                                                onClick={() => handlePreviewImage(img)}
                                            >
                                                <img
                                                    src={img}
                                                    alt={`Review image ${idx + 1}`}
                                                    className={styles.review_image}
                                                />
                                                <div className={styles.image_overlay}>
                                                    <EyeOutlined />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className={styles.rate_container}>
                                    <Rate disabled defaultValue={review.rating}/>
                                    <span>{review.rating}.0</span>
                                </div>
                                <Divider></Divider>
                            </div>
                        </div>
                    ))}

                    <div className={styles.add_review}>
                        <Title level={2} style={{margin:"0"}}> Add your review</Title>
                        <Text type={"secondary"} style={{fontSize:"22px"}} className={styles.add_desc}>Your email address will not published. Required fields are marked*</Text>

                        <div className={styles.name_email}>
                            <div className={styles.name_email_container}>
                                <Title level={3}>Name *</Title>
                                <Input
                                    name="name"
                                    value={newReview.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter Name"
                                />
                            </div>
                            <div className={styles.name_email_container}>
                                <Title level={3}>Email *</Title>
                                <Input
                                    name="email"
                                    value={newReview.email}
                                    onChange={handleInputChange}
                                    placeholder="Enter Email Address"
                                />
                            </div>
                        </div>

                        <div>
                            <Title level={3}>Your Rating *</Title>
                            <Rate
                                value={newReview.rating}
                                onChange={handleRatingChange}
                            />
                        </div>

                        <div className={styles.title_review}>
                            <Title level={3}>Add Review Title *</Title>
                            <Input
                                name="title"
                                value={newReview.title}
                                onChange={handleInputChange}
                                placeholder="Write Title here"
                            />
                        </div>

                        <div className={styles.detail_review}>
                            <Title level={3}>Add Detailed Review *</Title>
                            <TextArea
                                name="content"
                                value={newReview.content}
                                onChange={handleInputChange}
                                placeholder="Write your review..."
                                rows={6}
                            />
                        </div>

                        <div className={styles.upload}>
                            <Title level={3}>Photo / Video (Optional)</Title>
                            <div className={styles.upload}>
                                <Upload
                                    fileList={fileList}
                                    onChange={handleUploadChange}
                                    beforeUpload={() => false}
                                    multiple
                                    listType="picture-card"
                                >
                                    <Button>
                                        <MdOutlineAddPhotoAlternate style={{fontSize:"64px"}}/>
                                        <Text type={"secondary"} style={{fontSize:"24px"}}>Drag a Photo or Video</Text>
                                        <Title level={4} style={{color:"#3c1900", margin:"0"}}>Browse</Title>
                                    </Button>
                                </Upload>
                            </div>
                        </div>

                        <Button
                            style={{background:"#3c1900", color:"white", fontSize:"22px", borderRadius:"0", padding:"25px 35px"}}
                            className={styles.btn}
                            onClick={handleSubmitReview}
                        >
                            Submit
                        </Button>
                    </div>
                </div>
            ),
        },
    ];

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <Tabs
                    defaultActiveKey="1"
                    items={items}
                    centered
                />
                <Modal
                    open={previewVisible}
                    footer={null}
                    onCancel={() => setPreviewVisible(false)}
                    width={800}
                >
                    <img alt="preview" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        </div>
    );
}
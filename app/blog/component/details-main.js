'use client'
import styles from "../styles/details-main.module.css";
import { Typography, Avatar, Divider } from "antd";
import { UserOutlined,FacebookFilled,TwitterCircleFilled,LinkedinFilled } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const categories = [
    "Streetwear",
    "Luxury",
    "Casual",
    "Men",
    "Women",
    "Accessories",
    "Sneakers",
    "Vintage",
    "Minimalist",
    "Summer Style",
    "Winter Fashion",
    "Formal Wear",
    "Denim",
    "Sportwear",
    "Trendy"
];

export default function DetailsMain({ post }) {

    if (!post) return <Text>Post tidak ditemukan</Text>;

    return (
        <div className={styles.container}>
            <div className={styles.top_container}>
                <div className={styles.img_contain}></div>
                <div className={styles.tag_container}>
                    {post.tags.map((tag, index) => (
                        <Text key={index} className={styles.tag}>
                            {tag}
                        </Text>
                    ))}
                </div>
                <Title style={{margin:"0"}} className={styles.title_top}>{post.title}</Title>
                <div className={styles.avatar_write}>
                    <Avatar size={64} icon={<UserOutlined />} />
                    <div className={styles.child_avatar}>
                        <Text style={{fontWeight:"bold", fontSize:"18px"}}>Written by Jenny Alexander</Text>
                        <div className={styles.time}>
                            <Text type={"secondary"} style={{fontSize:"18px"}}>20 March 2024</Text>
                            |
                            <Text type={"secondary"} style={{fontSize:"18px"}}>12 min read</Text>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.child}>
                <div className={styles.left_container}>
                    <Text type={"secondary"} className={styles.share}>SHARE</Text>
                    <div className={styles.icon_container}>
                        <FacebookFilled className={styles.icon}/>
                        <TwitterCircleFilled className={styles.icon}/>
                        <LinkedinFilled className={styles.icon}/>
                    </div>
                </div>
                <div className={styles.mid_container}>
                    <div className={styles.a1}>
                        <Avatar size={64} icon={<UserOutlined />} />
                        <Text type={"secondary"} style={{fontSize:"22px"}} className={styles.text}>Lorem ipsum dolor sit amet, consectetur adispiscing elit, sed do eiusmod tempor<br/>incididunt ut labore et</Text>
                    </div>
                    <div>
                        <Text type={"secondary"} style={{fontSize:"22px"}} className={styles.text}>ed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,<br/>
                        totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecti beatae vitae dicta<br/>
                        sunt explicabo.
                        </Text>
                    </div>
                    <div>
                        <Title className={styles.title}>Fashion Trends Throughout the Year</Title>
                        <div className={styles.img_with_text}>
                            <Text type={"secondary"} style={{fontSize:"22px"}} className={styles.text}>ed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,<br/>
                                totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecti beatae vitae dicta<br/>
                                sunt explicabo.
                            </Text>
                            <div className={styles.img_2}>
                                <div className={styles.gambar_2}></div>
                                <div className={styles.gambar_2}></div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <Title className={styles.title}>Decoding the Lates Fashion Shows</Title>
                        <ul className={styles.customList}>
                            <li><Text type={"secondary"} style={{fontSize:"22px"}} className={styles.text}>Lorem ipsum dolor sit amet, consectetur adispiscing elit, sed do eiusmod tempor incididunt ut<br/>labore et.</Text></li>
                            <li><Text type={"secondary"} style={{fontSize:"22px"}} className={styles.text}>Lorem ipsum dolor sit amet, consectetur adispiscing elit, sed do eiusmod tempor incididunt ut<br/>labore et.</Text></li>
                            <li><Text type={"secondary"} style={{fontSize:"22px"}} className={styles.text}>Lorem ipsum dolor sit amet, consectetur adispiscing elit, sed do eiusmod tempor incididunt ut<br/>labore et.</Text></li>
                            <li><Text type={"secondary"} style={{fontSize:"22px"}} className={styles.text}>Lorem ipsum dolor sit amet, consectetur adispiscing elit, sed do eiusmod tempor incididunt ut<br/>labore et.</Text></li>
                        </ul>
                    </div>
                    <div className={styles.quotes}>
                        <Title level={2} style={{color:"#f6ad55"}}>Also Read :</Title>
                        <Text style={{fontSize:"22px", color:"white"}} className={styles.quotes_border}>"Learn About the Latest Fashion Trends"</Text>
                    </div>
                    <div>
                        <Title className={styles.title}>Crafting Your Own Fashion</Title>
                        <div className={styles.big_container_text}>
                            <Text type={"secondary"} style={{fontSize:"22px"}} className={styles.text}>ed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,<br/>
                                totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecti beatae vitae dicta<br/>
                                sunt explicabo.
                            </Text>
                            <div className={styles.big_img}></div>
                        </div>
                    </div>
                    <div>
                        <Title className={styles.title}>Learning from Fashion's Digital Elite</Title>
                        <Text type={"secondary"} style={{fontSize:"22px"}} className={styles.text}>ed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,<br/>
                            totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecti beatae vitae dicta<br/>
                            sunt explicabo.
                        </Text>
                    </div>
                    <div className={styles.comment}>
                        <Avatar size={64} icon={<UserOutlined />} />
                        <div >
                            <Title level={3}>Jenny Alexander</Title>
                            <Text style={{fontSize:"22px"}} className={styles.text}>ed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium <br/>doloremque,
                                totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et <br/>quasi architecti vitae dicta
                                sunt.
                            </Text>
                        </div>
                    </div>
                </div>
                <div className={styles.right_container}>
                    <Title level={1} className={styles.title}>Filter by Categories</Title>
                    <div className={styles.categories}>
                        {categories.map((cat, i) => (
                            <div key={i} className={styles.category_item}>
                                {cat}
                            </div>
                        ))}
                    </div>
                    <Divider style={{border:"1px solid #5555"}}/>
                    <Title className={styles.title}>Table of Content</Title>
                    <div className={styles.content}>
                        <Text type={"secondary"} style={{fontSize:"24px"}} className={styles.text}>
                            Fashion Trends Throughout the Year
                        </Text>
                        <Text type={"secondary"} style={{fontSize:"24px"}} className={styles.text}>
                            Decoding the Latest Fashion Shows
                        </Text>
                        <Text type={"secondary"} style={{fontSize:"24px"}} className={styles.text}>
                            Crafting Your Own Fashion
                        </Text>
                        <Text type={"secondary"} style={{fontSize:"24px"}} className={styles.text}>
                            Learning from Fashion's Digital Elite
                        </Text>
                    </div>
                    <div className={styles.poster}></div>
                </div>
            </div>
        </div>
    );
}
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Path ke file akun.json
const accountsFilePath = path.join(process.cwd(), 'akun.json');

// Helper function untuk membaca accounts
const readAccounts = () => {
    try {
        if (!fs.existsSync(accountsFilePath)) {
            // Buat file baru dengan array kosong jika belum ada
            const initialData = [
                {
                    id: 1,
                    firstName: "Stevanus",
                    lastName: "Gabriel",
                    email: "stevanus@gmail.com",
                    password: "12345678",
                    cart: [],
                    wishlist: []
                }
            ];
            fs.writeFileSync(accountsFilePath, JSON.stringify(initialData, null, 2), 'utf8');
            return initialData;
        }
        const data = fs.readFileSync(accountsFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading accounts:', error);
        return [];
    }
};

// Helper function untuk menulis accounts
const writeAccounts = (accounts) => {
    try {
        fs.writeFileSync(accountsFilePath, JSON.stringify(accounts, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Error writing accounts:', error);
        return false;
    }
};

// GET: Ambil wishlist user
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({
                success: false,
                error: 'User ID diperlukan'
            }, { status: 400 });
        }

        const accounts = readAccounts();
        const user = accounts.find(acc => acc.id === parseInt(userId));

        if (!user) {
            return NextResponse.json({
                success: false,
                error: 'User tidak ditemukan'
            }, { status: 404 });
        }

        // Pastikan wishlist ada (inisialisasi jika belum)
        if (!user.wishlist) {
            user.wishlist = [];
            // Simpan perubahan
            writeAccounts(accounts);
        }

        return NextResponse.json({
            success: true,
            wishlist: user.wishlist
        });
    } catch (error) {
        console.error('Error reading wishlist:', error);
        return NextResponse.json({
            success: false,
            error: 'Gagal mengambil wishlist'
        }, { status: 500 });
    }
}

// POST: Tambah ke wishlist dengan informasi lengkap
export async function POST(request) {
    try {
        const body = await request.json();
        const { userId, product } = body;

        console.log('POST /api/wishlist - Request:', { userId, product });

        if (!userId || !product) {
            return NextResponse.json({
                success: false,
                error: 'User ID dan product diperlukan'
            }, { status: 400 });
        }

        // Validasi data produk yang diperlukan
        if (!product.id || !product.name || !product.price) {
            return NextResponse.json({
                success: false,
                error: 'Data produk tidak lengkap (id, name, price required)'
            }, { status: 400 });
        }

        const accounts = readAccounts();
        const userIndex = accounts.findIndex(acc => acc.id === parseInt(userId));

        if (userIndex === -1) {
            return NextResponse.json({
                success: false,
                error: 'User tidak ditemukan'
            }, { status: 404 });
        }

        // Inisialisasi wishlist jika belum ada
        if (!accounts[userIndex].wishlist) {
            accounts[userIndex].wishlist = [];
        }

        // Cek apakah produk dengan kombinasi color dan size yang sama sudah ada di wishlist
        const existingProductIndex = accounts[userIndex].wishlist.findIndex(
            item => item.id === product.id &&
                item.selectedColor === product.selectedColor &&
                item.selectedSize === product.selectedSize
        );

        if (existingProductIndex !== -1) {
            // Jika sudah ada, hapus dari wishlist (toggle)
            accounts[userIndex].wishlist.splice(existingProductIndex, 1);
            const message = 'Product removed from wishlist';

            // Simpan perubahan
            const saved = writeAccounts(accounts);
            if (!saved) {
                throw new Error('Failed to save wishlist');
            }

            return NextResponse.json({
                success: true,
                message,
                wishlist: accounts[userIndex].wishlist,
                isInWishlist: false
            });
        } else {
            // Tambah produk baru ke wishlist dengan informasi lengkap
            const wishlistItem = {
                id: product.id,
                name: product.title || product.name,
                price: product.price,
                originalPrice: product.originalPrice || product.oldPrice || null,
                image: product.image || '',
                category: product.category || product.label || '',
                selectedColor: product.selectedColor || 'Brown',
                selectedSize: product.selectedSize || 'M',
                quantity: product.quantity || 1,
                inStock: product.inStock !== undefined ? product.inStock : true,
                rating: product.rating || 0,
                review: product.review || 0,
                addedAt: new Date().toISOString()
            };

            accounts[userIndex].wishlist.push(wishlistItem);
            const message = 'Product added to wishlist';

            // Simpan perubahan
            const saved = writeAccounts(accounts);
            if (!saved) {
                throw new Error('Failed to save wishlist');
            }

            return NextResponse.json({
                success: true,
                message,
                wishlist: accounts[userIndex].wishlist,
                isInWishlist: true
            });
        }
    } catch (error) {
        console.error('Error updating wishlist:', error);
        return NextResponse.json({
            success: false,
            error: 'Gagal mengupdate wishlist'
        }, { status: 500 });
    }
}

// DELETE: Hapus dari wishlist berdasarkan ID, color, dan size
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const productId = searchParams.get('productId');
        const color = searchParams.get('color');
        const size = searchParams.get('size');

        console.log('DELETE /api/wishlist - Request:', { userId, productId, color, size });

        if (!userId || !productId) {
            return NextResponse.json({
                success: false,
                error: 'User ID dan Product ID diperlukan'
            }, { status: 400 });
        }

        const accounts = readAccounts();
        const userIndex = accounts.findIndex(acc => acc.id === parseInt(userId));

        if (userIndex === -1) {
            return NextResponse.json({
                success: false,
                error: 'User tidak ditemukan'
            }, { status: 404 });
        }

        // Filter out produk yang akan dihapus berdasarkan ID, color, dan size
        if (color && size) {
            // Hapus dengan kombinasi spesifik
            accounts[userIndex].wishlist = (accounts[userIndex].wishlist || []).filter(
                item => !(item.id === parseInt(productId) &&
                    item.selectedColor === color &&
                    item.selectedSize === size)
            );
        } else {
            // Hapus semua varian produk dengan ID tersebut
            accounts[userIndex].wishlist = (accounts[userIndex].wishlist || []).filter(
                item => item.id !== parseInt(productId)
            );
        }

        // Simpan perubahan
        const saved = writeAccounts(accounts);
        if (!saved) {
            throw new Error('Failed to save wishlist');
        }

        return NextResponse.json({
            success: true,
            message: 'Product removed from wishlist',
            wishlist: accounts[userIndex].wishlist
        });
    } catch (error) {
        console.error('Error deleting from wishlist:', error);
        return NextResponse.json({
            success: false,
            error: 'Gagal menghapus dari wishlist'
        }, { status: 500 });
    }
}
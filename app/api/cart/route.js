import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Path ke file akun.json
const accountsFilePath = path.join(process.cwd(), 'akun.json');

// GET: Ambil cart user berdasarkan ID
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID diperlukan' }, { status: 400 });
        }

        // Baca file akun.json
        const fileContent = await fs.readFile(accountsFilePath, 'utf8');
        const accounts = JSON.parse(fileContent);

        // Cari user berdasarkan ID
        const user = accounts.find(acc => acc.id === parseInt(userId));

        if (!user) {
            return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
        }

        return NextResponse.json({ cart: user.cart || [] });
    } catch (error) {
        console.error('Error membaca cart:', error);
        return NextResponse.json({ error: 'Gagal mengambil data cart' }, { status: 500 });
    }
}

// POST: Tambah item ke cart
export async function POST(request) {
    try {
        const body = await request.json();
        const { userId, product } = body;

        if (!userId || !product) {
            return NextResponse.json({
                error: 'User ID dan product diperlukan'
            }, { status: 400 });
        }

        // Baca file akun.json
        const fileContent = await fs.readFile(accountsFilePath, 'utf8');
        const accounts = JSON.parse(fileContent);

        // Cari index user
        const userIndex = accounts.findIndex(acc => acc.id === parseInt(userId));

        if (userIndex === -1) {
            return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
        }

        // Inisialisasi cart jika belum ada
        if (!accounts[userIndex].cart) {
            accounts[userIndex].cart = [];
        }

        // Cek apakah produk dengan color dan size yang sama sudah ada di cart
        const existingProductIndex = accounts[userIndex].cart.findIndex(
            item => item.id === product.id &&
                item.selectedColor === product.selectedColor &&
                item.selectedSize === product.selectedSize
        );

        if (existingProductIndex !== -1) {
            // Update quantity jika produk sudah ada
            accounts[userIndex].cart[existingProductIndex].quantity += product.quantity;
        } else {
            // Tambah produk baru
            accounts[userIndex].cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                selectedColor: product.selectedColor,
                selectedSize: product.selectedSize,
                quantity: product.quantity,
                addedAt: new Date().toISOString()
            });
        }

        // Tulis kembali ke file
        await fs.writeFile(accountsFilePath, JSON.stringify(accounts, null, 2));

        return NextResponse.json({
            message: 'Produk berhasil ditambahkan ke cart',
            cart: accounts[userIndex].cart
        });
    } catch (error) {
        console.error('Error menambah ke cart:', error);
        return NextResponse.json({ error: 'Gagal menambah ke cart' }, { status: 500 });
    }
}

// PUT: Update quantity item di cart
export async function PUT(request) {
    try {
        const body = await request.json();
        const { userId, productId, color, size, quantity } = body;

        if (!userId || !productId) {
            return NextResponse.json({ error: 'User ID dan Product ID diperlukan' }, { status: 400 });
        }

        const fileContent = await fs.readFile(accountsFilePath, 'utf8');
        const accounts = JSON.parse(fileContent);

        const userIndex = accounts.findIndex(acc => acc.id === parseInt(userId));

        if (userIndex === -1) {
            return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
        }

        // Cari produk di cart
        const productIndex = accounts[userIndex].cart.findIndex(
            item => item.id === productId &&
                item.selectedColor === color &&
                item.selectedSize === size
        );

        if (productIndex === -1) {
            return NextResponse.json({ error: 'Produk tidak ditemukan di cart' }, { status: 404 });
        }

        if (quantity <= 0) {
            // Hapus produk jika quantity <= 0
            accounts[userIndex].cart.splice(productIndex, 1);
        } else {
            // Update quantity
            accounts[userIndex].cart[productIndex].quantity = quantity;
        }

        await fs.writeFile(accountsFilePath, JSON.stringify(accounts, null, 2));

        return NextResponse.json({
            message: 'Cart berhasil diupdate',
            cart: accounts[userIndex].cart
        });
    } catch (error) {
        console.error('Error mengupdate cart:', error);
        return NextResponse.json({ error: 'Gagal mengupdate cart' }, { status: 500 });
    }
}

// DELETE: Hapus item dari cart
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const productId = searchParams.get('productId');
        const color = searchParams.get('color');
        const size = searchParams.get('size');

        if (!userId || !productId) {
            return NextResponse.json({ error: 'User ID dan Product ID diperlukan' }, { status: 400 });
        }

        const fileContent = await fs.readFile(accountsFilePath, 'utf8');
        const accounts = JSON.parse(fileContent);

        const userIndex = accounts.findIndex(acc => acc.id === parseInt(userId));

        if (userIndex === -1) {
            return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
        }

        // Filter out produk yang akan dihapus
        accounts[userIndex].cart = accounts[userIndex].cart.filter(
            item => !(item.id === parseInt(productId) &&
                item.selectedColor === color &&
                item.selectedSize === size)
        );

        await fs.writeFile(accountsFilePath, JSON.stringify(accounts, null, 2));

        return NextResponse.json({
            message: 'Produk berhasil dihapus dari cart',
            cart: accounts[userIndex].cart
        });
    } catch (error) {
        console.error('Error menghapus dari cart:', error);
        return NextResponse.json({ error: 'Gagal menghapus dari cart' }, { status: 500 });
    }
}
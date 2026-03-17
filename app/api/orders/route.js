// app/api/orders/route.js
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const accountsFilePath = path.join(process.cwd(), 'akun.json');

// Fungsi untuk membaca file akun.json
async function readAccountsFile() {
    try {
        const data = await fs.readFile(accountsFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading accounts file:', error);
        return [];
    }
}

// Fungsi untuk menulis ke file akun.json
async function writeAccountsFile(accounts) {
    try {
        await fs.writeFile(accountsFilePath, JSON.stringify(accounts, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Error writing accounts file:', error);
        return false;
    }
}

// POST /api/orders - Menambahkan order baru
export async function POST(request) {
    try {
        const { userId, order } = await request.json();

        if (!userId || !order) {
            return NextResponse.json(
                { error: 'User ID and order data are required' },
                { status: 400 }
            );
        }

        // Baca file accounts
        const accounts = await readAccountsFile();

        // Cari user berdasarkan ID
        const userIndex = accounts.findIndex(acc => acc.id === userId);

        if (userIndex === -1) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Inisialisasi array orders jika belum ada
        if (!accounts[userIndex].orders) {
            accounts[userIndex].orders = [];
        }

        // Tambahkan order baru
        accounts[userIndex].orders.push({
            ...order,
            orderDate: new Date().toISOString(),
            status: 'Processing'
        });

        // Simpan kembali ke file
        const written = await writeAccountsFile(accounts);

        if (!written) {
            return NextResponse.json(
                { error: 'Failed to save order' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Order saved successfully',
            order: order
        });

    } catch (error) {
        console.error('Error in POST /api/orders:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// GET /api/orders?userId=123 - Mendapatkan semua orders user
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        // Baca file accounts
        const accounts = await readAccountsFile();

        // Cari user berdasarkan ID
        const user = accounts.find(acc => acc.id === parseInt(userId) || acc.id === userId);

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Kembalikan orders user (atau array kosong jika tidak ada)
        return NextResponse.json({
            orders: user.orders || []
        });

    } catch (error) {
        console.error('Error in GET /api/orders:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE /api/orders?userId=123&orderId=ORD-xxx - Menghapus order
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const orderId = searchParams.get('orderId');

        if (!userId || !orderId) {
            return NextResponse.json(
                { error: 'User ID and Order ID are required' },
                { status: 400 }
            );
        }

        // Baca file accounts
        const accounts = await readAccountsFile();

        // Cari user berdasarkan ID
        const userIndex = accounts.findIndex(acc => acc.id === parseInt(userId) || acc.id === userId);

        if (userIndex === -1) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        if (!accounts[userIndex].orders) {
            return NextResponse.json(
                { error: 'No orders found' },
                { status: 404 }
            );
        }

        // Filter out the order to delete
        accounts[userIndex].orders = accounts[userIndex].orders.filter(
            order => order.orderId !== orderId
        );

        // Simpan kembali ke file
        const written = await writeAccountsFile(accounts);

        if (!written) {
            return NextResponse.json(
                { error: 'Failed to delete order' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Order deleted successfully'
        });

    } catch (error) {
        console.error('Error in DELETE /api/orders:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT /api/orders - Update status order
export async function PUT(request) {
    try {
        const { userId, orderId, status } = await request.json();

        if (!userId || !orderId || !status) {
            return NextResponse.json(
                { error: 'User ID, Order ID, and status are required' },
                { status: 400 }
            );
        }

        // Baca file accounts
        const accounts = await readAccountsFile();

        // Cari user berdasarkan ID
        const userIndex = accounts.findIndex(acc => acc.id === parseInt(userId) || acc.id === userId);

        if (userIndex === -1) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        if (!accounts[userIndex].orders) {
            return NextResponse.json(
                { error: 'No orders found' },
                { status: 404 }
            );
        }

        // Cari order berdasarkan orderId
        const orderIndex = accounts[userIndex].orders.findIndex(
            order => order.orderId === orderId
        );

        if (orderIndex === -1) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        // Update status order
        accounts[userIndex].orders[orderIndex].status = status;

        // Simpan kembali ke file
        const written = await writeAccountsFile(accounts);

        if (!written) {
            return NextResponse.json(
                { error: 'Failed to update order' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Order status updated successfully'
        });

    } catch (error) {
        console.error('Error in PUT /api/orders:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
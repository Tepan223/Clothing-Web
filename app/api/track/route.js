import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request) {
    try {
        const { orderId, email } = await request.json();

        console.log('Track API called with:', { orderId, email });

        if (!orderId || !email) {
            return NextResponse.json(
                { error: 'Order ID and email are required' },
                { status: 400 }
            );
        }

        // Path ke file akun.json
        const accountsFilePath = path.join(process.cwd(), 'akun.json');
        console.log('Looking for accounts file at:', accountsFilePath);

        // Baca file accounts
        let accounts = [];
        try {
            const data = await fs.readFile(accountsFilePath, 'utf8');
            accounts = JSON.parse(data);
            console.log('Accounts loaded:', accounts.length);
        } catch (error) {
            console.error('Error reading accounts file:', error);
            return NextResponse.json(
                { error: 'Failed to read accounts data' },
                { status: 500 }
            );
        }

        // Cari order berdasarkan orderId
        let foundOrder = null;
        let foundUser = null;

        for (const account of accounts) {
            if (account.orders && Array.isArray(account.orders)) {
                const order = account.orders.find(o => o.orderId === orderId);
                if (order) {
                    foundOrder = order;
                    foundUser = account;
                    break;
                }
            }
        }

        // Cek apakah order ditemukan
        if (!foundOrder) {
            console.log('Order not found');
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        // Verifikasi email dengan billing email dari order
        const billingEmail = foundOrder.billingDetails?.email;

        if (!billingEmail) {
            console.log('No billing email found in order');
            return NextResponse.json(
                { error: 'Billing email not found in order' },
                { status: 404 }
            );
        }

        // Compare with billing email (case insensitive)
        if (billingEmail.toLowerCase() !== email.toLowerCase()) {
            console.log('Email mismatch:', { billingEmail, providedEmail: email });
            return NextResponse.json(
                { error: 'Billing email does not match' },
                { status: 404 }
            );
        }

        console.log('Order found and email verified:', foundOrder.orderId);

        // Return order details without sensitive user data
        return NextResponse.json({
            success: true,
            order: foundOrder,
            user: {
                name: foundUser.name,
                email: foundUser.email
            }
        });

    } catch (error) {
        console.error('Error in POST /api/track:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// GET method untuk testing
export async function GET() {
    return NextResponse.json({ message: 'Track API is working. Use POST method with orderId and billing email.' });
}
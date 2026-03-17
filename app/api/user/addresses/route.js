import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const accountsFilePath = path.join(process.cwd(), 'akun.json');

// Helper function untuk membaca accounts
const readAccounts = () => {
    try {
        if (!fs.existsSync(accountsFilePath)) {
            fs.writeFileSync(accountsFilePath, '[]', 'utf8');
            return [];
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

// PUT: Update addresses
export async function PUT(request) {
    try {
        const body = await request.json();
        const { userId, addresses } = body;

        if (!userId) {
            return NextResponse.json({
                success: false,
                error: 'User ID diperlukan'
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

        // Update addresses
        accounts[userIndex].addresses = addresses || [];
        accounts[userIndex].updatedAt = new Date().toISOString();

        const saved = writeAccounts(accounts);
        if (!saved) {
            throw new Error('Failed to save addresses');
        }

        return NextResponse.json({
            success: true,
            message: 'Addresses updated successfully',
            addresses: accounts[userIndex].addresses
        });
    } catch (error) {
        console.error('Error updating addresses:', error);
        return NextResponse.json({
            success: false,
            error: 'Gagal mengupdate addresses'
        }, { status: 500 });
    }
}
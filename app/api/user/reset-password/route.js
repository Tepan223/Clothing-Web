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

// POST: Reset password
export async function POST(request) {
    try {
        const body = await request.json();
        const { userId, currentPassword, newPassword } = body;

        console.log('Reset password request:', { userId, currentPassword, newPassword });

        // Validasi input
        if (!userId || !currentPassword || !newPassword) {
            return NextResponse.json({
                success: false,
                error: 'User ID, current password, and new password are required'
            }, { status: 400 });
        }

        // Validasi panjang password
        if (newPassword.length < 8) {
            return NextResponse.json({
                success: false,
                error: 'Password must be at least 8 characters'
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

        // Verifikasi current password
        if (accounts[userIndex].password !== currentPassword) {
            return NextResponse.json({
                success: false,
                error: 'Current password is incorrect'
            }, { status: 401 });
        }

        // Update password
        accounts[userIndex].password = newPassword;
        accounts[userIndex].updatedAt = new Date().toISOString();

        const saved = writeAccounts(accounts);
        if (!saved) {
            throw new Error('Failed to save new password');
        }

        // Hapus password dari response
        const { password, ...userWithoutPassword } = accounts[userIndex];

        return NextResponse.json({
            success: true,
            message: 'Password updated successfully',
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('Error resetting password:', error);
        return NextResponse.json({
            success: false,
            error: 'Gagal mereset password'
        }, { status: 500 });
    }
}
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

// GET: Ambil data user berdasarkan ID
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

        // Hapus password dari response
        const { password, ...userWithoutPassword } = user;

        return NextResponse.json({
            success: true,
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json({
            success: false,
            error: 'Gagal mengambil data user'
        }, { status: 500 });
    }
}

// PUT: Update data user
export async function PUT(request) {
    try {
        const body = await request.json();
        const { userId, firstName, lastName, email, phone, gender } = body;

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

        // Update data user
        if (firstName) accounts[userIndex].firstName = firstName;
        if (lastName) accounts[userIndex].lastName = lastName;
        if (email) accounts[userIndex].email = email;
        if (phone) accounts[userIndex].phone = phone;
        if (gender) accounts[userIndex].gender = gender;

        const saved = writeAccounts(accounts);
        if (!saved) {
            throw new Error('Failed to save user data');
        }

        // Hapus password dari response
        const { password, ...userWithoutPassword } = accounts[userIndex];

        return NextResponse.json({
            success: true,
            message: 'User data updated successfully',
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({
            success: false,
            error: 'Gagal mengupdate data user'
        }, { status: 500 });
    }
}
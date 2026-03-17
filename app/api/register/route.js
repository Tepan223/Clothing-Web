import fs from "fs";
import path from "path";

export async function POST(req) {
    try {
        const body = await req.json();
        const { firstName, lastName, email, password } = body;

        // Validasi input
        if (!firstName || !lastName || !email || !password) {
            return new Response(JSON.stringify({
                message: "Semua field harus diisi"
            }), { status: 400 });
        }

        const filePath = path.join(process.cwd(), "akun.json");

        // Jika file belum ada, buat file kosong
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, "[]", "utf-8");
        }

        const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

        // Cek email sudah ada
        if (data.find(u => u.email === email)) {
            return new Response(JSON.stringify({
                message: "Email already exists"
            }), { status: 400 });
        }

        // Generate ID baru
        const newId = data.length > 0 ? Math.max(...data.map(user => user.id)) + 1 : 1;

        // Buat user baru dengan ID
        const newUser = {
            id: newId,
            firstName,
            lastName,
            email,
            password, // Dalam production, hash password!
            cart: [],
            whistlist:[],
            createdAt: new Date().toISOString()
        };

        data.push(newUser);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

        // Kirim response tanpa password
        const userResponse = {
            id: newUser.id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email
        };

        return new Response(JSON.stringify({
            message: "Account created",
            user: userResponse
        }), { status: 201 });

    } catch (err) {
        console.error("Registration error:", err);
        return new Response(JSON.stringify({
            message: "Internal server error"
        }), { status: 500 });
    }
}
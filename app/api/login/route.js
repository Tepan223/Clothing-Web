import fs from "fs";
import path from "path";

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        const filePath = path.join(process.cwd(), "akun.json");

        if (!fs.existsSync(filePath)) {
            return new Response(JSON.stringify({ message: "No users found" }), { status: 404 });
        }

        const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        const user = data.find(u => u.email === email && u.password === password);

        if (!user) {
            return new Response(JSON.stringify({ message: "Invalid credentials" }), { status: 401 });
        }

        const { password: _, ...userWithoutPassword } = user;
        return new Response(JSON.stringify(userWithoutPassword), { status: 200 });

    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
    }
}
import { connectToDb } from "@/utils/database";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const POST = async (req: Request, res: Response) => {
  const { email, password } = await req.json();

  try {
    await connectToDb();
    const existingUser = await User.findOne({ email: email });

    if (!existingUser) {
      return new Response(JSON.stringify({ message: "Invalid email" }), {
        status: 401,
      });
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);

    if (!passwordMatch) {
      return new Response(JSON.stringify({ message: "Invalid password" }), {
        status: 401,
      });
    }

    const secretKey = process.env.SECRET_KEY as string;

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: existingUser._id,
        email: existingUser.email,
        username: existingUser.username,
        fullName: existingUser.fullName,
        nationality: existingUser.nationality,
        referralCode: existingUser.referralCode,
      },
      secretKey,
      { expiresIn: "3d" }
    );

    return new Response(JSON.stringify({ token }), {
      status: 200,
    });
  } catch (error: any) {
    console.error("Error during sign-in:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
};

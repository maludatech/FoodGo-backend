import { connectToDb } from "@/utils/database";
import User from "@/models/User";
import nodemailer from "nodemailer";
import crypto from "crypto";

export const POST = async (req: Request, res: Response) => {
  try {
    const { email } = await req.json();

    await connectToDb();

    const user = await User.findOne({ email });

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(3).toString("hex").slice(0, 6);
    const resetTokenExpiry = Date.now() + 30 * 60 * 1000; // 30 minutes

    // Save token and expiry to user
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.GMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: "FoodGo Ltd",
      to: user.email,
      subject: "🔒 Password Reset - FoodGo",
      html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
                <div style="text-align: center;">
                    <img src="https://res.cloudinary.com/dlnvweuhv/image/upload/v1732232273/hamburger-burger-svgrepo-com_oevwg5.png" alt="FoodGo Logo" style="width: 80px; height: 80px; margin-bottom: 20px;" />
                </div>
                <p style="color: #333; font-size: 18px; font-weight: bold;">Hello ${user.username},</p>
                <p style="color: #555; font-size: 16px;">You recently requested to reset your password for your CryptFX account.</p>
                <p style="color: #333; font-weight: bold; font-size: 22px; background-color: #f8f8f8; padding: 10px 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
                    ${resetToken}
                </p>
                <p style="color: #555; font-size: 16px;">Please use the above code to reset your password. This code will expire in 30 minutes.</p>
                <p style="color: #555; font-size: 16px;">If you did not request this, please ignore this email or <a href="https://CryptFX.vercel.app/contact" style="color: #EF2A39; text-decoration: none;">contact our support team</a> immediately.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="color: #555; font-size: 14px; text-align: center;">
                    Thank you for using <span style="color: #EF2A39; font-weight: bold;">FoodGo</span>.<br>
                    <strong>Best wishes,</strong><br>
                    FoodGo Team
                </p>
            </div>
        `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return new Response(
      JSON.stringify({ message: "Password reset email sent" }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error getting email: ", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
};

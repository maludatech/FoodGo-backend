import { connectToDb } from "@/utils/database";
import User from "@/models/User";
import nodemailer from "nodemailer";

export const POST = async (req: Request) => {
  try {
    const { fullName, email, imageUrl } = await req.json();

    // Validate input data
    if (!fullName || !email || !imageUrl) {
      return new Response(JSON.stringify({ message: "Invalid request data" }), {
        status: 400,
      });
    }

    // Connect to the database
    await connectToDb();

    // Check if the user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user
      user = await User.create({
        email,
        fullName,
        imageUrl,
      });

      // Configure Nodemailer
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.GMAIL,
          pass: process.env.PASSWORD,
        },
      });

      // Email options
      const mailOptions = {
        from: "FoodGo Ltd",
        to: user.email,
        subject: "Welcome to FoodGo",
        html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px; background-color: #f9f9f9;">
                  <div style="text-align: center;">
                      <img src="https://res.cloudinary.com/dlnvweuhv/image/upload/v1732232273/hamburger-burger-svgrepo-com_oevwg5.png" alt="FoodGo Logo" style="width: 80px; height: 80px; margin-bottom: 20px;" />
                  </div>
                  <h2 style="color: #333; text-align: center;">Welcome to FoodGo, ${user.fullName}!</h2>
                  <p style="color: #555; font-size: 16px;">
                      We're excited to have you join the FoodGo family! Your account has been successfully created, and now you're ready to dive into the delicious world of hamburgers!!!
                  </p>
                  <p style="color: #555; font-size: 16px; padding: 12px; border-left: 4px solid #EF2A39; font-style: italic;">
                      Whether you're craving our famous hamburgers or juicy burgers, we promise to delight your taste buds with every bite. Our menu is packed with mouthwatering options that will keep you coming back for more!
                  </p>
                  <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                  <p style="color: #555; font-size: 14px; text-align: center;">
                      Thank you for choosing <span style="color: #EF2A39; font-weight: bold;">FoodGo</span>.<br>
                      <strong>Bon Appétit!</strong><br>
                      FoodGo Team
                  </p>
              </div>
          `,
      };

      await transporter.sendMail(mailOptions);

      return new Response(
        JSON.stringify({
          message: "User created successfully",
          deliveryAddress: user.deliveryAddress,
        }),
        { status: 201 }
      );
    } else {
      // Update existing user details
      user.fullName = fullName;
      user.imageUrl = imageUrl;
      await user.save();

      return new Response(
        JSON.stringify({
          message: "User signed in successfully",
          deliveryAddress: user.deliveryAddress,
        }),
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.error(
      "Error during sign-in:",
      error.message || "Internal Server Error"
    );
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
};

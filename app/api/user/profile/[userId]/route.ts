import { connectToDb } from "@/utils/database";
import User from "@/models/User";
import bcrypt from "bcrypt";

// GET request to fetch user details by userId
export const GET = async (
  req: Request,
  { params }: { params: { userId: string } }
) => {
  const userId = params.userId;
  try {
    await connectToDb();

    const user = await User.findById(userId);

    if (!user) {
      console.error("User not found");
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error("Error fetching user details", error);
    return new Response(
      JSON.stringify({ message: "Error fetching user details" }),
      { status: 500 }
    );
  }
};

// PATCH request to update user details
export const PATCH = async (
  req: Request,
  { params }: { params: { userId: string } }
) => {
  try {
    const userId = params.userId;
    const { fullName, imageUrl, deliveryAddress, phoneNumber, password } =
      await req.json();

    await connectToDb();

    let updateData: Record<string, any> = {
      ...(fullName && { fullName }),
      ...(imageUrl && { imageUrl }),
      ...(deliveryAddress && { deliveryAddress }),
      ...(phoneNumber && { phoneNumber }),
    };

    // Hash the password if it is provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({
        message: "User details updated successfully!",
        user,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user details", error);
    return new Response(
      JSON.stringify({ message: "Error updating user details!" }),
      { status: 500 }
    );
  }
};

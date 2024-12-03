import { connectToDb } from "@/utils/database";
import User from "@/models/User";
import bcrypt from "bcrypt";

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

    const user = await User.findById(userId);

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    let updateData: Record<string, any> = {
      ...(fullName && { fullName }),
      ...(imageUrl && { imageUrl }),
      ...(deliveryAddress && { deliveryAddress }),
      ...(phoneNumber && { phoneNumber }),
    };

    // Handle password update
    if (password) {
      const isSamePassword = await bcrypt.compare(password, user.password);
      if (isSamePassword) {
        return new Response(
          JSON.stringify({
            message: "New password cannot be the same as the old password.",
          }),
          { status: 400 }
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    return new Response(
      JSON.stringify({
        message: "User details updated successfully!",
        user: updatedUser,
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

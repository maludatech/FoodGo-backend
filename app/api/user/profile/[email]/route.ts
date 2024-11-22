import { connectToDb } from "@/utils/database";
import User from "@/models/User";

export const GET = async (
  req: Request,
  { params }: { params: { email: string } }
) => {
  const email = params.email;
  try {
    await connectToDb();

    const user = await User.findOne({ email: email });

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

export const PATCH = async (
  req: Request,
  { params }: { params: { email: string } }
) => {
  try {
    const email = params.email;
    const { deliveryAddress } = await req.json();

    await connectToDb();

    const user = await User.findOne({ email: email });

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    const updatedDeliveryAddress = await User.findOneAndUpdate(
      { email: email },
      { deliveryAddress: deliveryAddress },
      { new: true }
    );

    if (!updatedDeliveryAddress) {
      return new Response(
        JSON.stringify({ message: "User details not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Delivery address updated successfully!!",
        updatedDeliveryAddress,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user delivery address", error);
    return new Response(
      JSON.stringify({ message: "Error updating user delivery address!" }),
      { status: 500 }
    );
  }
};

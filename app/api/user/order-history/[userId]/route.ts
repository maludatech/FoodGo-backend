import { connectToDb } from "@/utils/database";
import User from "@/models/User";
import Transaction from "@/models/Transactions";

export const GET = async (
  req: Request,
  { params }: { params: { userId: string } }
) => {
  try {
    const userId = params.userId;
    await connectToDb();
    const user = await User.findById(userId);

    if (!user) {
      console.error("User not found");
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    const transactionHistory = await Transaction.find({ buyer: user._id });
    return new Response(JSON.stringify(transactionHistory), { status: 200 });
  } catch (error: any) {
    console.error("Error fetching user transaction history: ", error.message);
    return new Response(
      JSON.stringify({ message: "Error fetching user transaction history" }),
      { status: 500 }
    );
  }
};

export const POST = async (
  req: Request,
  { params }: { params: { userId: string } }
) => {
  try {
    const userId = params.userId;
    const {
      name,
      imageUrl,
      quantity,
      price,
      deliveryFee,
      tax,
      total,
      deliveryDate,
    }: any = await req.json();

    await connectToDb();
    const user = await User.findById(userId);

    if (!user) {
      console.error("User not found");
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }
    const transaction = new Transaction({
      buyer: user._id,
      name,
      imageUrl,
      quantity,
      price,
      deliveryFee,
      tax,
      total,
      deliveryDate,
    });
    await transaction.save();

    return new Response(
      JSON.stringify({ message: "Transaction created successfully" }),
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating transaction history", error.message);
    return new Response(
      JSON.stringify({ message: "Error creating transaction history" }),
      { status: 500 }
    );
  }
};

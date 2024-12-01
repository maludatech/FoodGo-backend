import { connectToDb } from "@/utils/database";
import User from "@/models/User";
import Card from "@/models/Cards";

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
    const card = await Card.find({ cardOwner: user._id });
    return new Response(JSON.stringify(card), { status: 200 });
  } catch (error) {
    console.error("Error fetching payment cards", error);
    return new Response(
      JSON.stringify({ message: "Error fetching payment cards" }),
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
    const { cardNumber, cardExpiryDate, cardCVV, cardType } = await req.json();

    await connectToDb();

    const user = await User.findById(userId);

    if (!user) {
      console.error("User not found");
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }
    const card = new Card({
      cardOwner: user._id,
      cardNumber,
      cardExpiryDate,
      cardCVV,
      cardType,
    });
    await card.save();
    return new Response(
      JSON.stringify({ message: "Card created successfully" }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating payment method", error);
    return new Response(
      JSON.stringify({ message: "Error creating payment method" }),
      { status: 500 }
    );
  }
};

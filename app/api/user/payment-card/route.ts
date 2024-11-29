import { connectToDb } from "@/utils/database";
import User from "@/models/User";
import Card from "@/models/Cards";

export const GET = async ({ params }: { params: { email: string } }) => {
  try {
    const email = params.email;
    await connectToDb();
    const user = await User.findOne({ email: email }).select("_id");

    if (!user) {
      console.error("User not found");
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }
    const card = await Card.findOne({ cardOwner: user._id });
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
  { params }: { params: { email: string } },
  req: Request
) => {
  try {
    const email = params.email;
    const { cardNumber, cardExpiryDate, cardCVV, cardType } = await req.json();

    await connectToDb();

    const user = await User.findOne({ email: email }).select("_id");

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

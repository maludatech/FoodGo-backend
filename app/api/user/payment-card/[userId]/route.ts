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

    // Validate user existence
    const user = await User.findById(userId);
    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    // Check existing cards for the user
    const existingCards = await Card.find({ cardOwner: user._id });

    // Enforce maximum 2 cards rule
    if (existingCards.length >= 2) {
      return new Response(
        JSON.stringify({ message: "You cannot have more than 2 cards." }),
        { status: 400 }
      );
    }

    // Enforce unique cardType rule
    const duplicateCardType = existingCards.some(
      (card) => card.cardType.toLowerCase() === cardType.toLowerCase()
    );
    if (duplicateCardType) {
      return new Response(
        JSON.stringify({
          message: `You already have a ${cardType} card. Please use a different card type.`,
        }),
        { status: 400 }
      );
    }

    // Create new card
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

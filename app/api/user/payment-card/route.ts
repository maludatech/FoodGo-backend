import { connectToDb } from "@/utils/database";
import User from "@/models/User";
import Card from "@/models/Cards";

export const GET = async ({ params }: { params: { email: string } }) => {
  try {
    await connectToDb();
  } catch (error) {
    console.error("Error fetching payment cards", error);
    return new Response(
      JSON.stringify({ message: "Error fetching payment cards" }),
      { status: 500 }
    );
  }
};

export const POST = async ({ params }: { params: { email: string } }) => {
  try {
    await connectToDb();
  } catch (error) {
    console.error("Error creating payment method", error);
    return new Response(
      JSON.stringify({ message: "Error creating payment method" }),
      { status: 500 }
    );
  }
};

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

    await connectToDb();

    const user = await User.findOne({ email: email });

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }
  } catch (error) {
    console.error();
  }
};

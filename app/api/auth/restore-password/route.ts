import { connectToDb } from "@/utils/database";
import User from "@/models/User";

export const POST = async (req: Request, res: Response) => {
  try {
    const { code } = await req.json();

    await connectToDb();
    const user = await User.findOne({ resetToken: code });

    if (!user) {
      return new Response(JSON.stringify({ message: "Code incorrect" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({ message: "Code correct", userId: user._id }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error resolving code: ", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
};

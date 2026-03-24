import { connectToDB } from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        {
          error: "Email and password are required.",
        },
        { status: 400 },
      );
    } else {
      // YTD::: VALIDATE EMAIL AND PASSWORD FORMAT HERE
      await connectToDB();
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json(
          {
            error: "User already exists.",
          },
          { status: 400 },
        );
      } else {
        // The User model hashes the password in a pre-save hook.
        await User.create({ email, password });
        return NextResponse.json(
          {
            message: "User registered successfully.",
          },
          { status: 201 },
        );
      }
    }
  } catch (error) {
    console.log("Error registering user: ", error);

    return NextResponse.json(
      {
        error: "An error occurred while processing your request.",
      },
      { status: 500 },
    );
  }
}

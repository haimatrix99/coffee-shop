import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
// My imports.
import prisma from "../../../utils/db/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get session if there is one.
  const session = await getServerSession(req, res, authOptions);
  if (req.method === "GET") {
    if (!session) {
      // Protect our API route. Only authenticated users are allowed to receive past order data.
      res.status(401).json({ message: "User is not logged in." });
      return;
    }
    // Get past orders.
    let allOrders;
    try {
      allOrders = await prisma.order.findMany({
        orderBy: {
          orderDate: "desc",
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get orders from this user." });
      return;
    }
    res.status(200).json(allOrders);
  } else {
    res.status(418).json({
      message: "I am a teapot and I refuse to brew coffee with teapot.",
    });
  }
}

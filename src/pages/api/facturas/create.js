import clientPromise from "@/lib/mongodb";
import { authMiddleware } from "@/lib/middleware/authMiddleware";

const handler = async (req, res) => {
  const client = await clientPromise;
  const db = client.db("sena");

  if (req.method === "POST") {
    try {
      const newFactura = req.body;
      const result = await db.collection("facturas").insertOne(newFactura);
      res.status(201).json(result);
    } catch (error) {
      console.error("Error creating factura", error);
      res.status(500).json({ error: "Error connecting to the database" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default authMiddleware(handler);

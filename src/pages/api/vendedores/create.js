import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { authMiddleware } from "@/lib/middleware/authMiddleware";

const SALT_ROUNDS = 10;

async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { venUsuario, venContrasena } = req.body;

      if (!venUsuario || !venContrasena) {
        return res
          .status(400)
          .json({ message: "Usuario y contraseña son requeridos" });
      }

      const client = await clientPromise;
      const db = client.db("sena");
      const collection = db.collection("vendedores");
      const hashedPassword = await bcrypt.hash(venContrasena, SALT_ROUNDS);

      const result = await collection.insertOne({
        venUsuario,
        venContrasena: hashedPassword,
      });

      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: "Error connecting to the database" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default authMiddleware(handler);

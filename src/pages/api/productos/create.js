import clientPromise from "@/lib/mongodb";
import { authMiddleware } from "@/lib/middleware/authMiddleware";

async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { proCodigo, proDescripcion, proValor, proCantidad } = req.body;

      // Validación básica de campos requeridos
      if (
        proCodigo === undefined ||
        proDescripcion === undefined ||
        proValor === undefined ||
        proCantidad === undefined
      ) {
        return res.status(400).json({
          message:
            "proCodigo, proDescripcion, proValor, and proCantidad are required",
        });
      }

      // Conectar a MongoDB
      const client = await clientPromise;
      const db = client.db("sena");
      const collection = db.collection("productos");

      // Insertar el producto
      const result = await collection.insertOne({
        proCodigo,
        proDescripcion,
        proValor,
        proCantidad,
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

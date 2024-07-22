import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { authMiddleware } from "@/lib/middleware/authMiddleware";

async function handler(req, res) {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ message: "ID invalido" });
  }

  if (req.method === "PUT") {
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

      const client = await clientPromise;
      const db = client.db("sena");
      const collection = db.collection("productos");

      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { proCodigo, proDescripcion, proValor, proCantidad } }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "Producto not found" });
      }

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: "Error connecting to the database" });
    }
  } else if (req.method === "DELETE") {
    // Lógica para eliminar el producto
    try {
      const client = await clientPromise;
      const db = client.db("sena");
      const collection = db.collection("productos");

      const result = await collection.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Producto not found" });
      }

      res.status(204).end(); // No content
    } catch (error) {
      res.status(500).json({ error: "Error connecting to the database" });
    }
  } else {
    res.setHeader("Allow", ["PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default authMiddleware(handler);

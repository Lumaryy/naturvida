import clientPromise from "@/lib/mongodb";
import { authMiddleware } from "@/lib/middleware/authMiddleware";

async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { facNumero, facProductoId, faCantidad } = req.body;

      // Validación básica de campos requeridos
      if (!facNumero || !facProductoId || faCantidad === undefined) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Conectar a MongoDB
      const client = await clientPromise;
      const db = client.db("sena");
      const collection = db.collection("facturaDetalles");

      // Insertar el detalle de la factura
      const result = await collection.insertOne({
        facNumero,
        facProductoId,
        faCantidad,
      });

      res.status(201).json({
        message: "FacturaDetalle created successfully",
        insertedId: result.insertedId,
      });
    } catch (error) {
      console.error("Error connecting to the database:", error);
      res.status(500).json({ error: "Error connecting to the database" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default authMiddleware(handler);



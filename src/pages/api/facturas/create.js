import clientPromise from "@/lib/mongodb";
import { authMiddleware } from "@/lib/middleware/authMiddleware";

async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const {
        facNumero,
        facFecha,
        facCliente,
        facValorTotal,
        facVendedor,
        detalles,
      } = req.body;

      // Validación básica de campos requeridos
      if (
        !facNumero ||
        !facFecha ||
        !facCliente ||
        !facValorTotal ||
        !facVendedor ||
        !detalles
      ) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Conectar a MongoDB
      const client = await clientPromise;
      const db = client.db("sena");
      const collection = db.collection("facturas");

      // Insertar la factura
      const result = await collection.insertOne({
        facNumero,
        facFecha,
        facCliente,
        facValorTotal,
        facVendedor,
        detalles,
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

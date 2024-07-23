import clientPromise from "@/lib/mongodb";
import { authMiddleware } from "@/lib/middleware/authMiddleware";

const handler = async (req, res) => {
  if (req.method === "GET") {
    try {
      const { fechaInicio, fechaFin } = req.query;

      // Validar las fechas
      if (!fechaInicio || !fechaFin) {
        return res.status(400).json({ message: "Fecha de inicio y fecha de fin son requeridas" });
      }

      // Convertir las fechas a objetos Date
      const startDate = new Date(fechaInicio);
      const endDate = new Date(fechaFin);
      
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({ message: "Fechas inválidas" });
      }

      // Conectar a MongoDB
      const client = await clientPromise;
      const db = client.db("sena");
      const collection = db.collection("ventas");

      // Obtener las ventas en el rango de fechas
      const ventas = await collection.find({
        fechaVenta: { $gte: startDate, $lte: endDate }
      }).toArray();

      // Responder con la lista de ventas
      res.status(200).json(ventas);
    } catch (error) {
      console.error("Error connecting to the database:", error); // Registrar el error
      res.status(500).json({ error: "Error connecting to the database" });
    }
  } else {
    // Manejo de métodos no permitidos
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default authMiddleware(handler);

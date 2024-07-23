import clientPromise from "@/lib/mongodb";
import { authMiddleware } from "@/lib/middleware/authMiddleware";

async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const client = await clientPromise;
      const db = client.db("sena");
      const facturaDetalleCollection = db.collection("facturaDetalles");
      const productoCollection = db.collection("productos");

      // Obtener todos los detalles de la factura
      const facturaDetalles = await facturaDetalleCollection.find({}).toArray();

      // Obtener los IDs de los productos
      const productoIds = facturaDetalles.map(detalle => detalle.facProductoId);
      const productos = await productoCollection.find({ _id: { $in: productoIds } }).toArray();

      // Mapear productos a los detalles de la factura
      const detalleConProductos = facturaDetalles.map(detalle => ({
        ...detalle,
        producto: productos.find(p => p._id.toString() === detalle.facProductoId.toString())
      }));

      res.status(200).json(detalleConProductos);
    } catch (error) {
      console.error("Error connecting to the database:", error);
      res.status(500).json({ error: "Error connecting to the database" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default authMiddleware(handler);

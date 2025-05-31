const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3306;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuración de Multer para guardar imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, uniqueSuffix);
  }
});
const upload = multer({ storage: storage });

// Conexión a MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // por defecto en XAMPP
  database: 'facturas'
});

db.connect((err) => {
  if (err) throw err;
  console.log('✅ Conectado a MySQL');
});

// Rutas

// Obtener todas las facturas
app.get('/facturas', (req, res) => {
  db.query('SELECT * FROM facturas', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Crear nueva factura
app.post('/facturas', upload.single('imagen'), (req, res) => {
  const { fecha, valor } = req.body;
  const imagen = req.file ? req.file.filename : null;

  const sql = 'INSERT INTO facturas (fecha, valor, imagen) VALUES (?, ?, ?)';
  db.query(sql, [fecha, valor, imagen], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ id: result.insertId, fecha, valor, imagen });
  });
});

// Eliminar factura
app.delete('/facturas/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM facturas WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(204);
  });
});

// Actualizar factura
app.put('/facturas/:id', (req, res) => {
  const { id } = req.params;
  const { fecha, valor } = req.body;

  const sql = 'UPDATE facturas SET fecha = ?, valor = ? WHERE id = ?';
  db.query(sql, [fecha, valor, id], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(200);
  });
});




// Iniciar servidor para su funcion 
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

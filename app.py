import os
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
app.config['SECRET_KEY'] = 'Orden_66_UCE_2026'
CORS(app)

# --- CONFIGURACIÓN POSTGRESQL ---
# Reemplaza 'tu_password' por la contraseña de tu pgAdmin
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:Orden_66@localhost:5432/muebles_figueroa_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    "connect_args": {
        "options": "-c client_encoding=utf8"
    }
}

db = SQLAlchemy(app)

# --- MODELOS ---
class Producto(db.Model):
    __tablename__ = 'productos'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    categoria = db.Column(db.String(50), nullable=False)
    precio = db.Column(db.Float, nullable=False)
    imagen = db.Column(db.String(255))
    detalle = db.Column(db.Text)

class Usuario(db.Model):
    __tablename__ = 'usuarios'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False) # Evita duplicados
    password = db.Column(db.String(100), nullable=False)
    rol = db.Column(db.String(20), default='cliente') # 'admin' o 'cliente'

# --- API ENDPOINTS ---

@app.route('/api/productos', methods=['GET'])
def get_productos():
    muebles = Producto.query.all()
    return jsonify([{
        "id": p.id, "nombre": p.nombre, "categoria": p.categoria,
        "precio": p.precio, "imagen": p.imagen, "detalle": p.detalle
    } for p in muebles])

@app.route('/api/registro', methods=['POST'])
def registrar():
    data = request.json
    # Verificamos si el correo ya existe
    if Usuario.query.filter_by(email=data['email']).first():
        return jsonify({"error": "El correo ya está registrado"}), 400
    
    nuevo_usuario = Usuario(
        nombre=data['nombre'],
        email=data['email'],
        password=data['password'],
        rol='cliente'
    )
    db.session.add(nuevo_usuario)
    db.session.commit()
    return jsonify({"message": "Usuario creado con éxito"}), 201

if __name__ == '__main__':
    with app.app_context():
        db.create_all() # Esto crea las tablas automáticamente en pgAdmin
    app.run(port=5000, debug=True)
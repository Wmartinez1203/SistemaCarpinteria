import os
import urllib.parse
from flask import Flask, request, session, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS # <--- Habilita la comunicación con Angular
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['SECRET_KEY'] = 'figueroa_sistemas_2026_total_fix'
CORS(app) # <--- Permite que el puerto 4200 (Angular) lea el 5000 (Flask)

# --- CONFIGURACIÓN DE BASE DE DATOS ---
basedir = os.path.abspath(os.path.dirname(__file__))
instance_path = os.path.join(basedir, 'instance')
if not os.path.exists(instance_path):
    os.makedirs(instance_path)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(instance_path, 'muebles_figueroa.db')
app.config['UPLOAD_FOLDER'] = os.path.join(basedir, 'uploads')

if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

db = SQLAlchemy(app)

# --- MODELO DE PRODUCTO ---
class Producto(db.Model):
    __tablename__ = 'productos'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    categoria = db.Column(db.String(50), nullable=False)
    precio = db.Column(db.Float, nullable=False)
    imagen = db.Column(db.String(100))
    detalle = db.Column(db.Text)

# --- API ENDPOINTS (JSON) ---

@app.route('/api/productos', methods=['GET'])
def get_productos():
    muebles = Producto.query.all()
    # Convertimos a JSON para que Angular lo entienda
    return jsonify([{
        "id": p.id,
        "nombre": p.nombre,
        "categoria": p.categoria,
        "precio": p.precio,
        "imagen": f"http://localhost:5000/uploads/{p.imagen}" if p.imagen else None,
        "detalle": p.detalle
    } for p in muebles])

@app.route('/uploads/<filename>')
def display_image(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True)
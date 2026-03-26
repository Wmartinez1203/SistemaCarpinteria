import os
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv

# Cargamos las variables del .env
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuraciones desde el archivo .env
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Un modelo simple para verificar la conexión
class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)

# Crear las tablas automáticamente
with app.app_context():
    try:
        db.create_all()
        print("--- Conexión exitosa a Muebles Figueroa DB ---")
    except Exception as e:
        print(f"Error al conectar a la DB: {e}")

@app.route('/')
def status():
    return jsonify({
        "status": "online",
        "database": "connected",
        "project": "Muebles Figueroa"
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
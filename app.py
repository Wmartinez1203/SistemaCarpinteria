import os
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
# Permitimos CORS para que Angular hable con Flask sin bloqueos
CORS(app)

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# MODELO COMPLETO PARA POSTGRES
class Usuario(db.Model):
    __tablename__ = 'usuarios'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=True) # Opcional por si es Login Social
    rol = db.Column(db.String(20), default='cliente')

with app.app_context():
    db.create_all()
    print("--- Base de Datos Muebles Figueroa lista en PostgreSQL ---")

@app.route('/api/registro', methods=['POST'])
def registrar_usuario():
    data = request.json
    # Verificar si ya existe en Postgres
    usuario_existe = Usuario.query.filter_by(email=data['email']).first()
    if usuario_existe:
        return jsonify({"message": "Usuario ya registrado"}), 200

    nuevo = Usuario(
        nombre=data.get('nombre', data['email'].split('@')[0]),
        email=data['email'],
        password=data.get('password', 'social_login')
    )
    db.session.add(nuevo)
    db.session.commit()
    return jsonify({"status": "success"}), 201

if __name__ == '__main__':
    app.run(debug=True, port=5000)
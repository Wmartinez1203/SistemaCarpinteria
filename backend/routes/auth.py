from flask import Blueprint, request, jsonify
from models import Usuario
from database import db
from flask_jwt_extended import create_access_token  # <--- NUEVO

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/api/login', methods=['POST'])
def login():
    data = request.json
    user = Usuario.query.filter_by(email=data.get('email')).first()
    if user and user.check_password(data.get('password')):
        # Creamos el token con el rol incluido en los claims
        token = create_access_token(identity=user.email, additional_claims={"rol": user.rol})

        return jsonify({
            "token": token,  # <--- Enviamos el token al frontend
            "user": {
                "nombre": user.nombre,
                "email": user.email,
                "isAdmin": (user.rol == 'admin')
            }
        }), 200
    return jsonify({"message": "Credenciales inválidas"}), 401


@auth_bp.route('/api/registro', methods=['POST'])
def registrar_usuario():
    data = request.json
    if Usuario.query.filter_by(email=data['email']).first():
        return jsonify({"message": "El correo ya existe"}), 400

    nuevo = Usuario(
        nombre=data.get('nombre'), email=data['email'],
        rol='admin' if data['email'] == 'wladimirmartinez1203@gmail.com' else 'cliente'
    )
    nuevo.set_password(data.get('password'))
    db.session.add(nuevo)
    db.session.commit()
    return jsonify({"message": "Usuario creado"}), 201
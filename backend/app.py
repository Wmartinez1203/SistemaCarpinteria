import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from database import db
from models import Usuario
from routes.auth import auth_bp
from routes.products import product_bp
from flask_jwt_extended import JWTManager # <--- NUEVO

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuración
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'UCE_2026_SECRET')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('SECRET_KEY', 'UCE_2026_JWT_SECRET') # <--- NUEVO

db.init_app(app)
jwt = JWTManager(app) # <--- NUEVO

# Registro de Blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(product_bp)

def inicializar_sistema():
    with app.app_context():
        db.create_all()
        admin_email = "wladimirmartinez1203@gmail.com"
        if not Usuario.query.filter_by(email=admin_email).first():
            admin = Usuario(
                nombre="Fernando Martínez (Admin)",
                email=admin_email,
                rol="admin"
            )
            admin.set_password("Orden_66")
            db.session.add(admin)
            db.session.commit()
            print("--- 🚀 BASE DE DATOS Y ADMIN LISTOS ---")

if __name__ == '__main__':
    inicializar_sistema()
    app.run(debug=True, port=5000)
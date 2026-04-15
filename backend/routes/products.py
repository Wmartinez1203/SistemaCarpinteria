from flask import Blueprint, jsonify, request, send_from_directory
from models import Producto
from database import db
from werkzeug.utils import secure_filename
import os
from flask_jwt_extended import jwt_required, get_jwt # <--- NUEVO

product_bp = Blueprint('products', __name__)
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')

@product_bp.route('/api/productos', methods=['GET'])
def listar_productos():
    productos = Producto.query.all()
    return jsonify([{
        "id": p.id, "nombre": p.nombre, "categoria": p.categoria,
        "medidas": p.medidas, "descripcion": p.descripcion,
        "precio": p.precio, "imagen_url": p.imagen_url
    } for p in productos])

@product_bp.route('/api/productos/<int:id>', methods=['GET'])
def obtener_producto(id):
    producto = Producto.query.get(id)
    if not producto:
        return jsonify({"message": "No encontrado"}), 404
    return jsonify({
        "id": producto.id, "nombre": producto.nombre, "precio": producto.precio,
        "imagen_url": producto.imagen_url, "descripcion": producto.descripcion,
        "medidas": producto.medidas, "categoria": producto.categoria
    })

@product_bp.route('/api/productos', methods=['POST'])
@jwt_required() # <--- PROTEGIDO
def registrar_producto():
    # Validar que sea admin
    claims = get_jwt()
    if claims.get('rol') != 'admin':
        return jsonify({"message": "Acceso prohibido"}), 403

    try:
        nombre = request.form.get('nombre')
        precio = float(request.form.get('precio'))
        file = request.files.get('imagen')
        url_final = "http://localhost:5000/uploads/default.jpg"

        if file:
            if not os.path.exists(UPLOAD_FOLDER): os.makedirs(UPLOAD_FOLDER)
            filename = secure_filename(file.filename)
            file.save(os.path.join(UPLOAD_FOLDER, filename))
            url_final = f"http://localhost:5000/uploads/{filename}"

        nuevo_p = Producto(
            nombre=nombre, categoria=request.form.get('categoria'),
            medidas=request.form.get('medidas'), descripcion=request.form.get('detalle'),
            precio=precio, imagen_url=url_final
        )
        db.session.add(nuevo_p)
        db.session.commit()
        return jsonify({"message": "Creado con éxito"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@product_bp.route('/api/productos/<int:id>', methods=['PUT'])
@jwt_required() # <--- PROTEGIDO
def actualizar_producto(id):
    claims = get_jwt()
    if claims.get('rol') != 'admin':
        return jsonify({"message": "Acceso prohibido"}), 403

    producto = Producto.query.get(id)
    if not producto: return jsonify({"message": "No existe"}), 404

    try:
        producto.nombre = request.form.get('nombre', producto.nombre)
        producto.precio = float(request.form.get('precio', producto.precio))
        producto.categoria = request.form.get('categoria', producto.categoria)
        producto.medidas = request.form.get('medidas', producto.medidas)
        producto.descripcion = request.form.get('detalle', producto.descripcion)

        file = request.files.get('imagen')
        if file:
            filename = secure_filename(file.filename)
            file.save(os.path.join(UPLOAD_FOLDER, filename))
            producto.imagen_url = f"http://localhost:5000/uploads/{filename}"

        db.session.commit()
        return jsonify({"message": "Actualizado"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@product_bp.route('/api/productos/<int:id>', methods=['DELETE'])
@jwt_required() # <--- PROTEGIDO
def eliminar_producto(id):
    claims = get_jwt()
    if claims.get('rol') != 'admin':
        return jsonify({"message": "Acceso prohibido"}), 403

    producto = Producto.query.get(id)
    if not producto: return jsonify({"message": "No existe"}), 404
    db.session.delete(producto)
    db.session.commit()
    return jsonify({"message": "Eliminado"}), 200

@product_bp.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)
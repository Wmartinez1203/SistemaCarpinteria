import os
import urllib.parse
from flask import Flask, render_template, request, redirect, url_for, session, flash, send_from_directory, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from functools import wraps

app = Flask(__name__)
app.config['SECRET_KEY'] = 'figueroa_sistemas_2026_total_fix'

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
login_manager = LoginManager(app)
login_manager.login_view = 'login'

# Asegúrate de que el context_processor esté presente para que el contador no falle
@app.context_processor
def inject_globals():
    count = len(session.get('carrito', []))
    return dict(cart_count=count)

# --- MODELOS ---
class User(UserMixin, db.Model):
    __tablename__ = 'usuarios'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    es_admin = db.Column(db.Boolean, default=False)

class Producto(db.Model):
    __tablename__ = 'productos'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    categoria = db.Column(db.String(50), nullable=False)
    subcategoria = db.Column(db.String(50), nullable=False)
    precio = db.Column(db.Float, nullable=False)
    stock = db.Column(db.Integer, nullable=False)
    medidas = db.Column(db.String(100))
    imagen = db.Column(db.String(100))
    detalle = db.Column(db.Text)

@login_manager.user_loader
def load_user(user_id):
    return db.session.get(User, int(user_id))

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated or not current_user.es_admin:
            return redirect(url_for('home'))
        return f(*args, **kwargs)
    return decorated_function

# --- RUTAS ---
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/catalogo')
def catalogo():
    cat_f = request.args.get('cat')
    sub_f = request.args.get('sub')
    query = Producto.query
    if cat_f: query = query.filter_by(categoria=cat_f)
    if sub_f: query = query.filter_by(subcategoria=sub_f)
    muebles = query.all()
    menu = {
        "Dormitorio": ["Camas", "Veladores", "Armarios", "Cajoneras"],
        "Sala": ["Sofás", "Mesas de Centro", "Muebles de TV"],
        "Cocina": ["Alacenas", "Mesas de Diario"],
        "Oficina": ["Escritorios", "Sillas Ergonómicas"]
    }
    return render_template('catalogo.html', muebles=muebles, menu=menu, cat_actual=cat_f)

@app.route('/producto/<int:id>')
def detalle_mueble(id):
    mueble = db.session.get(Producto, id)
    if not mueble: return redirect(url_for('catalogo'))
    return render_template('detalle.html', mueble=mueble)

@app.route('/add_cart/<int:id>')
@login_required
def add_cart(id):
    if 'carrito' not in session: session['carrito'] = []
    mueble = db.session.get(Producto, id)
    if mueble:
        session['carrito'].append({'id': mueble.id, 'nombre': mueble.nombre, 'precio': mueble.precio, 'imagen': mueble.imagen})
        session.modified = True
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return jsonify({"status": "success", "count": len(session['carrito'])})
    return redirect(url_for('ver_carrito'))

@app.route('/carrito')
@login_required
def ver_carrito():
    items = session.get('carrito', [])
    total = sum(item['precio'] for item in items)
    return render_template('carrito.html', items=items, total=total)

@app.route('/remove_cart/<int:index>')
@login_required
def remove_cart(index):
    if 'carrito' in session:
        try:
            session['carrito'].pop(index)
            session.modified = True
        except IndexError: pass
    return redirect(url_for('ver_carrito'))

@app.route('/checkout', methods=['POST'])
@login_required
def checkout():
    items = session.get('carrito', [])
    if not items: return redirect(url_for('catalogo'))
    razon = request.form.get('razon_social')
    ruc = request.form.get('identificacion')
    mensaje = f"MUEBLES FIGUEROA - PEDIDO 🛠️\nCliente: {razon}\nRUC: {ruc}\n----------\n"
    total = 0
    for item in items:
        mensaje += f"- {item['nombre']} (${item['precio']})\n"
        total += item['precio']
    url_wa = f"https://wa.me/593963120573?text={urllib.parse.quote(mensaje + f'----------\nTOTAL: ${total}')}"
    session.pop('carrito', None)
    return redirect(url_wa)

@app.route('/admin_figueroa')
@login_required
@admin_required
def admin_panel():
    muebles = Producto.query.all()
    return render_template('admin.html', muebles=muebles)

@app.route('/admin/agregar', methods=['POST'])
@login_required
@admin_required
def agregar():
    f = request.files.get('imagen')
    if f:
        fname = secure_filename(f.filename)
        f.save(os.path.join(app.config['UPLOAD_FOLDER'], fname))
        nuevo = Producto(nombre=request.form.get('nombre'), categoria=request.form.get('categoria'), subcategoria=request.form.get('subcategoria'), precio=float(request.form.get('precio')), stock=int(request.form.get('stock')), medidas=request.form.get('medidas'), detalle=request.form.get('detalle'), imagen=fname)
        db.session.add(nuevo); db.session.commit()
    return redirect(url_for('admin_panel'))

@app.route('/admin/eliminar/<int:id>')
@login_required
@admin_required
def eliminar_mueble(id):
    mueble = db.session.get(Producto, id)
    if mueble:
        db.session.delete(mueble); db.session.commit()
    return redirect(url_for('admin_panel'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        u = User.query.filter_by(email=request.form['email']).first()
        if u and check_password_hash(u.password, request.form['password']):
            login_user(u); return redirect(url_for('home'))
        flash("Datos incorrectos.")
    return render_template('login.html')

@app.route('/registro', methods=['GET', 'POST'])
def registro():
    if request.method == 'POST':
        hashed_pw = generate_password_hash(request.form['password'], method='pbkdf2:sha256')
        u = User(nombre=request.form['nombre'], email=request.form['email'], password=hashed_pw, es_admin=False)
        db.session.add(u); db.session.commit()
        return redirect(url_for('login'))
    return render_template('registro.html')

@app.route('/logout')
def logout():
    logout_user(); session.pop('carrito', None); return redirect(url_for('home'))

@app.route('/uploads/<filename>')
def display_image(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        admin = User.query.filter_by(email='wladimirmartinez1203@gmail.com').first()
        if admin: admin.es_admin = True; db.session.commit()
    app.run(debug=True)
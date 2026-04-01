# 🪚 Carpintería Figueroa - Sistema de Gestión E-commerce

Este proyecto es una plataforma integral de **E-commerce** y administración de inventario diseñada para **Muebles Figueroa**, un negocio familiar con tres generaciones de tradición en Quito, Ecuador.

---

## 🚀 Características Principales

* **Catálogo Dinámico:** Filtrado avanzado por categorías (Dormitorio, Sala, Cocina, Oficina) y subcategorías mediante *Query Strings*.
* **Panel de Administración:** Gestión completa de inventario (CRUD) con carga de imágenes mediante `Werkzeug`.
* **Autenticación Segura:** Sistema de login y registro con hashing de contraseñas (`PBKDF2`).
* **Arquitectura Robusta:** Migración de SQLite a **PostgreSQL** para manejo de datos a escala profesional.
* **Interfaz Responsive:** Diseño adaptativo con Bootstrap 5 y una experiencia de usuario (UX) centrada en la conversión.
* **Atención al Cliente:** Integración directa con botón flotante de WhatsApp.

---

## 🛠️ Stack Tecnológico

| Componente | Tecnología |
| :--- | :--- |
| **Backend** | Python 3.12 & Flask |
| **Frontend** | HTML5, CSS3 (Bootstrap 5), Jinja2 |
| **Base de Datos** | PostgreSQL |
| **ORM** | SQLAlchemy |
| **Entorno** | VS Code |

---

## 🔧 Instalación y Configuración

### 1. Clonar el repositorio
´bash
git clone [https://github.com/Wmartinez1203/SistemaCarpinteria.git](https://github.com/Wmartinez1203/SistemaCarpinteria.git)
cd SistemaCarpinteria
Crear entorno virtual
Bash
python -m venv venv
# Activar en Windows:
.\venv\Scripts\activate
3. Instalar dependencias
Bash
pip install -r requirements.txt
4. Configurar Base de Datos
Asegúrate de configurar tu cadena de conexión a PostgreSQL en el archivo app.py.

👤 Autor
Fernando Wladimir Martínez Figueroa Estudiante de Ingeniería en Sistemas - Universidad Central del Ecuador (9º Semestre)


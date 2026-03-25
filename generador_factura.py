from fpdf import FPDF
from datetime import datetime


class FacturaPDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 15)
        self.cell(0, 10, 'Muebles Figueroa - Comprobante de Venta', 0, 1, 'C')
        self.ln(10)


def crear_factura(d):
    pdf = FacturaPDF()
    pdf.add_page()
    pdf.set_font('Arial', '', 12)
    pdf.cell(0, 10, f"Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M')}", 0, 1)
    pdf.cell(0, 10, f"Cliente: {d['cliente']}", 0, 1)
    pdf.ln(5)
    pdf.cell(100, 10, 'Concepto', 1);
    pdf.cell(30, 10, 'Cant.', 1);
    pdf.cell(30, 10, 'Total', 1, 1)
    pdf.cell(100, 10, d['producto'], 1);
    pdf.cell(30, 10, str(d['cantidad']), 1);
    pdf.cell(30, 10, f"${d['precio']}", 1, 1)

    nombre = f"factura_{datetime.now().strftime('%H%M%S')}.pdf"
    pdf.output(nombre)
    return nombre
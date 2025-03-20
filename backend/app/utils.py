import os
from reportlab.pdfgen import canvas
from django.core.files.base import ContentFile
import io
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from django.conf import settings

FONT_PATH = os.path.join(settings.BASE_DIR, "static/fonts", "DejaVuSans.ttf")
pdfmetrics.registerFont(TTFont("DejaVuSans", FONT_PATH))

def generate_ticket_pdf(ticket):
  buffer = io.BytesIO()
  pdf = canvas.Canvas(buffer)

  pdf.setFont("DejaVuSans", 16)
  
  pdf.drawString(100, 770, f"{ticket.ticket_type}")
  pdf.drawString(100, 750, f"Владелец: {ticket.owner.user.first_name} {ticket.owner.user.last_name}")
  pdf.drawString(100, 730, f"Цена: {ticket.ticket_type.price} руб.")
  pdf.drawString(100, 710, f"Статус оплаты: {ticket.get_payment_status_display()}")
  
  pdf.showPage()
  pdf.save()
  
  buffer.seek(0)
  return ContentFile(buffer.getvalue(), name=f"ticket_{ticket.owner}.pdf")
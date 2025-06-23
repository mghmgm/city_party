from celery import shared_task
from django.core.mail import send_mass_mail
from django.contrib.auth import get_user_model
from django.conf import settings
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

@shared_task
def send_mass_email_task(subject, message):
    try:
        # users = User.objects.filter(is_active=True).exclude(email='')
        # email_list = list(users.values_list('email', flat=True))
        
        email_list = ['irina.yaltantseva@mail.ru']
        
        if not email_list:
            logger.warning("Нет активных пользователей с email")
            return "Нет получателей"
        
        emails = [
            (subject, message, settings.DEFAULT_FROM_EMAIL, [email])
            for email in email_list
        ]

        result = send_mass_mail(emails, fail_silently=False)
        logger.info(f"Отправлено {result} писем")
        return f"Успешно отправлено {result} писем"
    
    except Exception as e:
        logger.error(f"Ошибка массовой рассылки: {str(e)}")
        raise  
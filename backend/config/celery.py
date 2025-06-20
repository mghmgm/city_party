import os
from celery import Celery

# Установка переменной окружения для Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')

app = Celery('config')

# Использование настроек из Django
app.config_from_object('django.conf:settings', namespace='CELERY')

# Автоподгрузка задач из всех зарегистрированных приложений Django
app.autodiscover_tasks()


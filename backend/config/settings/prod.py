from .base import *
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration
from dotenv import load_dotenv

load_dotenv()

# Sentry Configuration
sentry_sdk.init(
    dsn="https://2e618626ad0c7fececf3129ff1101b7d@o4509495483498496.ingest.de.sentry.io/4509495485005904", 
    integrations=[DjangoIntegration()],
    traces_sample_rate=1.0,
    environment="production",
    send_default_pii=True,
)

# Debug
DEBUG = False

# Security
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY')
ALLOWED_HOSTS = ['city-party.tw1.ru', "85.198.82.247"]
CSRF_TRUSTED_ORIGINS = ['https://city-party.tw1.ru']

# Security Settings
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 3600
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# Database
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv('DB_NAME'),
        "USER": os.getenv('DB_USER'),
        "PASSWORD": os.getenv('DB_PASSWORD'),
        "HOST": os.getenv('DB_HOST'),
        "PORT": os.getenv('DB_PORT'),
        "OPTIONS": {
            "client_encoding": "UTF8",
        },
    }
}

# CORS for production
CORS_ALLOWED_ORIGINS = ['https://city-party.tw1.ru']
CORS_ALLOW_CREDENTIALS = True

# Static files
STATIC_ROOT = '/var/www/city-party/static/'

EMAIL_HOST = 'smtp.example.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = os.getenv('EMAIL_ADDRESS')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_PASSWORD')
EMAIL_USE_TLS = True
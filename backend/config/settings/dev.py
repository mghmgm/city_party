import django
from .base import *
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

# Debug
DEBUG = True

# Security
SECRET_KEY = 'django-insecure-z)vw+@=4qg5+4hlwq7h^zn46o6%n+7x)h&9*9djmnv!p$#0v5('
ALLOWED_HOSTS = ['*']
CSRF_TRUSTED_ORIGINS = ['http://localhost', 'http://127.0.0.1']

# Database
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "city_party",
        "USER": "postgres",
        "PASSWORD": "root",
        "HOST": "localhost",
        "PORT": "5432",
        "OPTIONS": {
            "client_encoding": "UTF8",
        },
    }
}

# Debug Toolbar
INSTALLED_APPS += ["debug_toolbar", "silk"]
MIDDLEWARE += [
    "debug_toolbar.middleware.DebugToolbarMiddleware",
    "silk.middleware.SilkyMiddleware",
]
INTERNAL_IPS = ["127.0.0.1"]

# CORS for development
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

# Static files
STATIC_ROOT = BASE_DIR / 'static/'


# Email
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'localhost'
EMAIL_PORT = 1025 
EMAIL_USE_TLS = False



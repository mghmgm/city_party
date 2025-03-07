from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from app.views import EventAPIView

eventsRouter = DefaultRouter()
eventsRouter.register(r"api/events", EventAPIView, basename = "events")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('photologue/', include('photologue.urls', namespace='photologue')),
] 

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)
    urlpatterns += eventsRouter.urls
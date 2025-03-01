from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from app.views import EventAPIView, ReviewAPIView

router = DefaultRouter()
router.register(r"events", EventAPIView, basename = "events")
router.register(r"reviews", ReviewAPIView, basename="reviews")


urlpatterns = [
    path('admin/', admin.site.urls),
    path('photologue/', include('photologue.urls', namespace='photologue')),
    path('api/', include(router.urls)),
] 

urlpatterns += static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)

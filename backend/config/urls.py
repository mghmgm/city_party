from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from app.views import (
    EventAPIView,
    BannerAPIView,
    PlaceAPIView,
    CategoryAPIView,
    UserAPIView,
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# для тестировки юрлов со слагами
from app.admin import EventAdmin

eventsRouter = DefaultRouter()
eventsRouter.register(r"api/events", EventAPIView, basename="events")

bannerRouter = DefaultRouter()
bannerRouter.register(r"api/banners", BannerAPIView, basename="banners")

placeRouter = DefaultRouter()
placeRouter.register(r"api/places", PlaceAPIView, basename="places")

categoryRouter = DefaultRouter()
categoryRouter.register(r"api/categories", CategoryAPIView, basename="categories")


userRouter = DefaultRouter()
userRouter.register(r"api/user", UserAPIView, basename="user")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("photologue/", include("photologue.urls", namespace="photologue")),
    # для тестировки юрлов со слагами
    path("events/<slug:category_slug>", EventAdmin.get_categories, name="events"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += eventsRouter.urls
    urlpatterns += bannerRouter.urls
    urlpatterns += placeRouter.urls
    urlpatterns += categoryRouter.urls
    urlpatterns += userRouter.urls

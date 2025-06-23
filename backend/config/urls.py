import debug_toolbar
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
    ReviewAPIView,
    TicketAPIView,
    UserAPIView,
    TicketTypeAPIView,
    UserRegistrationAPIView,
    yandex_auth_callback,
    # yandex_auth_callback,
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

reviewRouter = DefaultRouter()
reviewRouter.register(r"api/reviews", ReviewAPIView, basename="reviews")

ticketTypeRouter = DefaultRouter()
ticketTypeRouter.register(
    r"api/ticket-types", TicketTypeAPIView, basename="ticket-types"
)

ticketRouter = DefaultRouter()
ticketRouter.register(r"api/tickets", TicketAPIView, basename="tickets")

userRouter = DefaultRouter()
userRouter.register(r"api/user", UserAPIView, basename="user")


# def trigger_error(request):
#     division_by_zero = 1 / 0

urlpatterns = [
    # path('sentry-debug/', trigger_error),
    path("admin/", admin.site.urls),
    
    path("api/auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path('api/auth/register/', UserRegistrationAPIView.as_view(), name='register'),
        
    path('auth/', include('social_django.urls', namespace='social')),
    path('auth/yandex/callback/', yandex_auth_callback, name='yandex_callback'),
    
    path("photologue/", include("photologue.urls", namespace="photologue")),

    # для тестировки юрлов со слагами
    path("events/<slug:category_slug>", EventAdmin.get_categories, name="events"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += [
        path("__debug__/", include(debug_toolbar.urls)),
        path("silk", include("silk.urls", namespace="silk")),
    ]

urlpatterns += eventsRouter.urls
urlpatterns += bannerRouter.urls
urlpatterns += placeRouter.urls
urlpatterns += categoryRouter.urls
urlpatterns += userRouter.urls
urlpatterns += reviewRouter.urls
urlpatterns += ticketTypeRouter.urls
urlpatterns += ticketRouter.urls

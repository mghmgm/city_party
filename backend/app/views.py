from .models import Event
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.decorators import action
from .serializers import EventSerializer, ReviewSerializer

class EventAPIView(ModelViewSet):
    serializer_class = EventSerializer
    queryset = Event.published.all()
    
    # доделать респонсы
    @action(methods=["GET"], detail=False, url_path="(?P<category_slug>[\w-]+)")
    def by_category(self, request, category_slug):
        try:
            events = Event.published.filter(categories__slug = category_slug)
            serializer = EventSerializer(events, many = True)
            return Response(serializer.data)
        except:
            return Response()
    
    @action(methods=["GET"], detail=True, url_path="reviews")
    def reviews(self, request, pk=None):
        event = self.get_object()
        reviews = event.reviews.filter(status="accepted").order_by("pub_date")
        serializer = ReviewSerializer(reviews, many = True)
        return Response(serializer.data)

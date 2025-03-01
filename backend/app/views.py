from .models import Event, Review
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
            events = Event.published.by_category(category_slug)
            serializer = EventSerializer(events, many = True)
            return Response(serializer.data)
        except:
            return Response()


class ReviewAPIView(ModelViewSet):
    serializer_class = ReviewSerializer
    queryset = Review.order_by_pub_date.all()

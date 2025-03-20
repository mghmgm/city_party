from .models import Event, Banner, Place
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.decorators import action
from .serializers import EventSerializer, ReviewSerializer, BannerSerializer, PlaceSerializer
from rest_framework import status


class EventAPIView(ModelViewSet):
    serializer_class = EventSerializer
    queryset = Event.published.all()

    @action(
        methods=["GET"], 
        detail=False, 
        url_path="category/(?P<category_slug>[\w-]+)"
    )
    def by_category(self, request, category_slug):
        try:
            events = Event.published.filter(categories__slug=category_slug).prefetch_related('categories')
            serializer = EventSerializer(events, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

    @action(methods=["GET", "POST"], detail=True, url_path="reviews")
    def reviews(self, request, pk=None):
        event = self.get_object()
        
        if request.method=="GET":
            reviews = event.reviews.filter(status="accepted").order_by("pub_date").select_related("author")
            serializer = ReviewSerializer(reviews, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        if request.method=="POST":
            if not request.user.is_authenticated:
                return Response(status=status.HTTP_401_UNAUTHORIZED)
            serializer = ReviewSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(author=request.user.userprofile, event=event, status="on_moderation")
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(status=status.HTTP_400_BAD_REQUEST)


    @action(methods=["DELETE", "PATCH"], detail=True, url_path="reviews/(?P<review_id>\\d+)") 
    def review(self, request, pk=None, review_id=None):
        event = self.get_object()
        review = event.reviews.filter(id=review_id, status="accepted").first()
        
        if request.method=="PATCH":
            if review.author != request.user.userprofile:
                return Response(status=status.HTTP_403_FORBIDDEN)
            serializer = ReviewSerializer(review, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(status=status.HTTP_400_BAD_REQUEST)
            
        if request.method=="DELETE":
            if review.author != request.user.userprofile:
                return Response(status=status.HTTP_403_FORBIDDEN)
            review.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

class BannerAPIView(ModelViewSet):
  serializer_class = BannerSerializer
  queryset = Banner.objects.filter(is_visible = True)

class PlaceAPIView(ModelViewSet):
  serializer_class = PlaceSerializer
  queryset = Place.objects.all()
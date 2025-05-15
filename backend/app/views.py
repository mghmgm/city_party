from .filters import EventFilter
from .models import Event, Banner, Place, Category, UserProfile
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from django.utils import timezone
from rest_framework.decorators import action
from .serializers import (
    EventSerializer,
    ReviewSerializer,
    BannerSerializer,
    PlaceSerializer,
    CategorySerializer,
    GallerySerializer,
    TicketTypeSerializer,
    UserProfileSerializer,
)
from rest_framework import status
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
import random


class EventAPIView(ModelViewSet):
    serializer_class = EventSerializer
    filterset_class = EventFilter

    def get_queryset(self):
        queryset = Event.published.all()
        limit = self.request.query_params.get("limit", None)
        ordering = self.request.query_params.get("ordering")
        search = self.request.query_params.get("search", None)

        if search:
            queryset = queryset.filter(title__icontains=search)

        if ordering == "rating":
            queryset = queryset.order_by("-rating_avg")
            queryset = queryset.exclude(rating_avg__isnull=True)
            
        if limit is not None:
            limit = int(limit)
            queryset = queryset[:limit]

        return queryset

    @action(
        methods=["GET"], detail=False, url_path="category/(?P<category_slug>[\w-]+)"
    )
    def by_category(self, request, category_slug):
      events = Event.published.filter(categories__slug=category_slug).prefetch_related("categories")
      
      if not events.exists():
          return Response([], status=status.HTTP_200_OK)
      
      serializer = EventSerializer(events, many=True)
      return Response(serializer.data, status=status.HTTP_200_OK)

    @action(methods=["GET", "POST"], detail=True, url_path="reviews")
    def reviews(self, request, pk=None):
        event = self.get_object()

        if request.method == "GET":
            reviews = (
                event.reviews.filter(status="accepted")
                .order_by("-pub_date")
                .select_related("author")
            )
            reviews_count = reviews.count()
            serializer = ReviewSerializer(reviews, many=True)
            return Response(
                {"count": reviews_count, "reviews": serializer.data},
                status=status.HTTP_200_OK,
            )

        if request.method == "POST":
            if not request.user.is_authenticated:
                return Response(status=status.HTTP_401_UNAUTHORIZED)
            serializer = ReviewSerializer(data=request.data)
            if serializer.is_valid():
              
                #  пока не реализую кнопку у админа и предупреждение автору отзыва
                
                # serializer.save(
                #     author=request.user.userprofile, event=event, status="on_moderation"
                # )
                
                serializer.save(
                    author=request.user.userprofile, event=event, status="accepted", pub_date=timezone.now()
                )
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(status=status.HTTP_400_BAD_REQUEST)

    @action(
        methods=["DELETE", "PATCH"], detail=True, url_path="reviews/(?P<review_id>\\d+)"
    )
    def review(self, request, pk=None, review_id=None):
        event = self.get_object()
        review = event.reviews.filter(id=review_id, status="accepted").first()

        if request.method == "PATCH":
            if review.author != request.user.userprofile:
                return Response(status=status.HTTP_403_FORBIDDEN)
            serializer = ReviewSerializer(review, data=request.data, partial=True)
            if serializer.is_valid():
                updated_review = serializer.update(review, serializer.validated_data)
                return Response(
                    ReviewSerializer(updated_review).data, status=status.HTTP_200_OK
                )
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if request.method == "DELETE":
            if review.author != request.user.userprofile:
                return Response(status=status.HTTP_403_FORBIDDEN)
            review.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

    @action(methods=["GET"], detail=True, url_path="gallery")
    def gallery(self, request, pk=None):
        event = self.get_object()
        gallery = event.gallery
        serializer = GallerySerializer(gallery)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(methods=["GET"], detail=True, url_path="ticket-types")
    def ticket_types(self, request, pk=None):
        event = self.get_object()
        ticket_types = event.ticket_types.all()
        serializer = TicketTypeSerializer(ticket_types, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserAPIView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(methods=["GET"], detail=False, url_path="profile")
    def profile(self, request):
        try:
            user_profile = UserProfile.objects.get(user=request.user)
            serializer = UserProfileSerializer(user_profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except UserProfile.DoesNotExist:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

    @action(methods=["GET"], detail=False, url_path="avatar")
    def avatar(self, request):
        try:
            user_avatar = UserProfile.objects.get(user=request.user).values_list(
                "avatar", flat=True
            )
            serializer = UserProfileSerializer(user_avatar)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except UserProfile.DoesNotExist:
            return Response(status=status.HTTP_401_UNAUTHORIZED)


class BannerAPIView(ModelViewSet):
    serializer_class = BannerSerializer
    queryset = Banner.objects.filter(is_visible=True)

    @action(detail=False, methods=["get"], url_path="random")
    def random_banner(self, request):
        queryset = self.get_queryset()
        banner = random.choice(list(queryset))
        serializer = self.get_serializer(banner)
        return Response(serializer.data)


class PlaceAPIView(ModelViewSet):
    serializer_class = PlaceSerializer

    def get_queryset(self):
        queryset = Place.objects.all()
        limit = self.request.query_params.get("limit", None)

        if limit is not None:
            limit = int(limit)
            queryset = queryset[:limit]
        
        return queryset


class CategoryAPIView(ModelViewSet):
    serializer_class = CategorySerializer
    queryset = Category.objects.all()

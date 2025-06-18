from django.shortcuts import get_object_or_404
from .filters import EventFilter
from .models import (
    Event,
    Banner,
    Place,
    Category,
    Review,
    TicketType,
    UserProfile,
    Ticket,
)
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
    TicketSerializer,
)
from rest_framework import status
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
import random
from django.db.models import Q
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.db.models.query import QuerySet
from django.http import HttpRequest
from rest_framework.request import Request


class EventAPIView(ModelViewSet):
    """API для работы с событиями."""

    serializer_class = EventSerializer
    filterset_class = EventFilter
    permission_classes = [AllowAny]

    def get_queryset(self) -> QuerySet[Event]:
        """
        Получение опубликованных событий.
        """
        # return Event.published.select_related("gallery").prefetch_related("categories")
        return Event.published.select_related("gallery")

    @action(
        methods=["GET"], detail=False, url_path="category/(?P<category_slug>[\w-]+)"
    )
    def by_category(self, request: Request, category_slug: str) -> Response:
        """
        Получение событий по категории.
        """
        events = self.get_queryset().filter(categories__slug=category_slug)

        if not events.exists():
            return Response([], status=status.HTTP_200_OK)

        serializer = self.get_serializer(events, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(methods=["GET", "POST"], detail=True, url_path="reviews")
    def reviews(self, request: Request, pk: int = None) -> Response:
        """
        Работа с отзывами на событие.
        """
        event = self.get_object()

        if request.method == "GET":
            reviews = (
                event.reviews.filter(status="accepted")
                .select_related("author")
                .order_by("-pub_date")
            )
            serializer = ReviewSerializer(reviews, many=True)
            return Response(
                {"count": reviews.count(), "reviews": serializer.data},
                status=status.HTTP_200_OK,
            )

        if request.method == "POST":
            if not request.user.is_authenticated:
                return Response(status=status.HTTP_401_UNAUTHORIZED)

            serializer = ReviewSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(
                author=request.user.userprofile,
                event=event,
                status="on_moderation",
                pub_date=timezone.now(),
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(
        methods=["DELETE", "PATCH"], detail=True, url_path="reviews/(?P<review_id>\\d+)"
    )
    def review(
        self, request: Request, pk: int = None, review_id: int = None
    ) -> Response:
        """
        Удаление или изменение отзыва.
        """
        event = self.get_object()
        review = get_object_or_404(event.reviews, id=review_id)
        
        # event = self.get_object()
        # review = get_object_or_404(
        #     event.reviews,
        #     id=review_id,
        #     status="accepted",
        #     author=request.user.userprofile,
        # )

        if review.author != request.user.userprofile:
            return Response(
                {"detail": "Вы не автор этого отзыва"}, status=status.HTTP_403_FORBIDDEN
            )

        if review.status == "rejected":
            return Response(
                {"detail": "Нельзя изменить отклоненный отзыв"},
                status=status.HTTP_403_FORBIDDEN,
            )

        if request.method == "PATCH" and "status" in request.data:
            return Response(
                {"detail": "Вы не можете изменять статус отзыва"},
                status=status.HTTP_403_FORBIDDEN,
            )

        if request.method == "PATCH":
            serializer = ReviewSerializer(review, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            updated_review = serializer.save()
            return Response(
                ReviewSerializer(updated_review).data, status=status.HTTP_200_OK
            )

        if request.method == "DELETE":
            review.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

    @action(methods=["GET"], detail=True, url_path="gallery")
    def gallery(self, request: Request, pk: int = None) -> Response:
        """
        Получение галереи события.
        """
        event = self.get_object()
        serializer = GallerySerializer(event.gallery)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(methods=["GET"], detail=True, url_path="ticket-types")
    def ticket_types(self, request: Request, pk: int = None) -> Response:
        """
        Получение типов билетов для события.
        """
        now = timezone.now()
        ticket_types = (
            self.get_object()
            .ticket_types.filter(start_date__gte=now)
            .select_related("event")
            .order_by("start_date")
        )
        serializer = TicketTypeSerializer(ticket_types, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserAPIView(viewsets.ViewSet):
    """API для работы с пользователями."""

    permission_classes = [IsAuthenticated]

    @action(methods=["GET"], detail=False, url_path="profile")
    def profile(self, request: Request) -> Response:
        """
        Получение профиля пользователя.

        Аргументы:
            request: Запрос

        Возвращает:
            Response: Данные профиля пользователя
        """
        try:
            user_profile = UserProfile.objects.get(user=request.user)
            tickets_data = self.tickets(request).data
            serializer = UserProfileSerializer(
                user_profile, context={"tickets_data": tickets_data}
            )
            return Response(serializer.data, status=status.HTTP_200_OK)
        except UserProfile.DoesNotExist:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

    @action(methods=["GET"], detail=False, url_path="avatar")
    def avatar(self, request: Request) -> Response:
        """
        Получение аватара пользователя.

        Аргументы:
            request: Запрос

        Возвращает:
            Response: Данные аватара
        """
        try:
            user_avatar = UserProfile.objects.get(user=request.user).values_list(
                "avatar", flat=True
            )
            serializer = UserProfileSerializer(user_avatar)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except UserProfile.DoesNotExist:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

    @action(methods=["GET"], detail=False, url_path="tickets")
    def tickets(self, request: Request) -> Response:
        """
        Получение билетов пользователя.

        Аргументы:
            request: Запрос

        Возвращает:
            Response: Список активных и использованных билетов
        """
        all_tickets = Ticket.objects.filter(owner=request.user.userprofile)

        active_tickets = (
            all_tickets.exclude(payment_status="canceled")
            .filter(ticket_type__start_date__gt=timezone.now())
            .order_by("ticket_type__start_date")
        )

        used_tickets = all_tickets.exclude(
            id__in=active_tickets.values_list("id", flat=True)
        ).exclude(~Q(payment_status="paid"))

        active_serializer = TicketSerializer(active_tickets, many=True)
        used_serializer = TicketSerializer(used_tickets, many=True)

        return Response(
            {
                "active_tickets": active_serializer.data,
                "used_tickets": used_serializer.data,
            },
            status=status.HTTP_200_OK,
        )


class BannerAPIView(ModelViewSet):
    """API для работы с баннерами."""

    serializer_class = BannerSerializer
    queryset = Banner.objects.filter(is_visible=True)

    @action(detail=False, methods=["get"], url_path="random")
    def random_banner(self, request: Request) -> Response:
        """
        Получение случайного баннера.

        Аргументы:
            request: Запрос

        Возвращает:
            Response: Данные случайного баннера
        """
        queryset = self.get_queryset()
        banner = random.choice(list(queryset))
        serializer = self.get_serializer(banner)
        return Response(serializer.data)


class PlaceAPIView(ModelViewSet):
    """API для работы с местами проведения событий."""

    serializer_class = PlaceSerializer

    def get_queryset(self) -> QuerySet[Place]:
        """
        Получение мест проведения.

        Возвращает:
            QuerySet[Place]: QuerySet мест проведения
        """
        queryset = Place.objects.all()
        limit = self.request.query_params.get("limit", None)

        if limit is not None:
            limit = int(limit)
            queryset = queryset[:limit]

        return queryset


class CategoryAPIView(ModelViewSet):
    """API для работы с категориями событий."""

    serializer_class = CategorySerializer
    queryset = Category.objects.all()


class ReviewAPIView(ModelViewSet):
    """API для работы с отзывами."""

    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

    def get_permissions(self):
        """
        Инстанциирует и возвращает список разрешений, которые требуются для данного действия.
        """
        if self.action in ["moderation_reviews", "update_review_status"]:
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    @action(methods=["GET"], detail=False, url_path="moderation")
    def moderation_reviews(self, request: Request) -> Response:
        """
        Получение отзывов на модерации (для администраторов).
        """
        reviews = (
            Review.objects.filter(status="on_moderation")
            .order_by("-pub_date")
            .select_related("author", "event")
        )

        reviews_count = reviews.count()
        serializer = ReviewSerializer(reviews, many=True)
        return Response(
            {"count": reviews_count, "reviews": serializer.data},
            status=status.HTTP_200_OK,
        )

    @action(methods=["PATCH"], detail=True)
    def update_review_status(self, request: Request, pk: int = None) -> Response:
        """
        Обновление статуса отзыва (для администраторов).
        """
        review = self.get_object()
        new_status = request.data.get("status")
        if new_status not in ["accepted", "rejected"]:
            return Response(
                {"detail": "Неизвестный статус"}, status=status.HTTP_400_BAD_REQUEST
            )

        review.status = new_status
        review.save()

        serializer = ReviewSerializer(review)
        return Response(serializer.data)


class TicketTypeAPIView(ModelViewSet):
    """API для работы с типами билетов."""

    queryset = TicketType.objects.all()
    serializer_class = TicketTypeSerializer

    def get_permissions(self) -> list:
        """
        Определение прав доступа для разных действий.

        Возвращает:
            list: Список классов прав доступа
        """
        if self.action in ["create", "destroy", "update"]:
            permission_classes = [IsAdminUser]
        elif self.action in ["update_quantity"]:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = []

        return [permission() for permission in permission_classes]

    @action(methods=["PATCH"], detail=True)
    def update_quantity(self, request: Request, pk: int = None) -> Response:
        """
        Обновление количества доступных билетов.
        Доступно только авторизованным пользователям.

        Аргументы:
            request: Запрос
            pk: ID типа билета

        Возвращает:
            Response: Обновленное количество доступных билетов
        """
        ticket = self.get_object()
        amount = request.data.get("amount", 1)
        amount = int(amount)

        if ticket.available_quantity < amount:
            return Response(
                {"error": "Нет такого количества доступных билетов"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        ticket.available_quantity -= amount
        ticket.save()

        return Response(
            {"available_quantity": ticket.available_quantity}, status=status.HTTP_200_OK
        )

    def create(self, request: Request, *args, **kwargs) -> Response:
        """
        Создание нового типа билета.
        Доступно только администраторам.

        Аргументы:
            request: Запрос

        Возвращает:
            Response: Созданный тип билета
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )


class TicketAPIView(ModelViewSet):
    """API для работы с билетами."""

    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer

    def get_permissions(self) -> list:
        """
        Получение прав доступа.

        Возвращает:
            list: Список классов прав доступа
        """
        if self.request.query_params.get("status") == "on_canceled":
            return [IsAdminUser()]
        return super().get_permissions()

    def get_queryset(self) -> QuerySet[Ticket]:
        """
        Получение билетов с фильтрацией по статусу и текущему пользователю.
        """
        queryset = super().get_queryset()

        # Для обычных пользователей показываем только их билеты
        if not self.request.user.is_staff:
            queryset = queryset.filter(owner=self.request.user.userprofile)

        # Дополнительная фильтрация по статусу
        status = self.request.query_params.get("status")
        if status == "on_canceled":
            # Для статуса on_canceled проверяем права через get_permissions()
            return queryset.filter(payment_status="on_canceled")

        return queryset

    def perform_create(self, serializer: TicketSerializer) -> None:
        """
        Создание билета.

        Аргументы:
            serializer: Сериализатор билета
        """
        ticket_type_id = self.request.data.get("ticket_type_id")

        serializer.save(
            owner=self.request.user.userprofile,
            payment_status="paid",
            ticket_type_id=ticket_type_id,
        )

    @action(detail=True, methods=["patch"])
    def update_status(self, request: Request, pk: int = None) -> Response:
        """
        Обновление статуса билета.

        Аргументы:
            request: Запрос
            pk: ID билета

        Возвращает:
            Response: Обновленные данные билета
        """
        ticket = self.get_object()
        new_status = request.data.get("payment_status")

        allowed_statuses = ["paid", "canceled", "on_canceled", "pending"]

        if new_status not in allowed_statuses:
            return Response(
                {
                    "error": f"Недопустимый статус. Допустимые значения: {', '.join(allowed_statuses)}"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        ticket.payment_status = new_status
        ticket.save()

        serializer = self.get_serializer(ticket)
        return Response(serializer.data)

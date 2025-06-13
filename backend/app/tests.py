import pytest
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APIRequestFactory, force_authenticate
from .views import TicketAPIView, TicketTypeAPIView
from .models import Ticket, UserProfile, TicketType, Event
from django.utils import timezone
import datetime


@pytest.fixture
def api_factory():
    """Фабрика для создания API запросов."""
    return APIRequestFactory()


@pytest.fixture
def event():
    """Создает тестовое мероприятие."""
    return Event.objects.create(
        title="Test Event",
        description="Test Description",
        address="Test Address",
        is_published=True,
    )


@pytest.fixture
def ticket_type(event):
    """Создает тестовый тип билета для мероприятия."""
    return TicketType.objects.create(
        event=event,
        start_date=timezone.now() + datetime.timedelta(days=1),
        end_date=timezone.now() + datetime.timedelta(days=2),
        price=1000,
        available_quantity=10,
        total_quantity=20,
    )


@pytest.fixture
def admin_user():
    """Создает пользователя с правами администратора."""
    user = User.objects.create_superuser(
        username="admin", email="admin@test.com", password="password"
    )
    UserProfile.objects.create(user=user, avatar="images/default.jpg")
    return user


@pytest.fixture
def regular_user():
    """Создает обычного пользователя."""
    user = User.objects.create_user(
        username="user", email="user@test.com", password="password"
    )
    UserProfile.objects.create(user=user, avatar="images/default.jpg")
    return user


@pytest.fixture
def ticket(regular_user, ticket_type):
    """Создает тестовый билет для обычного пользователя."""
    return Ticket.objects.create(
        ticket_type=ticket_type, owner=regular_user.userprofile, payment_status="paid"
    )


@pytest.mark.django_db
class TestTicketAPIView:
    def test_get_permissions_for_on_canceled(self, api_factory, admin_user, regular_user):
        """Проверяет права доступа к билетам со статусом 'on_canceled'."""
        view = TicketAPIView.as_view({"get": "list"})

        request = api_factory.get("/tickets/?status=on_canceled")
        force_authenticate(request, user=regular_user)
        response = view(request)
        assert response.status_code == status.HTTP_403_FORBIDDEN

        request = api_factory.get("/tickets/?status=on_canceled")
        force_authenticate(request, user=admin_user)
        response = view(request)
        assert response.status_code == status.HTTP_200_OK

    def test_get_queryset_filtering(self, api_factory, admin_user, regular_user, ticket):
        """Тестирует фильтрацию билетов в get_queryset."""
        view = TicketAPIView.as_view({"get": "list"})

        request = api_factory.get("/tickets/")
        force_authenticate(request, user=regular_user)
        response = view(request)
        assert len(response.data) == 1

        request = api_factory.get("/tickets/?status=on_canceled")
        force_authenticate(request, user=regular_user)
        response = view(request)
        assert response.status_code == status.HTTP_403_FORBIDDEN

        ticket.payment_status = "on_canceled"
        ticket.save()
        request = api_factory.get("/tickets/?status=on_canceled")
        force_authenticate(request, user=admin_user)
        response = view(request)
        assert len(response.data) == 1

    def test_perform_create(self, api_factory, regular_user, ticket_type):
        """Тестирует процесс создания билета."""
        view = TicketAPIView.as_view({"post": "create"})
        data = {"ticket_type_id": ticket_type.id}

        request = api_factory.post("/tickets/", data, format="json")
        force_authenticate(request, user=regular_user)
        response = view(request)

        assert response.status_code == status.HTTP_201_CREATED
        assert Ticket.objects.count() == 1
        ticket = Ticket.objects.first()
        assert ticket.owner == regular_user.userprofile
        assert ticket.payment_status == "paid"
        assert ticket.ticket_type_id == ticket_type.id

    def test_update_status_action(self, api_factory, regular_user, ticket):
        """Тестирует обновление статуса билета."""
        view = TicketAPIView.as_view({"patch": "update_status"})

        data = {"payment_status": "canceled"}
        request = api_factory.patch(
            f"/tickets/{ticket.pk}/update_status/", data, format="json"
        )
        force_authenticate(request, user=regular_user)
        response = view(request, pk=ticket.pk)

        assert response.status_code == status.HTTP_200_OK
        ticket.refresh_from_db()
        assert ticket.payment_status == "canceled"

        data = {"payment_status": "invalid_status"}
        request = api_factory.patch(
            f"/tickets/{ticket.pk}/update_status/", data, format="json"
        )
        force_authenticate(request, user=regular_user)
        response = view(request, pk=ticket.pk)

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "Недопустимый статус" in str(response.data["error"])

    def test_ticket_creation_does_not_change_available_quantity(
        self, api_factory, regular_user, ticket_type
    ):
        """Проверяет, что создание билета не изменяет доступное количество."""
        initial_quantity = ticket_type.available_quantity
        view = TicketAPIView.as_view({"post": "create"})
        data = {"ticket_type_id": ticket_type.id}

        request = api_factory.post("/tickets/", data, format="json")
        force_authenticate(request, user=regular_user)
        response = view(request)

        assert response.status_code == status.HTTP_201_CREATED
        ticket_type.refresh_from_db()
        assert ticket_type.available_quantity == initial_quantity


@pytest.mark.django_db
class TestTicketTypeAPIView:
    def test_update_quantity_success(self, api_factory, regular_user, ticket_type):
        """Тестирует успешное обновление количества билетов."""
        view = TicketTypeAPIView.as_view({"patch": "update_quantity"})
        initial_quantity = ticket_type.available_quantity

        request = api_factory.patch(
            f"/ticket-types/{ticket_type.pk}/update_quantity/",
            {"amount": 2},
            format="json",
        )
        force_authenticate(request, user=regular_user)
        response = view(request, pk=ticket_type.pk)

        assert response.status_code == status.HTTP_200_OK
        ticket_type.refresh_from_db()
        assert ticket_type.available_quantity == initial_quantity - 2
        assert response.data["available_quantity"] == ticket_type.available_quantity

    def test_update_quantity_default_amount(self, api_factory, regular_user, ticket_type):
        """Тестирует обновление количества с дефолтным значением amount (1)."""
        view = TicketTypeAPIView.as_view({"patch": "update_quantity"})
        initial_quantity = ticket_type.available_quantity

        request = api_factory.patch(
            f"/ticket-types/{ticket_type.pk}/update_quantity/", {}, format="json"
        )
        force_authenticate(request, user=regular_user)
        response = view(request, pk=ticket_type.pk)

        assert response.status_code == status.HTTP_200_OK
        ticket_type.refresh_from_db()
        assert ticket_type.available_quantity == initial_quantity - 1

    def test_update_quantity_insufficient_available(self, api_factory, regular_user, ticket_type):
        """Тестирует попытку резервирования большего количества билетов, чем доступно."""
        view = TicketTypeAPIView.as_view({"patch": "update_quantity"})
        initial_quantity = ticket_type.available_quantity
        amount = initial_quantity + 1

        request = api_factory.patch(
            f"/ticket-types/{ticket_type.pk}/update_quantity/",
            {"amount": amount},
            format="json",
        )
        force_authenticate(request, user=regular_user)
        response = view(request, pk=ticket_type.pk)

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "Нет такого количества доступных билетов" in response.data["error"]
        ticket_type.refresh_from_db()
        assert ticket_type.available_quantity == initial_quantity

    def test_update_quantity_unauthenticated(self, api_factory, ticket_type):
        """Тестирует обновление количества без аутентификации."""
        view = TicketTypeAPIView.as_view({"patch": "update_quantity"})
        initial_quantity = ticket_type.available_quantity

        request = api_factory.patch(
            f"/ticket-types/{ticket_type.pk}/update_quantity/",
            {"amount": 1},
            format="json",
        )
        response = view(request, pk=ticket_type.pk)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        ticket_type.refresh_from_db()
        assert ticket_type.available_quantity == initial_quantity

    def test_create_ticket_type_as_admin(self, api_factory, admin_user, event):
        """Тестирует создание типа билета администратором."""
        view = TicketTypeAPIView.as_view({"post": "create"})
        initial_count = TicketType.objects.count()

        new_ticket_type_data = {
            "event": event.id,
            "start_date": timezone.now() + datetime.timedelta(days=5),
            "end_date": timezone.now() + datetime.timedelta(days=6),
            "price": 1500,
            "available_quantity": 50,
            "total_quantity": 100,
        }

        request = api_factory.post(
            "/ticket-types/", new_ticket_type_data, format="json"
        )
        force_authenticate(request, user=admin_user)
        response = view(request)

        assert response.status_code == status.HTTP_201_CREATED
        assert TicketType.objects.count() == initial_count + 1
        assert response.data["price"] == "1500"
        assert response.data["available_quantity"] == 50

    def test_create_ticket_type_as_regular_user(self, api_factory, regular_user, event):
        """Тестирует попытку создания типа билета обычным пользователем."""
        view = TicketTypeAPIView.as_view({"post": "create"})
        initial_count = TicketType.objects.count()

        new_ticket_type_data = {
            "event": event.id,
            "start_date": timezone.now() + datetime.timedelta(days=5),
            "end_date": timezone.now() + datetime.timedelta(days=6),
            "price": 1500,
            "available_quantity": 50,
            "total_quantity": 100,
        }

        request = api_factory.post(
            "/ticket-types/", new_ticket_type_data, format="json"
        )
        force_authenticate(request, user=regular_user)
        response = view(request)

        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert TicketType.objects.count() == initial_count
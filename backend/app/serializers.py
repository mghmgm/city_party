from django.conf import settings
from rest_framework import serializers
from .models import (
    Event,
    Review,
    Category,
    Banner,
    Place,
    Gallery,
    Photo,
    TicketType,
    UserProfile,
    Ticket,
)


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        # указать позже конкретные поля (для клиента которые)
        fields = "__all__"


class EventSerializer(serializers.ModelSerializer):
    rating_avg = serializers.FloatField(read_only=True)
    categories = CategorySerializer(many=True)
    cover_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            "id",
            "title",
            "description",
            "cover_image_url",
            "categories",
            "rating_avg",
        ]

    def get_cover_image_url(self, obj):
        if obj.cover_image:
            return settings.MEDIA_URL + obj.cover_image.image.name
        return None


class ReviewSerializer(serializers.ModelSerializer):
    author_username = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = [
            "id",
            "event_id",
            "description",
            "rating",
            "author_username",
            "pub_date",
            "status",
        ]
        extra_kwargs = {
            "author": {"read_only": True},
            "event": {"read_only": True},
        }

    def get_author_username(self, obj):
        return obj.author.user.username


class BannerSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Banner
        fields = ["image_url", "company", "event_id"]

    def get_image_url(self, obj):
        if obj.image:
            return settings.MEDIA_URL + obj.image.name


class PlaceSerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField()

    class Meta:
        model = Place
        fields = ["photo_url", "name", "description", "address"]

    def get_photo_url(self, obj):
        if obj.photo:
            return settings.MEDIA_URL + obj.photo.name


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["name", "slug"]


class PhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = ["image", "title", "caption"]


class GallerySerializer(serializers.ModelSerializer):
    photos = PhotoSerializer(many=True, read_only=True)

    class Meta:
        model = Gallery
        fields = ["title", "photos"]


class TicketTypeSerializer(serializers.ModelSerializer):
    start_date = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", allow_null=True)
    end_date = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", allow_null=True)

    class Meta:
        model = TicketType
        fields = [
            "id",
            "start_date",
            "end_date",
            "price",
            "event",
            "available_quantity",
        ]


class TicketSerializer(serializers.ModelSerializer):
    event = serializers.SerializerMethodField()
    payment_status_display = serializers.SerializerMethodField()
    owner_username = serializers.SerializerMethodField()

    class Meta:
        model = Ticket
        fields = [
            "id",
            "ticket_type_id",
            "owner_username",
            "event",
            "payment_status_display",
            "payment_status",
        ]
        extra_kwargs = {"owner": {"required": False}}

    def get_event(self, obj):
        return EventSerializer(obj.ticket_type.event).data

    def get_payment_status_display(self, obj):
        return obj.get_payment_status_display()

    def get_owner_username(self, obj):
        return obj.owner.user.username if obj.owner and obj.owner.user else None


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username")
    first_name = serializers.CharField(source="user.first_name")
    last_name = serializers.CharField(source="user.last_name")
    is_superuser = serializers.CharField(source="user.is_superuser")
    active_tickets = serializers.SerializerMethodField()
    used_tickets = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = [
            "description",
            "avatar",
            "vk_profile",
            "username",
            "first_name",
            "last_name",
            "active_tickets",
            "used_tickets",
            "is_superuser",
        ]

    def get_active_tickets(self, obj):
        tickets_data = self.context.get("tickets_data", {})
        return tickets_data.get("active_tickets", [])

    def get_used_tickets(self, obj):
        tickets_data = self.context.get("tickets_data", {})
        return tickets_data.get("used_tickets", [])

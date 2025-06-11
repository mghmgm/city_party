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
    # review_count = serializers.IntegerField(read_only=True)
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
            # "review_count",
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
        fields = ["image_url", "title", "description", "company", "event_id"]

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
        fields = ["start_date", "end_date", "price", "event"]


class TicketSerializer(serializers.ModelSerializer):
    ticket_type = serializers.SerializerMethodField()
    event_title = serializers.SerializerMethodField()
    event_id = serializers.SerializerMethodField()
    cover_img_url = serializers.SerializerMethodField()
    payment_status = serializers.SerializerMethodField()

    class Meta:
        model = Ticket
        fields = [
            "ticket_type",
            "owner",
            "event_title",
            "event_id",
            "cover_img_url",
            "payment_status",
        ]

    def get_ticket_type(self, obj):
        serializer = TicketTypeSerializer(obj.ticket_type)
        return serializer.data

    def get_event_title(self, obj):
        return obj.ticket_type.event.title
    
    def get_event_id(self, obj):
        return obj.ticket_type.event.id

    def get_cover_img_url(self, obj):
        return settings.MEDIA_URL + obj.ticket_type.event.cover_image.image.name

    def get_payment_status(self, obj):
        return obj.get_payment_status_display()


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
        tickets_data = self.context.get('tickets_data', {})
        return tickets_data.get('active_tickets', [])

    def get_used_tickets(self, obj):
        tickets_data = self.context.get('tickets_data', {})
        return tickets_data.get('used_tickets', [])
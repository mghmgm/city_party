from django.conf import settings
from rest_framework import serializers
from .models import Event, Review, Category, Banner, Place


class CategorySerializer(serializers.ModelSerializer):
  class Meta:
    model = Category
    # указать позже конкретные поля (для клиента которые)
    fields = "__all__"


class EventSerializer(serializers.ModelSerializer):
  review_count = serializers.IntegerField(read_only=True)
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
      "review_count",
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
      "description",
      "rating",
      "author_username",
      "pub_date",
      "status",
    ]
    extra_kwargs = {
      "author": {"read_only": True},
      "event": {"read_only": True},
      "status": {"read_only": True},
    }

    def get_author_username(self, obj):
        return obj.author.user.username


class BannerSerializer(serializers.ModelSerializer):
  image_url = serializers.SerializerMethodField()
  
  class Meta:
    model = Banner
    fields = ["image_url", "title", "description", "company"]
    
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
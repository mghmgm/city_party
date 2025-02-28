from rest_framework import serializers
from .models import Event, Review

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        # указать позже конкретные поля (для клиента которые)
        fields = "__all__"

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        # указать позже конкретные поля (для клиента которые)
        fields = "__all__"
from rest_framework import serializers
from .models import Event, Review, Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        # указать позже конкретные поля (для клиента которые)
        fields = "__all__"

class EventSerializer(serializers.ModelSerializer):
    review_count = serializers.IntegerField(read_only=True)
    rating_avg = serializers.FloatField(read_only=True)
    categories = CategorySerializer(many=True)
    
    class Meta:
        model = Event
        # указать позже конкретные поля (для клиента которые)
        fields = "__all__"

class ReviewSerializer(serializers.ModelSerializer):
    author_username = serializers.SerializerMethodField()
    
    class Meta:
        model = Review
        fields =  ['id', 'description', 'rating', 'author_username', 'pub_date', 'status']
        extra_kwargs = {
            'author': {'read_only': True},
            'event': {'read_only': True},
            'status': {'read_only': True}
        }
        
    def get_author_username(self, obj):
        return obj.author.user.username
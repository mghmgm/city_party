import django_filters
from django.db.models import Q
from .models import Event

class EventFilter(django_filters.FilterSet):
    search = django_filters.CharFilter(method='filter_search', field_name='title')
    ordering = django_filters.CharFilter(method='filter_ordering')
    limit = django_filters.NumberFilter(method='filter_limit')

    class Meta:
        model = Event
        fields = ['title']

    def filter_search(self, queryset, name, value):
        """Фильтрация по поисковому запросу"""
        return queryset.filter(title__icontains=value)

    def filter_ordering(self, queryset, name, value):
        """Сортировка по рейтингу"""
        if value == "rating":
            queryset = queryset.order_by("-rating_avg")
            queryset = queryset.exclude(rating_avg__isnull=True)
        return queryset

    def filter_limit(self, queryset, name, value):
        """Ограничение количества результатов"""
        if value:
            return queryset[:int(value)]
        return queryset
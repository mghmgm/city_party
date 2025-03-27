import django_filters
from .models import Event

class EventFilter(django_filters.FilterSet):
  title = django_filters.CharFilter(lookup_expr='icontains')
  
  class Meta:
    model = Event
    fields=['title']
from django.contrib import admin
from .models import Event, Category, Place, Review, TicketType, Ticket, UserProfile, Banner, Company
from django.forms import Textarea, TextInput
from django.db import models


class ReviewInline(admin.TabularInline):
    model = Review
    extra = 1
    raw_id_fields = ["event", "author"]
    formfield_overrides = {
        models.TextField: {'widget': Textarea(attrs={'rows': 2, 'cols': 40})}
    }

class TicketTypeInline(admin.TabularInline):
    model = TicketType
    extra = 1
    raw_id_fields = ["event"]
    formfield_overrides = {
        models.TextField: {'widget': Textarea(attrs={'rows': 2, 'cols': 40})}
    }

class TicketInline(admin.TabularInline):
    model = Ticket
    extra = 1
    raw_id_fields = ["ticket_type", "owner"]

class BannerInline(admin.TabularInline):
    model = Banner
    extra = 1
    raw_id_fields = ["company", "event"]
    formfield_overrides = {
        models.CharField: {'widget': TextInput(attrs={'size': '10'})},
        models.TextField: {'widget': Textarea(attrs={'rows': 6, 'cols': 18})},
    }


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = [
        "title", 
        "cover_image", 
        "gallery", 
        "short_description", 
        "address", 
        "created_at",
        "is_published",
        'get_categories',
    ]
    list_filter = ["categories", "address"]
    filter_horizontal = ["categories"]
    search_fields = ["title"]
    date_hierarchy = 'created_at'
    inlines = [ReviewInline, TicketTypeInline]
    raw_id_fields = ["gallery", "cover_image"]
    
    def get_categories(self, obj):
        return ", ".join([category.name for category in obj.categories.all()])
    get_categories.short_description = "Категории"
    
    @admin.display(description="Описание")
    def short_description(self, obj):
        return (
            obj.description[:30] + "..."
            if len(obj.description) > 80
            else obj.description
        )


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "slug"]
    search_fields = ["name"]


@admin.register(Place)
class PlaceAdmin(admin.ModelAdmin):
    list_display = ["name", "photo", "short_description", "address", "created_at", "is_published"]
    search_fields = ["name", "address"]
    date_hierarchy = "created_at"
    
    @admin.display(description="Описание")
    def short_description(self, obj):
        return (
            obj.description[:180] + "..."
            if len(obj.description) > 80
            else obj.description
        )


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ["event", "short_description", "rating", "author", "created_at", "pub_date", "status"]
    list_display_links = ["short_description"]
    date_hierarchy = "created_at"
    search_fields = ["short_description"]
    list_filter = ["author", "event"]
    raw_id_fields = ["author", "event"]
    
    @admin.display(description="Описание")
    def short_description(self, obj):
        return (
            obj.description[:50] + "..."
            if len(obj.description) > 80
            else obj.description
        )


@admin.register(TicketType)
class TicketTypeAdmin(admin.ModelAdmin):
    list_display = [
        "event", 
        "description", 
        "price", 
        "event_date", 
        "available_quantity", 
        "total_quantity"
    ]
    inlines = [TicketInline]
    list_filter = ["event"]
    date_hierarchy = "event_date"
    raw_id_fields = ["event"]


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = [
        "ticket_type", 
        "owner", 
        "payment_status", 
    ]
    raw_id_fields = ["ticket_type", "owner"]
    list_filter = ["owner", "ticket_type"]


@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = [
        "title", 
        "description",
        "image", 
        "pub_date", 
        "end_date", 
        "company",
        "created_at",
        "event"
    ]
    search_fields = ["title"]
    raw_id_fields = ["company", "event"]
    date_hierarchy = ("created_at")


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ["name", "tin", "email"]
    search_fields = ["name"]
    inlines = [BannerInline]


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = [
        "username", 
        "avatar",
        "email", 
        "first_name", 
        "last_name", 
        "is_superuser",
        "is_active",
    ]
    search_fields = ["username"]
    raw_id_fields = ["user"]
    list_filter = ["user__is_active", "user__is_superuser"]    
    inlines = [ReviewInline, TicketInline]

    def username(self, obj):
        return obj.user.username
    username.short_description = 'Юзернейм'

    def email(self, obj):
        return obj.user.email
    email.short_description = 'Почта'

    def first_name(self, obj):
        return obj.user.first_name
    first_name.short_description = 'Имя'

    def last_name(self, obj):
        return obj.user.last_name
    last_name.short_description = 'Фамилия'

    def is_superuser(self, obj):
        return obj.user.is_superuser
    is_superuser.short_description = 'Суперюзер'
    
    def is_active(self, obj):
        return obj.user.is_active
    is_active.short_description = 'Активный'

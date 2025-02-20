from django.contrib import admin
from .models import Event, Category, Place, Gallery, Review, TicketType, Ticket, UserProfile, Banner, Company
from django.utils.safestring import mark_safe


class ReviewInline(admin.TabularInline):
    model = Review
    extra = 1
    raw_id_fields = ["event", "author"]

class GalleryInline(admin.TabularInline):
    model = Gallery
    extra = 1
    raw_id_fields = ["event"]

class TicketTypeInline(admin.TabularInline):
    model = TicketType
    extra = 1
    raw_id_fields = ["event"]

class TicketInline(admin.TabularInline):
    model = Ticket
    extra = 1
    raw_id_fields = ["ticket_type"]

class BannerInline(admin.TabularInline):
    model = Banner
    extra = 1
    raw_id_fields = ["company"]


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = [
        "title", 
        "cover_image",  
        "description", 
        "address", 
        "pub_date", 
        "is_published",
        'get_categories',
    ]
    list_filter = ["categories", "address"]
    filter_horizontal = ["categories"]
    search_fields = ["title"]
    date_hierarchy = 'pub_date'
    inlines = [ReviewInline, GalleryInline, TicketTypeInline]
    
    def get_categories(self, obj):
        return ", ".join([category.name for category in obj.categories.all()])
    get_categories.short_description = "Категории"


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name"]
    search_fields = ["name"]


@admin.register(Place)
class PlaceAdmin(admin.ModelAdmin):
    list_display = [
        "name", 
        "description", 
        "address"
    ]
    search_fields = ["name", "address"]


@admin.register(Gallery)
class GalleryAdmin(admin.ModelAdmin):
    list_display = ["id", "image", "event"]
    list_filter = ["event"]
    raw_id_fields = ["event"]


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ["event", "description", "author", "pub_date"]
    list_display_links = ["description"]
    search_fields = ["description"]
    list_filter = ["author", "event"]
    raw_id_fields = ["author", "event"]


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
        "is_valid"
    ]
    raw_id_fields = ["ticket_type", "owner"]
    list_filter = ["owner", "ticket_type"]
    readonly_fields = ["is_valid"]


@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = [
        "title", 
        "description",
        "image", 
        "pub_date", 
        "end_date", 
        "company",
    ]
    search_fields = ["title"]
    raw_id_fields = ["company"]


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

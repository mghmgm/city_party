from django.urls import reverse
from django.utils import timezone
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator
from photologue.models import Photo, Gallery
from datetime import timedelta
from django.db.models import Count, Avg

class EventPublishedManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(
            is_published=True,
            created_at__gte=timezone.now() - timedelta(days=2 * 365)
        )\
          .annotate(rating_avg = Avg('reviews__rating'))\
        
    def get_total(self):
        return self.get_queryset().aggregate(Count('id'))

class Event(models.Model):
    title = models.CharField(max_length=255, verbose_name="Заголовок")
    cover_image = models.ForeignKey(Photo, null=True, blank=True, on_delete=models.SET_NULL, verbose_name="Обложка")
    gallery = models.ForeignKey(Gallery, on_delete = models.SET_NULL, null=True, blank=True, verbose_name="Галерея")
    categories = models.ManyToManyField("Category", related_name="events", verbose_name="Категории")
    description = models.TextField(max_length=4000, verbose_name="Описание")
    address = models.CharField(max_length=500, verbose_name="Адрес")
    created_at = models.DateTimeField(default=timezone.now, verbose_name="Дата создания")
    is_published = models.BooleanField(default=False, verbose_name="Опубликовано")
    
    def __str__(self):
        return self.title
    
    objects = models.Manager()
    published = EventPublishedManager()
    
    class Meta:
        db_table = "events"
        verbose_name = "Событие"
        verbose_name_plural = "События"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['created_at']),
            models.Index(fields=['is_published']),
        ]


class Category(models.Model):
    name = models.CharField(max_length=255, unique=True, verbose_name="Название категории")
    slug = models.SlugField(max_length=255, unique=True, verbose_name="Слаг")
    
    def __str__(self):
        return self.name
    
    class Meta:
        db_table = "categories"
        verbose_name = "Категория"
        verbose_name_plural = "Категории"
        
    def get_absolute_url(self):
        return reverse('events', kwargs={'category_slug': self.slug})


class Review(models.Model):
    class Status(models.TextChoices):
        REJECTED = "rejected", "Отклонен"
        ACCEPTED = "accepted", "Принят"
        ON_MODERATION = "on_moderation", "На модерации"
    
    author = models.ForeignKey("UserProfile", on_delete=models.CASCADE, related_name="reviews", verbose_name="Автор")
    description = models.TextField(max_length=1000, verbose_name="Описание")
    rating = models.PositiveIntegerField(validators=[MaxValueValidator(5)], verbose_name="Рейтинг")
    pub_date = models.DateTimeField(null = True, blank=True, verbose_name="Дата публикации")
    created_at = models.DateTimeField(default=timezone.now, verbose_name="Дата создания")
    event = models.ForeignKey("Event", on_delete=models.CASCADE, related_name="reviews", verbose_name="Событие")
    status = models.CharField(default=Status.ON_MODERATION, choices=Status, verbose_name="Статус", max_length=50)

    
    def __str__(self):
        return f"review by {self.author.user.username} for {self.event.title}"

    class Meta:
        db_table = "reviews"
        verbose_name = "Отзыв"
        verbose_name_plural = "Отзывы"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['author']),
            models.Index(fields=['event']),
            models.Index(fields=['created_at']),
            models.Index(fields=['status']),
        ]


class Place(models.Model):
    name = models.CharField(max_length=255, unique=True, verbose_name="Название места")
    photo = models.ImageField(upload_to="images/", verbose_name="Изображение")
    description = models.TextField(max_length=4000, verbose_name="Описание")
    created_at = models.DateTimeField(default=timezone.now, verbose_name="Дата создания")
    is_published = models.BooleanField(default=False, verbose_name="Опубликовано")
    address = models.CharField(max_length=500, verbose_name="Адрес")
    
    def __str__(self):
        return self.name
    
    class Meta:
        db_table = "places"
        verbose_name = "Место"
        verbose_name_plural = "Места"
        indexes = [
            models.Index(fields=['created_at']),
            models.Index(fields=['is_published']),
        ]


class TicketType(models.Model):
    event = models.ForeignKey("Event", on_delete=models.CASCADE, related_name="ticket_types", verbose_name="Событие")
    start_date = models.DateTimeField(verbose_name="Дата начала", null=True)
    end_date = models.DateTimeField(verbose_name="Дата окончания", null=True)
    price = models.DecimalField(max_digits=8, decimal_places=0, verbose_name="Цена")
    available_quantity = models.PositiveBigIntegerField(default=0, verbose_name="Доступное количество")
    total_quantity = models.PositiveBigIntegerField(default=0, verbose_name="Общее количество")
    
    class Meta:
        db_table = "ticket_types"
        verbose_name = "Тип Билета"
        verbose_name_plural = "Типы Билетов"
        
    def __str__(self):
      if self.start_date:
          date_str = self.start_date.strftime('%d.%m.%Y')
      else:
          date_str = 'Нет даты'
      return f"{self.event.title} ({date_str})"



class Ticket(models.Model):
    class PaymentStatus(models.TextChoices):
        PENDING = "pending", "Не оплачен"
        PAID = "paid", "Оплачен"
        CANCELED = "canceled", "Отменен"
        ON_CANCELED = "on_canceled", "На возврате"
    
    ticket_type = models.ForeignKey("TicketType", on_delete=models.CASCADE, related_name="tickets", verbose_name="Тип билета")
    owner = models.ForeignKey("UserProfile", on_delete=models.SET_NULL, null=True, blank=True, related_name="tickets", verbose_name="Владелец")
    payment_status = models.CharField(choices=PaymentStatus, default=PaymentStatus.PENDING, verbose_name="Статус оплаты", max_length=50)
    pdf_file = models.FileField(upload_to='documents/', verbose_name="Файл", null=True, blank=True)
    
    def __str__(self):
        return f"{self.owner.user.username}'s ticket for {self.ticket_type.event.title}"

    class Meta:
        db_table = "tickets"
        verbose_name = "Билет"
        verbose_name_plural = "Билеты"
        indexes = [
            models.Index(fields=['owner']),
        ]


class Banner(models.Model):
    image = models.ImageField(upload_to="images/", verbose_name="Изображение")
    pub_date = models.DateTimeField(verbose_name="Дата публикации")
    end_date = models.DateTimeField(verbose_name="Дата окончания")
    company = models.ForeignKey("Company", on_delete=models.CASCADE, related_name="banners", verbose_name="Компания")
    created_at = models.DateTimeField(default=timezone.now, verbose_name="Дата создания")
    is_visible = models.BooleanField(default=False)
    event = models.ForeignKey(Event, on_delete=models.SET_NULL, null=True, blank=True, related_name="banners", verbose_name="Ивент")
    
    class Meta:
        db_table = "banners"
        verbose_name = "Баннер"
        verbose_name_plural = "Баннеры"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['created_at']),
            models.Index(fields=['event']),
        ]


class Company(models.Model):
    name = models.CharField(max_length=255, verbose_name="Название компании")
    email = models.EmailField(unique=True, verbose_name="Электронная почта")
    tin = models.PositiveBigIntegerField(verbose_name="ИНН")
    
    def __str__(self):
        return self.name
    
    class Meta:
        db_table = "companies"
        verbose_name = "Компания"
        verbose_name_plural = "Компании"


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, verbose_name="Пользователь")
    description = models.CharField(max_length=500, verbose_name="Описание", null=True, blank=True)
    avatar = models.ImageField(upload_to="images/", verbose_name="Аватар")
    vk_profile = models.URLField(verbose_name="ВК профиль", null=True, blank=True)
    # yandex_id = models.CharField(max_length=100, blank=True, null=True)
    
    def __str__(self):
        return self.user.username
    
    class Meta:
        db_table = "user_profiles"
        verbose_name = "Профиль"
        verbose_name_plural = "Профили"

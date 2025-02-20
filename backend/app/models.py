from django.utils import timezone
from django.db import models
from django.contrib.auth.models import User


class Event(models.Model):
    title = models.CharField(max_length=255, verbose_name="Заголовок")
    cover_image = models.ImageField(upload_to="images/", null=True, blank=True, verbose_name="Обложка")
    categories = models.ManyToManyField("Category", related_name="events", verbose_name="Категории")
    description = models.TextField(max_length=1000, verbose_name="Описание")
    address = models.CharField(max_length=500, verbose_name="Адрес")
    pub_date = models.DateTimeField(default=timezone.now, verbose_name="Дата публикации")
    is_published = models.BooleanField(default=False, verbose_name="Опубликовано")
    
    def __str__(self):
        return self.title
    
    class Meta:
        db_table = "events"
        verbose_name = "Событие"
        verbose_name_plural = "События"
        ordering = ['-pub_date']
        indexes = [
            models.Index(fields=['-pub_date']),
        ]


class Gallery(models.Model):
    image = models.ImageField(upload_to="images/", verbose_name="Изображение")
    event = models.ForeignKey("Event", on_delete=models.CASCADE, related_name="gallery", verbose_name="Событие")

    def __str__(self):
        return f"image for {self.event.title}"
    
    class Meta:
        db_table = "galleries"
        verbose_name = "Галерея"
        verbose_name_plural = "Галереи"


class Category(models.Model):
    name = models.CharField(max_length=255, unique=True, verbose_name="Название категории")
    
    def __str__(self):
        return self.name
    
    class Meta:
        db_table = "categories"
        verbose_name = "Категория"
        verbose_name_plural = "Категории"


class Review(models.Model):
    author = models.ForeignKey("UserProfile", on_delete=models.CASCADE, related_name="reviews", verbose_name="Автор")
    description = models.TextField(max_length=1000, verbose_name="Описание")
    pub_date = models.DateTimeField(auto_now_add=True, verbose_name="Дата публикации")
    event = models.ForeignKey("Event", on_delete=models.CASCADE, related_name="reviews", verbose_name="Событие")
    
    def __str__(self):
        return f"comment by {self.author.user.username} for {self.event.title}"

    class Meta:
        db_table = "reviews"
        verbose_name = "Отзыв"
        verbose_name_plural = "Отзывы"
        ordering = ['-pub_date']


class Place(models.Model):
    name = models.CharField(max_length=255, unique=True, verbose_name="Название места")
    description = models.CharField(max_length=1000, verbose_name="Описание")
    address = models.CharField(max_length=500, verbose_name="Адрес")
    
    def __str__(self):
        return self.name
    
    class Meta:
        db_table = "places"
        verbose_name = "Место"
        verbose_name_plural = "Места"


class TicketType(models.Model):
    event = models.ForeignKey("Event", on_delete=models.CASCADE, related_name="ticket_types", verbose_name="Событие")
    description = models.TextField(max_length=255, null=True, blank=True, verbose_name="Описание")
    price = models.DecimalField(max_digits=8, decimal_places=0, verbose_name="Цена")
    event_date = models.DateTimeField(verbose_name="Дата события")
    available_quantity = models.PositiveBigIntegerField(default=0, verbose_name="Доступное количество")
    total_quantity = models.PositiveBigIntegerField(default=0, verbose_name="Общее количество")
    
    def __str__(self):
        return f"{self.event.title} ({self.description})"
    
    class Meta:
        db_table = "ticket_types"
        verbose_name = "Тип Билета"
        verbose_name_plural = "Типы Билетов"


class Ticket(models.Model):
    class PaymentStatus(models.TextChoices):
        PENDING = "pending", "Не оплачен"
        PAID = "paid", "Оплачен"
        CANCELED = "canceled", "Отменен"
    
    ticket_type = models.ForeignKey("TicketType", on_delete=models.CASCADE, related_name="tickets", verbose_name="Тип билета")
    owner = models.ForeignKey("UserProfile", on_delete=models.SET_NULL, null=True, blank=True, related_name="tickets", verbose_name="Владелец")
    payment_status = models.CharField(
        max_length=10,
        choices=PaymentStatus,
        default=PaymentStatus.PENDING,
        verbose_name="Статус оплаты"
    )
    is_valid = models.BooleanField(default=True, verbose_name="Действительный")
    
    def __str__(self):
        return f"{self.owner.user.username}'s ticket for {self.ticket_type.event.title}"

    class Meta:
        db_table = "tickets"
        verbose_name = "Билет"
        verbose_name_plural = "Билеты"


class Banner(models.Model):
    title = models.CharField(max_length=255, verbose_name="Заголовок")
    description = models.TextField(max_length=100, verbose_name="Описание")
    image = models.ImageField(upload_to="images/", verbose_name="Изображение")
    pub_date = models.DateTimeField(verbose_name="Дата публикации")
    end_date = models.DateTimeField(verbose_name="Дата окончания")
    company = models.ForeignKey("Company", on_delete=models.CASCADE, related_name="banners", verbose_name="Компания")

    def __str__(self):
        return self.title
    
    class Meta:
        db_table = "banners"
        verbose_name = "Баннер"
        verbose_name_plural = "Баннеры"


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
    description = models.CharField(max_length=500, verbose_name="Описание")
    avatar = models.ImageField(upload_to="images/", verbose_name="Аватар")
    
    def __str__(self):
        return self.user.username
    
    class Meta:
        db_table = "user_profiles"
        verbose_name = "Профиль"
        verbose_name_plural = "Профили"

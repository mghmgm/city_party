# Generated by Django 5.1.6 on 2025-02-19 14:28

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0023_alter_event_address_alter_event_category_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterField(
            model_name='banner',
            name='company',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='banners', to='app.company', verbose_name='Компания'),
        ),
        migrations.AlterField(
            model_name='banner',
            name='end_date',
            field=models.DateTimeField(verbose_name='Дата окончания'),
        ),
        migrations.AlterField(
            model_name='banner',
            name='image',
            field=models.ImageField(upload_to='images/', verbose_name='Изображение'),
        ),
        migrations.AlterField(
            model_name='banner',
            name='pub_date',
            field=models.DateTimeField(verbose_name='Дата публикации'),
        ),
        migrations.AlterField(
            model_name='banner',
            name='title',
            field=models.CharField(max_length=255, verbose_name='Заголовок'),
        ),
        migrations.AlterField(
            model_name='category',
            name='name',
            field=models.CharField(max_length=255, unique=True, verbose_name='Название категории'),
        ),
        migrations.AlterField(
            model_name='company',
            name='email',
            field=models.EmailField(max_length=254, unique=True, verbose_name='Электронная почта'),
        ),
        migrations.AlterField(
            model_name='company',
            name='name',
            field=models.CharField(max_length=255, verbose_name='Название компании'),
        ),
        migrations.AlterField(
            model_name='gallery',
            name='event',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='gallery', to='app.event', verbose_name='Событие'),
        ),
        migrations.AlterField(
            model_name='gallery',
            name='image',
            field=models.ImageField(upload_to='images/', verbose_name='Изображение'),
        ),
        migrations.AlterField(
            model_name='place',
            name='address',
            field=models.CharField(max_length=500, verbose_name='Адрес'),
        ),
        migrations.AlterField(
            model_name='place',
            name='description',
            field=models.CharField(max_length=1000, verbose_name='Описание'),
        ),
        migrations.AlterField(
            model_name='place',
            name='name',
            field=models.CharField(max_length=255, unique=True, verbose_name='Название места'),
        ),
        migrations.AlterField(
            model_name='review',
            name='author',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reviews', to='app.userprofile', verbose_name='Автор'),
        ),
        migrations.AlterField(
            model_name='review',
            name='description',
            field=models.TextField(max_length=1000, verbose_name='Описание'),
        ),
        migrations.AlterField(
            model_name='review',
            name='event',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reviews', to='app.event', verbose_name='Событие'),
        ),
        migrations.AlterField(
            model_name='review',
            name='pub_date',
            field=models.DateTimeField(auto_now_add=True, verbose_name='Дата публикации'),
        ),
        migrations.AlterField(
            model_name='ticket',
            name='is_valid',
            field=models.BooleanField(default=True, verbose_name='Действительный'),
        ),
        migrations.AlterField(
            model_name='ticket',
            name='owner',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='tickets', to='app.userprofile', verbose_name='Владелец'),
        ),
        migrations.AlterField(
            model_name='ticket',
            name='payment_status',
            field=models.CharField(choices=[('pending', 'Не оплачен'), ('paid', 'Оплачен'), ('canceled', 'Отменён')], default='pending', max_length=10, verbose_name='Статус оплаты'),
        ),
        migrations.AlterField(
            model_name='ticket',
            name='ticket_type',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tickets', to='app.tickettype', verbose_name='Тип билета'),
        ),
        migrations.AlterField(
            model_name='tickettype',
            name='available_quantity',
            field=models.PositiveBigIntegerField(default=0, verbose_name='Доступное количество'),
        ),
        migrations.AlterField(
            model_name='tickettype',
            name='description',
            field=models.TextField(blank=True, max_length=255, null=True, verbose_name='Описание'),
        ),
        migrations.AlterField(
            model_name='tickettype',
            name='event',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='ticket_types', to='app.event', verbose_name='Событие'),
        ),
        migrations.AlterField(
            model_name='tickettype',
            name='event_date',
            field=models.DateTimeField(verbose_name='Дата события'),
        ),
        migrations.AlterField(
            model_name='tickettype',
            name='price',
            field=models.DecimalField(decimal_places=0, max_digits=8, verbose_name='Цена'),
        ),
        migrations.AlterField(
            model_name='tickettype',
            name='total_quantity',
            field=models.PositiveBigIntegerField(default=0, verbose_name='Общее количество'),
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='avatar',
            field=models.ImageField(upload_to='images/', verbose_name='Аватар'),
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='description',
            field=models.CharField(max_length=500, verbose_name='Описание'),
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='Пользователь'),
        ),
    ]

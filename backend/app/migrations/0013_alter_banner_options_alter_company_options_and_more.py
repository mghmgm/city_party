# Generated by Django 5.1.6 on 2025-02-18 09:51

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0012_alter_category_options_alter_gallery_options'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='banner',
            options={'verbose_name': 'Баннер', 'verbose_name_plural': 'Баннеры'},
        ),
        migrations.AlterModelOptions(
            name='company',
            options={'verbose_name': 'Компания', 'verbose_name_plural': 'Компании'},
        ),
        migrations.AlterModelOptions(
            name='place',
            options={'verbose_name': 'Место', 'verbose_name_plural': 'Места'},
        ),
        migrations.AlterModelOptions(
            name='review',
            options={'verbose_name': 'Отзыв', 'verbose_name_plural': 'Отзывы'},
        ),
        migrations.AlterModelOptions(
            name='ticket',
            options={'verbose_name': 'Билет', 'verbose_name_plural': 'Билеты'},
        ),
        migrations.AlterModelOptions(
            name='tickettype',
            options={'verbose_name': 'Тип Билета', 'verbose_name_plural': 'Типы Билетов'},
        ),
        migrations.AlterModelOptions(
            name='userprofile',
            options={'verbose_name': 'Профиль', 'verbose_name_plural': 'Профили'},
        ),
    ]

# Generated by Django 5.1.6 on 2025-02-21 13:21

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0032_remove_ticket_is_valid_banner_created_at_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='banner',
            name='created_at',
            field=models.DateTimeField(default=django.utils.timezone.now, verbose_name='Дата создания'),
        ),
    ]

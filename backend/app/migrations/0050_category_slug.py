# Generated by Django 5.1.6 on 2025-02-28 10:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0049_alter_banner_options_alter_review_options_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='category',
            name='slug',
            field=models.SlugField(blank=True, max_length=255, null=True, unique=True, verbose_name='URL'),
        ),
    ]

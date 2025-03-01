# Generated by Django 5.1.6 on 2025-02-25 18:17

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0043_remove_event_cover_image'),
        ('photologue', '0014_alter_watermark_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='image',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='photologue.photo'),
        ),
    ]

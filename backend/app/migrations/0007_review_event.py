# Generated by Django 5.1.6 on 2025-02-18 09:19

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0006_tickettype_description'),
    ]

    operations = [
        migrations.AddField(
            model_name='review',
            name='event',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, related_name='reviews', to='app.event'),
            preserve_default=False,
        ),
    ]

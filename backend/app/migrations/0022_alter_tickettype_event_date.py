# Generated by Django 5.1.6 on 2025-02-19 13:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0021_alter_tickettype_event_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tickettype',
            name='event_date',
            field=models.DateTimeField(),
        ),
    ]

# Generated by Django 5.1.6 on 2025-02-19 13:23

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0019_rename_available_quantity_tickettype_available_quantityy_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='tickettype',
            old_name='available_quantityy',
            new_name='available_quantity',
        ),
        migrations.RenameField(
            model_name='tickettype',
            old_name='event_datee',
            new_name='event_date',
        ),
        migrations.RenameField(
            model_name='tickettype',
            old_name='total_quantityy',
            new_name='total_quantity',
        ),
    ]

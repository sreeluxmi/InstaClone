# Generated by Django 4.2.4 on 2023-08-21 11:04

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_user_email_or_phone'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='email_or_phone',
        ),
    ]

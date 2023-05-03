# Generated by Django 4.0.6 on 2022-09-16 15:11

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Character',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='silly', max_length=256)),
                ('detail1', models.CharField(default='large', max_length=1024)),
                ('detail2', models.CharField(default='smoker', max_length=1024)),
            ],
        ),
    ]

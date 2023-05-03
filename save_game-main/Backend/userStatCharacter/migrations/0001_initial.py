# Generated by Django 4.0.6 on 2022-09-16 15:13

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('character', '0001_initial'),
        ('userStat', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserStatCharacter',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('character', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='character.character')),
                ('userStat', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='userStat.userstat')),
            ],
        ),
    ]
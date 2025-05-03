from django.core.management.base import BaseCommand
from faker import Faker
from django.contrib.auth.models import User
from app.models import UserProfile, Category
from transliterate import translit
from django.core.files import File
import random
from PIL import Image
from io import BytesIO
from django.utils.text import slugify

fake = Faker("ru_RU")


def create_fake_image():
    img = Image.new(
        "RGB",
        (100, 100),
        color=(random.randint(0, 255), random.randint(0, 255), random.randint(0, 255)),
    )
    img_io = BytesIO()
    img.save(img_io, "JPEG")
    img_io.seek(0)
    return File(img_io, name=f"avatar_{random.randint(1000, 9999)}.jpg")


class Command(BaseCommand):
    help = "Populates the database with fake data"

    # запуск генерации записей
    def handle(self, *args, **kwargs):
        # self.create_users(20)
        # self.create_categories()
        self.create_events(1)
        # self.create_reviews()
        # self.create_places()
        # self.create_banners()
        # self.create_companies()
        # self.create_tickets_types()
        # self.create_tickets()

    # фейковый юзер
    def create_users(self, number):
        for _ in range(number):
            first_name = fake.first_name()
            first_name_translit = translit(first_name, "ru", reversed=True)
            unique_number = fake.unique.random_number(digits=3)
            username = f"{first_name_translit.lower()}_{unique_number}"
            vk_profile_url = f"https://www.vk.com/{username}"
            avatar_image = create_fake_image()

            user = User.objects.create(
                username=username,
                first_name=first_name,
                last_name=fake.last_name(),
                email=f"{username}@mail.ru",
            )
            user.set_password("123456")
            user.save()

            UserProfile.objects.create(
                user=user,
                avatar=avatar_image,
                description=fake.text(max_nb_chars=60),
                vk_profile=vk_profile_url,
            )

    def create_categories(self):
        categories = [
            "Кино",
            "Мастер-классы",
            "Спорт",
            "Театр",
            "Цирк",
            "Пушкинская карта",
            "Выставка",
            "Концерт",
        ]
        for category in categories:
            slug = translit(category.lower(), "ru", reversed=True)
            Category.objects.create(
                name=category,
                slug=slugify(slug),
            )

    def create_events(self):
        pass

    def create_reviews(self):
        pass

    def create_places(self):
        pass

    def create_banners(self):
        pass

    def create_companies(self):
        pass

    def create_tickets_types(self):
        pass

    def create_tickets(self):
        pass

from datetime import datetime, timedelta
from django.core.management.base import BaseCommand
from faker import Faker
from django.contrib.auth.models import User
from app.models import (
    UserProfile,
    Category,
    Event,
    Review,
    Banner,
    Company,
    Place,
    Ticket,
    TicketType,
)
from transliterate import translit
from django.core.files import File
import random
from PIL import Image
from io import BytesIO
from django.utils.text import slugify
from photologue.models import Photo, Gallery

fake = Faker("ru_RU")

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

reviews = [
    "Очень разочарована мероприятием. Организация была на низком уровне: началось с опозданием, звук был ужасный, а ведущий явно не готов. Больше не приду.",
    "В целом неплохо, но было ощущение, что чего-то не хватает. Программа затянутая, но локация понравилась. Если немного доработать — будет классно.",
    "Прекрасное событие! Всё было организовано на высшем уровне — отличная атмосфера, музыка, и интересные активности. Обязательно приду снова!",
]

profile_desc = [
    "Обожаю ходить на концерты и открывать для себя новые места в городе! 🎤🎶",
    "Люблю путешествовать по городским мероприятиям и всегда в поиске крутых тусовок! 🌍🍸",
    "Тусовщица с большим сердцем! Мечтаю посетить все выставки и мастер-классы города. 💫🎨",
]

ticket_types_desc = [
    "Выходной день, 10:00-19:00",
    "Будний день, 10:00-19:00",
    "4 февраля 16:00",
]


def create_fake_image():
    img = Image.new(
        "RGB",
        (100, 100),
        color=(random.randint(0, 255), random.randint(0, 255), random.randint(0, 255)),
    )
    img_io = BytesIO()
    img.save(img_io, "JPEG")
    img_io.seek(0)
    return File(img_io, name=f"image_{random.randint(1000, 9999)}.jpg")


class Command(BaseCommand):
    help = "Populates the database with fake data"

    def handle(self, *args, **kwargs):
        self.create_users(1)
        # self.create_categories()
        # self.create_events(1)
        # self.create_reviews(1)
        # self.create_places(1)
        # self.create_banners(1)
        # self.create_companies(1)
        # self.create_tickets_types(1)
        # self.create_tickets(1)

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
                description=random.choice(profile_desc),
                vk_profile=vk_profile_url,
            )

    def create_categories(self):
        for category in categories:
            slug = translit(category.lower(), "ru", reversed=True)
            Category.objects.create(
                name=category,
                slug=slugify(slug),
            )

    def create_fake_photo(self):
        return Photo.objects.create(
            title=fake.sentence(nb_words=3),
            slug=fake.slug(),
            caption=fake.text(max_nb_chars=100),
            is_public=True,
        )

    def create_fake_gallery(self):
        gallery = Gallery.objects.create(
            title=fake.sentence(nb_words=3),
            slug=fake.slug(),
            description=fake.text(max_nb_chars=200),
            is_public=True,
        )
        photos = [self.create_fake_photo() for _ in range(random.randint(1, 5))]
        gallery.photos.set(photos)
        return gallery

    def create_events(self, number):
        all_categories = list(Category.objects.all())

        for _ in range(number):
            cover_photo = Photo.objects.order_by("?").first()
            gallery = Gallery.objects.order_by("?").first()
            selected_categories = random.sample(all_categories, k=random.randint(1, 3))

            event = Event.objects.create(
                title=fake.sentence(nb_words=6),
                cover_image=cover_photo,
                gallery=gallery,
                description=fake.text(max_nb_chars=1000),
                address=fake.address(),
            )
            event.categories.set(selected_categories)

    def create_reviews(self, number):
        users = list(UserProfile.objects.all())
        events = list(Event.objects.filter(is_published=True))

        for _ in range(number):
            rating = random.randint(1, 5)
            if rating <= 2:
                description = reviews[0]
            elif rating <= 4:
                description = reviews[1]
            else:
                description = reviews[2]

            Review.objects.create(
                author=random.choice(users),
                description=description,
                rating=rating,
                event=random.choice(events),
            )

    def create_places(self, number):
        for _ in range(number):
            photo = create_fake_image()
            Place.objects.create(
                name=fake.company(),
                photo=photo,
                description=fake.text(max_nb_chars=1000),
                address=fake.address(),
            )

    def create_banners(self, number):
        companies = Company.objects.all()
        events = Event.objects.all()

        for _ in range(number):
            company = companies[fake.random_int(0, len(companies) - 1)]
            event = (
                events[fake.random_int(0, len(events) - 1)] if events.exists() else None
            )
            pub_date = fake.date_this_year()
            end_date = pub_date + timedelta(days=fake.random_int(1, 30))

            banner = Banner.objects.create(
                title=event.title if event else fake.sentence(max_nb_chars=20),
                description=fake.text(max_nb_chars=50),
                image=fake.image_url(),
                pub_date=pub_date,
                end_date=end_date,
                company=company,
                event=event,
                is_visible=fake.boolean(),
            )
            self.stdout.write(
                self.style.SUCCESS(
                    f'Banner "{banner.title}" created for company {company.name}.'
                )
            )

    def create_companies(self, number):
        for _ in range(number):
            company = Company.objects.create(
                name=fake.company(),
                email=fake.email(),
                tin=fake.random_int(min=1000000000, max=9999999999),
            )
            self.stdout.write(self.style.SUCCESS(f"Company {company.name} created."))

    def create_tickets_types(self, number):
        events = Event.objects.all()

        for _ in range(number):
            event = events[fake.random_int(0, len(events) - 1)]
            future_date = datetime.now() + timedelta(days=random.randint(1, 90))
            available_quantity = fake.random_int(1, 400)

            ticket_type = TicketType.objects.create(
                event=event,
                description=random.choice(ticket_types_desc),
                price=fake.random_int(100, 5000, 100),
                available_quantity=available_quantity,
                total_quantity=fake.random_int(available_quantity, 400),
            )

        self.stdout.write(
            self.style.SUCCESS(
                f'Ticket Type "{ticket_type}" created for event "{event.title}".'
            )
        )

    def create_tickets(self, number):
        ticket_types = list(TicketType.objects.all())
        users = list(UserProfile.objects.all())
        statuses = [status[0] for status in Ticket.PaymentStatus.choices]

        for _ in range(number):
            ticket = Ticket.objects.create(
                ticket_type=random.choice(ticket_types),
                owner=random.choice(users),
                payment_status=random.choice(statuses),
            )
            self.stdout.write(
                self.style.SUCCESS(
                    f'Создан билет на событие "{ticket.ticket_type.event.title}", '
                    f'владелец: {ticket.owner or "—"}, статус: {ticket.payment_status}'
                )
            )

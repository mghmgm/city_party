from urllib.request import urlopen
from django.core.files.base import ContentFile
from .models import UserProfile

def save_user_profile(backend, user, response, *args, **kwargs):
    """Сохранение данных профиля из Yandex"""
    if backend.name != 'yandex-oauth2':
        return
    
    profile, created = UserProfile.objects.get_or_create(user=user)
    
    profile.yandex_id = response.get('id')
    
    if response.get('default_avatar_id'):
        avatar_url = f"https://avatars.yandex.net/get-yapic/{response['default_avatar_id']}/islands-200"
        try:
            avatar_data = urlopen(avatar_url).read()
            profile.avatar.save(
                f'yandex_avatar_{user.username}.jpg', 
                ContentFile(avatar_data),
                save=True
            )
        except Exception as e:
            print(f"Error loading avatar: {e}")

    if response.get('real_name'):
        name_parts = response['real_name'].split()
        if name_parts:
            user.first_name = name_parts[0]
            if len(name_parts) > 1:
                user.last_name = ' '.join(name_parts[1:])
            user.save()
    
    profile.save()
from django.urls import path
from .views import register, login, profile, check_email, reset_password, admin_users, admin_delete_user

urlpatterns = [
    path("register/", register),
    path("login/", login),
    path("profile/", profile),
    path("check-email/", check_email),
    path("reset-password/", reset_password),
    path("admin/users/", admin_users),
    path("admin/users/<int:pk>/delete/", admin_delete_user),
]

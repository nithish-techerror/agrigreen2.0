from django.urls import path
from .views import products_api, product_detail, my_products, delete_product, admin_products, admin_edit_product, admin_delete_product

urlpatterns = [
    path("", products_api),              # IT IS CALLING GET all products AND POST add product
    path("my/", my_products),            #  IT IS CALLING GET my products
    path("<int:pk>/", delete_product),   #  IT'S CALLING GET single / DELETE product
    path("detail/<int:pk>/", product_detail),  #  IT IS CALLING  product detail
    path("admin/", admin_products),
    path("admin/<int:pk>/edit/", admin_edit_product),
    path("admin/<int:pk>/delete/", admin_delete_product),
]
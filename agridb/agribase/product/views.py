
from urllib import request

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from .models import Product
from .serializers import ProductSerializer

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def products_api(request):
    if request.method == "GET":
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

    if request.method == "POST":
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_products(request):
    products = Product.objects.filter(user=request.user).order_by("-id")   
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(["GET", "DELETE"])
@permission_classes([IsAuthenticated])
def delete_product(request, pk):
    try:
        product = Product.objects.get(id=pk)
    except Product.DoesNotExist:
        return Response({"error": "Not found"}, status=404)

    # GET single product
    if request.method == "GET":
        serializer = ProductSerializer(product)
        return Response(serializer.data)

    # DELETE product
    if request.method == "DELETE":
        if product.user != request.user:
            return Response({"error": "Not allowed"}, status=403)

        product.delete()
        return Response({"message": "Deleted"}, status=204)
@api_view(["GET"])
def product_detail(request, pk):
    product = Product.objects.get(id=pk)
    serializer = ProductSerializer(product)
    return Response(serializer.data)


# ── ADMIN: LIST ALL PRODUCTS ──
@api_view(["GET"])
@permission_classes([IsAdminUser])
def admin_products(request):
    products = Product.objects.all().order_by("-created")
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


# ── ADMIN: EDIT PRODUCT ──
@api_view(["PATCH"])
@permission_classes([IsAdminUser])
def admin_edit_product(request, pk):
    try:
        product = Product.objects.get(id=pk)
    except Product.DoesNotExist:
        return Response({"error": "Not found"}, status=404)

    data = request.data
    if 'title' in data:
        product.title = data['title']
    if 'price' in data:
        product.price = data['price']
    if 'category' in data:
        product.category = data['category']
    product.save()

    serializer = ProductSerializer(product)
    return Response(serializer.data)


# ── ADMIN: DELETE ANY PRODUCT ──
@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def admin_delete_product(request, pk):
    try:
        product = Product.objects.get(id=pk)
    except Product.DoesNotExist:
        return Response({"error": "Not found"}, status=404)

    product.delete()
    return Response({"message": "Deleted"}, status=204)

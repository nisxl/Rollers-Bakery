from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from base.api.utils.email_utils import send_order_confirmation_email
from base.items import products
from base.models import Product, Review, Category
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from base.api.serializers import ProductSerializer, CategorySerializer
from base.recommendation import recommendation

from django.db import connection
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from django.http import HttpResponse
from sklearn.preprocessing import MinMaxScaler, StandardScaler

# from base.recommendation import recommendation

@api_view(['GET'])
def getProducts(request):
    query = request.query_params.get('keyword')
    print('query:', query)
    if query == None:
        query = ''
    products = Product.objects.filter(
        name__icontains=query)  # i means case insernsitive

    # page = request.query_params.get('page')

    # # query set we want to paginate, no. of products
    # paginator = Paginator(products, 5)

    # try:
    #     products = paginator.page(page)

    # except PageNotAnInteger:
    #     products = paginator.page(1)

    # except EmptyPage:
    #     products = paginator.page(paginator.num_pages)

    # if page == None:
    #     page = 1

    # page = int(page)

    serializer = ProductSerializer(products, many=True)
    return Response({'products': serializer.data})
    # return Response({'products': serializer.data, 'page': page, 'pages': paginator.num_pages})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getRecommendation(request):
    user_id = request.user.id  # Get the user ID from the JWT token
    recommended_product_ids = recommendation(user_id)  # Pass the user ID to the recommendation method
    recommended_products = Product.objects.filter(_id__in=recommended_product_ids)
    serializer = ProductSerializer(recommended_products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getTopProducts(request):
    products = Product.objects.filter(
        rating__gt=4).order_by('-rating')[0:5]
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getProduct(request, pk):
    product = Product.objects.get(_id=pk)
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)






@api_view(['GET'])
def getCategories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProduct(request, pk):
    data = request.data
    try:
        product = Product.objects.get(_id=pk)
    except Product.DoesNotExist:
        return Response({'message': 'Product does not exist'}, status=status.HTTP_404_NOT_FOUND)

    category_id = data.get('category')
    category = Category.objects.get(id=category_id) if category_id else product.category

    product.name = data.get('name', product.name)
    product.price = data.get('price', product.price)
    product.brand = data.get('brand', product.brand)
    product.countInStock = data.get('countInStock', product.countInStock)
    product.category = category
    product.description = data.get('description', product.description)
    product.is_cake = data.get('is_cake', product.is_cake)
    product.one_day_cake = data.get('one_day_cake', product.one_day_cake)
    product.min_weight = data.get('min_weight', product.min_weight)
    product.max_weight = data.get('max_weight', product.max_weight)

    product.save()
    
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)




@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProduct(request):
    data = request.data
    category_id = data.get('category')
    category = Category.objects.get(id=category_id) if category_id else None

    product = Product.objects.create(
        name=data.get('name'),
        price=data.get('price'),
        brand=data.get('brand'),
        countInStock=data.get('countInStock'),
        category=category,
        description=data.get('description'),
        is_cake=data.get('is_cake'),
        one_day_cake=data.get('one_day_cake'),
        min_weight=data.get('min_weight'),
        max_weight=data.get('max_weight')
    )


    serializer = ProductSerializer(product)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def createCategory(request):
    data = request.data
    category = Category.objects.create(
        name=data.get('name'),
        image=request.FILES.get('image') 
    )
    serializer = CategorySerializer(category)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProduct(request, pk):
    product = Product.objects.get(_id=pk)
    product.delete()
    return Response("Product was deleted")


@api_view(['POST'])
def uploadImage(request):
    data = request.data
    product_id = data['product_id']
    product = Product.objects.get(_id=product_id)

    product.image = request.FILES.get('image')
    product.save()
    return Response("Image was uploaded ^^")


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createProductReview(request, pk):
    user = request.user
    product = Product.objects.get(_id=pk)
    data = request.data

    # Scnearios
    # 1 Review already exists
    alreadyExists = product.review_set.filter(user=user).exists()

    if alreadyExists:
        content = {'detail': 'Product already reviewed'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    # 2 No Rating or 0
    elif data['rating'] == 0:
        content = {'detail': 'Please select a rating'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    # 3 Create Review
    else:
        review = Review.objects.create(
            user=user,
            product=product,
            name=user.first_name,
            rating=data['rating'],
            comment=data['comment'],

        )
        reviews = product.review_set.all()
        product.numReviews = len(reviews)

        total = 0
        for i in reviews:
            total += i.rating

            product.rating = total / len(reviews)
        product.save()

        return Response('Review Added')

# def getRecommendation(request):
#     recommended_products = recommendation()
# from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from base.models import Product, Order, OrderItem, ShippingAddress, Review, Category
from base.models import *
from django.contrib.auth.models import User
from django.urls import path
# User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    _id = serializers.SerializerMethodField(read_only=True)
    isAdmin = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', '_id', 'username', 'email', 'name', 'isAdmin']

    def get__id(self, obj):
        return obj.id

    def get_isAdmin(self, obj):
        return obj.is_staff

    def get_name(self, obj):
        name = obj.first_name
        if name == '':
            name = obj.email

        return name

class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', '_id', 'username', 'email', 'name', 'isAdmin', 'token']

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)  # make the token type to access token


class ReviewSerializer(serializers.ModelSerializer):

    class Meta:
        model = Review
        fields = '__all__'


# class ProductSerializer(serializers.ModelSerializer):
#     reviews = serializers.SerializerMethodField(read_only=True)

#     class Meta:
#         model = Product
#         fields = '__all__'

#     def get_reviews(self, obj):
#         reviews = obj.review_set.all()
#         if isinstance(reviews, tuple):
#             return []
#         serializer = ReviewSerializer(reviews, many=True)
#         return serializer.data

# class ProductSerializer(serializers.ModelSerializer):
#     reviews = serializers.SerializerMethodField(read_only=True)

#     class Meta:
#         model = Product
#         fields = '__all__'

#     def get_reviews(self, obj):
#         reviews = obj.review_set.all()
#         serializer = ReviewSerializer(reviews, many=True)
#         return serializer.data

# class ProductSerializer(serializers.ModelSerializer):
#     reviews = serializers.SerializerMethodField(read_only=True)

#     class Meta:
#         model = Product
#         fields = '__all__'

#     def get_reviews(self, obj):
#         reviews = obj.review_set.all()
#         if isinstance(reviews, tuple) or not reviews:  # Check if reviews is a tuple or empty
#             return []
#         serializer = ReviewSerializer(reviews, many=True)
#         return serializer.data

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    reviews = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Product
        fields = '__all__'

    def get_reviews(self, obj):
        reviews = obj.review_set.all()
        if isinstance(reviews, tuple) or not reviews:
            return []
        serializer = ReviewSerializer(reviews, many=True)
        return serializer.data


class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = '__all__'


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    orderItems = serializers.SerializerMethodField(read_only=True)
    ShippingAddress = serializers.SerializerMethodField(read_only=True)
    user = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Order
        fields = '__all__'

    def get_orderItems(self, obj):
        items = obj.orderitem_set.all()
        serializer = OrderItemSerializer(items, many=True)
        return serializer.data

    def get_ShippingAddress(self, obj):
        try:
            address = ShippingAddressSerializer(
                obj.shippingaddress, many=False).data
        except:
            address = False
        return address

    def get_user(self, obj):
        user = obj.user
        serializer = UserSerializer(user, many=False)
        return serializer.data

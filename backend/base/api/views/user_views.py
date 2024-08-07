from rest_framework import status
from django.contrib.auth.hashers import make_password
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from django.shortcuts import redirect
from base.api.serializers import  UserSerializer, UserSerializerWithToken
from rest_framework import generics
from django.urls import path

from django.core.mail import send_mail
from django.urls import reverse
from django.contrib.sites.shortcuts import get_current_site
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import default_token_generator
from django.http import HttpResponse,HttpResponseBadRequest

from django.views.decorators.csrf import csrf_exempt
 
from rest_framework.permissions import AllowAny

import uuid

# to return user data from the token
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        serializer = UserSerializerWithToken(self.user).data
        for k, v in serializer.items():
            data[k] = v
        return data

    # @classmethod
    # def get_token(cls, user):
    #     token = super().get_token(user)

    #     # Add custom claims
    #     token['username'] = user.username
    #     # ...

    #     return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


# @api_view(['GET'])
# def getRoutes(request):

#     routes = [
#         '/api/token',
#         '/api/token/refresh',

#     ]
#     return Response(routes)

@api_view(['POST'])
def registerUser(request):
    data = request.data

    user, created = User.objects.get_or_create(
        username=data['email'],
        email=data['email'],
        defaults={
            'first_name': data['name'],
            'password': make_password(data['password']),
        }
    )

    if not created:
        message = {'detail': 'User with this email already exists.'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

    user.is_active = False  # Set the user's is_active field to False
    user.save()

    # Send the confirmation email
    send_confirmation_email(request, user)

    serializer = UserSerializerWithToken(user, many=False)
    return Response(serializer.data)


def send_confirmation_email(request, user):
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    current_site = get_current_site(request)
    domain = current_site.domain
    path = reverse('activate_account', kwargs={'uidb64': uid, 'token': token})
    activation_link = f'http://{domain}{path}'

    subject = 'Account Activation'
    message = f'Hi {user.first_name},\n\nPlease click the link below to activate your account:\n\n{activation_link}'
    from_email = 'nis.maharaj@gmail.com' 
    recipient_list = [user.email]

    send_mail(subject, message, from_email, recipient_list, fail_silently=False)

def activate_account(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user is not None and default_token_generator.check_token(user, token):
        user.is_active = True
        user.save()
        return redirect('http://localhost:3000/#/login')
    else:
        return HttpResponse('Activation link is invalid.')


@api_view(['POST'])
@csrf_exempt
@authentication_classes([])
@permission_classes([AllowAny])
def password_reset(request):
    data = request.data
    email = data.get('email')

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'detail': 'User with this email does not exist.'}, status=status.HTTP_404_NOT_FOUND)

    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    current_site = get_current_site(request)
    domain = current_site.domain
    path = reverse('password_reset_confirm', kwargs={'uidb64': uid, 'token': token})
    reset_link = f'http://{domain}{path}'
    
    # reset_link = f'http://localhost:3000/password-reset-confirm?uidb64=%7Buid%7D&token=%7Btoken%7D'

    subject = 'Password Reset Request'
    message = f'Hi {user.first_name},\n\nPlease click the link below to reset your password:\n\n{reset_link}'
    from_email = 'nis.maharaj@gmail.com'
    recipient_list = [user.email]

    send_mail(subject, message, from_email, recipient_list, fail_silently=False)

    return Response({'detail': 'Password reset email sent.'})

@api_view(['GET','POST'])
@csrf_exempt
@authentication_classes([])
@permission_classes([AllowAny])
def password_reset_confirm(request, uidb64=None, token=None):
    if request.method == 'POST':
        password = request.data.get('password')

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return HttpResponseBadRequest()

        if default_token_generator.check_token(user, token):
            user.set_password(password)
            user.save()
            return Response({'detail': 'Password has been reset.'}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Invalid token.'}, status=status.HTTP_400_BAD_REQUEST)

    # GET request
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user is not None and default_token_generator.check_token(user, token):
        # Display a form for resetting the password
        return redirect('http://localhost:3000/password-reset-confirm/' + uidb64 + '/' + token + '/')
    else:
        return Response({'detail': 'Invalid token.'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUsersProfile(request):
    user = request.user
    serializer = UserSerializerWithToken(user, many=False)

    data = request.data

    user.first_name = data['name']
    user.username = data['email']
    user.email = data['email']

    if data['password'] != '':
        user.password = make_password(data['password'])

    user.save()

    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUsersProfile(request):
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUserById(request, pk):
    user = User.objects.get(id=pk)
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUser(request, pk):
    user = User.objects.get(id=pk)

    data = request.data

    user.first_name = data['name']
    user.username = data['email']
    user.email = data['email']
    user.is_staff = data['isAdmin']

    user.save()
    serializer = UserSerializer(user, many=False)

    return Response(serializer.data)


@api_view(['DELETE'])
def deleteUser(request, pk):
    userForDeletion = User.objects.get(id=pk)
    userForDeletion.delete()
    return Response("user was deleted")

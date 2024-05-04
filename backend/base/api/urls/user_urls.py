from base.api.views import user_views as views
from base.api.views.user_views import MyTokenObtainPairView

from django.urls import path, include
from django.utils.http import urlsafe_base64_decode


urlpatterns = [

    path('users/login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),

    # path('users/login/', views.MyTokenObtainPairView.as_view(),
    #      name="token-obtain-pair"), 
    path('users/register/', views.registerUser, name='register'),
    path('users/activate/<str:uidb64>/<str:token>/', views.activate_account, name='activate_account'),
    
    path('users/password-reset/', views.password_reset, name='password_reset'),
    path('users/password-reset-confirm/<str:uidb64>/<str:token>/', views.password_reset_confirm, name='password_reset_confirm'),

    path('users/profile/', views.getUsersProfile, name="users-profile"),
    path('users/profile/update/', views.updateUsersProfile,
         name="users-profile-update"),
    path('users/', views.getUsers, name="users"),

    # path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('users/<str:pk>/', views.getUserById, name='user'),

    path('users/update/<str:pk>/', views.updateUser, name='user-update'),
    path('users/delete/<str:pk>/', views.deleteUser, name='user-delete'),

]

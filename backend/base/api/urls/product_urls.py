from django.urls import path
from base.api.views import product_views as views


urlpatterns = [
    path('', views.getProducts, name='products'),
    path('create/', views.createProduct, name='product-create'),
    path('upload/', views.uploadImage, name='image-upload'),
    
    
    path('recommendation/', views.getRecommendation, name='recommendation'),

    path('<int:pk>/reviews/', views.createProductReview, name='create-review'),
    path('top/', views.getTopProducts, name='top-products'),

    path('<int:pk>/', views.getProduct, name='product'),

    path('update/<int:pk>/', views.updateProduct, name='product-update'),
    path('delete/<int:pk>/', views.deleteProduct, name='product-delete'),

]

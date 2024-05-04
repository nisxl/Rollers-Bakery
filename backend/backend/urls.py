from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include

from django.views.generic import TemplateView



urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/', include('base.api.urls.user_urls')),
    path('api/orders/', include('base.api.urls.order_urls')),
    path('api/products/', include('base.api.urls.product_urls')),


]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

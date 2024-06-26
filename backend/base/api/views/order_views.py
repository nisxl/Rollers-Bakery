from rest_framework import status
from django.contrib.auth.hashers import make_password
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.conf import settings
from base.models import Product, Order, OrderItem, ShippingAddress
from base.api.serializers import OrderSerializer
from datetime import datetime
import requests

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user
    data = request.data
    orderItems = data['orderItems']  # list sent from the frontend

    if orderItems and len(orderItems) == 0:
        return Response({'detail': 'No Order Items'}, status=status.HTTP_400_BAD_REQUEST)

    else:
        # 1. create order
        order = Order.objects.create(
            user=user,
            paymentMethod=data['paymentMethod'],
            taxPrice=data['taxPrice'],
            shippingPrice=data['shippingPrice'],
            totalPrice=data['totalPrice']
        )
        # 2. create shipping address

        shipping = ShippingAddress.objects.create(
            order=order,
            address=data['shippingAddress']['address'],
            city=data['shippingAddress']['city'],
            postalCode=data['shippingAddress']['postalCode'],
            country=data['shippingAddress']['country']
        )
        # 3. create order items and set the order to orderItem relationship

        for i in orderItems:
            product = Product.objects.get(_id=i['product'])

            item = OrderItem.objects.create(
                product=product,
                order=order,
                name=product.name,
                qty=i['qty'],
                price=i['price'],
                image=product.image.url,
            )

            # 4. update stock

            product.countInStock -= item.qty
            product.save()
        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    user = request.user
    orders = user.order_set.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getOrders(request):
    orders = Order.objects.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById(request, pk):
    user = request.user
    try:
        order = Order.objects.get(_id=pk)

        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data)

        else:
            Response({'detail': 'Not authorized to view this order'},
                     status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response({'detail': 'Order does not exist'},   status=status.HTTP_400_BAD_REQUEST)


# @api_view(['PUT'])
# @permission_classes([IsAuthenticated])
# def updateOrderToPaid(request, pk):
#     order = Order.objects.get(_id=pk)

#     order.isPaid = True
#     order.paidAt = datetime.now()
#     order.save()
#     return Response("Order was paid")


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateOrderToDelivered(request, pk):
    order = Order.objects.get(_id=pk)

    order.isDelivered = True
    order.deliveredAt = datetime.now()
    order.save()
    return Response("Order was delivered")


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateOrderToPaid(request, pk):
    order = Order.objects.get(_id=pk)

    if request.method == 'PUT':
        payment_method = request.data.get('paymentMethod')
        payment_result = request.data.get('paymentResult')

        if not payment_method or not payment_result:
            return Response({'error': 'Payment method and result are required'})

        if payment_method == 'Khalti':
            headers = {
                'Authorization': f"Key {settings.TEST_SECRET_KEY}"
            }
            payload = {
                'token': payment_result.get('token'),
                'amount': payment_result.get('amount'),
            }

            try:
                response = requests.post('https://khalti.com/api/v2/payment/verify/', data=payload, headers=headers)

                if response.status_code == 200:
                    response_json = response.json()

                    if response_json.get('idx'):
                        order.isPaid = True
                        order.paidAt = datetime.now()
                        order.transaction_id = response_json.get('idx')
                        order.save()
                        return Response({'message': 'Order was paid.'})
                    else:
                        return Response({'error': 'Payment verification failed'})
                else:
                    return Response({'error': 'Khalti API request failed'})
            except Exception as e:
                return Response({'error': str(e)})

        # Add other payment methods here
        else:
            return Response({'error': 'Invalid payment method'})

    return Response({'error': 'Invalid request method'})
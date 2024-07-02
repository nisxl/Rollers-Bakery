# your_app/utils/email_utils.py

from django.core.mail import send_mail
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

def send_order_confirmation_email(to_email, order_details):
    subject = 'Order Confirmation'
    email_from = settings.DEFAULT_FROM_EMAIL

    context = {
        'customer_name': order_details['customer_name'],
        'order_id': order_details['order_id'],
        # 'product_name': order_details['product_name'],
        # 'quantity': order_details['quantity'],
        # 'price': order_details['price'],
    }

    text_content = render_to_string('emails/order_confirmation.txt', context)
    html_content = render_to_string('emails/order_confirmation.html', context)

    # Create the email
    email = EmailMultiAlternatives(subject, text_content, email_from, [to_email])
    email.attach_alternative(html_content, "text/html")

    # Send the email
    email.send()

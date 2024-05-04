import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from django.contrib.auth.models import User
from .models import Product, Review

# def recommend_products():
#     # Step 4: Recommend products
#     # recommended_products = ["Ford", "Volvo", "BMW"]
#     recommended_products = []
#     for j in range(len(products)):
#         if ratings[user_index, j] == 0:
#             product_ratings = ratings[similar_users, j]
#             if product_ratings.any():
#                 score = np.dot(similarities[user_index, similar_users], product_ratings) / np.sum(similarities[user_index, similar_users])
#                 recommended_products.append((products[j], score))

#     recommended_products.sort(key=lambda x: x[1], reverse=True)
#     return recommended_products

def recommend_products(user_id):
    # Step 1: Create a user-item matrix
    users = User.objects.all()
    products = Product.objects.all()
    ratings = np.zeros((len(users), len(products)))
    for i, user in enumerate(users):
        user_ratings = Review.objects.filter(user=user).values_list('product_id', 'rating')
        for product_id, rating in user_ratings:
            
            j = list(products).index(Product.objects.get(_id=product_id))

            # j = products.index(Product.objects.get(_id=product_id))
            ratings[i, j] = rating

    # Step 2: Calculate similarity
    similarities = cosine_similarity(ratings)

    # Step 3: Find similar users
    # user_index = users.index(User.objects.get(id=user_id))
    user_index = list(users).index(User.objects.get(id=user_id))
    
    similar_users = np.argsort(similarities[user_index])[::-1][:10]

    # Step 4: Recommend products
    recommended_products = []
    for j in range(len(products)):
        if ratings[user_index, j] == 0:
            product_ratings = ratings[similar_users, j]
            if product_ratings.any():
                score = np.dot(similarities[user_index, similar_users], product_ratings) / np.sum(similarities[user_index, similar_users])
                recommended_products.append((products[j], score))

    recommended_products.sort(key=lambda x: x[1], reverse=True)
    return recommended_products

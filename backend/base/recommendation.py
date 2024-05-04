from django.db import connection
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from django.http import HttpResponse
from sklearn.preprocessing import MinMaxScaler, StandardScaler


def recommendation(user_id):

    # Step 1: Gather data from the database
    with connection.cursor() as cursor:
        cursor.execute('SELECT * FROM base_review') 
        ratings = cursor.fetchall()

        cursor.execute('SELECT * FROM base_product')  
        products = cursor.fetchall()

    # Step 2: Create pandas DataFrames
    ratings = pd.DataFrame(ratings, columns=['name', 'rating', 'comment', 'createdAt','_id',  'product_id', 'user_id'])
    products = pd.DataFrame(products, columns=['name','image','baked_goods_type','flavor','brand','category','description','rating','numReviews','price',
                                           'countInStock','createdAt','_id','is_cake','min_weight','max_weight','user_id',])  # Replace column names with your actual column names


    # print('The ratings dataset has', ratings['user_id'].nunique(), 'unique users')
    # Merge data

     # Step 3: Merge the tables on the common key
    dataframe = pd.merge(ratings, products,  left_on='product_id', right_on='_id', how='inner')

    print("Dataframe columns:", dataframe.columns)

    print("dataframe:: ", dataframe.head())

    # Create user-item matrix
    # matrix = dataframe.pivot_table(index='userId', columns='name_x', values='rating')
    matrix = dataframe.pivot_table(index='user_id_x', columns='product_id', values='rating_x')
    print("matrix", matrix.columns)

    print("matrix unnormalized:: ", matrix.head())

    matrix_norm = matrix.subtract(matrix.mean(axis=1), axis='rows')

    print("matrix normalized:: ", matrix_norm.head() )

    # Similarity using Pearson correlation

    user_similarity = matrix_norm.T.corr()
    # user_similarity1 = matrix.T.corr()

    # Choose a user ID
    picked_userid = user_id
    # Remove picked user ID from the candidate list
    user_similarity.drop(index=picked_userid, inplace=True)
    print("similar users:", user_similarity.head())

    # Number of similar users
    n = 3
    # User similarity threshold
    user_similarity_threshold = 0.1
    # Get top n similar users
    similar_users = user_similarity[user_similarity[picked_userid] > user_similarity_threshold][picked_userid].sort_values(
    ascending=False)[:n]

    # Check if there are any similar users
    if similar_users.empty:
        return []  # Return an empty list if no similar users are found


    picked_userid_watched = matrix[matrix.index == picked_userid].dropna(axis=1, how='all')
    similar_user_products = matrix[matrix.index.isin(similar_users.index)].dropna(axis=1, how='all')

    similar_user_products.drop(picked_userid_watched.columns, axis=1, inplace=True, errors='ignore')

    # Dictionary to store item score
    item_score = {}
    for i in similar_user_products.columns:
        movie_rating = similar_user_products[i]
        total = 0
        weight = 0
        for u in similar_users.index:
            if pd.notna(movie_rating[u]):
                score = similar_users[u] * movie_rating[u]
                total += score
                weight += abs(similar_users[u])

        # Average score
        if weight != 0:
            item_score[i] = total / weight

    # Convert dictionary to pandas dataframe
    item_score = pd.DataFrame(item_score.items(), columns=['name', 'movie_score'])
    # Sorting by score
    ranked_item_score = item_score.sort_values(by='movie_score', ascending=False)
    # Filtering top m products
    m = 4
    top_products = ranked_item_score.head(m)['name'].values
    print("top products:", top_products)

    recommended_products = []

    for product_id in top_products:
        recommended_products.append(product_id)

    # Return the list of recommended products
    return recommended_products
    # output = f'The similar users for user {picked_userid} are: {", ".join(map(str, similar_users.index))}\n'
    # output += f'Top {m} recommended products:\n'
    # for movie in top_products:
    #     output += f'- {movie}\n'

    # return output



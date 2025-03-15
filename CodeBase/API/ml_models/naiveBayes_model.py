import os
import sys

import re
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB


# Function to load and train the Naive Bayes model
def load_naive_bayes_model():
    # Load dataset
    base_path = getattr(sys, "_MEIPASS", os.path.abspath("."))
    file_path = os.path.join(
        base_path, "ml_models", "DataSets", "Naive_Bayes_Queries_Dataset_NEW.xlsx"
    )
    naive_bayes_df = pd.read_excel(file_path)
    # naive_bayes_df = pd.read_excel('./ml_models/DataSets/Naive_Bayes_Queries_Dataset.xlsx')

    # Prepare the data for training
    X = naive_bayes_df["Query"]  # Input: the queries
    y = naive_bayes_df[
        "Category"
    ]  # Target: the labels (Generic Case Search, Trademark Ordinance Search, Section Number Search)

    # Split the dataset into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.1, random_state=42
    )

    # Convert the text data into numeric features using CountVectorizer
    nb_vectorizer = CountVectorizer()
    X_train_vectors = nb_vectorizer.fit_transform(X_train)
    X_test_vectors = nb_vectorizer.transform(X_test)

    # Initialize and train the Naive Bayes classifier
    nb_classifier = MultinomialNB()
    nb_classifier.fit(X_train_vectors, y_train)
    print("Naive Bayes Loaded")
    # Return the trained model and vectorizer
    return nb_classifier, nb_vectorizer


# Function to extract any integer from the query using regex
def extract_integer(query):
    # Regular expression to capture any integer (e.g., "23", "45", etc.)
    match = re.search(r"\b\d+\b", query)
    if match:
        print(f"Extracted Number: {match.group(0)}")
        return match.group(0)  # Return the captured integer
    return None  # Return None if no integer is found


# Function to handle the repetitive query processing
def run_query(query, nb_classifier, nb_vectorizer):
    # Predict the category of the query using Naive Bayes
    query_vector = nb_vectorizer.transform([query])
    prediction = nb_classifier.predict(query_vector)[0]
    print(f"Naive Bayes Prediction: {prediction}")
    return prediction


# nb_classifier, vectorizer = load_naive_bayes_model('/content/Naive_Bayes_Balanced_Queries_Dataset.csv')

# Use the `run_query` function to process a query
# query_result = run_query("Your query here", nb_classifier, vectorizer, model, generic_df, required_columns, trademark_df, embedder, title_embeddings, desc_embeddings)

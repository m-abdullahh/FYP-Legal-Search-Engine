import os
import sys
import random
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.preprocessing import LabelEncoder
from xgboost import XGBClassifier


def load_judgement_classification_model():

    base_path = getattr(sys, "_MEIPASS", os.path.abspath("."))
    file_path = os.path.join(
        base_path, "ml_models", "DataSets", "judgement_dataset.xlsx"
    )
    df = pd.read_excel(file_path)

    df = df.drop_duplicates()
    df["Facts"] = df["Facts"].fillna("")

    def add_typo(word):
        if len(word) > 3:
            i = random.randint(1, len(word) - 2)
            word = (
                word[:i] + random.choice("abcdefghijklmnopqrstuvwxyz") + word[i + 1 :]
            )
        return word

    def shuffle_words(text):
        words = text.split()
        if len(words) > 1:
            random.shuffle(words)
        return " ".join(words)

    def drop_words(text, drop_prob=0.1):
        words = text.split()
        new_words = [word for word in words if random.random() > drop_prob]
        return " ".join(new_words)

    def add_noise(text):
        text = shuffle_words(text)
        text = " ".join([add_typo(word) for word in text.split()])
        text = drop_words(text)
        return text

    df["Facts_noise"] = df["Facts"].apply(add_noise)

    def map_to_broad_category(result):
        result_lower = result.lower()
        if "allowed" in result_lower:
            return "allowed"
        elif "dismissed" in result_lower:
            return "dismissed"
        else:
            return "others"

    df["output_category"] = df["Judgment Results"].apply(map_to_broad_category)
    label_encoder = LabelEncoder()
    df["output_category_encoded"] = label_encoder.fit_transform(df["output_category"])

    X = df["Facts_noise"]
    y = df["output_category_encoded"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, stratify=y, random_state=42
    )

    vectorizer = TfidfVectorizer(stop_words="english", max_features=5000)
    X_train_tfidf = vectorizer.fit_transform(X_train)

    classifierSVM = SVC(kernel="linear", random_state=42)
    classifierSVM.fit(X_train_tfidf, y_train)

    classifierRF = RandomForestClassifier(n_estimators=100, random_state=42)
    classifierRF.fit(X_train_tfidf, y_train)

    classifierXG = XGBClassifier(random_state=42)
    classifierXG.fit(X_train_tfidf, y_train)

    return classifierSVM, classifierRF, classifierXG, vectorizer, label_encoder


# Function to predict class using specified classifier
def query_judgement_classification_model(
    input_text,
    classifier_name,
    classifierSVM,
    classifierRF,
    classifierXG,
    vectorizer,
    label_encoder,
):
    input_text_tfidf = vectorizer.transform([input_text])
    if classifier_name == "svm":
        classifier = classifierSVM
    elif classifier_name == "randomforest":
        classifier = classifierRF
    elif classifier_name == "xgboost":
        classifier = classifierXG
    else:
        raise ValueError(
            "Classifier not recognized. Choose from 'svm', 'randomforest', 'xgboost'."
        )

    predicted_class_encoded = classifier.predict(input_text_tfidf)
    predicted_class = label_encoder.inverse_transform(predicted_class_encoded)
    return predicted_class[0]


if __name__ == "__main__":
    classifierSVM, classifierRF, classifierXG, vectorizer, label_encoder = (
        load_judgement_classification_model()
    )
    print(
        query_judgement_classification_model(
            "The plaintiff has filed a suit for trademark infringement",
            "svm",
            classifierSVM,
            classifierRF,
            classifierXG,
            vectorizer,
            label_encoder,
        )
    )

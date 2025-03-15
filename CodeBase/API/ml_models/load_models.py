# Cases Model Variables
cases_model = None
tm_cases_df = None
cp_cases_df = None
required_columns = None

# Trademark Ordinance Model Variables
ordinance_dict = None

# Judgement Classification Model Variables
classifierSVM = None
classifierRF = None
classifierXG = None

# Naive Bayes Model Variables
vectorizer = None
label_encoder = None
nb_vectorizer = None
nb_classifier = None
gemini_model = None

from ml_models import load_judgement_classification_model

from ml_models import initialize_tm_cases_model

from ml_models import initialize_tm_ordiance_model

from ml_models import load_naive_bayes_model
from ml_models import load_gemini_model


def load_models():
    global cases_model, tm_cases_df, cp_cases_df, required_columns

    global ordinance_dict

    global classifierSVM, classifierRF, classifierXG, vectorizer, label_encoder

    global nb_vectorizer, nb_classifier

    global gemini_model

    #! Load Gemini Model
    gemini_model = load_gemini_model()
    #! Load Naive Bayes Model
    nb_classifier, nb_vectorizer = load_naive_bayes_model()
    print("Naive Bayes Model Loaded")

    #! Load Generic Search Model
    cases_model, tm_cases_df, cp_cases_df, required_columns = (
        initialize_tm_cases_model()
    )
    print("Generic Model Loaded")

    #! Load Trademark Model
    ordinance_dict = initialize_tm_ordiance_model()
    print("Trademark Model Loaded")

    #! Load Judgement Classification Model
    (
        classifierSVM,
        classifierRF,
        classifierXG,
        vectorizer,
        label_encoder,
    ) = load_judgement_classification_model()  # classifierXG, classifierRF,
    print("Judgement Classification Model Loaded")

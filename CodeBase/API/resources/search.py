from flask.views import MethodView
from flask_smorest import Blueprint

from ml_models.load_models import (
    # TRADEMARK CASES MODEL Variables
    cases_model,
    tm_cases_df,
    cp_cases_df,
    required_columns,
    # TRADEMARK Ordinance MODEL Variables
    ordinance_dict,
    # JUDGEMENT CLASSIFICATION MODEL Variables
    classifierSVM,
    classifierRF,
    classifierXG,
    vectorizer,
    label_encoder,
    # NAIVE BAYES MODEL Variables
    nb_classifier,
    nb_vectorizer,
    # GEMINI MODEL Variables
    gemini_model,
)

from ml_models import query_judgement_classification_model
from ml_models import query_tm_ordinance_model
from ml_models import query_tm_cases_model
from ml_models import run_query, extract_integer
from ml_models import process_query_with_gemini
from schemas import (
    JudgementClassificationSchema,
    GenericSearchSchema,
    TrademarkSearchSchema,
    ChatBotSchema,
)


def perform_search(
    query,
    prediction,
    cases_model,
    tm_cases_df,
    cp_cases_df,
    required_columns,
    ordinance_dict,
):
    if prediction == "Case Search":
        results = query_tm_cases_model(
            cases_model,
            tm_cases_df,
            cp_cases_df,
            required_columns,
            query,
        )
        return results

    elif prediction == "Trademark Ordinance Search":
        # Call Trademark Model query
        results = query_tm_ordinance_model(
            query,
            ordinance_dict,
            "text",
        )
        return results

    elif prediction == "Search by Section Number":
        section_no = int(extract_integer(query))
        if section_no:
            print(f"Extracted Number: {section_no}")
            query = section_no
            results = query_tm_ordinance_model(
                query,
                ordinance_dict,
                "section_no",
            )
            return results
        else:
            return "No number found in the query."

    elif prediction == "invalid query":
        return gemini_model.generate_content(
            f"Answer concisely and very short, QUERY: '{query}'",
        ).text


blp = Blueprint(
    "searches",
    __name__,
    description="Operations of Searches",
    url_prefix="/search",
)


#! Generic Search Model route
@blp.route("/genericsearch")
class GenericSearch(MethodView):
    @blp.arguments(GenericSearchSchema, location="query")
    def get(self, search_data):
        query = search_data.get("text")
        case_type = search_data.get("case_type", "trademark")
        print(query, case_type)
        if not query:
            return {"error": "No text query provided"}, 400

        results = query_tm_cases_model(
            cases_model, tm_cases_df, cp_cases_df, required_columns, query, case_type
        )
        print(type(results), len(results))
        return results


#! Trademark Search Model route
@blp.route("/trademarksearch")
class TrademarkSearch(MethodView):
    @blp.arguments(TrademarkSearchSchema, location="query")
    def get(self, search_data):
        text = search_data.get("text")
        section_no = search_data.get("section_no")
        query_type = search_data.get("query_type")
        case_type = search_data.get("case_type", "trademark")

        print(text, section_no, query_type)
        query = section_no if query_type == "section_no" else text

        results = query_tm_ordinance_model(
            query,
            ordinance_dict,
            query_type,
            case_type,
        )
        return results


#! Judgement Classification Prediction Model route
@blp.route("/judgementclassification")
class JudgementClassification(MethodView):
    @blp.arguments(JudgementClassificationSchema, location="query")
    def get(self, search_data):
        query = search_data.get("text")
        if not query:
            return {"error": "No text query provided"}, 400

        result = query_judgement_classification_model(
            query,
            "svm",
            classifierSVM,
            classifierRF,
            classifierXG,
            vectorizer,
            label_encoder,
        )
        return {"result": result}


#! Chatbot API
@blp.route("/chatbot")
class ChatBot(MethodView):
    @blp.arguments(ChatBotSchema, location="query")
    def get(self, search_data):
        query = search_data.get("text")
        if not query:
            return {"error": "No text query provided"}, 400

        prediction = run_query(query, nb_classifier, nb_vectorizer)

        gemini_query = perform_search(
            query,
            prediction,
            cases_model,
            tm_cases_df,
            cp_cases_df,
            required_columns,
            ordinance_dict,
        )
        if prediction == "invalid query":
            return {"result": gemini_query}
        result = process_query_with_gemini(gemini_query, gemini_model)
        return {"result": result}

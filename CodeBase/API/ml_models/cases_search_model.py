# import os
# import sys

# import pandas as pd
# from sentence_transformers import SentenceTransformer, util
# import pickle


# def initialize_tm_cases_model(save_embeddings=False):
#     # Load dataset

#     base_path = getattr(sys, "_MEIPASS", os.path.abspath("."))

#     # file_path = os.path.join(base_path, 'ml_models', 'DataSets', 'trademark_cases_dataset_260.xls')
#     # tm_cases_df = pd.read_csv(file_path)

#     file_path = os.path.join(
#         base_path, "ml_models", "DataSets", "trademark_cases_dataset.xlsx"
#     )
#     embedding_path = os.path.join(
#         base_path, "ml_models", "embeddings", "finetuned_trademark_cases_embeddings.pkl"
#     )
#     tm_cases_df = pd.read_excel(file_path)

#     tm_cases_required_columns = [
#         "Facts",
#         "Issues framed",
#         "Decisions/Holdings",
#         "Reasoning and Analysis",
#         "Title",
#     ]

#     missing_columns = [
#         col for col in tm_cases_required_columns if col not in tm_cases_df.columns
#     ]
#     if missing_columns:
#         print("MISSINGGG")

#     tm_cases_model = SentenceTransformer(
#         os.path.join(base_path, "ml_models", "fine_tuned_legal_bert_dynamic_loss")
#     )
#     # model = SentenceTransformer("bert-base-nli-mean-tokens")

#     if save_embeddings:
#         for col in tm_cases_required_columns:
#             tm_cases_df[col + "_embedding"] = tm_cases_df[col].apply(
#                 lambda x: tm_cases_model.encode(str(x), convert_to_tensor=True)
#             )

#         # Save the DataFrame with embeddings to a file
#         tm_cases_df.to_pickle(embedding_path)
#         print("Embeddings computed and saved.")
#     else:
#         # Load precomputed embeddings
#         tm_cases_df = pd.read_pickle(embedding_path)
#         print("Embeddings loaded.")

#     print("Trademark Model is Ready.")
#     return tm_cases_model, tm_cases_df, tm_cases_required_columns


# def query_tm_cases_model(
#     tm_cases_model, tm_cases_df, tm_cases_required_columns, query, top_k=3
# ):
#     query_embeddings = tm_cases_model.encode(query, convert_to_tensor=True)

#     selected_columns = tm_cases_required_columns

#     all_hits = []
#     for col in selected_columns:
#         hits = util.semantic_search(
#             query_embeddings, tm_cases_df[col + "_embedding"].tolist(), top_k=top_k
#         )
#         all_hits.extend(hits[0])

#     unique_hits = {hit["corpus_id"]: hit for hit in all_hits}.values()
#     sorted_hits = sorted(unique_hits, key=lambda x: x["score"], reverse=True)[:top_k]

#     tm_cases_result_list = []

#     for hit in sorted_hits:
#         hit_id = hit["corpus_id"]
#         article_data = tm_cases_df.iloc[hit_id]

#         case_data = {
#             "Title": article_data["Title"],
#             "Facts": article_data["Facts"],
#             "Issues_framed": article_data["Issues framed"],
#             "Decisions_Holdings": article_data["Decisions/Holdings"],
#             "Reasoning_and_Analysis": article_data["Reasoning and Analysis"],
#             "result": article_data["Judgment Results"],
#             # "Date": article_data["Date"],
#             "Judgement_Result": article_data["Judgment Results"],
#         }

#         tm_cases_result_list.append(case_data)
#     return tm_cases_result_list


# if __name__ == "__main__":
#     model, df, required_columns = initialize_tm_cases_model(save_embeddings=False)

#     query = "trademark for food products"
#     results = query_tm_cases_model(model, df, required_columns, query, 3)

#     titles = [result["Title"] for result in results]
#     print(len(results), "\n\n")
#     for title in titles:
#         print(title)
#         print("\n")

# ---------------------------------------------------------------------------------------------------------------------
# ---------------------------------------------------------------------------------------------------------------------
# ---------------------------------------------------------------------------------------------------------------------

import os
import sys
import pandas as pd
from sentence_transformers import SentenceTransformer, util
import pickle


def initialize_tm_cases_model(save_embeddings=False):
    # Load datasets and initialize embeddings for both trademark and copyright cases
    base_path = getattr(sys, "_MEIPASS", os.path.abspath("."))

    # Trademark case setup
    tm_file_path = os.path.join(
        base_path, "ml_models", "DataSets", "trademark_cases_dataset.xlsx"
    )
    tm_embedding_path = os.path.join(
        base_path, "ml_models", "embeddings", "finetuned_trademark_cases_embeddings.pkl"
    )
    tm_cases_df = pd.read_excel(tm_file_path)

    # Copyright case setup
    cp_file_path = os.path.join(
        base_path, "ml_models", "DataSets", "copyright_cases_dataset.xlsx"
    )
    cp_embedding_path = os.path.join(
        base_path, "ml_models", "embeddings", "finetuned_copyright_cases_embeddings.pkl"
    )
    cp_cases_df = pd.read_excel(cp_file_path)

    required_columns = [
        "Facts",
        "Issues framed",
        "Decisions/Holdings",
        "Reasoning and Analysis",
        "Title",
    ]

    # Check for missing columns
    for df, case_type in [(tm_cases_df, "trademark"), (cp_cases_df, "copyright")]:
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            raise ValueError(
                f"Missing columns in {case_type} dataset: {missing_columns}"
            )

    model = SentenceTransformer(
        os.path.join(base_path, "ml_models", "fine_tuned_legal_bert_dynamic_loss")
    )

    if save_embeddings:
        for df, embedding_path, case_type in [
            (tm_cases_df, tm_embedding_path, "trademark"),
            (cp_cases_df, cp_embedding_path, "copyright"),
        ]:
            for col in required_columns:
                df[col + "_embedding"] = df[col].apply(
                    lambda x: model.encode(str(x), convert_to_tensor=True)
                )
            df.to_pickle(embedding_path)
            print(f"Embeddings for {case_type} cases computed and saved.")
    else:
        tm_cases_df = pd.read_pickle(tm_embedding_path)
        cp_cases_df = pd.read_pickle(cp_embedding_path)
        print("Embeddings for trademark and copyright cases loaded.")

    print("Models and embeddings are ready.")
    return model, tm_cases_df, cp_cases_df, required_columns


def query_tm_cases_model(
    cases_model,
    tm_cases_df,
    cp_cases_df,
    required_columns,
    query,
    case_type="trademark",
    top_k=3,
):
    # Select the appropriate dataset and embeddings based on case_type
    if case_type == "trademark":
        cases_df = tm_cases_df
    elif case_type == "copyright":
        cases_df = cp_cases_df
    else:
        raise ValueError("Invalid case_type. Choose 'trademark' or 'copyright'.")

    query_embeddings = cases_model.encode(query, convert_to_tensor=True)

    selected_columns = required_columns

    all_hits = []
    for col in selected_columns:
        hits = util.semantic_search(
            query_embeddings, cases_df[col + "_embedding"].tolist(), top_k=top_k
        )
        all_hits.extend(hits[0])

    unique_hits = {hit["corpus_id"]: hit for hit in all_hits}.values()
    sorted_hits = sorted(unique_hits, key=lambda x: x["score"], reverse=True)[:top_k]

    result_list = []

    for hit in sorted_hits:
        hit_id = hit["corpus_id"]
        article_data = cases_df.iloc[hit_id]

        case_data = {
            "Title": article_data["Title"],
            "Facts": article_data["Facts"],
            "Issues_framed": article_data["Issues framed"],
            "Decisions_Holdings": article_data["Decisions/Holdings"],
            "Reasoning_and_Analysis": article_data["Reasoning and Analysis"],
            "Judgement_Result": article_data["Judgment Results"],
        }

        result_list.append(case_data)
    return result_list


if __name__ == "__main__":
    model, tm_df, cp_df, required_columns = initialize_tm_cases_model(
        save_embeddings=False
    )

    case_type = "trademark"  # Change to 'copyright' for copyright cases
    query = (
        "trademark for food products"
        if case_type == "trademark"
        else "copyright infringement in software"
    )
    results = query_tm_cases_model(
        model, tm_df, cp_df, required_columns, query, top_k=3, case_type=case_type
    )

    titles = [result["Title"] for result in results]
    print(len(results), "\n\n")
    for title in titles:
        print(title)
        print("\n")

# import os
# import sys

# import pandas as pd
# from sentence_transformers import SentenceTransformer, util
# import pickle  # For saving and loading embeddings

# def initialize_tm_ordiance_model(save_embeddings=False):

#     base_path = getattr(sys, '_MEIPASS', os.path.abspath("."))
#     file_path = os.path.join(base_path, 'ml_models', 'DataSets', 'trademark_ordinance_dataset.csv')
#     embeddings_path = os.path.join(base_path,'ml_models', 'embeddings', 'trademark_ordinance_embedding.pkl')

#     tm_ordinance_df = pd.read_csv(file_path)
#     tm_ordinance_df = tm_ordinance_df.fillna("")
#     tm_ordinance_df["id"] = tm_ordinance_df.index

#     tm_ordinance_model = SentenceTransformer(os.path.join(base_path, 'ml_models', 'fine_tuned_legal_bert_dynamic_loss'))

#     if save_embeddings:
#         # Compute embeddings and save them
#         tm_title_embeddings = tm_ordinance_model.encode(tm_ordinance_df["title"].tolist(), convert_to_tensor=True)
#         tm_desc_embeddings = tm_ordinance_model.encode(tm_ordinance_df["subsec_desc"].tolist(), convert_to_tensor=True)

#         # Save embeddings and DataFrame
#         with open(embeddings_path, "wb") as f:
#             pickle.dump((tm_ordinance_df, tm_title_embeddings, tm_desc_embeddings), f)
#         print("Embeddings computed and saved.")
#     else:
#         # Load precomputed embeddings if available
#         if os.path.exists(embeddings_path):
#             with open(embeddings_path, "rb") as f:
#                 tm_ordinance_df, tm_title_embeddings, tm_desc_embeddings = pickle.load(f)
#             print("Embeddings loaded.")
#         else:
#             raise FileNotFoundError("Precomputed embeddings not found. Set `save_embeddings=True` to generate them.")

#     return tm_ordinance_df, tm_ordinance_model, tm_title_embeddings, tm_desc_embeddings


# def query_tm_ordinance_model(
#     query, tm_ordinance_df, tm_ordinance_model, tm_title_embeddings, tm_desc_embeddings, query_type
# ):
#     if query_type == "section_no":
#         q = tm_ordinance_df[tm_ordinance_df["sect_no"] == query]
#         return q.to_dict(orient="records")
#     else:
#         top_k = 5
#         query_embedding = tm_ordinance_model.encode(query, convert_to_tensor=True)
#         title_hits = util.semantic_search(
#             query_embedding, tm_title_embeddings, top_k=top_k
#         )
#         desc_hits = util.semantic_search(query_embedding, tm_desc_embeddings, top_k=top_k)

#         hits = title_hits[0] + desc_hits[0]
#         hits = sorted(hits, key=lambda x: x["score"], reverse=True)[:top_k]

#         results = []
#         for hit in hits:
#             hit_id = hit["corpus_id"]
#             article_data = tm_ordinance_df.iloc[hit_id]
#             results.append(article_data.to_dict())
#         return results


# if __name__ == "__main__":
#     df, embedder, title_embeddings, desc_embeddings = initialize_tm_ordiance_model(save_embeddings=True)
#     print("Model and embeddings initialized and saved.")
#     query = "trademark products"
#     query_type = "text"
#     result = query_tm_ordinance_model(
#         query, df, embedder, title_embeddings, desc_embeddings, query_type
#     )
#     print(len(result))


# --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


import os
import sys
import pickle
import pandas as pd
from sentence_transformers import SentenceTransformer, util


def initialize_tm_ordiance_model(save_embeddings=False):
    base_path = getattr(sys, "_MEIPASS", os.path.abspath("."))

    # Dataset paths
    tm_file_path = os.path.join(
        base_path, "ml_models", "DataSets", "trademark_ordinance_dataset.csv"
    )
    cp_file_path = os.path.join(
        base_path, "ml_models", "DataSets", "copyright_ordinance_dataset.csv"
    )

    # Embedding paths
    tm_embeddings_path = os.path.join(
        base_path, "ml_models", "embeddings", "trademark_ordinance_embedding.pkl"
    )
    cp_embeddings_path = os.path.join(
        base_path, "ml_models", "embeddings", "copyright_ordinance_embedding.pkl"
    )

    # Load datasets
    tm_df = pd.read_csv(tm_file_path)
    tm_df = tm_df.fillna("")
    tm_df["id"] = tm_df.index

    cp_df = pd.read_csv(cp_file_path)
    cp_df = cp_df.fillna("")
    cp_df["id"] = cp_df.index

    # Load model
    model = SentenceTransformer(
        os.path.join(base_path, "ml_models", "fine_tuned_legal_bert_dynamic_loss")
    )

    # Save or load embeddings
    if save_embeddings:
        # Compute embeddings and save them for both datasets
        tm_title_embeddings = model.encode(
            tm_df["title"].tolist(), convert_to_tensor=True
        )
        tm_desc_embeddings = model.encode(
            tm_df["subsec_desc"].tolist(), convert_to_tensor=True
        )

        cp_title_embeddings = model.encode(
            cp_df["title"].tolist(), convert_to_tensor=True
        )
        cp_desc_embeddings = model.encode(
            cp_df["subsec_desc"].tolist(), convert_to_tensor=True
        )

        # Save embeddings for both datasets
        with open(tm_embeddings_path, "wb") as f:
            pickle.dump((tm_df, tm_title_embeddings, tm_desc_embeddings), f)
        with open(cp_embeddings_path, "wb") as f:
            pickle.dump((cp_df, cp_title_embeddings, cp_desc_embeddings), f)

        print("Embeddings for both trademark and copyright computed and saved.")
    else:
        # Load precomputed embeddings for both datasets
        if os.path.exists(tm_embeddings_path):
            with open(tm_embeddings_path, "rb") as f:
                tm_df, tm_title_embeddings, tm_desc_embeddings = pickle.load(f)
            print("Trademark embeddings loaded.")
        else:
            raise FileNotFoundError(
                "Precomputed trademark embeddings not found. Set `save_embeddings=True` to generate them."
            )

        if os.path.exists(cp_embeddings_path):
            with open(cp_embeddings_path, "rb") as f:
                cp_df, cp_title_embeddings, cp_desc_embeddings = pickle.load(f)
            print("Copyright embeddings loaded.")
        else:
            raise FileNotFoundError(
                "Precomputed copyright embeddings not found. Set `save_embeddings=True` to generate them."
            )

    return {
        "trademark": (tm_df, tm_title_embeddings, tm_desc_embeddings),
        "copyright": (cp_df, cp_title_embeddings, cp_desc_embeddings),
        "model": model,
    }


def query_tm_ordinance_model(query, df_dict, query_type="text", case_type="trademark"):
    print("datasetyupe: ", case_type)
    # Select dataset based on user input
    if case_type == "trademark":
        df, title_embeddings, desc_embeddings = df_dict["trademark"]
    elif case_type == "copyright":
        df, title_embeddings, desc_embeddings = df_dict["copyright"]
    else:
        raise ValueError("Invalid dataset type. Use 'trademark' or 'copyright'.")

    if query_type == "section_no":
        q = df[df["sect_no"] == query]
        return q.to_dict(orient="records")
    else:
        top_k = 5
        query_embedding = df_dict["model"].encode(query, convert_to_tensor=True)
        title_hits = util.semantic_search(
            query_embedding, title_embeddings, top_k=top_k
        )
        desc_hits = util.semantic_search(query_embedding, desc_embeddings, top_k=top_k)

        hits = title_hits[0] + desc_hits[0]
        hits = sorted(hits, key=lambda x: x["score"], reverse=True)[:top_k]

        results = []
        for hit in hits:
            hit_id = hit["corpus_id"]
            article_data = df.iloc[hit_id]
            results.append(article_data.to_dict())
        return results


if __name__ == "__main__":
    df_dict = initialize_tm_ordiance_model(save_embeddings=False)
    print("Model and embeddings initialized and saved.")

    # Query trademark dataset
    query = "trademark products"
    query_type = "text"
    result = query_tm_ordinance_model(
        query, "trademark", df_dict, query_type=query_type
    )
    print(f"Trademark results: {len(result)}")

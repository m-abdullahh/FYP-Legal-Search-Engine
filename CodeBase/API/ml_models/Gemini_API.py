import os
import google.generativeai as genai


# Function to configure the Gemini model
def load_gemini_model():
    api_key = os.environ["API_KEY"]
    genai.configure(api_key=api_key)
    gemini_model = genai.GenerativeModel("gemini-1.5-flash")
    return gemini_model


# Function to process the query with Gemini
def process_query_with_gemini(gemini_query, gemini_model):
    # Call the relevant model based on the user's query
    # Prepare concatenated data for the prompt
    concatenated_data = "\n\n".join(
        [
            ", ".join([f"{key}: {value}" for key, value in item.items()])
            for item in gemini_query
        ]
    )

    # Create the prompt for rephrasing
    prompt = f"Summarize and Concise it extremely into Important Details. reply shouldnt have anything like Here is the reposnse or SUMMARY: etc\n DATA:  \n{concatenated_data}"

    # Generate rephrased content using the Gemini model
    response = gemini_model.generate_content(prompt)

    return response.text

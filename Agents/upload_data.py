import os
import functions_framework
from google.cloud import storage
import vertexai
from vertexai.generative_models import GenerativeModel, Part
import json
import re
from google.cloud import bigquery
from Agents.clean_model import clean_json

PROJECT_ID = "smart-wallet-b9b00"
LOCATION = "us-west1"
TABLE_ID = "expenses" 
DATASET_ID = "default_dataset" 
# Initialize Google Cloud Storage client
storage_client = storage.Client()
if not PROJECT_ID or not LOCATION:
    raise ValueError("GCP_PROJECT_ID and GCP_LOCATION environment variables must be set.")

vertexai.init(project=PROJECT_ID, location=LOCATION)

model = GenerativeModel("gemini-2.5-flash-lite")

def add_data(data):
    client = bigquery.Client(project=PROJECT_ID)
    table_ref = client.dataset(DATASET_ID).table(TABLE_ID)
    try:
        error_rows = client.insert_rows_json(table_ref, data)
        print(f"---------------{error_rows}")
        return error_rows
    except Exception as e:
        print(f"EROROROROROROR: {e}")
        return {"Error": e}

def get_data(request_json):
    gcs_uri = None
    user_id = None
    receipt_id = None

    if request_json and 'gcs_uri' in request_json:
        gcs_uri = request_json['gcs_uri']
    if request_json and 'user_id' in request_json:
        user_id = request_json['user_id']
    if request_json and 'receipt_id' in request_json:
        receipt_id = request_json['receipt_id']

    if not gcs_uri:
        return {"error": "Missing 'gcs_uri' in request. Please provide it as a query parameter or in the JSON body."}, 400
    
    if not user_id:
        return {"error": "Missing 'user_id' in request. Please provide it as a query parameter or in the JSON body."}, 400
    
    if not receipt_id:
        return {"error": "Missing 'receipt_id' in request. Please provide it as a query parameter or in the JSON body."}, 400

    if not gcs_uri.startswith("gs://"):
        return {"error": f"Invalid GCS URI format: {gcs_uri}. Must start with 'gs://'."}, 400

    try:
        bucket_name, blob_path = gcs_uri.replace("gs://", "").split("/", 1)
    except ValueError:
        return {"error": f"Invalid GCS URI format: {gcs_uri}. Expected format gs://bucket-name/path/to/image.jpg"}, 400

    try:
        bucket = storage_client.bucket(bucket_name)
        blob = bucket.blob(blob_path)
        if not blob.exists():
            return {"error": f"Image not found at GCS URI: {gcs_uri}"}, 404
        image_bytes = blob.download_as_bytes()
        print(f"Successfully downloaded image from {gcs_uri}")
    except Exception as e:
        print(f"Error downloading image from GCS: {e}")
        return {"error": f"Failed to download image from GCS: {e}"}, 500

    mime_type = "image/jpeg"
    if gcs_uri.lower().endswith((".png")):
        mime_type = "image/png"
    elif gcs_uri.lower().endswith((".jpg", ".jpeg")):
        mime_type = "image/jpeg"
    elif gcs_uri.lower().endswith((".gif")):
        mime_type = "image/gif"
    elif gcs_uri.lower().endswith((".webp")):
        mime_type = "image/webp"
    # Add more image types if needed

    try:
        image_part = Part.from_data(data=image_bytes, mime_type=mime_type)

        prompt = f""" 
        Data in image can be present in any type of human speaking languages, so understand which language it is
        and then converts the text to english and do the preprocessing as mentioned below
        categories = [
            "Clothing & Accessories",
            "Food & Beverages",
            "Personal Care & Hygiene",
            "Home & Kitchen",
            "Electronics & Appliances",
            "Tools & Utilities",
            "Travel & Outdoor",
            "Stationery & Office Supplies",
            "Storage & Organization",
            "Pet Supplies"
        ]
        Fetch me information in json format
        Each row in json is specific to each value
        {{
            {{
                "user_id": {user_id},
                "receipt_id": {receipt_id},
                "shop_name": string,
                "receipt_date" : in datetime format,
                "item_name" : string,
                "item_value" : float64,
                "category": string (pick from list)
            }},
            {{
                "user_id": {user_id},
                "receipt_id": {receipt_id},
                "shop_name": string,
                "receipt_date" : in datetime format,
                "item_name" : string,
                "item_value" : float64,
                "category": string (pick from list)
            }},....
            {{
                "user_id": {user_id},
                "receipt_id": {receipt_id},
                "shop_name": string,
                "receipt_date" : in datetime format,
                "item_name" : Total,
                "item_value" : float64,
                "category": Totals (This is hardcoded for total amount row)
            }},
            {{
                "user_id": {user_id},
                "receipt_id": {receipt_id},
                "shop_name": string,
                "receipt_date" : in datetime format,
                "item_name" : Discount,
                "item_value" : float64 (0 by default),
                "category": Discounts (This is hardcoded for discount amount row)
            }},
            {{
                "user_id": {user_id},
                "receipt_id": {receipt_id},
                "shop_name": string,
                "receipt_date" : in datetime format,
                "item_name" : string,
                "item_value" : float64 (0 by default),
                "category": Taxes (This is hardcoded for discount amount row)
            }}
        }}
        Apart from this is there are some random information then ignore it
        Also very Important remove all the endline characters like //
        your response should be like : 
            {{
                text : json mentioned above (this should not be a string and it should not have special endline characters)
            }}
        
        """

        print("Sending request to Gemini model...")
        response = model.generate_content(
            [ prompt, image_part ],
            generation_config={"temperature" : 0.4}
        )
        print("Received response from Gemini model.")
        # bq_result = create_sql(response.text)
        # print(f"This is the resultant bq_query: {bq_result}")
        # The model might return plain text that looks like JSON, or actual JSON.
        # Try to parse it as JSON, if it fails, return as plain text.
        print(f"!!!!!!!!!!!!!{response.text}!!!!!!!!!!!!!!")
        try:
            # Attempt to parse the text as JSON
            parsed_json = clean_json(response.text)
            print(f"----------{parsed_json}------------")
            print(add_data(parsed_json['text']))
            return parsed_json, 200
        except json.JSONDecodeError:
            print("Model response was not a valid JSON. Returning as plain text.")
            return {"extracted_text": response.text, "note": "Model response was not a valid JSON string."}, 200

    except Exception as e:
        print(f"Error processing image with Vertex AI: {e}")
        return {"error": f"Failed to process image with Vertex AI: {e}"}, 500
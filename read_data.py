import os
import functions_framework
from google.cloud import storage
import vertexai
from vertexai.generative_models import GenerativeModel, Part
import json
import re
from google.cloud import bigquery

PROJECT_ID = "smart-wallet-b9b00"
LOCATION = "us-west1"
TABLE_ID = "expenses" 
DATASET_ID = "default_dataset" 

vertexai.init(project=PROJECT_ID, location=LOCATION)

model = GenerativeModel("gemini-2.5-flash-lite")

def refine_sql_query(gemini_output: str) -> str:
    # Remove triple backticks and optional 'sql' tag
    print("-----------------0----------------")
    query = gemini_output.strip()
    query = re.sub(r"^```sql", "", query)
    query = re.sub(r"^```", "", query)
    query = re.sub(r"```$", "", query)
    
    # Remove any remaining markdown artifacts
    query = query.replace("```", "")
    
    # Remove comment lines (optional)
    query = "\n".join(line for line in query.splitlines() if not line.strip().startswith("--"))
    print(f"here is the final queryyyyyyy: {query}")
    # Trim leading/trailing spaces
    query = query.strip()

    return query

def execute_bigquery_query(query: str) -> list:
    try:
        client = bigquery.Client(project=PROJECT_ID)
        query_job = client.query(query)
        results = query_job.result()

        # Convert results to list of dictionaries
        rows = [dict(row.items()) for row in results]
        print(rows)
        return rows

    except Exception as e:
        print(f"Error executing query: {e}")
        return []


def create_query(json):
    user_id = json['user_id']
    try:
        prompt = f""" 
        * Create me a bigquery query for table: {PROJECT_ID}.{DATASET_ID}.{TABLE_ID}
        * This query should only operate over {user_id} data only so can be added to where column.
        * Query logic is as follows: {json['prompt']}
        * Any comparison on columns apart from user_id and receipt id should be case insensitive
        * In category look for similar category if asked for category filter and fetch even if it is similar
        * Schema for the table is : 
        user_id string, receipt_id string, receipt_date DATETIME, item_name string, item_value (float), category string, shop_name string
        * Here are some restrictions on the query:
        1. the response.text should be a string just containing sql nothing extra
        2. It should be executable
        3. All the column names and datatype should match with table schema
        4. It should not have any special characters like / and endline characters /n
        """

        print("Sending request to Gemini model...")
        response = model.generate_content(
            prompt,
            generation_config={"temperature" : 0.4}
        )
        print("========================")
        print("Received response from Gemini model.")
        refined_query = refine_sql_query(response.text)
        print(refined_query)
        query_result = execute_bigquery_query(refined_query)

        return query_result, 200
    except Exception as e:
        return {"error", e}, 500
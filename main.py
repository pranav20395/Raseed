import os
import functions_framework
from google.cloud import storage
import vertexai
from vertexai.generative_models import GenerativeModel, Part
import json
import re
from google.cloud import bigquery
from upload_data import get_data
from read_data import create_query
from agent_file import agent_task
PROJECT_ID = "smart-wallet-b9b00"
LOCATION = "us-west1"

def upload(request_json):
    try:
        result = get_data(request_json)
        return result
    except Exception as e:
        print(f"ERROR IN UPLOAD FUNCTION IN MAIN {e}")
        return e
    return "done"

def read(request_json):
    try:
        result = create_query(request_json)
        return result
    except Exception as e:
        print(f"ERROR {e}")
        return e
    return "Function to be deployed"

def agent(request_json):
    try:
        result = agent_task(request_json)
        return result
    except Exception as e:
        print(f"ERROR {e}")
        return e
    return "Agent working"

@functions_framework.http
def main_func(request):
    gcs_uri = None
    prompt = None
    query_type = None # query_type can be -> read / upload
    user_id = None
    receipt_id = None

    request_json = request.get_json()

    if request_json and 'gcs_uri' in request_json:
        gcs_uri = request_json['gcs_uri']
    if request_json and 'prompt' in request_json:
        prompt = request_json['prompt']
    if request_json and 'query_type' in request_json:
        query_type = request_json['query_type']
    if request_json and 'user_id' in request_json:
        user_id = request_json['user_id']
    if request_json and 'receipt_id' in request_json:
        receipt_id = request_json['receipt_id']

    result = None
    # Based on the query type we will call out different agents
    if query_type == "read":
        result = read(request_json)
    elif query_type == "upload":
        result = upload(request_json)
    elif query_type == "agent":
        result = agent(request_json)
    else:
        result = {"Error" : "query type doesn't match with read or upload"}
        return result, 500
    
    return result


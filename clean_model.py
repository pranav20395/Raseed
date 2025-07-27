import json
import re

def clean_json(model_response_string):
    """
    Cleans a model's response string (removing markdown code block formatting
    and non-breaking spaces) and then attempts to parse the contained JSON.

    Args:
        model_response_string (str): The raw string received from the model,
                                      potentially wrapped in markdown code blocks
                                      and containing non-breaking spaces.

    Returns:
        dict or None: The parsed JSON object if successful, None otherwise.
    """
    print(f"Original string:\n{model_response_string}")

    # Step 1: Remove leading/trailing markdown code block formatting
    match = re.search(r'^```json\n(.*)\n```$', model_response_string, re.DOTALL)

    if match:
        json_string_extracted = match.group(1)
        print(f"\nExtracted JSON string after stripping markdown:\n{json_string_extracted}")
    else:
        json_string_extracted = model_response_string.strip()
        print("\nNo markdown code block detected. Stripping leading/trailing whitespace.")

    # Step 2: Replace non-breaking spaces with regular spaces
    # This is crucial for fixing the invalid JSON issue caused by ' ' characters.
    json_string_cleaned = json_string_extracted.replace('\xa0', ' ')
    print(f"\nString after replacing non-breaking spaces:\n{json_string_cleaned}")


    # Step 3: Load the cleaned string into a JSON object
    try:
        data = json.loads(json_string_cleaned)
        print("\nSuccessfully loaded JSON.")
        return data
    except json.JSONDecodeError as e:
        print(f"\nError decoding JSON: {e}")
        print(f"Problematic string (after all cleaning attempts): '{json_string_cleaned}'")
        return None
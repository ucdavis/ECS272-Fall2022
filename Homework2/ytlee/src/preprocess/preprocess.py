import csv 
import json 

def csv_to_json(csvFilePath, jsonFilePath, preprocess_func):
    jsonArray = []
      
    #read csv file
    with open(csvFilePath, encoding='utf-8') as csvf: 
        #load csv file data using csv library's dictionary reader
        csvReader = csv.DictReader(csvf) 

        #convert each csv row into python dict
        for row in csvReader: 
            #add this python dict to json array
            jsonArray.append(row)
    
    preprocess_data = preprocess_func(jsonArray)
    #convert python jsonArray to JSON String and write to file
    with open(jsonFilePath, 'w', encoding='utf-8') as jsonf: 
        jsonString = json.dumps(preprocess_data, indent=4)
        jsonf.write(jsonString)
        
def preprocess_func(data):
    process_data = []
    key_list = {
        "acousticness",
        "artists", 
        "danceability", 
        "duration_ms", 
        "energy", 
        "id", 
        "instrumentalness",
        "key",
        "liveness",
        "loudness", 
        "name",
        "popularity",
        "release_date",
        "speechiness",
        "tempo",
        "valence",
        "year",
        }
    
    for item in data:
        process_data.append({ kept_key: clean(kept_key, normalize(kept_key, item[kept_key])) for kept_key in key_list })
    return process_data[0:1000]

def normalize(key, value):
    normalize_dict = {
        "popularity": { "min": 0, "max": 100},
        "tempo": { "min": 50, "max": 150},
        "loudness": { "min": -60, "max": 0},
        "key": { "min": 0, "max": 11},
    }
    if key in normalize_dict.keys():
        return str((float(value) - normalize_dict[key]["min"])/(normalize_dict[key]['max'] - normalize_dict[key]['min']))
    else:
        return value

def clean(key, value):
    if key == "artists":
        list = value.replace('[','').replace(']','').replace("'",'').replace('"', "").split(",")
        list = [s.strip() for s in list]
        return list
    return value


csvFilePath = r'data.csv'
jsonFilePath = r'data_1000.json'
csv_to_json(csvFilePath, jsonFilePath, preprocess_func)
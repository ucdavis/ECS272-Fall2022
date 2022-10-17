from ast import Delete
import csv 
import json
import statistics 

def preprocess_raw():
    csvFilePath = r'data.csv'
    jsonFilePath = r'data.json'
    csv_to_json(csvFilePath, jsonFilePath, preprocess_func)

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
import os
def save_json(data, filepath="data/new_dict.json"):
    dirname = os.path.dirname(__file__)
    relative_path = os.path.join(dirname, filepath)
    with open(relative_path, 'w') as fp:
        json.dump(data, fp, indent=4)

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
    return process_data

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


def further_preprocess(filepath=r'data.json'):
    data = json.load(open(filepath))
    artist_dict = generate_artist_song_dict(data)
    filtered_artist_dict = filter_artists_by_songs_number(artist_dict, 50,1000)
    artist_info_dict = generate_artist_ranking_info(filtered_artist_dict)
    sorted_artist_list = list(artist_info_dict.keys())
    sorted_artist_list.sort(reverse=True, key=lambda a:artist_info_dict[a]["mse"])
    save_json(filtered_artist_dict, filepath="artist_song_dict.json")
    save_json(artist_info_dict, filepath="artist_rank_info_dict.json")
    save_json(sorted_artist_list, filepath="sorted_artist_list.json")


def generate_artist_song_dict(data):
    artist_dict = {}
    for song in data:
        artists = song["artists"]
        for artist in artists:
            if(artist not in artist_dict.keys()):
                artist_dict[artist] = []
            artist_dict[artist].append(song)
    return artist_dict

def filter_artists_by_songs_number(artist_dict, min, max):
    del_list = []
    for artist, songs in artist_dict.items():
        if len(songs) not in range(min, max):
            print(len(songs))
            del_list.append(artist)
        else:
            songs.sort(key=lambda song: song["year"])
    for filtered_artist in del_list:
        del artist_dict[filtered_artist]
    print(len(artist_dict.keys()))
    return artist_dict

def generate_artist_ranking_info(artist_dict):
    import statistics
    dimension_keys = [
        "acousticness",
        "danceability", 
        "energy", 
        "instrumentalness",
        "key",
        "liveness",
        "loudness", 
        "popularity",
        "speechiness",
        "tempo",
        "valence",
    ] 
    artist_info_dict = {}
    for artist, songs in artist_dict.items():
        dimension_means = {}
        for d in dimension_keys:
            dimension_means[d] = statistics.fmean([float(song[d]) for song in songs])
        artist_mse = statistics.fmean([song_mse(song, dimension_keys, dimension_means) for song in songs])
        if(artist not in artist_info_dict.keys()):
            artist_info_dict[artist] = {}
        artist_info_dict[artist]["mse"] = artist_mse
        artist_info_dict[artist]["num_songs"] = len(songs)
    return artist_info_dict

def song_mse(song, dimension_keys, dimension_means):
    return statistics.fmean([se(float(song[d]), dimension_means[d]) for d in dimension_keys])  
def se(x, mean):
    return (x-mean)**2
        



further_preprocess()

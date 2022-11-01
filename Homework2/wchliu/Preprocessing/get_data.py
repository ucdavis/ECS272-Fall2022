import json
import csv


# filtered out all movies with imdb_score
def get_movies_csv(input_csv, output_csv): 
    f1 = open(input_csv, 'r')
    f2 = open(output_csv, 'w')
    reader = csv.reader(f1)
    writer = csv.writer(f2)
    writer.writerow([
        'id', 'title', 'release_year', 'runtime', 'genres', 
        'production_country', 'imdb_score', 'imdb_votes'
    ])
    for line in reader:
        if reader.line_num == 1:
            continue
        if line[2] == 'MOVIE' and line[11] != '':
            # 0-id, 1-title, 4-release_year, 6-runtime, 7-genresList, 8-countryList, 11-imdbScore, 12-imdbVotes
            row = [line[0], line[1], line[4], line[6], line[7], line[8], line[11], line[12]]
            writer.writerow(row)

    f1.close()
    f2.close()

# the overview: avg imdb_scores of genres
def averge_score_by_genres(movie_csv, avg_genres_score_csv):
    genre_dict = {}
    with open(movie_csv, 'r') as f1:
        reader = csv.reader(f1)
        for line in reader:
            if reader.line_num == 1:
                continue
            genres = line[4][1:-1].split(', ')
            for genre in genres:
                if genre == '':
                    print(line)
                    continue
                genre = genre[1:-1]
                if genre_dict.get(genre):
                    genre_dict[genre][0] += float(line[6])
                    genre_dict[genre][1] += 1
                else:
                    genre_dict[genre] = [float(line[6]), 1]
    
    with open(avg_genres_score_csv, 'w') as f2:
        writer = csv.writer(f2)
        writer.writerow(['genre', 'imdb_score_total', 'num_movies', 'imdb_score_avg'])
        for k, v in genre_dict.items():
            row = [k, v[0], v[1], round(v[0]/v[1], 1)]
            writer.writerow(row)


def movies_by_genres(movie_csv, output_dir):
    genres = ['drama', 'crime', 'action', 'thriller', 'european', 
        'fantasy', 'comedy', 'war', 'romance', 'western', 'documentation', 
        'history', 'music', 'family', 'horror', 'scifi', 'animation', 'sport', 'reality'
    ]
    fs = []
    writers = {}
    for genre in genres:
        f = open(output_dir + genre + '.csv', 'w')
        writer = csv.writer(f)
        writer.writerow([
            'id', 'title', 'release_year', 'runtime', 'genres', 
            'production_country', 'imdb_score', 'imdb_votes'
        ])
        fs.append(f)
        writers[genre] = writer
    
    with open(movie_csv, 'r') as f1:
        reader = csv.reader(f1)
        for line in reader:
            if reader.line_num == 1:
                continue
            line_genres = line[4][1:-1].split(', ')
            for line_genre in line_genres:
                line_genre = line_genre[1:-1]
                writer = writers.get(line_genre)
                if writer is not None:
                    writer.writerow(line)

    for i in range(len(fs)):
        fs[i].close()


def avg_by_year(movie_csv, avg_year_csv):
    year_dict = {}
    with open(movie_csv, 'r') as f1:
        reader = csv.reader(f1)
        for line in reader:
            if reader.line_num == 1:
                continue
            year = line[2]
            if line[4] == '' or line[3] == '':
                print(line)
                continue
            if year_dict.get(year):
                year_dict[year][0] += float(line[6])
                year_dict[year][1] += float(line[3])
                year_dict[year][2] += 1
            else:
                year_dict[year] = [float(line[6]), float(line[3]), 1]
    
    with open(avg_year_csv, 'w') as f2:
        writer = csv.writer(f2)
        writer.writerow(['year', 'num_movies', 'imdb_score_avg', 'runtime_avg'])
        for k, v in year_dict.items():
            row = [k, v[2], round(v[0]/v[2], 1), round(v[1]/v[2], 1)]
            writer.writerow(row)

if __name__ == "__main__":
    # get_movies_csv("data/titles.csv", "data/movies.csv")
    # averge_score_by_genres("data/movies.csv", "../Vue-Skeleton/src/assets/data/avg_genres_score.csv")
    # movies_by_genres("data/movies.csv", "../Vue-Skeleton/src/assets/data/")
    # avg_by_year("data/movies.csv", "../Vue-Skeleton/src/assets/data/avg_year.csv")
    pass

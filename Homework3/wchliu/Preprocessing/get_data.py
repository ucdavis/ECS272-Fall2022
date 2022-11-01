import json
import csv

# average total stats of different generation
def averge_total_stats_by_generation(pokemon_csv, avg_total_csv):
    total_dict = {}
    pair_dict = {}
    with open(pokemon_csv, 'r') as f1:
        reader = csv.reader(f1)
        for line in reader:
            if reader.line_num == 1:
                continue
            pair = (line[-3], line[4])
            if pair_dict.get(pair) is None:
                pair_dict[pair] = line[0]
            else:
                print(line[0], pair_dict[pair])
            generation = line[11]
            if generation == '':
                print(line)
                continue
            if total_dict.get(generation):
                total_dict[generation][0] += float(line[4])
                total_dict[generation][1] += 1
            else:
                total_dict[generation] = [float(line[4]), 1]
    
    with open(avg_total_csv, 'w') as f2:
        writer = csv.writer(f2)
        writer.writerow(['generation', 'stats_total', 'num_pokemon', 'stats_avg'])
        for k, v in total_dict.items():
            row = [k, v[0], v[1], round(v[0]/v[1], 1)]
            writer.writerow(row)


if __name__ == "__main__":
    averge_total_stats_by_generation("data/pokemon_all.csv", "../Vue-Skeleton/src/assets/data/avg_stats_generation.csv")
    # pass

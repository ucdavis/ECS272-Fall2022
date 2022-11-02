import csv
import numpy as np

counter = 0
key_counter = 0

save_csv = open('./table_data.csv', 'w')
writer = csv.writer(save_csv)
writer.writerow(['key', 'singer'])

tmp_singers = []

with open('spotify.csv', 'r') as file:
    reader = csv.reader(file)
    for row in reader:
        if counter == 0:  
            counter += 1  
            continue
        print(row[1])
        # print(list(row[1].split('\'')))
        tmp = list(row[1].split('\''))
        for i in range(len(tmp)):
            if tmp[i]!='[' and tmp[i]!=']' and tmp[i]!=', ':
                if tmp[i] not in tmp_singers:
                    if '\"' in list(tmp[i]):
                        continue
                    row_save = [str(key_counter)]
                    row_save.append(tmp[i])
                    print(row_save)
                    key_counter += 1
                    tmp_singers.append(tmp[i])
                    writer.writerow(row_save)

save_csv.close()

                
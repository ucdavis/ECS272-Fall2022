import pandas as pd
import csv
import json


dset = pd.read_csv('./globalterrorismdb_0718dist.csv', encoding='latin1')
df = pd.DataFrame(dset)
df = df[['iyear', 'region_txt']]
df.groupby(['iyear', 'region_txt']).value_counts().to_csv('tmp.csv')

d = {}

with open('tmp.csv') as rf:
    reader = csv.reader(rf)
    for r in reader:
        y, r, c = rf.readline().split(',')
        if r not in d:
            d[r] = []
        d[r].append({'year': y, 'count': int(c)})

with open('second_chart.json', 'w') as wf:
    wf.write(json.dumps(d))

import pandas as pd
import collections
import csv
import json


dset = pd.read_csv('./globalterrorismdb_0718dist.csv', encoding='latin1')
df = pd.DataFrame(dset)
df = df[['iyear', 'region_txt']]
df.groupby(['iyear', 'region_txt']).value_counts().to_csv('tmp.csv')

d = {}
region_set = set()
with open('tmp.csv') as rf:
    reader = csv.reader(rf)
    for r in reader:
        y, r, c = rf.readline().split(',')
        if True or r == 'Middle East & North Africa' or r == 'South America':
            if str(int(y) // 10 * 10) + ',' + r not in d:
                d[str(int(y) // 10 * 10) + ',' + r] = 0
            d[str(int(y) // 10 * 10) + ',' + r] += int(c)
            region_set.add(r)

res = {'data': [], 'regions': list(region_set)}
tmp = {}
for k, v in d.items():
    y, r = k.split(',')
    if int(y) not in tmp:
        tmp[int(y)] = {dr: 0 for dr in region_set} 
    tmp[int(y)].update({r: v})
    if 'max' not in tmp[int(y)]:
        tmp[int(y)]['max'] = v
    tmp[int(y)]['max'] = max(tmp[int(y)]['max'], v)

for k, v in tmp.items():
    v.update({'year': k})
    res['data'].append(v)

with open('first_chart.json', 'w') as wf:
    wf.write(json.dumps(res))

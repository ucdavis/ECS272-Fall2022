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
year_set = set()
with open('tmp.csv') as rf:
    reader = csv.reader(rf)
    for r in reader:
        y, r, c = rf.readline().split(',')
        if True or r == 'Middle East & North Africa' or r == 'South America':
            if str(int(y) // 5 * 5) + ',' + r not in d:
                d[str(int(y) // 5 * 5) + ',' + r] = 0
            d[str(int(y) // 5 * 5) + ',' + r] += int(c)
            region_set.add(r)
            year_set.add(int(y) // 5 * 5)

res = {'xyear': {'data': [], 'regions': list(region_set)}, 
       'xregion': {'data': [], 'regions': list(year_set)}}

# xyear
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
    res['xyear']['data'].append(v)

# xregion
tmp = {}
for k, v in d.items():
    y, r = k.split(',')
    if r not in tmp:
        tmp[r] = {yr: 0 for yr in year_set}
    tmp[r].update({y: v})
    if 'max' not in tmp[r]:
        tmp[r]['max'] = v
    tmp[r]['max'] = max(tmp[r]['max'], v)

for k, v in tmp.items():
    v.update({'year': k})
    res['xregion']['data'].append(v)


with open('first_chart.json', 'w') as wf:
    wf.write(json.dumps(res))

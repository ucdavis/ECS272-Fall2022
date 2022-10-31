import pandas as pd
import csv
import json
import collections


dset = pd.read_csv('./globalterrorismdb_0718dist.csv', encoding='latin1')
df = pd.DataFrame(dset)
df = df[['iyear', 'nkill', 'nwound', 'country_txt', 'region_txt']]
df.to_csv('tmp.csv')

d = collections.defaultdict(list)

with open('tmp.csv') as rf:
    reader = csv.reader(rf)
    for r in rf.readlines():
        _id, year, kill, wound, country, region = r.split(',')
        try:
            # print(kill, wound)
            kill = int(float(kill))
            wound = int(float(wound))
        except:
            continue
        d[year].append({'country': country.replace('\n', ''), 'region': region.replace('\n', ''), 'kill': kill, 'wound': wound})

d['years'] = list(d.keys())

with open('second_chart.json', 'w') as wf:
    wf.write(json.dumps(d))

import pandas as pd
import csv
import json


dset = pd.read_csv('./globalterrorismdb_0718dist.csv', encoding='latin1')
df = pd.DataFrame(dset)
print(df[['success', 'attacktype1_txt', 'weaptype1_txt']].to_csv('tmp.csv'))

d = {}
thresholds = [i for i in range(400, 1000, 100)]
res = {t: {'data': {'links': [], 'nodes': []}} for t in thresholds}
res['thresholds'] = thresholds

for threshold in thresholds:
    with open('tmp.csv') as rf:
        reader = csv.reader(rf)
        for r in reader:
            awts = rf.readline().split(',')
            if str(awts[2] + ',' + awts[3]) not in d:
                d[str(awts[2] + ',' + awts[3])] = 0
            d[str(awts[2] + ',' + awts[3])] += 1

    with open('tmp.csv') as rf:
        reader = csv.reader(rf)
        for r in reader:
            awts = rf.readline().split(',')
            if (str(awts[2] + ',' + awts[3]) in d):
                awts[1] = 'success' if 1 else 'fail'
                if str(awts[1] + ',' + awts[2]) not in d:
                    d[str(awts[1] + ',' + awts[2])] = 0
                d[str(awts[1] + ',' + awts[2])] += 1

    for k, v in d.items():
        s, t = k.split(',')
        if s != 'Unknown' and t != 'Unknown' and v > threshold:
            res[threshold]['data']['links'].append({'source': s, 'target': t, 'value': v})

    node_set = set([])
    for link in sorted(res[threshold]['data']['links'], key=lambda x: x['value']):
        node_set.add(link['source'])
        node_set.add(link['target'])

    for n in node_set:
        res[threshold]['data']['nodes'].append({'id': n})

with open('third_chart.json', 'w') as wf:
    wf.write(json.dumps(res))

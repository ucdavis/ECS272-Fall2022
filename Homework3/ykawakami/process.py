import pandas as pd

if __name__ == "__main__":
    data = pd.read_csv('/Users/yuyakawakami/Downloads/pitches.csv')
    data = data.assign(xmid = (data['x0'] + data['px']) / 2 - data['pfx_x'] / 12)
    data = data.assign(zmid = (data['z0'] + data['pz']) / 2 - data['pfx_z'] / 12)

    data2 = pd.read_csv('/Users/yuyakawakami/Downloads/atbats.csv')
    data = data.merge(data2, how='inner', on='ab_id')
    # data = data[['x0', 'xmid', 'z0', 'zmid', 'px', 'pz', 'pitch_type', 'start_speed']]
    # data = data[data.apply(lambda x: x['pitch_type'] in ['FF', 'CU', 'SI', 'CH', 'SL', 'FS'], axis=1)]
    # data2 = data.sample(n = 100)
    # data2.to_csv('temp.csv')

    atbats = data['ab_id'].unique()
    atbats_to_sel = atbats[:150]
    data_temp = data[data.apply(lambda x: x['ab_id'] in atbats_to_sel, axis=1)]
    data_temp.to_csv('ab150_subset.csv')

    atbats_to_sel = atbats[:50000]
    data_temp = data[data.apply(lambda x: x['ab_id'] in atbats_to_sel, axis=1)]
    data_temp.to_csv('ab50000_subset.csv')




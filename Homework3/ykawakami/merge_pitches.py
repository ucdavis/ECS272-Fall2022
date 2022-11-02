import pandas as pd


def main():
    pitches = pd.read_csv('pitches.csv').drop_duplicates()
    atbats = pd.read_csv('atbats.csv').drop_duplicates()
    merged = pitches.merge(atbats, how='inner', on='ab_id')
    merged.to_csv('merged_pithes.csv')
    return 0

if __name__ == "__main__":
    main()

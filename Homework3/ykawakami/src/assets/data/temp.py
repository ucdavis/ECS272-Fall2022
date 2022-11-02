import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd

if __name__ == "__main__":
    data = pd.read_csv('ab50000_subset.csv')
    data2 = data[data['pitch_type'] == 'SL']
    breakpoint()


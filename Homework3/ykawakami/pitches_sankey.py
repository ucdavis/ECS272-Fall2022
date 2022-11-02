import pandas as pd
import csv

pitch_result_dict = {
    'Groundout': 'O',
    'Double': 'H',
    'Single': 'H',
    # 'Strikeout': 'SO',
    'Strikeout': 'O',
    'Walk': 'BB',
    'Runner Out': 'OT',
    'Flyout': 'O',
    'Forceout': 'O',
    'Pop Out': 'O',
    'Intent Walk': 'OT',
    'Lineout': 'O',
    'Home Run': 'H',
    'Triple': 'H',
    'Hit By Pitch': 'OT',
    'Grounded Into DP': 'O',
    'Sac Bunt': 'OT',
    'Fielders Choice': 'O',
    'Bunt Groundout': 'O',
    'Field Error': 'OT',
    'Double Play': 'O',
    'Sac Fly': 'OT',
    'Fielders Choice Out': 'O',
    'Bunt Pop Out': 'O',
    'Catcher Interference': 'OT',
    # 'Strikeout - DP': 'SO',
    'Strikeout - DP': 'O',
    'Batter Interference': 'OT',
    'Sac Fly DP': 'O',
    'Bunt Lineout': 'O',
    'Sacrifice Bunt DP': 'O',
    'Triple Play': 'O'
}

flow_dict = {
    '00-O': 0,
    '00-H': 0,
    '00-OT': 0,
    '00-10': 0,
    '00-01': 0,

    '01-O': 0,
    '01-H': 0,
    '01-OT': 0,
    '01-02': 0,
    '01-11': 0,

    '02-O': 0,
    '02-SO': 0,
    '02-H': 0,
    '02-OT': 0,
    '02-12': 0,

    '10-O': 0,
    '10-H': 0,
    '10-OT': 0,
    '10-11': 0,
    '10-20': 0,

    '11-O': 0,
    '11-H': 0,
    '11-OT': 0,
    '11-12': 0,
    '11-21': 0,

    '12-O': 0,
    '12-SO': 0,
    '12-H': 0,
    '12-OT': 0,
    '12-22': 0,

    '20-O': 0,
    '20-H': 0,
    '20-OT': 0,
    '20-21': 0,
    '20-30': 0,

    '21-O': 0,
    '21-H': 0,
    '21-OT': 0,
    '21-22': 0,
    '21-31': 0,

    '22-O': 0,
    '22-SO': 0,
    '22-H': 0,
    '22-OT': 0,
    '22-32': 0,

    '30-O': 0,
    '30-H': 0,
    '30-BB': 0,
    '30-OT': 0,
    '30-31': 0,

    '31-O': 0,
    '31-H': 0,
    '31-BB': 0,
    '31-OT': 0,
    '31-32': 0,

    '32-O': 0,
    '32-SO': 0,
    '32-H': 0,
    '32-BB': 0,
    '32-OT': 0,
}

def main():
    df = pd.read_csv('merged_pitches.csv')

    # Remove 2 strike fouls
    # breakpoint()
    # df = df[!(df['code'] == 'F' && df['s_count'] == 2)]
    df = df.query('code != "F" | s_count != 2')

    # Iterate though every at bat...

    for atb in df['ab_id'].unique():
        print(atb)
        if atb == 2015091950:
            break
        if atb in [2015015093, 2015048098, 2015057021, 2015091950]:
            continue
        # get the number of pithces...
        cur_selection = df[df['ab_id'] == atb]
        # print(cur_selection)
        num_pitches = cur_selection.shape[0]
        pitch_outcome = cur_selection['type']

        # cur_selection['event'] should all be the same - the same AB so take the first
        ab_outcome = pitch_result_dict[cur_selection[:1]['event'].tolist()[0]]

        # Keep track of count
        S = 0
        B = 0

        for i in range(num_pitches):
            # It's the last
            if i == num_pitches - 1:
                flow_dict[f'{B}{S}-{ab_outcome}'] += 1
                continue

            if pitch_outcome.tolist()[i] == 'S':
                # newS = S + 1
                flow_dict[f'{B}{S}-{B}{S+1}'] += 1
                S += 1
            elif pitch_outcome.tolist()[i] == 'B':
                # newB = B + 1
                flow_dict[f'{B}{S}-{B+1}{S}'] += 1
                B += 1
            else:
                # Its an X
                if i != num_pitches - 1:
                    raise ValueError("BAD")

            if S > 3 or B > 4:
                raise ValueError("BAD")
    print(flow_dict)
    breakpoint()
    temp = [{'Source': i.split('-')[0], 'Dest': i.split('-')[1], 'Flow': flow_dict[i]} for i in flow_dict]
    with open("pitch_flow_2.csv", 'w') as csvFile:
        writer = csv.DictWriter(csvFile, fieldnames=['Source', 'Dest', 'Flow'])
        writer.writeheader()
        for i in temp:
            writer.writerow(i)
    return 0

if __name__ == "__main__":
    main()

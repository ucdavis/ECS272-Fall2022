
const pitch_result_color = {
    'S': '#e41a1c',
    'B': '#4daf4a',
    'X': '#377eb8',
};

const pitch_type_result_dict = {
    'S': 'Strike',
    'B': 'Ball',
    'X': 'In Play',
};

const pitch_label_color = {
    'Strike': '#e41a1c',
    'Ball': '#4daf4a',
    'In Play': '#377eb8',
};

const pitch_result_dict = {
    'Groundout': 'O',
    'Double': 'H',
    'Single': 'H',
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
    'Strikeout - DP': 'O',
    'Batter Interference': 'OT',
    'Sac Fly DP': 'O',
    'Bunt Lineout': 'O',
    'Sacrifice Bunt DP': 'O',
    'Triple Play': 'O'
}
const pitch_type_dict = {
    'CH': 'Changeup',
    'CU': 'Curveball',
    'EP': 'Eephus',
    'FA': 'Fastball',
    'FC': 'Cutter',
    'FF': 'Fastball',
    'FS': 'Splitter',
    'FT': 'Two seam Fastball',
    'FO': 'Forkball',
    'IN': 'Intent ball',
    'KC': 'Knuckle ball Curve',
    'KN': 'Knuckle ball',
    'PO': 'Pitch out',
    'SC': 'Screwball',
    'SI': 'Sinker',
    'SL': 'Slider'

}

const pitch_type_color = {
    'FF': 0x7fc97f,
    'CU': 0xbeaed4,
    'SI': 0xffff99,
    'CH': 0x386cb0,
    'SL': 0xfdc086,
    'FS': 0xf0027f
}

const pitch_type_label_color = {
    '4-Seam Fastball': '#7fc97f',
    'Curveball': '#beaed4',
    'Sinker': '#ffff99',
    'Changeup': '#386cb0',
    'Slider': '#fdc086',
    'Splitter': '#f0027f',
    'Other': '#bf5617'
}


export {
    pitch_result_color,
    pitch_label_color,
    pitch_result_dict,
    pitch_type_dict,
    pitch_type_color,
    pitch_type_label_color,
    pitch_type_result_dict,
}

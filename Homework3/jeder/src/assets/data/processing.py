import csv
import datetime

def convert_int(s):
    try:
        i = int(s)
    except ValueError:
        i = 0
    return i


relevant_keys = ['eventid','iyear','imonth','iday','country','country_txt','region','region_txt'
,'city','latitude','longitude','summary','success','suicide','attacktype1','attacktype1_txt'
,'targtype1','targtype1_txt','gname','weaptype1','weaptype1_txt'
,'nkill','nwound']

begin = datetime.datetime(2000, 1, 1)
end = datetime.datetime(2005, 12, 31)
outsize = 0
invalid = 0
cnt = 0



print("Processing...")

with open('globalterrorismdb_0718dist.csv','r', newline='')as fin:
    with open('globalterrorismdb_processed.csv','w', newline='') as fout:
        reader = csv.DictReader(fin) 
        writer = csv.DictWriter(fout, fieldnames=relevant_keys)
        writer.writeheader()

        # relevant_rows = { key: reader[key] for key in relevant_keys }

        for row in reader:
            cnt = cnt + 1
            date = datetime.datetime(1900, 1, 1)
            try:
                date = datetime.datetime(int(row['iyear']), int(row['imonth']), int(row['iday']))
            except:
                invalid = invalid + 1

            if begin <= date and date <= end:
                if convert_int(row['nkill']) > 0 or convert_int(row['nwound']) > 0:
                    outsize = outsize + 1
                    
                    writerow = { key: row[key] for key in relevant_keys }
                    # if(outsize == 1): print(writerow)
                    writer.writerow(writerow)

                    if outsize % 1000 == 0:
                        print(outsize)

    print("Processed Size: " + str(cnt))
    print("Result Size: " + str(outsize))
    print("Invalid Date: " + str(invalid))
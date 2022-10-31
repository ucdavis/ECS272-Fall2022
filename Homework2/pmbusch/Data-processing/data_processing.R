# Data processing for Homework 2 ECS 272 Fall 2022
# US Wildfire Dataset - https://www.kaggle.com/rtatman/188-million-us-wildfires
# PBH Oct 2022


# library -----
library(tidyverse)
library(lubridate)
library(RSQLite)
library(jsonlite)


# load SQL lite data ------
# NEED TO CHANGE THIS PATH IF RUNNING IN OTHER MACHINE!
file_path <- "D:/ECS272-Fall2022/Homework2/pmbusch/%s"

# see https://www.kaggle.com/code/captcalculator/wildfire-exploratory-analysis
## connect to db
conn <- dbConnect(SQLite(), sprintf(file_path,"Data/FPA_FOD_20170508.sqlite"))

# data frame
df <- tbl(conn, "Fires") %>% collect()

# disconnect db
dbDisconnect(conn)
rm(conn)


# Data Filter -----
# Only California


# Data procesisng ----------


# exploration of columns
names(df)
# unique(df$STATE)
table(df$STATE) %>% sort()
# unique(df$FIRE_YEAR)
table(df$FIRE_YEAR)
# unique(df$STAT_CAUSE_CODE)
# unique(df$STAT_CAUSE_DESCR)


df <- df %>% filter(STATE=="CA")

# new categories for wildfires - 8 in total
table(df$STAT_CAUSE_DESCR) %>% sort()
df <- df %>% mutate(STAT_CAUSE=case_when(
  STAT_CAUSE_DESCR %in% c("Structure","Railroad","Powerline") ~ "Powerline/Railroad/Structure",
  STAT_CAUSE_DESCR %in% c("Fireworks","Smoking","Children","Campfire") ~ "Campfire/Children/Smoking/Fireworks",
  T ~ STAT_CAUSE_DESCR))
table(df$STAT_CAUSE) %>% sort()


# Function to extract the season
getSeason <- function(dat) {
  stopifnot(class(dat) == "Date")
  scalarCheck <- function(dat) {
    m <- month(dat)      
    d <- day(dat)        
    if ((m == 9 & d >= 23) | (m == 10) | (m == 11) | (m == 12 & d < 21)) {
      r <- 1
    } else if ((m == 12 & d >= 21) | (m == 1) | (m == 2) | (m == 3 & d < 21)) {
      r <- 2
    } else if ((m == 3 & d >= 21) | (m == 4) | (m == 5) | (m == 6 & d < 21))
    {
      r <- 3
    } else {
      r <- 4
    }
    r
  }
  res <- sapply(dat, scalarCheck)
  res <- ordered(res, labels=c("Fall", "Winter", "Spring", "Summer"))
  res <- as.character(res)
  invisible(res)
}

# Date creation
df <- df %>% 
  mutate(FIRE_DATE=as.Date(DISCOVERY_DOY-1,paste0(FIRE_YEAR,"-01-01")),
         SEASON=getSeason(FIRE_DATE))


## Bar Chart -----
# Note: Output is always size of wild fire and count

# Data by year, cause and state
fire_bar <- df %>% 
  # group_by(FIRE_YEAR,STATE,STAT_CAUSE) %>% 
  group_by(STAT_CAUSE) %>% 
  summarise(fire_Totalsize=sum(FIRE_SIZE),
            fire_count=n()) %>% 
  ungroup() %>% 
  mutate(fire_avgSize=fire_Totalsize/fire_count) %>% 
  arrange(desc(fire_Totalsize))

# by season
fire_bar2 <-df %>% 
  group_by(SEASON) %>% 
  summarise(fire_Totalsize=sum(FIRE_SIZE),
            fire_count=n()) %>% 
  ungroup() %>% 
  mutate(fire_avgSize=fire_Totalsize/fire_count) %>% 
  arrange(desc(fire_Totalsize))


# Export to JSON format 
export_fire_bar <- toJSON(fire_bar, pretty = T)
#json
write(paste0('{\n"data":',export_fire_bar,"\n}"), 
      sprintf(file_path,"src/assets/data/fire_bar.json"))
# csv
write.table(fire_bar, sprintf(file_path,"src/assets/data/fire_bar.csv"),
            sep=",",row.names = F)


export_fire_bar2 <- toJSON(fire_bar2, pretty = T)
#json
write(paste0('{\n"data":',export_fire_bar2,"\n}"), 
      sprintf(file_path,"src/assets/data/fire_bar_season.json"))
# csv
write.table(fire_bar2, sprintf(file_path,"src/assets/data/fire_bar_season.csv"),
            sep=",",row.names = F)


## Scatter ----
# create date base on year and day of year
fire_scatter <- df %>% 
  select(OBJECTID,DISCOVERY_DOY,FIRE_YEAR,FIRE_DATE,SEASON,
         STAT_CAUSE,STAT_CAUSE_DESCR,STATE,FIRE_SIZE) %>% 
  sample_n(1000) %>%
  filter(FIRE_SIZE<1000)

fire_scatter$FIRE_SIZE %>% max()

fire_scatter

# Export to JSON format 
export_fire_scatter <- toJSON(fire_scatter, pretty = T)
#json
write(paste0('{\n"data":',export_fire_scatter,"\n}"), 
      sprintf(file_path,"src/assets/data/fire_scatter.json"))
# csv
write.table(fire_scatter, sprintf(file_path,"src/assets/data/fire_scatter.csv"),
            sep=",",row.names = F)

## Stacked Area ----
# Data by year, cause 
fire_area <- df %>% 
  mutate(month=month(FIRE_DATE),
         month_qt=case_when( # month to quarters
           month<4 ~ 1,
           month<7 ~ 2,
           month<10 ~ 3,
           T ~ 4),
         year=FIRE_YEAR+month_qt/4) %>% 
  group_by(year,STAT_CAUSE) %>% 
  summarise(fire_Totalsize=sum(FIRE_SIZE),
            fire_count=n()) %>% 
  ungroup() %>% 
  mutate(fire_avgSize=fire_Totalsize/fire_count) %>% 
  arrange(desc(fire_Totalsize)) %>% 
  mutate(fire_Totalsize=round(fire_Totalsize,0))

# Spread data to long format
fire_area <- fire_area %>% 
  select(-fire_avgSize,-fire_count) %>% 
  pivot_wider(names_from = STAT_CAUSE, values_from = fire_Totalsize,
              values_fill = 0) %>% 
  arrange(year)


# Export to JSON format 
export_fire_area <- toJSON(fire_area, pretty = T)
#json
write(paste0('{\n"data":',export_fire_area,"\n}"), 
      sprintf(file_path,"src/assets/data/fire_area.json"))


## SANKEY DIAGRAM ------
# CAUSE, SEASON AND YEAR

## Order the data for the Sankey
order_cause <- c("Lightning","Miscellaneous","Equipment Use","Arson",
                 "Campfire/Children/Smoking/Fireworks","Missing/Undefined",
                 "Debris Burning","Powerline/Railroad/Structure")
order_season <- c("Summer","Fall","Winter","Spring")

df <- df %>% 
  mutate(STAT_CAUSE=factor(STAT_CAUSE,levels=order_cause),
         SEASON=factor(SEASON,levels=order_season))


# from cause to season
data <- df %>% 
  group_by(STAT_CAUSE,SEASON) %>% 
  summarise(value=round(sum(FIRE_SIZE)/1e3,2)) %>%
  # arrange(desc(value)) %>% 
  arrange(STAT_CAUSE,SEASON) %>% 
  ungroup() %>% 
  rename(source=STAT_CAUSE,target=SEASON) %>% 
  mutate(source=as.character(source),target=as.character(target))

# from season to year
data2 <- df %>% 
  group_by(SEASON,FIRE_YEAR) %>% 
  summarise(value=round(sum(FIRE_SIZE)/1e3,2)) %>% 
  arrange(FIRE_YEAR,SEASON) %>%  ungroup() %>% 
  rename(source=SEASON,target=FIRE_YEAR) %>% 
  mutate(source=as.character(source),target=as.character(target))

# from cause season to year
data3 <- df %>% 
  group_by(STAT_CAUSE,SEASON,FIRE_YEAR) %>% 
  summarise(value=round(sum(FIRE_SIZE)/1e3,2)) %>% 
  arrange(STAT_CAUSE,FIRE_YEAR,SEASON) %>%  ungroup() %>% 
  rename(source=SEASON,target=FIRE_YEAR,cause=STAT_CAUSE) %>% 
  mutate(source=as.character(source),target=as.character(target),cause=as.character(cause))

# from year season to cause
data4 <- df %>% 
  group_by(FIRE_YEAR,SEASON,STAT_CAUSE) %>% 
  summarise(value=round(sum(FIRE_SIZE)/1e3,2)) %>% 
  arrange(FIRE_YEAR,SEASON,STAT_CAUSE) %>%  ungroup() %>% 
  rename(source=STAT_CAUSE,target=SEASON,year=FIRE_YEAR) %>% 
  mutate(source=as.character(source),target=as.character(target),year=as.character(year))


## Nodes - SIMPLY THE CATEGORIES and the TOTAL VALUES FOR THE HEIGHT
nodes_cause <- df %>% 
  group_by(STAT_CAUSE) %>% 
  summarise(value=round(sum(FIRE_SIZE)/1e3,2)) %>% 
  # arrange(desc(value)) %>% 
  arrange(STAT_CAUSE) %>% 
  ungroup() %>% 
  rename(name=STAT_CAUSE) %>% mutate(name=as.character(name))
nodes_season <- df %>% 
  group_by(SEASON) %>% 
  summarise(value=round(sum(FIRE_SIZE)/1e3,2)) %>% 
  # arrange(desc(value)) %>% 
  arrange(SEASON) %>% 
  ungroup() %>% 
  rename(name=SEASON) %>% mutate(name=as.character(name))
nodes_year <- df %>% 
  group_by(FIRE_YEAR) %>% 
  summarise(value=round(sum(FIRE_SIZE)/1e3,2)) %>% 
  arrange(FIRE_YEAR) %>%  ungroup() %>% 
  rename(name=FIRE_YEAR) %>% mutate(name=as.character(name))

nodes <- rbind(nodes_cause,nodes_season,nodes_year) %>% 
  rownames_to_column() %>% rename(node=rowname) %>% 
  mutate(id=str_replace_all(name," |/","-"))

nodes <- toJSON(nodes, pretty = T)

# links: node names to values
links <- rbind(data,data2)
links <- toJSON(links, pretty = T)

# export to JSON
write(paste0('{"items": {\n"nodes":',nodes,', \n "links":',links,"}\n}"), 
      sprintf(file_path,"src/assets/data/fire_sankey.json"))


# detail of cause - season - year
links_detail <- rbind(data %>% mutate(cause=""),data3)
# links_detail <- data3 %>% mutate(target=as.character(target))
links_detail <- toJSON(links_detail, pretty = T)

write(paste0('{"items": {\n"nodes":',nodes,', \n "links":',links_detail,"}\n}"), 
      sprintf(file_path,"src/assets/data/fire_sankey_detail.json"))



# detail of cause - season - year but for links going from cause to year
links_detailYear <- rbind(data2 %>% mutate(year=""),data4)
links_detailYear <- toJSON(links_detailYear, pretty = T)

write(paste0('{"items": {\n"nodes":',nodes,', \n "links":',links_detailYear,"}\n}"), 
      sprintf(file_path,"src/assets/data/fire_sankey_detailYear.json"))


## EoF
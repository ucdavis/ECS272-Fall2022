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



## SANKEY DIAGRAM ------
# CAUSE, SEASON AND YEAR

# from cause to season
data <- df %>% 
  group_by(STAT_CAUSE,SEASON) %>% 
  summarise(value=round(sum(FIRE_SIZE)/1e3,2)) %>% arrange(desc(value)) %>% ungroup() %>% 
  rename(source=STAT_CAUSE,target=SEASON)

# from season to year
data2 <- df %>% 
  group_by(SEASON,FIRE_YEAR) %>% 
  summarise(value=round(sum(FIRE_SIZE)/1e3,2)) %>% arrange(FIRE_YEAR) %>%  ungroup() %>% 
  rename(source=SEASON,target=FIRE_YEAR)

## Nodes - SIMPLY THE CATEGORIES and the TAOL VALUES FOR THE HEIGHT
nodes_cause <- df %>% 
  group_by(STAT_CAUSE) %>% 
  summarise(value=round(sum(FIRE_SIZE)/1e3,2)) %>% arrange(desc(value)) %>% ungroup() %>% 
  rename(name=STAT_CAUSE)
nodes_season <- df %>% 
  group_by(SEASON) %>% 
  summarise(value=round(sum(FIRE_SIZE)/1e3,2)) %>% arrange(desc(value)) %>% ungroup() %>% 
  rename(name=SEASON)
nodes_year <- df %>% 
  group_by(FIRE_YEAR) %>% 
  summarise(value=round(sum(FIRE_SIZE)/1e3,2)) %>% arrange(FIRE_YEAR) %>%  ungroup() %>% 
  rename(name=FIRE_YEAR)

nodes <- rbind(nodes_cause,nodes_season,nodes_year) %>% 
  rownames_to_column() %>% rename(node=rowname) %>% 
  mutate(id=str_replace_all(name," ","-"))

nodes <- toJSON(nodes, pretty = T)

# links: node names to values
links <- rbind(data,data2)
links <- toJSON(links, pretty = T)

# export to JSON
write(paste0('{"items": {\n"nodes":',nodes,', \n "links":',links,"}\n}"), 
      sprintf(file_path,"src/assets/data/fire_sankey.json"))
       
## EoF
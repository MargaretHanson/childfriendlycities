# School Radar

### [Live Demo](https://taupe-tiramisu-9054e2.netlify.app/)

## Why is this site useful? 

This site is designed to assist families with children looking to move to New York City. Due to the diversity of neighborhoods across the give boroughs, this tool seeks to help users better understand the context of where they might move to!

## How to use the site?

Users may enter the address of their potential new home in the search bar at the top of the site, which will pinpoint the address and locate it within a map of New York. Users then can toggle between types of schools in their area, using the table-list view to the right of the map to identify school names. 

Additionally, users are able to sift through a range of child-friendly neighborhood indicators. A cholorpleth map will populate based off what users select, which includes hover-able elements that show exactly what certain statistics are in different community districts.

## Where did the data come from?

Using data from NYC Open Data, American Community Survey (ACS), the Community Health Survey (CHS), the NYC Housing and Vacancy Survey (HVS), and the NYC Department of Health and Mental Hygiene, different indicators for neighborhood child-friendliness have been calculated. These factors include the ratio of parks to the under-18 population of the neighborhood, the rate of childhood-obesity, the rate of childhood asthma, the rate of air pollution, the number of pedestrian injuries, and the rate of renters experiencing rent burden. 

### Data sources

[American Community Survey (ACS)](https://www.census.gov/acs/www/data/data-tables-and-tools/data-profiles/2015/)

[Community Health Survey (CHS)](https://data.cityofnewyork.us/browse?Dataset-Information_Agency=Department+of+Health+and+Mental+Hygiene+%28DOHMH%29&provenance=official) 

[NYC Open Data](https://data.cityofnewyork.us/Recreation/Parks-Properties/enfh-gkve)

[NYC Housing and Vacancy Survey (HVS)](https://www.census.gov/programs-surveys/nychvs.html )

[NYC Department of Health and Mental Hygiene](https://data.cityofnewyork.us/browse?Dataset-Information_Agency=Department+of+Health+and+Mental+Hygiene+%28DOHMH%29)


## Development and build notes
The geocoder service used is Geocodio. The API key for Geocodio can be set up in `/src/connections/geocoder.ts`.

### Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

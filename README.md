# osm street complete edits ireland + viz

The script for extracting the street complete edits is forked from [amandasaurus/2021-osm-street-complete-edits](https://github.com/amandasaurus/2021-osm-street-complete-edits/) and adapted to work on my mac.

I've extended this extract to also gather the geographic data of the changes to allow for the [visualization as heatmap using deck.gl](https://elegant-swartz-d72f01.netlify.app/).

# Usage

Head over to geofabrik and download the ireland-and-northern-ireland.osm.pbf file which includes hte username data, you will need to sign in with your osm account -> https://osm-internal.download.geofabrik.de/europe/ireland-and-northern-ireland.html
You will need to download:

1. ireland-and-northern-ireland-internal.osh.pbf
2. ireland-and-northern-ireland-latest-internal.osm.pbf

Let's extract all the streetcomplete edits made in Ireland.

> *Note: this step could take over 1 hour due to the size of the files to be downloaded and processed.*

```bash
./make.sh
```

Extract the ids of each geo feature

```bash
xsv select id sc-edits.csv | tail +2 >  sc-edits-ids.csv
```

Using the ids extracted, pull out geojson version of each feature

```bash
osmium export --overwrite -c osmiumexp.config -x print_record_separator=false --add-unique-id=type_id  sc-edits-ids.osm.pbf -o sc-edits-ids.geojsonseq
```

For deck.gl we are going to use a csv file to allow for streaming of the data to the client, since we will end up with a > 5mb file.

```bash
node process.js > output/heatmap.csv

xsv join --no-case id sc-edits.csv osmid output/heatmap.csv | xsv select id[0],username,lat,lon,weight > output/heatmap-user.csv
```

# Visualization

First we need to have node.js installed and the install the dependencies

```bash
cd screen-grid
npm install
```

To start a local webserver and view the map on your local machine:

```bash
npm run start
```

If you want to build and publish this on a website, you first need to compile the node.js files into something your browser can use:

```bash
npm run build
```

Copy the dist folder to your webserver and you're good to go. I choose to use [netlify](https://netlify.com/) since you can just drag and drop the dist folder to deploy.

# References

- Data extraction - [amandasaurus/2021-osm-street-complete-edits](https://github.com/amandasaurus/2021-osm-street-complete-edits/)
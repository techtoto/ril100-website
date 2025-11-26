#!/usr/bin/env nu

let data = open --raw "Download-betriebsstellen-data.xlsx" | from xlsx
let latest_column = $data | columns | sort --reverse | first

$data | get $latest_column | skip 3 | headers | to csv | save -f public/ril100.csv

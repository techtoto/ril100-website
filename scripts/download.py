#!/usr/bin/env python3
from bs4 import BeautifulSoup
from requests import get
import re

URL = "https://www.dbinfrago.com/web/schienennetz/betrieb/allgemeine-betriebsinformationen/betriebsstellen-12592996"
headers = { "User-Agent": "https://github.com/techtoto/ril100-website" }

text = get(url=URL, headers=headers).text
soup = BeautifulSoup(text, features="html.parser")

file_url = soup.find(name="a", href=re.compile("Download-betriebsstellen-data\\.xlsx$")).attrs["href"]

response = get(url=f"https://www.dbinfrago.com/{file_url}", headers=headers)
with open("Download-betriebsstellen-data.xlsx", "wb") as f:
    f.write(response.content)

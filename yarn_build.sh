#!/bin/bash

set -e

pwd;
parcel build src/index.html --public-url ./;
rm -Rf docs;
mv dist docs;

echo "Zbudowano poczakę";

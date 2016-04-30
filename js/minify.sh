#!/bin/bash

set -x
set -e

rm bootgitstrap.min.js
jsmin <bootgitstrap.js> bootgitstrap.min.js

rm gitstrap.min.js
jsmin <gitstrap.js> gitstrap.min.js

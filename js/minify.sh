#!/bin/bash

set -x
set -e

rm gitstrap.min.js
jsmin <gitstrap.js> gitstrap.min.js

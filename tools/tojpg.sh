#!/bin/bash
help ()
{
    echo " "
    echo "usage: $0 <path-to-image-file> <number-of-kB>"
    echo "    -h    this help"
    echo " "
    echo "    Example: $0 ~/hello.jpg 40"
    echo "     Will convert hello.jpg into a jpeg that is less than or equal to"
    echo "     40kB in size."
    echo " "
    echo "This script used ImageMagick, so any type that can be converted to"
    echo " jpg is a valid input"
    echo " "
    exit 1
}

# user options
while getopts "h" opt; do
  case $opt in
    h)
      help >&2
      ;;
  esac
done

# check for available commands
if command -v convert >/dev/null 2>&1; then
    CVT="convert "
else
    echo "This script requires ImageMagick\'s \'convert\', aborting."
    exit 1
fi

if command -v identify >/dev/null 2>&1; then
    IDENT="identify"
else
    echo "This script requires ImageMagick\'s \'identify\', aborting."
    exit 1
fi

# get file path and output image size
shift $(($OPTIND - 1))
IMAGE=$1
SIZE=$2

# make sure these args are present
if [ -z "$IMAGE" ]; then
    help
fi
if [ -z "$SIZE" ]; then
    help
fi

# check inital size
$IDENT $IMAGE

# convert to jpg if necessary by changing the output extension
filename=$(basename "$IMAGE")
directory=$(dirname "$IMAGE")
extension="${filename##*.}"
filename="${filename%.*}"
OUTPUT=$IMAGE
if [ "$extension" != "jpg" ]; then
    OUTPUT="$directory/${filename}.jpg"
    echo "converting to jpg > $OUTPUT"
    $CVT $IMAGE $OUTPUT
    IMAGE=$OUTPUT
fi

$CVT $IMAGE -define jpeg:extent=${SIZE}kb $OUTPUT
$IDENT $OUTPUT

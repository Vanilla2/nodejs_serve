#!/bin/bash
export SERVE_DIR=$PWD;
TYPE=static
while [ "$1" != "" ]; do
    case $1 in
        -s)
            ;;
        -w)
            TYPE=website;
        ;;
        --port)
            export SERVE_PORT=$2;
            ;;
    esac
    shift
done
export TYPE;
node ~/.scripts/serve/index.js
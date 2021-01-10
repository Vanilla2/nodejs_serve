#!/bin/bash
export SERVE_DIR=$PWD;
while [ "$1" != "" ]; do
    case $1 in
        --port)
            export SERVE_PORT=$2;
            ;;
    esac
    shift
done
node ~/.scripts/serve/index.js
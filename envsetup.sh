#!/usr/bin/env bash
# Usage
# - just run the script with ". envsetup.sh"

docker-machine start default
eval "$(docker-machine env default)"
docker-compose up -d
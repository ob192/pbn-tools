#!/bin/bash

TAG_VERSION="0.1.0-rc0"

docker build . -t "sasha192bunin/jwt-tool:$TAG_VERSION" -t sasha192bunin/jwt-tool:latest && \
docker push "sasha192bunin/jwt-tool:$TAG_VERSION" && \
docker push "sasha192bunin/jwt-tool:latest"
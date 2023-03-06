#!/bin/bash

source .env

sudo docker run \
    --rm \
    -it \
    -v ~/.aws:/root/.aws \
    -v $(pwd)/dist:/cd amazon/aws-cli \
    s3 --region eu-south-1 sync /cd/ s3://${S3_BUCKET}/

exit $?
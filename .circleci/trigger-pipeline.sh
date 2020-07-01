#!/bin/bash

branch="develop"  # Default branch
api_token="$CIRCLE_API_USER_TOKEN"  # Default to $CIRCLE_API_USER_TOKEN
production_delivery="false" # Do not deliver to production by default

PARAMS=""

while (( "$#" )); do
  case "$1" in
    -b|--branch)
      branch=$2
      shift 2
      ;;
    -a|--api-token)
      api_token=$2
      shift 2
      ;;
    -p|--production_delivery)
      production_delivery=$2
      shift 2
      ;;
    --) # end argument parsing
      shift
      break
      ;;
    -*|--*=) # unsupported flags
      echo "Error: Unsupported flag $1" >&2
      echo "Usage: trigger-pipeline.sh --branch develop --api-token <user_token> --production_delivery false $1" >&2
      exit 1
      ;;
    *) # preserve positional arguments
      PARAMS="$PARAMS $1"
      shift
      ;;
  esac
done

# set positional arguments in their proper place
eval set -- "$PARAMS"


post_data="
    {
      \"branch\": \"$branch\",
      \"parameters\": {
        \"api_triggered\": true,
        \"production_delivery\": ${production_delivery}
      }
    }"

curl -X POST https://circleci.com/api/v2/project/github/Integreat/integreat-react-native-app/pipeline \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Circle-Token: ${api_token}" \
  --data "$post_data"

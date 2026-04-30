#!/bin/bash
# Lists circular dependencies for the current workspace directory.
# Excludes ../shared/ when run from web/ or native/ so you only see
# your own workspace's cycles.
#
# Usage:
#   bash list_workspace_circular_deps.sh [error_limit] [entry_point]
#   yarn list-circular-deps            # default limit 0, entry ./src/index.tsx
#   yarn list-circular-deps 1          # allow up to 1 circular dep

if ! command -v madge &> /dev/null
then
    echo "Madge is not installed. Please install it first."
    exit 1
fi

error_limit=${1:-0}
entry_point=${2:-./src/index.tsx}
workspace_name=$(basename "$(pwd)")

echo "Checking $workspace_name (entry: $entry_point)..."

exclude_args=()
if [ "$workspace_name" = "web" ] || [ "$workspace_name" = "native" ]; then
    exclude_args=(--exclude "\.\.\/shared\/")
fi

madge --circular --no-spinner --no-color --ts-config ./tsconfig.json "${exclude_args[@]}" --extensions ts,tsx "$entry_point"

stderr_output=$(madge --circular --no-spinner --no-color --ts-config ./tsconfig.json "${exclude_args[@]}" --extensions ts,tsx "$entry_point" 2>&1 >/dev/null)

if echo "$stderr_output" | grep -q 'Found [0-9]\+ circular dep'; then
    circular_count=$(echo "$stderr_output" | grep -o 'Found [0-9]\+ circular dep' | grep -o '[0-9]\+')
else
    circular_count=0
fi

echo "Number of circular dependencies in $workspace_name: $circular_count"

if [ "$circular_count" -gt "$error_limit" ]; then
    echo "Error: Circular dependency count ($circular_count) exceeds the limit ($error_limit)."
    exit 1
fi

echo "Circular dependency count is within the limit ($error_limit)."

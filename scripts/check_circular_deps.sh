#!/bin/bash

if ! command -v madge &> /dev/null
then
    echo "Madge is not installed. Please install it first."
    exit 1
fi

if [ -z "$1" ]; then
    echo "Usage: $0 <error_limit> [verbose]"
    echo "Example: $0 0"
    echo "         $0 0 verbose"
    exit 1
fi

error_limit=$1
verbose=${2:-}
exit_code=0

check_workspace() {
    local workspace_dir=$1
    local entry_point=$2
    local workspace_name=$3
    local exclude_pattern=${4:-}

    echo "Checking $workspace_name..."

    cd "$workspace_dir" || exit 1

    local exclude_args=()
    if [ -n "$exclude_pattern" ]; then
        exclude_args=(--exclude "$exclude_pattern")
    fi

    if [ "$verbose" = "verbose" ]; then
        # Run madge to stdout to show detailed circular dependency chains
        madge --circular --no-spinner --no-color --ts-config ./tsconfig.json "${exclude_args[@]}" --extensions ts,tsx "$entry_point"
        echo ""
    fi

    stderr_output=$(madge --circular --no-spinner --no-color --ts-config ./tsconfig.json "${exclude_args[@]}" --extensions ts,tsx "$entry_point" 2>&1 >/dev/null)

    if echo "$stderr_output" | grep -q 'Found [0-9]\+ circular dependencies'; then
        circular_count=$(echo "$stderr_output" | grep -o 'Found [0-9]\+ circular dependencies' | grep -o '[0-9]\+')
    else
        circular_count=0
    fi

    echo "  Number of circular dependencies in $workspace_name: $circular_count"

    if [ "$circular_count" -gt "$error_limit" ]; then
        echo "  Error: Circular dependency count ($circular_count) exceeds the limit ($error_limit)."
        exit_code=1
    else
        echo "  Circular dependency count is within the limit."
    fi

    echo "$stderr_output"

    cd - > /dev/null || exit 1
}

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

check_workspace "$PROJECT_ROOT/web" ./src/index.tsx "web" "\.\.\/shared\/"
echo ""

check_workspace "$PROJECT_ROOT/native" ./src/index.tsx "native" "\.\.\/shared\/"
echo ""

check_workspace "$PROJECT_ROOT/shared" ./index.ts "shared"

exit $exit_code

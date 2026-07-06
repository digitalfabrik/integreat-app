#!/bin/bash
# Checks circular dependencies via madge for the web, native and shared workspaces.
#
# --verbose: list the dependency chains.
#
# Usage:
#   bash checkCircularDependencies.sh [--verbose]

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PATH="$PROJECT_ROOT/node_modules/.bin:$PATH"

if ! command -v madge &> /dev/null; then
    echo "Madge is not installed. Please install it first."
    exit 1
fi

verbose=false

while [ $# -gt 0 ]; do
    case "$1" in
        --verbose|-v) verbose=true; shift ;;
        --help|-h)
            sed -n '2,7p' "$0" | sed 's/^# \{0,1\}//'
            exit 0 ;;
        *) echo "Unknown argument: $1"; exit 1 ;;
    esac
done

exit_code=0

check_workspace() {
    local workspace_dir=$1
    local entry=$2
    local workspace_name=$3
    local exclude_pattern=${4:-}

    echo "Checking $workspace_name..."

    cd "$workspace_dir" || exit 1

    local exclude_args=()
    if [ -n "$exclude_pattern" ]; then
        exclude_args=(--exclude "$exclude_pattern")
    fi

    output=$(madge --circular --no-spinner --no-color --ts-config ./tsconfig.json "${exclude_args[@]}" --extensions ts,tsx "$entry" 2>&1)

    if [ "$verbose" = "true" ]; then
        echo "$output"
        echo ""
    fi

    if echo "$output" | grep -q 'Found [0-9]\+ circular dep'; then
        circular_count=$(echo "$output" | grep -o 'Found [0-9]\+ circular dep' | grep -o '[0-9]\+')
    else
        circular_count=0
    fi

    echo "  Number of circular dependencies in $workspace_name: $circular_count"

    if [ "$circular_count" -gt 0 ]; then
        exit_code=1
    fi

    cd - > /dev/null || exit 1
}

check_workspace "$PROJECT_ROOT/web" ./src/index.tsx "web" "\.\.\/shared\/"
echo ""
check_workspace "$PROJECT_ROOT/native" ./src/index.tsx "native" "\.\.\/shared\/"
echo ""
check_workspace "$PROJECT_ROOT/shared" ./src/index.ts "shared"
echo ""
check_workspace "$PROJECT_ROOT/translations" ./src/index.ts "translations"
echo ""
check_workspace "$PROJECT_ROOT/build-configs" ./src/index.ts "build-configs"

exit $exit_code

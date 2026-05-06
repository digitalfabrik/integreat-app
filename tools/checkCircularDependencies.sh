#!/bin/bash
# Checks circular dependencies via madge.
#
# Default mode: check the web, native, shared, translations and build-configs workspaces.
# --current:    check only the current workspace (cwd). The dependency
#               chains are always listed in this mode.
#
# Usage:
#   bash checkCircularDependencies.sh [--current] [--verbose] [--limit N] [entry_point]
#
# Examples:
#   bash checkCircularDependencies.sh                    # all workspaces, fail if any cycles
#   bash checkCircularDependencies.sh verbose            # all workspaces, list chains
#   bash checkCircularDependencies.sh --current          # current workspace, default entry
#   bash checkCircularDependencies.sh --current --limit 5 ./index.ts

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PATH="$PROJECT_ROOT/node_modules/.bin:$PATH"

if ! command -v madge &> /dev/null; then
    echo "Madge is not installed. Please install it first."
    exit 1
fi

mode="all"
verbose=false
error_limit=0
entry_point=./src/index.tsx

while [ $# -gt 0 ]; do
    case "$1" in
        --current|-c) mode="current"; shift ;;
        --verbose|-v|verbose) verbose=true; shift ;;
        --limit) error_limit="$2"; shift 2 ;;
        --help|-h)
            sed -n '2,15p' "$0" | sed 's/^# \{0,1\}//'
            exit 0 ;;
        *) entry_point="$1"; shift ;;
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

    if [ "$verbose" = "true" ]; then
        madge --circular --no-spinner --no-color --ts-config ./tsconfig.json "${exclude_args[@]}" --extensions ts,tsx "$entry"
        echo ""
    fi

    stderr_output=$(madge --circular --no-spinner --no-color --ts-config ./tsconfig.json "${exclude_args[@]}" --extensions ts,tsx "$entry" 2>&1 >/dev/null)

    if echo "$stderr_output" | grep -q 'Found [0-9]\+ circular dep'; then
        circular_count=$(echo "$stderr_output" | grep -o 'Found [0-9]\+ circular dep' | grep -o '[0-9]\+')
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

    cd - > /dev/null || exit 1
}

if [ "$mode" = "current" ]; then
    # --current always lists the chains
    verbose=true
    workspace_name=$(basename "$(pwd)")
    exclude_pattern=""
    if [ "$workspace_name" = "web" ] || [ "$workspace_name" = "native" ]; then
        exclude_pattern="\.\.\/shared\/"
    fi
    check_workspace "$(pwd)" "$entry_point" "$workspace_name" "$exclude_pattern"
else

    check_workspace "$PROJECT_ROOT/web" ./src/index.tsx "web" "\.\.\/shared\/"
    echo ""
    check_workspace "$PROJECT_ROOT/native" ./src/index.tsx "native" "\.\.\/shared\/"
    echo ""
    check_workspace "$PROJECT_ROOT/shared" ./index.ts "shared"
    echo ""
    check_workspace "$PROJECT_ROOT/translations" ./src/index.ts "translations"
    echo ""
    check_workspace "$PROJECT_ROOT/build-configs" ./index.ts "build-configs"
fi

exit $exit_code

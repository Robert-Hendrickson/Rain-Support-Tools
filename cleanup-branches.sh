#!/bin/bash
set -euo pipefail

dryrun=false
help=false

while [[ $# -gt 0 ]]; do
    case "$1" in
        --dry-run|-d)
            dryrun=true
            shift
            ;;
        --help|-h)
            help=true
            shift
            ;;
        *)
            echo "Invalid option: $1"
            exit 1
            ;;
    esac
done

if [[ "$help" == true ]]; then
    echo "Usage: $0 [options]"
    echo "  --dry-run, -d   Perform a dry run. No branches will be deleted."
    echo "  --help, -h      Show this help message."
    exit 0
fi

current_branch=$(git rev-parse --abbrev-ref HEAD)
if [[ "$current_branch" == "HEAD" ]]; then
    echo "Warning: Detached HEAD state. No branches will be deleted."
    exit 1
fi

echo "----------------------------------------"
echo "Cleaning up branches..."
echo "Current branch: $current_branch"
[[ "$dryrun" == true ]] && echo "(Dry run mode)"
echo "----------------------------------------"

branch_count=0
branches=$(git branch --format='%(refname:short)' --merged)
while read -r branch; do
    if [[ "$branch" != "main" && "$branch" != "$current_branch" ]]; then
        if [[ "$dryrun" == true ]]; then
            echo "Would delete branch: $branch"
        else
            git branch -d "$branch"
        fi
        ((++branch_count))
    fi
done <<< "$branches"

echo "----------------------------------------"
word="branch"
[[ $branch_count -ne 1 ]] && word="branches"
if [[ "$dryrun" == true ]]; then
    echo "Dry run completed. $branch_count $word would have been deleted."
else
    echo "Completed. $branch_count $word deleted."
fi
echo "----------------------------------------"

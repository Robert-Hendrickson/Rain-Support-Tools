#!/bin/bash
dryrun=false
help=false

while [ $# -gt 0 ]; do
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
            shift
    esac
done

if [ "$help" = true ]; then
    echo "Usage: $0"
    echo "  --dry-run|-d  Dry run mode enabled. No branches will be deleted."
    echo "  --help|-h     Show this help message"
    exit 0
fi

current_branch=$(git rev-parse --abbrev-ref HEAD)

if [ "$dryrun" = true ]; then
    echo "Dry run mode enabled. No branches will be deleted."
fi

for branch in $(git branch --format='%(refname:short)' --merged); do
    if [ "$branch" != "main" ] && [ "$branch" != "$current_branch" ]; then
        if [ "$dryrun" = true ]; then
            echo "Would delete branch: $branch"
        else
            git branch -d "$branch"
        fi
    fi
done
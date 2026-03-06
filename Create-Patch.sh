#!/bin/bash

PATCH_DIR="./Patches"

default_branch=$(git symbolic-ref refs/remotes/origin/HEAD)
base_commit=$(git merge-base $default_branch HEAD)
source_commit=${2:-$(git rev-list --reverse $base_commit..HEAD | head -n1)}
patch_count=$(ls -1 "$PATCH_DIR" | wc -l)
patch_num=$(printf "%04d" "$((patch_count + 1))")
patch_name=${1:-$(git symbolic-ref --short HEAD)}

git format-patch --stdout $source_commit..HEAD > "$PATCH_DIR/$patch_num-$patch_name.patch"
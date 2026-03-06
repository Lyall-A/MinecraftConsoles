#!/bin/bash

for patch in $(ls Patches/*.patch | sort -V); do
    echo "Applying patch: $patch"
    patch -p1 --forward < "$patch"
done
#!/bin/bash
cat << 'IGNORE' >> .gitignore
apps_ls.txt
services_ls.txt
IGNORE
git rm -rf --cached apps_ls.txt services_ls.txt > /dev/null 2>&1
git add .gitignore

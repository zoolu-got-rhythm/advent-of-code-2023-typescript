#!/bin/bash

# USAGE: this.sh < input.txt

sed -r '
        s/\:\s+/ | /;
        s/\s\|\s/,/g;
        s/[[:space:]]+/ /g;
    ' \
    | awk -F',' '
        {
            split($2, arr, " ");
            for (i in arr) { win_num[arr[i]]=0 }

            split($3, arr, " ");

            c=0
            for (i in arr) {
                if (arr[i] in win_num) {c++}
            }

            print c
            delete win_num
        }
    ' \
    | awk '
        {
            cards_count[NR]=1
            scores[NR]=$0
        }

        END {

            for (i in cards_count) {
                for (j = i+1; j <= i+scores[i]; j++) {
                    cards_count[j]+=cards_count[i]
                }
            }

            for (i in cards_count) {
                p1+= scores[i] > 0 ? 2^(scores[i]-1) : 0
                p2+=cards_count[i]
            }

            print "Part 1:" p1
            print "Part 2:" p2
        }
    '


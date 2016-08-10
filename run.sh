#!/usr/bin/env bash
cd src && \
javac rush/RushHour.java -d ../terminal-build && \
cp -a ui/bundle ../terminal-build/ui/bundle && \
cp ../test-boards/* ../terminal-build/. && \
cd ../terminal-biuld && \
java rush/RushHour $*
#!/bin/bash

cd /home/runner/workspace/server && npm run dev &
SERVER_PID=$!

sleep 3

cd /home/runner/workspace/client && npm start

wait $SERVER_PID

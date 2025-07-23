#!/bin/bash

docker-compose up --build &

sleep 2

open http://localhost:8080

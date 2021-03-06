#!/bin/bash

mongo <<EOF
   var cfg = {
        "_id": "rs0",
        "version": 1,
        "members": [
            {
                "_id": 0,
                "host": "mongo-0.mongo:27017"
            }
        ]
    };
    rs.initiate(cfg);
    //rs.reconfig(cfg, { force: true });
    rs.status();
EOF
sleep 10

mongo <<EOF
   use admin;
   admin = db.getSiblingDB("admin");
   admin.createUser(
     {
	    user: "aymen",
        pwd: "aymen",
        roles: [ { role: "root", db: "admin" } ]
     });
     db.getSiblingDB("admin").auth("aymen", "aymen");
     rs.status();
EOF
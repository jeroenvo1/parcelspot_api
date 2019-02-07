#!/usr/bin / env node
/**
 * usage: ./operations/scripts/deploy.js --sshPassword SSH_PASSWORD --sshUser SSH_USER --tag TAG --dockerUsername DOCKER_USERNAME --dockerPassword DOCKER_PASSWORD --image IMAGE --port PORT
 * 
 *      --branch        Branch that is deployed
 *      --sshPassword   ssh passwordd
 *      --sshUser       ssh user
 *      --env           Current enviroment
 * 
 */

var yargs = require("yargs").argv;
var SSH = require('simple-ssh');


var repo = 'jeroenvo';
var image = yargs.image;
var tag = yargs.tag;
var dockerUsername = yargs.dockerUsername;
var dockerPassword = yargs.dockerPassword;
var instance = '142.93.224.133';
var sshUser = yargs.sshUser;
var sshPassword = yargs.sshPassword;
var port = yargs.port;

var ssh = new SSH({
    host: instance,
    user: sshUser,
    pass: sshPassword
});

ssh.on('error', function (err) {
    console.log('SSH Error: ');
    console.log(err);
    ssh.end();
});

ssh
    .exec(`docker login -u ${dockerUsername} -p ${dockerPassword}`, {
        out: function (stdout) {
            console.log('login');
            console.log(stdout);
        },
        err: function (stderr) {
            console.log('login error');
            console.log(stderr);
        }
    })
    .exec(`docker stop ${image} || true`, {
        out: function (stdout) {
            console.log('remove current container');
            console.log(stdout);
        },
        err: function (stderr) {
            console.log('remove current container error');
            console.log(stderr);
        }
    })
    .exec(`docker pull ${repo}/${image}:${tag}`, {
        out: function (stdout) {
            console.log('pull');
            console.log(stdout);
        },
        err: function (stderr) {
            console.log('pull error');
            console.log(stderr);
        }
    })
    .exec(`docker run -d -p ${port} --name ${image} --rm ${repo}/${image}:${tag}`, {
        out: function (stdout) {
            console.log('run');
            console.log(stdout);
        },
        err: function (stderr) {
            console.log('run error');
            console.log(stderr);
        }
    })
    .start();


// docker run -d -p 8081:8081 --name parcelspot-api --rm jeroenvo/parcelspot-api:master-155e157

// docker run -it --entrypoint /bin/bash -p 8081:8081 --name parcelspot-api --rm jeroenvo/parcelspot-api:master-155e157 -s
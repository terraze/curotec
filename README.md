<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

## Candidate Information

<b>Laravel+Vue Fullstack</b>
José Ricardo Freitas Santos Junior
josericardojunior@gmail.com

Assessment: https://talent.curotec.com/candidate/assessment/171 (Collaborative Kanban Board)

## Install and Run

#### Requirements

This projects uses Laravel Sail. In order to run the project using Sail, you need to have Docker and Docker Compose installed. Here's a list of all software you might need:

* Docker
* PHP 8.3
* Composer

If running on Windows, you might need to install WSL2 and execute the commands inside the WSL2 terminal. 

#### Install

Execute these commands on root of this project:

```
composer install
./vendor/bin/sail up -d
./vendor/bin/sail artisan migrate
./vendor/bin/sail artisan db:seed
```

Node and NPM will be installed on the Docker container. If you decide to install all software manually, also run these:

```
npm install
npm run dev
```

#### Run

Open http://localhost/

### Problems with the requirements

The assessment requirements are conflicting. Here's why:

"Laravel WebSockets with Laravel Echo and Pusher"
* Laravel WebSockets (server)
* Laravel Echo (client)
* Pusher Protocol (the communication protocol)

"Vue Socket.io integration" - This is a different stack that uses:
* Socket.IO protocol
* Socket.IO client

These can't be directly integrated because they use different protocols.
Laravel WebSockets documentation explicitly mentions it implements the Pusher protocol.
Socket.IO documentation about its protocol:
> "Socket.IO is NOT a WebSocket implementation. Although Socket.IO indeed uses WebSocket as a transport when possible, it adds additional metadata to each packet."

As a result, I had to choose one of the two options,m and decided to use Laravel WebSockets + Laravel Echo, following Laravel's official stack.
## License

This project is only for evaluation purposes and shall not be distributed or used for other purposes.

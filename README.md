## Setup

### Docker

* Install the [Docker Toolbox](https://docs.docker.com/) for Mac
* Start the Docker machine and set environment variables

```
docker-machine start default
docker-machine env default
```
* Build the Docker container for the database

```
docker-compose build
```
* Run the database within the Docker containers

```
docker-compose up
```
* Setup the databases (development and test)

```
rake db:setup
rake db:test:prepare
```

## Development

### Boot the application

1. Start the Docker machine `docker-machine start default`

2. Start Docker containers:

```
bin/bash . envsetup.sh
```

3. Start the rails server `rails server -b 0.0.0.0`

### SSH into a container

1. With Docker:

	* List running containers: ```docker ps```

	* ```docker exec -i -t mockit_db bash```

2. With Docker Compose:

`docker-compose run app bash`

### Connect to the Docker database container (Rubymine/pgAdmin)

* Get docker machine ip address by `docker-machine ip default`

* Use that ip address with port 5432 to connect to the database)

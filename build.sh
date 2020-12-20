#! /bin/bash

client_version=$(sed -n 5p ./version)
server_version=$(sed -n 2p ./version)
username="capy0812"
client_image_name="pwd-client"
server_image_name="pwd-server"

k8s_tag="production-k8s"
docker_tag="production-docker"

# specify which target phase you want to build
build_client_docker_image () {
    docker build \
        -f docker/client-webapp.dockerfile \
        -t "${username}/${client_image_name}:${client_version}" \
        --target $1 \
        ./client-webapp
}

build_server_docker_image () {
    docker build \
        -f docker/server.dockerfile \
        -t "${username}/${server_image_name}:${server_version}" \
        --target $1 \
        ./server
}

if [ -n "$1" ]; then
    case "$1" in
        build)
            if [ -n "$2" ]; then
                case "$2" in
                    client)
                        cd client-webapp
                        tsc || { "Linter errors exist. Please fix errors before building image" ; cd .. ; exit 1;}
                        cd ..
                        echo "Linter passed. Proceeding."
                        build_client_docker_image $docker_tag
                    ;;
                    server)
                        build_server_docker_image $k8s_tag
                    ;;
                    *)
                        echo "Start to build server and client image."
                    ;;
                esac
            fi
        ;;
        # run docker container
        run)
        ;;
    esac
else
    echo "Please enter a valid command"
fi

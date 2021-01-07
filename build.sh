#! /bin/bash

# constants

# version
client_version=$(sed -n 5p ./version)
server_version=$(sed -n 2p ./version)

# user info
username="capy0812"

# image base name
client_image_name="pwd-client"
server_image_name="pwd-server"

client_image_full_name="$username/$client_image_name-platform:$client_version"
server_image_full_name="$username/$server_image_name:$server_version"

k8s_tag="production-k8s"
docker_tag="production-docker"

# main command
command=""

# target component should be client, server or db.
target_component=""

# options
k8s_image=false
docker_image=false
docker_network_name=""

# specify which target phase you want to build
build_client_image () {
    if [[ "$1" == "$k8s_tag" ]]; then
        file_path="./docker/client-webapp.k8s.local.dockerfile"
        img_name="${client_image_full_name/platform/k8s}"
    fi
    if [[ "$1" == "$docker_tag" ]]; then
        file_path="./docker/client-webapp.docker.dockerfile"
        img_name="${client_image_full_name/platform/docker}"
    fi
    docker build \
        -f "$file_path" \
        -t "$img_name" \
        --target "$1" \
        ./client-webapp
}

build_server_image () {
    docker build \
        -f docker/server.dockerfile \
        -t "$server_image_full_name" \
        --target $1 \
        ./server
}

# parse command
while [[ $# -gt 0 ]]; do
    case "$1" in
        build)
            command="build"
            shift
        ;;
        run)
            command="run"
            shift
        ;;
        client)
            target_component="client"
            shift
        ;;
        server)
            target_component="server"
            shift
        ;;
        help)
            target_component="help"
            shift
        ;;
        --docker|-D)
            docker_image=true
            shift
        ;;
        --k8s|-k)
            k8s_image=true
            shift
        ;;
        --docker-network|-dn)
            docker_network_name="$2"
            shift
            shift
        ;;
        *)
            echo "not a valid command or option."
        ;;
    esac
done

case "$command" in
    build)
        case "$target_component" in
        client)
            cd client-webapp
            tsc || { "Linter errors exist. Please fix errors before building image" ; cd .. ; exit 1;}
            cd ..
            echo "Linter passed. Proceeding."
            if [[ "$k8s_image" == true ]]; then
                echo "Build client image for k8s."
                build_client_image $k8s_tag
            fi
            if [[ "$docker_image" == true ]]; then
                echo "Build client image for docker."
                build_client_image $docker_tag
            fi
        ;;
        server)
            build_server_image "production-k8s"
        ;;
        help)
            echo "build command uses docker engine to build the target component with the version tag given in the version file."
        ;;
        *)
            echo "not a valid component."
        ;;
        esac
    ;;
    run)
        if [[ -z "$docker_network_name" ]];then
            echo "Please specify the docker network name you want to attach to."
            exit 1
        fi

        case "$target_component" in
            client)
                docker run \
                    -d \
                    "$client_image_full_name"
            ;;
            server)
                docker run \
                -d \
                --network="$docker_network_name" \
                -p 8081:8080 \
                "$server_image_full_name"
            ;;
            *)
                echo "$target_component is not a valid component."
            ;;
        esac
    ;;
    *)
        "$command is not a valid command."
    ;;
esac

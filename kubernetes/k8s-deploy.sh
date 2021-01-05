
command=""
target=""

# option
config_map=false
secret_map=false

while [[ $# -gt 0]]; do
    case "$1" in
        create)
            command="create"
            shift
        ;;
        delete)
            command="delete"
            shift
        ;;
        client)
            target="client"
            shift
        server)
            target="server"
            shift
        --configmap|-cm)
            config_map=true
        ;;
        --secretmap|-sm)
            secret_map=true
        ;;
        *)
            echo "$1 is not a valid command."
            exit 1
        ;;
    esac
done

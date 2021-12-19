# Método 1. GoShimmer con Docker.
> Los desarrolladores de GoShimmer mantienen la imagen Docker de GoShimmer en DockerHub.

[GoShimmer Docker Image](https://hub.docker.com/r/iotaledger/goshimmer).

## Instalación Docker

En este método de instalación se usará un contenedor de Docker del nodo Hornet por lo que es necesario tener instalado Docker en el VPS o Raspberry.

En la consola linux ejecutamos:

```sh
curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh
```
Una vez terminada la instalación en la consola añadimos un grupo docker y añadimos al usuario en uso al grupo docker.
Esto es necesario hacerlo para poder usar docker con el usuario conectado a la consola sin necesidad de usar sudo.

```sh
sudo groupadd docker
sudo usermod -aG docker $USER
```

Cerrar la consola e iniciar una nueva sesión con el mismo usuario que se añadió al grupo docker.

En este momento podemos comprobar el correcto funcionamiento llamando a un contenedor de prueba Docker.

```sh
docker run hello-world
```

[Docker postinstall](https://docs.docker.com/engine/install/linux-postinstall/)

## Instalación DockerCompose

Para la ejecución del nodo Hornet utilizaremos dockercompose ya que tiene la ventaja de centralizar la configuración en un único fichero yaml.

```sh
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
docker-compose --version
```

## Configuración de puertos

En caso que no este instalado el cortafuegos lo instalaremos con ufw y habilitaremos el puerto 22 ssh:

- el puerto 22 que nos da acceso a la gestión del servidor.

```sh
sudo apt install ufw -y
sudo ufw allow 22
sudo ufw enable
```

Una vez que el servidor está instalado es necesario hacerlo visible a la red para esto abrimos:

- 14626	Autopeering	UDP
- 14666	Gossip	TCP
- 8080	HTTP API	TCP/HTTP
- 8081	Dashboard	TCP/HTTP
- 6061	pprof HTTP API	TCP/HTTP

```sh
sudo ufw allow 14626/udp
sudo ufw allow 14666/tcp
sudo ufw allow 8080/tcp
sudo ufw allow 8081/tcp
sudo ufw allow 6061/tcp
sudo ufw reload
```

## El fichero docker-compose.yaml

Creamos el directorio donde se encontraran la base de datos y el fichero de configuración de docker-compose.

```sh
sudo mkdir -p /opt/goshimmer && cd /opt/goshimmer
sudo mkdir db && sudo chmod 0777 db
sudo chown $USER:$USER /opt/goshimmer -R
```

```sh

cat << EOF >  /opt/goshimmer/docker-compose.yaml
version: '3.3'

networks:
  outside:
    external:
      name: shimmer

services:
  goshimmer:
    image: iotaledger/goshimmer:latest
    container_name: goshimmer
    hostname: goshimmer
    stop_grace_period: 2m
    volumes:
      - "./db:/tmp/mainnetdb:rw"
      - "./peerdb:/tmp/peerdb:rw"
      - "/etc/localtime:/etc/localtime:ro"
    ports:
      # Autopeering
      - "0.0.0.0:14626:14626/udp"
      # Gossip
      - "0.0.0.0:14666:14666/tcp"
      # HTTP API
      - "0.0.0.0:8080:8080/tcp"
      # Dashboard
      - "0.0.0.0:8081:8081/tcp"
      # pprof profiling
      - "0.0.0.0:6061:6061/tcp"
      # xteam
      - "0.0.0.0:5000:5000/tcp"

    environment:
      - ANALYSIS_CLIENT_SERVERADDRESS=analysisentry-01.devnet.shimmer.iota.cafe:21888
      - AUTOPEERING_BINDADDRESS=0.0.0.0:14626
      - DASHBOARD_BINDADDRESS=0.0.0.0:8081
      - GOSSIP_BINDADDRESS=0.0.0.0:14666
      - WEBAPI_BINDADDRESS=0.0.0.0:8080
      - PROFILING_BINDADDRESS=0.0.0.0:6061
      - NETWORKDELAY_ORIGINPUBLICKEY=9DB3j9cWYSuEEtkvanrzqkzCQMdH1FGv3TawJdVbDxkd
      - PROMETHEUS_BINDADDRESS=0.0.0.0:9311
    command: >
      --skip-config=true
      --autoPeering.entryNodes=2PV5487xMw5rasGBXXWeqSi4hLz7r19YBt8Y1TGAsQbj@analysisentry-01.devnet.shimmer.iota.cafe:15626,5EDH4uY78EA6wrBkHHAVBWBMDt7EcksRq6pjzipoW15B@entry-0.devnet.tanglebay.com:14646,CAB87iQZR6BjBrCgEBupQJ4gpEBgvGKKv3uuGVRBKb4n@entry-1.devnet.tanglebay.com:14646
      --node.disablePlugins=portcheck
      --node.enablePlugins=remotelog,networkdelay,spammer,prometheus,txstream
      --database.directory=/tmp/mainnetdb
      --node.peerDBDirectory=/tmp/peerdb
      --logger.level=info
      --logger.disableEvents=false
      --logger.remotelog.serverAddress=metrics-01.devnet.shimmer.iota.cafe:5213
      --drng.pollen.instanceID=1
      --drng.pollen.threshold=3
      --drng.pollen.committeeMembers=AheLpbhRs1XZsRF8t8VBwuyQh9mqPHXQvthV5rsHytDG,FZ28bSTidszUBn8TTCAT9X1nVMwFNnoYBmZ1xfafez2z,GT3UxryW4rA9RN9ojnMGmZgE2wP7psagQxgVdA4B9L1P,4pB5boPvvk2o5MbMySDhqsmC2CtUdXyotPPEpb7YQPD7,64wCsTZpmKjRVHtBKXiFojw7uw3GszumfvC4kHdWsHga
      --drng.xTeam.instanceID=1339
      --drng.xTeam.threshold=4
      --drng.xTeam.committeeMembers=GUdTwLDb6t6vZ7X5XzEnjFNDEVPteU7tVQ9nzKLfPjdo,68vNzBFE9HpmWLb2x4599AUUQNuimuhwn3XahTZZYUHt,Dc9n3JxYecaX3gpxVnWb4jS3KVz1K1SgSK1KpV1dzqT1,75g6r4tqGZhrgpDYZyZxVje1Qo54ezFYkCw94ELTLhPs,CN1XLXLHT9hv7fy3qNhpgNMD6uoHFkHtaNNKyNVCKybf,7SmttyqrKMkLo5NPYaiFoHs8LE6s7oCoWCQaZhui8m16,CypSmrHpTe3WQmCw54KP91F5gTmrQEL7EmTX38YStFXx
    networks:
      - outside
EOF
```

## GoShimmer network Bridge

Dentro del entorno docker creamos la red shimmer, esto es útil al permitir que varios contenedores puedan usar la red para comunicarse entre si.
Mas adelante contenedores Wasp con el nodo GoShimmer

```sh
docker network create --driver=bridge shimmer
```

## Ejecutar el nodo Goshimmer

Dentro de la carpeta /opt/goshimmer ejecutaremos en la consola.
Esto ejecutará en segundo plano el nodo GoShimmer.

```sh
docker-compose up -d
```

## Operaciones con el nodo

- Id del contenedor.
- Log del nodo.
- Parar el nodo.
- Arrancar el nodo.

```sh
docker ps -q #devuelve el id del contenedor
docker logs -f IdContenedor
docker-compose stop
docker-compose up -d
```

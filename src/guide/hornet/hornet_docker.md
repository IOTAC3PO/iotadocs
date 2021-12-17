# Método 2. Hornet con Docker
> Los desarrolladores de Hornet mantienen la imagen Docker de Hornet en DockerHub.

[Hornet Docker Image](https://hub.docker.com/r/gohornet/hornet).

## Instalación Docker

En este metodo de instalación se usará un contenedor de Docker del nodo Hornet por lo que es necesario tener instalado Docker en el VPS o Raspberry.

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

Cerrar la consola e iniciar una nueva sesión con el mismo usuario que se añadio al grupo docker.

En este momento podemos comprobar el correcto funcionamiento llamando a un contenedor de prueba Docker.

```sh
docker run hello-world
```

[Docker postinstall](https://docs.docker.com/engine/install/linux-postinstall/)

## Instalación DockerCompose

Para la ejecución del nodo Hornet utilizaremos dockercompose ya que tiene la ventaja de centralizar la configuración en un único fichero yaml.

```sh
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compos
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
docker-compose --version
```

## Clonado del repositorio Hornet

El nodo Hornet necesitar de ficheros de recursos para poder ejecutarse en este momento clonamos el repositorio hornet en local para tener acceso a ellos.

```sh
git clone https://github.com/gohornet/hornet && cd hornet && git checkout mainnet
```

La imagen Docker se ejecuta bajo el usuario con id 65532 y el grupo id 65532. Para asegurarse de que no hay problemas de permisos tendrá que crear los directorio de mainnetdb snapshots y p2pstore bajo el usuario 65532.

```sh
sudo mkdir mainnetdb && sudo chown 65532:65532 mainnetdb
sudo mkdir -p snapshots/mainnet && sudo chown -R 65532:65532 snapshots
sudo mkdir p2pstore && sudo chown 65532:65532 p2pstore
```

## Configuración de puertos

En la version de docker al igual que en la versión apt es necesario modificar el fichero config.json para adecuar los puertos a nuestro ámbito de ejecución.

[Hornet config.json](http://localhost:8080/guide/hornet/hornet_apt.html#despues-de-instalar)


## El fichero docker-compose.yaml

En este fichero pondremos la configuración necesaria para ejecutar el nodo Hornet.

```yaml
version: '3'
services:
  hornet:
    container_name: hornet
    image: gohornet/hornet:latest
    ulimits:
      nofile:
        soft: 8192
        hard: 8192
    restart: always
    ports:
      - "15600:15600/tcp"
      - "14626:14626/udp"
      - "14265:14265/tcp"
      - "8081:8081/tcp"
      - "8091:8091/tcp"
      - "1883:1883/tcp"
    cap_drop:
      - ALL
    volumes:
      - ./config.json:/app/config.json:ro
      - ./peering.json:/app/peering.json
      - ./profiles.json:/app/profiles.json:ro
      - ./mainnetdb:/app/mainnetdb
      - ./p2pstore:/app/p2pstore
      - ./snapshots/mainnet:/app/snapshots/mainnet

```

## Generar usuario y password

Por defecto el nodo viene sin usuario/password y es necesario crear uno para poder administrar el nodo desde el dashboard. Para esto realizamos lo siguiente:

```sh
docker exec -it hornet /app/hornet tool pwd-hash
```

Al ejecutar nos pide un password y devuelve los valores hash y salt:

```sh
Enter a password:
Re-enter your password:

Success!
Your hash: 72321e2bc77e2deac3ac2a9318501910996e15c5b063d110dd934f204cf72ac0
Your salt: 99dcf699a8cfe080e4542bcc9cc74e6eb97f151116a89a424895e131b6fa8ef0
```

Estos valores hay que ponerlos en el fichero config.json:

```sh
sudo sed -i 's/"passwordHash": "0000000000000000000000000000000000000000000000000000000000000000"/"passwordHash": "72321e2bc77e2deac3ac2a9318501910996e15c5b063d110dd934f204cf72ac0"/g' config.json
sudo sed -i 's/"passwordSalt": "0000000000000000000000000000000000000000000000000000000000000000"/"passwordSalt": "99dcf699a8cfe080e4542bcc9cc74e6eb97f151116a89a424895e131b6fa8ef0"/g' config.json
```

## config.json

En este momento hay que reemplazar el los valores anteriores por 0.0.0.0
Adicionalmente hay que activar el plugin Autopeering para encontar vecinos.

```sh

sudo sed -i 's/localhost:8081/0.0.0.0:8081/g' config.json
sudo sed -i 's/127.0.0.0:8081/0.0.0.0:8081/g' config.json
sudo sed -i 's/"Spammer"/"Spammer","Autopeering"/g' config.json

```

## Ejecutar el nodo

Solo tendremos que llamar a docker-compose desde el mismi directorio donde se clono el repositorio Hornet.
Esto nos deja corriendo el conenedor en segundo plano.

```sh
docker-compose up -d
```
devuelve info de contenedor, en este caso buscamos el id del contenedor

```sh
docker ps
```

Aquí vemos el log de hornet con el id del contenedor

```sh
docker logs -f IDContenedor
```

Aquí paramos el contenedor hornet

```sh
docker-compose stop
```

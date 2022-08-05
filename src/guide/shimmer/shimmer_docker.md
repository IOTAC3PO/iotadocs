# Método 1. Shimmer con Docker
> La instalación del nodo Shimmer se realiza con imágenes Docker:
> - Nodo Hornet
> - Proxy Traefik
> - Prometheus y Grafana
> - Módulos INX

La opción más recomendable de instalación del nodo Shimmer es con Docker ya que nos proporciona de una forma sencilla la instalación de todas las herramientas.

## Instalación Docker

Antes de continuar tenemos que instalar Docker en nuestro VPS. Hay diferentes formas de realizarlo pero la mas sencilla es utilizar el script sh que proporciona Docker.

Entrando en la consola linux como admin:

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

## Instalación DockerCompose

Para la ejecución del nodo Shimmer utilizaremos dockercompose ya que tiene la ventaja de centralizar la configuración en un único fichero yaml.

```sh
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
docker-compose --version
```

## Clonado del repositorio Shimmer

El nodo Shimmer necesita de ficheros de recursos para poder ejecutarse, en este momento clonamos el repositorio Shimmer en local para tener acceso a ellos.

```sh

mkdir -p /opt/shimmerbeta
cd /opt/shimmerbeta
wget -c https://github.com/iotaledger/hornet/releases/download/v2.0.0-beta.3/HORNET-2.0.0-beta.3-docker.tar.gz
tar -xzf HORNET-2.0.0-beta.3-docker.tar.gz
rm HORNET-2.0.0-beta.3-docker.tar.gz

```

## Configuración de puertos

En este momento abriremos los puertos necesarios en nuestro VPS para permitir la comunicación del nodo con el exterior.

Para esto ejecutamos en la consola de linux:

```sh

apt install ufw -y
ufw default allow outgoing
ufw default deny incoming
ufw allow ssh
ufw allow 80
ufw allow 443
ufw allow 14626/udp
ufw allow 15600/tcp
yes | ufw enable

```

## Generar usuario y password

Para generar el password que utilizaremos en el login del dashboard del nodo ejecutaremos la utilidad que proporciona Hornet para tal fin, por lo que primero obtenemos las imagenes del nodo con todas las utilidades out of the box.

Descargamos las imágenes de los contenedores Docker del nodo.

Para esto ejecutamos en la terminal:

```sh 

cd /opt/shimmerbeta
docker-compose pull

```

Después de descargar las imagenes y antes de crear usuario / password, creamos un fichero de entorno donde guardaremos los siguientes datos:
- Host
- Email
- Dashboard user
- Password
- Password Salt

Adicionalmente realizamos las consultas de los datos necesarios para informar el fichero de entorno.

Primero, consultamos la url ùnica que tiene nuestro nodo:

```sh

dig -x node-ip

donde 'node-ip' es nuestra ip del VPS

dig -x 103.124.46.78

Nos devuelve 'static.103.124.46.78.clients.your-server.de'

```

Segundo, generamos el password para nuestro Dashboard del nodo.

Para esto ejecutamos en la terminal:

```sh

docker-compose run --rm hornet tool pwd-hash --json --password "YOURPASSWORDGOESHERE" | sed -e 's/\r//g'

Donde 'YOURPASSWORDGOESHERE' corresponde a nuestra password

y nos devuelve 
{
"passwordHash": "050b72362975522a15a8b769c97a581ac454cf770cbf38a7736a632ebdce4f96",
"passwordSalt": "15181e146d24e35ecb35482f163f15d551a4c6cba9b8a87e62399e9df9390208"
}
```

Por último con estos datos sustituimos los valores del siguiente script:
- YOURHOSTNAME por static.103.124.46.78.clients.your-server.de que nos devolvió el comando DIG
- YOUREMAIL por tu email.- miemail@gmail.com (u otro de vuestra conveniencia)
- YOURDASHBOARDUSERNAME por admin (u otro de vuestra conveniencia)
- YOURDASHBOARDPASSWORDHASH por el valor de passwordHash
- YOURDASHBOARDPASSWORD por el valor de passwordSalt

En este momento generamos el fichero de entorno ejecutando en la terminal:

```sh

touch .env
echo "HORNET_HOST=YOURHOSTNAME" >> .env
echo "ACME_EMAIL=YOUREMAIL" >> .env
echo "DASHBOARD_USERNAME=YOURDASHBOARDUSERNAME" >> .env
echo "DASHBOARD_PASSWORD=YOURDASHBOARDPASSWORDHASH" >> .env
echo "DASHBOARD_SALT=YOURDASHBOARDPASSWORD" >> .env

```

Una vez ejecutado el script comprobamos que el fichero de entorno .env contiene los valores deseados.

Para esto ejecutamos en la terminal:

```sh
cd /opt/shimmerbeta
cat .env

Nos devuelve

HORNET_HOST=static.103.124.46.78.clients.your-server.de
ACME_EMAIL=miemail@gmail.com
DASHBOARD_USERNAME=admin
DASHBOARD_PASSWORD=050b72362975522a15a8b769c97a581ac454cf770cbf38a7736a632ebdce4f96
DASHBOARD_SALT=15181e146d24e35ecb35482f163f15d551a4c6cba9b8a87e62399e9df9390208

```

Una vez comprobado le diremos a la instalación del Nodo que use esos valores.

Para esto ejecutamos en la terminal:

```sh

cd /opt/shimmerbeta
./prepare_docker.sh

```

## Ejecutar el nodo

Para posteriormente levantar el nodo:

Solo tendremos que llamar a docker-compose desde el mismo directorio donde se clono el repositorio Shimmer.
Esto nos deja corriendo el contenedor en segundo plano.

```sh

cd /opt/shimmerbeta
docker-compose up -d

```

Aquí vemos el log de Shimmer 

```sh
docker compose logs -f 
```

Aquí paramos el contenedor Shimmer

```sh
docker-compose stop
```

## Grafana

El nodo de Shimmer viene con un monitor de recursos Grafana, para acceder a el dashboard para acceder a el escribimos en la barra del navegador web la dirección Dig
que consultamos anteriormente:

https://static.103.124.46.78.clients.your-server.de/dashboard

Al ser la primera vez que accedemos nos solicita un usuario y password que por defecto es admin/admin .- al introducir el login nos solicita cambiar el password por defecto donde eligiéremos un password a nuestra conveniencia.

Una vez dentro del panel de administración tendremos que añadir un panel para monitorear nuestro nodo Shimmer usando el siguiente Json de configuración:

[Grafana Json node dashing](https://github.com/Dr-Electron/hornet/blob/feat/grafana-dashboard/docker-example/assets/grafana/dashboards/node_dashboard.json)

# Método 1. Repositorio apt de Hornet

> Los desarrolladores de Hornet mantienen el repositorio apt de Hornet.

> Los scripts que se indican en esta página se pueden descargar desde:
> [Script de instalación](https://github.com/IOTAC3PO/scriptsnodes/blob/main/install_hornet_ppa.sh)
> sh install_hornet.sh MIPASSWORD
> Esto instalará el nodo Hornet y como usuario del Dashboard admin y MIPASSWORD

## Antes de comenzar

Antes de iniciar la Instalación por el método APT tendremos que revisar los requerimientos de software/hardware y tener el sistema operativo actualizado.

Para esto ejecutamos en la consola:

```sh
sudo apt update -y && sudo apt upgrade -y
```

## Instala Hornet como un servicio systemd.

Ejecutando las cuatro sentencias indicadas en el cuadro sh se realizan las siguientes tareas:

- Importa la clave pública que se utiliza para firmar la liberación del software.
- Añada el repositorio de Hornet APT a sus fuentes de APT.
- Actualiza las listas de paquetes apt e instala Hornet.
- Habilita el servicio systemd, esto implica que al reiniciar el servidor el nodo se ejecutará automáticamente, sin nuestra intervención.

```sh
wget -qO - https://ppa.hornet.zone/pubkey.txt | sudo apt-key add -

sudo sh -c 'echo "deb http://ppa.hornet.zone stable main" >> /etc/apt/sources.list.d/hornet.list'

sudo apt update -y && sudo apt install hornet

sudo systemctl enable hornet.service
```

## Después de instalar

En este momento hay que configurar el nodo para poder sincronizar la base de datos con otros vecinos.

### config.json

Habitualmente el fichero de configuración se encuentra en esta ubicación
> /var/lib/hornet/config.json

Al realizar _cat_ vemos el contenido del fichero donde podemos ver que en el por defecto hat varias referencias a localhost o 127.0.0.1

```sh
cat /var/lib/hornet/config.json
```

En este momento hay que reemplazar el los valores anteriores por 0.0.0.0
Adicionalmente hay que activar el plugin Autopeering para encontrar vecinos.

```sh

sudo sed -i 's/localhost:8081/0.0.0.0:8081/g' /var/lib/hornet/config.json
sudo sed -i 's/127.0.0.0:8081/0.0.0.0:8081/g' /var/lib/hornet/config.json
sudo sed -i 's/"Spammer"/"Spammer","Autopeering"/g' /var/lib/hornet/config.json

```

## Operaciones con el servidor

En caso que no este instalado el cortafuegos lo instalaremos con ufw y habilitaremos el puerto 22 ssh:

- el puerto 22 que nos da acceso a la gestión del servidor.

```sh
sudo apt install ufw -y
sudo ufw allow 22
sudo ufw enable
```

Una vez que el servidor está instalado es necesario hacerlo visible a la red para esto abrimos:

- el puerto 8081 que no muestra el dashboard del nodo.
- el puerto 15600 que habilita el protocolo goship.
- el puerto 14626 que habilita la comunicación con otros nodos de la red .

```sh
sudo ufw allow 8081/tcp
sudo ufw allow 15600/tcp
sudo ufw allow 14626/udp
sudo ufw reload
```

## Operaciones con el nodo

Estas son las acciones de gestión del nodo:

- __parar nodo__
- __arrancar nodo__
- __reiniciar nodo__
- __estado del nodo__
- __logs del nodo__

```sh
sudo systemctl stop hornet
sudo systemctl start hornet
sudo systemctl restart hornet
sudo systemctl status hornet
sudo journalctl -fu hornet
```

Hay ocasiones en el que la base de datos se corrompe y el nodo no arranca correctamente en ese caso hay que borrar la base de datos.

```sh
sudo rm -fr /var/lib/hornet/mainnetdb
sudo rm -fr /var/lib/hornet/snapshots
```

## Generar usuario y password

Por defecto el nodo viene sin usuario/password y es necesario crear uno para poder administrar el nodo desde el dashboard. Para esto realizamos lo siguiente:

```sh

hornet tools pwd-hash

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
sudo sed -i 's/"passwordHash": "0000000000000000000000000000000000000000000000000000000000000000"/"passwordHash": "72321e2bc77e2deac3ac2a9318501910996e15c5b063d110dd934f204cf72ac0"/g' /var/lib/hornet/config.json
sudo sed -i 's/"passwordSalt": "0000000000000000000000000000000000000000000000000000000000000000"/"passwordSalt": "99dcf699a8cfe080e4542bcc9cc74e6eb97f151116a89a424895e131b6fa8ef0"/g' /var/lib/hornet/config.json
```
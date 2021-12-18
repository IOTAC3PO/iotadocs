# Método 3. Hornet nativo
> Los desarrolladores de Hornet mantienen el repositorio github de versiones de Hornet.

Para realizar la instalación en modo nativo descargamos la versión apropiada para el sistema operativo, en nuestro caso usamos el siguiente enlace ya que es la ultima ves ion liberada del nodo.

En la terminal escribimos:

```sh
sudo mkdir -p /opt/hornet && cd /opt/hornet
sudo chown $USER:$USER /opt/hornet
wget https://github.com/iotaledger/hornet/releases/download/v1.0.5/HORNET-1.0.5_Linux_x86_64.tar.gz
tar -xvf HORNET-1.0.5_Linux_x86_64.tar.gz
cd HORNET-1.0.5_Linux_x86_64
```

Como en los métodos anteriores es necesario realizar cambios en el fichero config.json y abrir puertos del router.


## Después de instalar

En este momento hay que configurar el nodo para poder sincronizar la base de datos con otros vecinos.

### config.json

El fichero de configuración se encuentra en esta ubicación
> /opt/hornet/HORNET-1.0.5_Linux_x86_64/config.json

Al realizar _cat_ vemos el contenido del fichero donde podemos ver que en el por defecto hat varias referencias a localhost o 127.0.0.1

```sh
cat /opt/hornet/HORNET-1.0.5_Linux_x86_64/config.json
```

En este momento hay que reemplazar el los valores anteriores por 0.0.0.0
Adicionalmente hay que activar el plugin Autopeering para encontrar vecinos.

```sh

sudo sed -i 's/localhost:8081/0.0.0.0:8081/g' /opt/hornet/HORNET-1.0.5_Linux_x86_64/config.json
sudo sed -i 's/127.0.0.0:8081/0.0.0.0:8081/g' /opt/hornet/HORNET-1.0.5_Linux_x86_64/config.json
sudo sed -i 's/"Spammer"/"Spammer","Autopeering"/g' /opt/hornet/HORNET-1.0.5_Linux_x86_64/config.json

```

## Operaciones con el servidor

En caso que no este instalado el cortafuego lo instalaremos con y habilitaremos el puerto 22 ssh:

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
## Creación del servicio de sistema

Esta operación es necesaria para realizar tareas del nodo.
Añade un servicio hornet al inicio del sistema operativo, de esta forma inicia de forma automática el nodo.
Es necesario usar __sudo su__ ya que el usuario de opreración(conexión a la consola) no es administrador, realizamos la operación __cat__ y finalmente __exit__ para volver al usuario de operaciones.

```sh
sudo su

cat << EOF > /lib/systemd/system/hornet-mainnet.service
[Unit]
Description=Hornet Mainnet
After=network-online.target

[Service]
WorkingDirectory=/opt/hornet/HORNET-1.0.5_Linux_x86_64
ExecStart=/opt/hornet/HORNET-1.0.5_Linux_x86_64/hornet -c config.json
ExecReload=/bin/kill -HUP $MAINPID
TimeoutSec=infinity
KillMode=process
Restart=on-failure
RestartSec=100
Type=simple
User=root
Group=root
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=hornet-mainnet

[Install]
WantedBy=multi-user.target
EOF

exit
```

Habilitamos el servicio __hornet-mainnet.service__,  arrancamos el nodo y por último vemos el log del nodo con journalctl.

```sh
sudo systemctl enable hornet-mainnet.service
sudo systemctl start hornet-mainnet && journalctl -u hornet-mainnet -f

```

## Operaciones con el nodo

Estas son las acciones de gestión del nodo:

- __parar nodo__
- __arrancar nodo__
- __reiniciar nodo__
- __estado del nodo__
- __logs del nodo__

```sh
sudo systemctl stop hornet-mainnet
sudo systemctl start hornet-mainnet
sudo systemctl restart hornet-mainnet
sudo systemctl status hornet-mainnet
sudo journalctl -fu hornet-mainnet
```

Hay ocasiones en el que la base de datos se corrompe y el nodo no arranca correctamente en ese caso hay que borrar la base de datos.

```sh
sudo rm -fr /opt/hornet/HORNET-1.0.5_Linux_x86_64/mainnetdb
sudo rm -fr /opt/hornet/HORNET-1.0.5_Linux_x86_64/snapshots
```

## Generar usuario y password

Por defecto el nodo viene sin usuario/password y es necesario crear uno para poder administrar el nodo desde el dashboard. Para esto realizamos lo siguiente:

```sh
./hornet tools pwd-hash
```

Al ejecutar nos pide un password y devuelve los valores hash y salt:

```sh
No config file found via 'config.json'. Loading default settings.No peering config file found via 'peering.json'. Loading default settings.No profiles config file found via 'profiles.json'. Loading default settings.Enter a password:
Re-enter your password:

Success!
Your hash: 72321e2bc77e2deac3ac2a9318501910996e15c5b063d110dd934f204cf72ac0
Your salt: 99dcf699a8cfe080e4542bcc9cc74e6eb97f151116a89a424895e131b6fa8ef0
```

Estos valores hay que ponerlos en el fichero config.json:

```sh
sudo sed -i 's/"passwordHash": "0000000000000000000000000000000000000000000000000000000000000000"/"passwordHash": "72321e2bc77e2deac3ac2a9318501910996e15c5b063d110dd934f204cf72ac0"/g' /opt/hornet/HORNET-1.0.5_Linux_x86_64/config.json
sudo sed -i 's/"passwordSalt": "0000000000000000000000000000000000000000000000000000000000000000"/"passwordSalt": "99dcf699a8cfe080e4542bcc9cc74e6eb97f151116a89a424895e131b6fa8ef0"/g' /opt/hornet/HORNET-1.0.5_Linux_x86_64/config.json
```

# Método 1. Bee nativo.

> Los desarrolladores de Bee mantienen el repositorio github de versiones de Bee.


Para realizar la instalación en modo nativo descargamos la versión apropiada para el sistema operativo, en nuestro caso usamos el siguiente enlace ya que es la ultima versión liberada del nodo.

En la terminal escribimos:

```sh
sudo mkdir -p /opt/bee && cd /opt/bee
sudo chown $USER:$USER /opt/bee
wget https://github.com/iotaledger/bee/releases/download/v0.2.1/bee-node-0.2.1-linux-x86-64.zip
unzip bee-node-0.2.1-linux-x86-64.zip
cd bee-node-0.2.1-linux-x86-64
wget https://github.com/iotaledger/bee/releases/download/v0.2.1/config.chrysalis-mainnet.toml
mv config.chrysalis-mainnet.toml config.toml
```

Como en los métodos anteriores es necesario realizar cambios en el fichero config.toml y abrir puertos del router.

## Después de instalar

En este momento hay que configurar el nodo para poder sincronizar la base de datos con otros vecinos.

### config.toml

El fichero de configuración se encuentra en esta ubicación
> /opt/bee/bee-node-0.2.1-linux-x86-64/config.toml

Al realizar _cat_ vemos el contenido del fichero donde podemos ver que en el por defecto hat varias referencias a localhost o 127.0.0.1

```sh
cat /opt/bee/bee-node-0.2.1-linux-x86-64/config.toml
```

En este momento hay que reemplazar el los valores anteriores por 0.0.0.0

```sh
sudo sed -i 's/localhost/0.0.0.0/g' /opt/bee/bee-node-0.2.1-linux-x86-64/config.toml
sudo sed -i 's/127.0.0.0/0.0.0.0/g' /opt/bee/bee-node-0.2.1-linux-x86-64/config.toml
```

## Generar identidad del nodo

En la consola ejecutamos ./bee p2p-identity :

```sh
./bee p2p-identity

Your p2p private key:	6a8d882f6ea266dd28f1b136239b25d7bc294b9c5ca955c94f1822ccbab9e4eacc4b1aacb8051093a3820dd89f23bc3cc97a1e41f0ee07787680b14819c71b7a
Your p2p public key:	cc4b1aacb8051093a3820dd89f23bc3cc97a1e41f0ee07787680b14819c71b7a
Your p2p PeerID:	12D3KooWPZqm8ZwjwwcryDYCVGt2HUE9oM6wpPrUFSxsSSSDbL2d
```
```sh
sudo sed -i 's/identity   = ""/identity   = "6a8d882f6ea266dd28f1b136239b25d7bc294b9c5ca955c94f1822ccbab9e4eacc4b1aacb8051093a3820dd89f23bc3cc97a1e41f0ee07787680b14819c71b7a"/g' /opt/bee/bee-node-0.2.1-linux-x86-64/config.toml
```

## Emparejamiento del nodo

Actualmente Bee no tiene Autopeering por lo que hay que buscar vecinos para nuestro nodo.
Afortunadamente hay compatibilidad entre nodos Hornet y Bee por lo que si tenemos un nodo Hornet funcionando con Autopeering podremos conectar el nodo Bee a Hornet.

En la consola ejecutamos:

```sh

sudo sed -i 's/#\[\[network.peering.peers]]/\[\[network.peering.peers]]/g' /opt/bee/bee-node-0.2.1-linux-x86-64/config.toml
sudo sed -i 's/#address  = ""/address  = "\/ip4\/192.168.1.141\/tcp\/15600\/p2p\/12D3KooWACveX5FfMTEyFzbdLphodJgwvkVK9wTTkaHYzTfaeSbw"/g' /opt/bee/bee-node-0.2.1-linux-x86-64/config.toml
sudo sed -i 's/#alias    = ""/alias    = "RPI4"/g' /opt/bee/bee-node-0.2.1-linux-x86-64/config.toml

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

```sh
sudo ufw allow 8081/tcp
sudo ufw allow 15600/tcp
sudo ufw reload
```
## Creación del servicio de sistema

Esta operación es necesaria para realizar tareas del nodo.
Añade un servicio bee al inicio del sistema operativo, de esta forma inicia de forma automática el nodo.
Es necesario usar __sudo su__ ya que el usuario de opreración(conexión a la consola) no es administrador, realizamos la operación __cat__ y finalmente __exit__ para volver al usuario de operaciones.

```sh
sudo su

cat << EOF > /lib/systemd/system/bee-mainnet.service
[Unit]
Description=Bee Mainnet
After=network-online.target

[Service]
WorkingDirectory=/opt/bee/bee-node-0.2.1-linux-x86-64
ExecStart=/opt/bee/bee-node-0.2.1-linux-x86-64/bee -c config.toml
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
SyslogIdentifier=bee-mainnet

[Install]
WantedBy=multi-user.target
EOF

exit
```

Habilitamos el servicio __bee-mainnet.service__,  arrancamos el nodo y por último vemos el log del nodo con journalctl.

```sh
sudo systemctl enable bee-mainnet.service
sudo systemctl start bee-mainnet && journalctl -u bee-mainnet -f

```

## Operaciones con el nodo

Estas son las acciones de gestión del nodo:

- __parar nodo__
- __arrancar nodo__
- __reiniciar nodo__
- __estado del nodo__
- __logs del nodo__

```sh
sudo systemctl stop bee-mainnet
sudo systemctl start bee-mainnet
sudo systemctl restart bee-mainnet
sudo systemctl status bee-mainnet
sudo journalctl -fu bee-mainnet
```

Hay ocasiones en el que la base de datos se corrompe y el nodo no arranca correctamente en ese caso hay que borrar la base de datos.

```sh
sudo rm -fr /opt/bee/bee-node-0.2.1-linux-x86-64/storage
sudo rm -fr /opt/bee/bee-node-0.2.1-linux-x86-64/snapshots
```

## Generar usuario y password

```sh
./bee password
Password:
Re-enter password:
Password salt: 7f54bf55af3a0023f29d785ea61d75e43cd393353719af7a7af3fd2d11b106f0
Password hash: e01f66da66f572ff1b07765308f3395d8311dd67a4fdf54d6e69b85f1bae337b
```

Estos valores hay que ponerlos en el fichero config.toml:

```sh
sudo sed -i 's/password_salt   = "0000000000000000000000000000000000000000000000000000000000000000"/password_salt   = "7f54bf55af3a0023f29d785ea61d75e43cd393353719af7a7af3fd2d11b106f0"/g' config.toml
sudo sed -i 's/password_hash   = "0000000000000000000000000000000000000000000000000000000000000000"/password_hash   = "e01f66da66f572ff1b07765308f3395d8311dd67a4fdf54d6e69b85f1bae337b"/g' config.toml
```

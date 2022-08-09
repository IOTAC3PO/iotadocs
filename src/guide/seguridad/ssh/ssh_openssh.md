# Intalación de OpenSSH

> Los nodos Iota están instalados en servidores, comunmente en servidores Linux, mantener la seguridad en nuestros servidores lo es todo, ya que sin nuestro nodo no podemos ser autosuficientes, sin contar otros problemas derivados, saber nuestros saldos o que un atacante pueda alterar nuestras transacciones si estas hacen la prueba de trabajo en en el nodo o usar nuestro nodo para otras operaciones no destinadas a la finalidad del nodo. 

> __Un servidor VPS de Hetzner ya viene instalado el servicio Ssh, ya que de otro modo no podriamos comunicarnos con el. Por tanto los primeros pasos de esta guia están enfocados a los casos en los que tenemos una máquina local dentro de nuestro CPD o nuestro domicilio con una máquina virtual o una raspberry o un pc.__

## Instalando OpenSSH 

> Este es un proceso local.- estamos usando la máquina de forma presencial en tu CPD, raspberry, pc o máquina virtual.

Ssh es el método de comunicación para la administracion y gestión de nuestro servidor remoto por lo que si queremos gestionar nuestro servidor debemos instalar el servicio Ssh que viene en el paquete OpenSSH.

Normalmente con el sistema operativo Ubuntu no viene instalado el servicio Ssh por lo que tenemos que instalarlo de la siguiente forma,

En la terminal linux ejecutamos:

```sh

sudo apt update -y && sudo apt upgrade -y
sudo apt install openssh-server -y

```

Ejecutando el siguiente comando en la terminal podremos ver que la instalación de OpenSSH se realizó correctramente.

```sh

sudo systemctl status ssh

● ssh.service - OpenBSD Secure Shell server
     Loaded: loaded (/lib/systemd/system/ssh.service; enabled; vendor preset: e>
     Active: active (running) since Mon 2022-08-08 17:59:09 UTC; 1min 46s ago
       Docs: man:sshd(8)
             man:sshd_config(5)
    Process: 717 ExecStartPre=/usr/sbin/sshd -t (code=exited, status=0/SUCCESS)el
   Main PID: 757 (sshd)
      Tasks: 3 (limit: 3392)
     Memory: 9.0M
     CGroup: /system.slice/ssh.service
             ├─ 757 sshd: /usr/sbin/sshd -D [listener] 2 of 10-100 startups
             ├─ 952 sshd: [accepted]
             └─1215 sshd: [accepted]

ago 08 17:59:08 ubuntu systemd[1]: Starting OpenBSD Secure Shell server...
ago 08 17:59:09 ubuntu sshd[757]: Server listening on 0.0.0.0 port 22.
ago 08 17:59:09 ubuntu sshd[757]: Server listening on :: port 22.
ago 08 17:59:09 ubuntu systemd[1]: Started OpenBSD Secure Shell server.

```


## Instalación Ufw

> Este es un proceso local.- estamos usando la máquina de forma presencial en tu CPD, raspberry, pc o máquina virtual.

Ufw es el cortafuegos de facto de los sistemas Ubuntu, nos sirve para proteger nuestro servidor de entradas no deseadas a nuestro sistema, por lo que es una pieza fundamental para protergernos.

Normalmente con el sistema operativo Ubuntu no viene instalado el servicio Ufw por lo que tenemos que instalarlo de la siguiente forma.

En la terminal linux ejecutamos:

```sh

sudo apt update -y && sudo apt upgrade -y
sudo apt install ufw -y

```

Una vez instalado comprobamos que está funcionando correctamente.

Para esto ejecutamos en la terminal:

```sh

sudo systemctl status ufw

y como respuesta debemos ver:

● ufw.service - Uncomplicated firewall
     Loaded: loaded (/lib/systemd/system/ufw.service; enabled; vendor preset: e>
     Active: active (exited) since Tue 2022-08-09 07:31:20 UTC; 8min ago
       Docs: man:ufw(8)
    Process: 402 ExecStart=/lib/ufw/ufw-init start quiet (code=exited, status=0>
   Main PID: 402 (code=exited, status=0/SUCCESS)

```

## Habilitar el puerto SSH(22)

Una vez instalado el servicio ufw abriremos el puerto 22

Ejecutamos en la terminal linux:

```sh

sudo ufw allow ssh
sudo ufw enable

```

Una vez más comprobamos el estado de nuestro servicio,

Ejecutando en la consola linux:

```sh

sudo ufw status

En el que a continuación podemos ver su estado

Status: active

To                         Action      From
--                         ------      ----
22/tcp                     ALLOW       Anywhere                  
22/tcp (v6)                ALLOW       Anywhere (v6)  

```

## Backup del fichero de configuración del servicio SSH

Una vez preparado nuestro servicio Ssh, instalado el cortafuego ufw y habilitado el puerto 22 debemos hacer una copia seguridad del fichero de configuración del servicio ssh ya que sobre realizaremos modificaciones de configuración y en el caso de que haya algun error de configuración podremos restaurar la copia de seguridad.

Para esto ejecutamos en la consola linux:

```sh

sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak

```

Hecho esto podemos consultar la configuración por defecto del servicio Ssh.

Para esto ejecutamos en la consola linux:

```sh

sudo sshd -T

```

Esto nos devuel una lista de directivas extensa, a modo de ejemplo:

```sh

port 22
addressfamily any
listenaddress [::]:22
listenaddress 0.0.0.0:22
usepam yes
logingracetime 120
x11displayoffset 10
maxauthtries 6
maxsessions 10
clientaliveinterval 0
clientalivecountmax 3
streamlocalbindmask 0177
permitrootlogin without-password
ignorerhosts yes
ignoreuserknownhosts no
hostbasedauthentication no
hostbasedusesnamefrompacketonly no
pubkeyauthentication yes
kerberosauthentication no
kerberosorlocalpasswd yes
kerberosticketcleanup yes
gssapiauthentication no
gssapicleanupcredentials yes
gssapikeyexchange no
gssapistrictacceptorcheck yes
gssapistorecredentialsonrekey no
gssapikexalgorithms gss-gex-sha1-,gss-group14-sha1-
passwordauthentication yes
kbdinteractiveauthentication no
challengeresponseauthentication no
....

```

## Editando el fichero de configuración 

### Restringiendo el acceso al usuario root

En estos momentos podemos iniciar la configuraciones necesarias

```sh

sudo nano /etc/ssh/sshd_config

```

Lo primero que debemos hacer es denegar el acceso por el usuario root al puerto 22 ya que como se puede ver en la salida de consola de abajo alguien esta intentando acceder a nuestro vps como root y aunque es complicado que lo consiga si tenemos una buena password siempre existe esa posibilidad.

```sh

Aug 09 08:16:13 ubuntu-4gb-hel1-1 kernel: [UFW BLOCK] IN=eth0 OUT= MAC=96:00:01:75:10:b4:d2:74:7f:6e:37:e3:08:00 SRC=123.160.221.7 DST=65.108.209.141 LEN=52 TOS=0x00 PREC=0x00 TTL=38 ID=64516 DF PROTO=TCP SPT=21412 DPT=21231 WINDOW=65535 RES=0x00 SYN URGP=0 
Aug 09 08:16:33 ubuntu-4gb-hel1-1 kernel: [UFW BLOCK] IN=eth0 OUT= MAC=96:00:01:75:10:b4:d2:74:7f:6e:37:e3:08:00 SRC=89.248.165.60 DST=65.108.209.141 LEN=40 TOS=0x00 PREC=0x00 TTL=247 ID=1506 PROTO=TCP SPT=51189 DPT=3293 WINDOW=1024 RES=0x00 SYN URGP=0 
Aug 09 08:17:06 ubuntu-4gb-hel1-1 kernel: [UFW BLOCK] IN=eth0 OUT= MAC=96:00:01:75:10:b4:d2:74:7f:6e:37:e3:08:00 SRC=167.248.133.139 DST=65.108.209.141 LEN=44 TOS=0x00 PREC=0x00 TTL=36 ID=53499 PROTO=TCP SPT=15069 DPT=28080 WINDOW=1024 RES=0x00 SYN URGP=0 
Aug 09 08:17:25 ubuntu-4gb-hel1-1 kernel: [UFW BLOCK] IN=eth0 OUT= MAC=96:00:01:75:10:b4:d2:74:7f:6e:37:e3:08:00 SRC=79.124.62.82 DST=65.108.209.141 LEN=40 TOS=0x00 PREC=0x00 TTL=242 ID=36026 PROTO=TCP SPT=48135 DPT=28432 WINDOW=1024 RES=0x00 SYN URGP=0 
Aug 09 08:17:37 ubuntu-4gb-hel1-1 kernel: [UFW BLOCK] IN=eth0 OUT= MAC=96:00:01:75:10:b4:d2:74:7f:6e:37:e3:08:00 SRC=79.124.62.78 DST=65.108.209.141 LEN=40 TOS=0x00 PREC=0x00 TTL=244 ID=54869 PROTO=TCP SPT=48136 DPT=45442 WINDOW=1024 RES=0x00 SYN URGP=0 
^[[1;2BAug 09 08:17:43 ubuntu-4gb-hel1-1 sshd[48244]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=112.133.244.175  user=root
Aug 09 08:17:45 ubuntu-4gb-hel1-1 sshd[48244]: Failed password for root from 112.133.244.175 port 28714 ssh2
Aug 09 08:17:46 ubuntu-4gb-hel1-1 sshd[48244]: Received disconnect from 112.133.244.175 port 28714:11: Bye Bye [preauth]
Aug 09 08:17:46 ubuntu-4gb-hel1-1 sshd[48244]: Disconnected from authenticating user root 112.133.244.175 port 28714 [preauth]

```

Entonces primero hay dos pasos necesarios:

- Crear un usuario de administración distintinto de root.
- Denegar el acceso a root al puerto 22.


Para realizar esto usamos la terminal linux:

```sh

sudo adduser -m pecadordelapradera
usermod -aG sudo pecadordelapradera

```

Una vez añadido el usuario con privilegios sudo abrimos otra terminal y comprabamos que podemos entrar en el servidor con el nuevo usuario.
Una vez dentro editamos el fichero de configuración del servicio ssh y dejamos de permitir el acceso root por ssh de la siguiente forma.

```sh

sudo nano /etc/ssh/sshd_config

y buscamos la directiva PermitRootLogin yes y cambiamos a PermitRootLogin no

Guardamos los cambios y reiniciamos el servicio con:

sudo systemctl restart sshd

```

### Permitiendo el acceso al usuario pecadordelapradera

Como en la ocasión anterior editamos el fichero de configuración y solo permitimos que el usuario pecadordelapradera pueda conectarse a nuestro vps.

Para realizar esto usamos la terminal linux:

```sh

sudo nano /etc/ssh/sshd_config

y buscamos la directiva AllowUsers .- en el caso de no existir añadimos al final del fichero

AllowUsers pecadordelapradera

Guardamos los cambios y reiniciamos el servicio con:

sudo systemctl restart sshd

```

Como resultado obtenemos que se deniegan los intentos de iniciar sesion al usuario root

```sh

Aug 09 09:24:12 ubuntu-4gb-hel1-1 sshd[91849]: User root from 81.91.233.42 not allowed because not listed in AllowUsers
Aug 09 09:24:12 ubuntu-4gb-hel1-1 sshd[91849]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=81.91.233.42  user=root
Aug 09 09:24:14 ubuntu-4gb-hel1-1 sshd[91849]: Failed password for invalid user root from 81.91.233.42 port 36776 ssh2

```

Otro ejemplo de intento de inicio de session no permitido

```

Aug 09 09:27:02 ubuntu-4gb-hel1-1 sshd[93916]: Failed password for invalid user suporte from 65.52.9.242 port 56880 ssh2
Aug 09 09:27:03 ubuntu-4gb-hel1-1 sshd[93916]: Received disconnect from 65.52.9.242 port 56880:11: Bye Bye [preauth]
Aug 09 09:27:03 ubuntu-4gb-hel1-1 sshd[93916]: Disconnected from invalid user suporte 65.52.9.242 port 56880 [preauth]


```

### Limitar el número de intentos de acceso por ssh

Normalmente no necesitamos muchos intentos de login para nuestro vps ya que sabemos como entrar por lo que es muy util retringir el numero de intentos.

Para esto modificamos el fichero de configuración.

Para realizar esto usamos la terminal linux:

```sh

sudo nano /etc/ssh/sshd_config

y buscamos la directiva MaxAuthTries 3 y descomentamos quitando #

MaxAuthTries 3 .- estable el maximo a 3 intentos.

Guardamos los cambios y reiniciamos el servicio con:

sudo systemctl restart sshd

```

Esta es la configuración básica y nos proporciona mucha seguridad, casi mucha seguridad.
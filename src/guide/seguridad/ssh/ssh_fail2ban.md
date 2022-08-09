# Protegiendo nuestro vps con fail2ban

> fail2ban es un servicio para protegernos de los usuarios que intentan acceder de forma masiva a nuestro servidor detectando la concurrencia de intentos de acceso  y baneando la ip desde la que hacen el ataque.

> Definitivamente trata este tipo de accesos anomalos como ataques por que la intención y el resultado es una denegación de servion en nuestro servidor.


## Intalación de fail2ban

Instalar fail2ban es muy sencillo ya que está disponible en la distribución de ubuntu.

Para realizar la instalación ejecutamos en la consola linux:

```sh

sudo apt update -y && sudo apt upgrade -y
sudo apt install fail2ban -y

```

Una vez instalado comprobamos su estado

```sh

sudo systemctl status fail2ban

Nos responde:

● fail2ban.service - Fail2Ban Service
     Loaded: loaded (/lib/systemd/system/fail2ban.service; enabled; vendor preset: enabled)
     Active: active (running) since Tue 2022-08-09 11:26:23 UTC; 1h 21min ago
       Docs: man:fail2ban(1)
   Main PID: 14071 (f2b/server)
      Tasks: 5 (limit: 4556)
     Memory: 12.8M
     CGroup: /system.slice/fail2ban.service
             └─14071 /usr/bin/python3 /usr/bin/fail2ban-server -xf start

Aug 09 11:26:23 ubuntu-4gb-hel1-1 systemd[1]: Starting Fail2Ban Service...
Aug 09 11:26:23 ubuntu-4gb-hel1-1 systemd[1]: Started Fail2Ban Service.
Aug 09 11:26:23 ubuntu-4gb-hel1-1 fail2ban-server[14071]: Server ready


```

## Configuración de fail2ban

La instalación predeterminada de Fail2ban viene con dos archivos de configuración:

- /etc/fail2ban/jail.conf
- /etc/fail2ban/jail.d/defaults-debian.conf. 

No se recomienda modificar estos archivos, ya que pueden sobrescribirse cuando se actualiza el paquete.

Fail2ban lee los archivos de configuración en el siguiente orden. Cada archivo .local anula la configuración del archivo .conf:

- /etc/fail2ban/jail.conf
- /etc/fail2ban/jail.d/*.conf
- /etc/fail2ban/jail.local
- /etc/fail2ban/jail.d/*.local

Para la mayoría de los usuarios, la forma más fácil de configurar Fail2ban es copiar jail.conf a jail.local y modificar el archivo jail.local.

Los usuarios más avanzados pueden crear un archivo .local de configuración desde cero. El archivo .local no tiene que incluir todas las configuraciones del .confarchivo correspondiente, solo aquellas que desea anular.

Cree un archivo .local de configuración a partir del archivo jail.conf predeterminado:

```sh

sudo cp /etc/fail2ban/jail.{conf,local}

```

## Configuración de prohibición

Los valores de bantime, findtimey maxretryopciones definen el tiempo de prohibición y las condiciones de prohibición.

bantime es la duración durante la cual la IP está prohibida. Cuando no se especifica ningún sufijo, el valor predeterminado es segundos. De forma predeterminada, el valor bantime se establece en 10 minutos. En general, la mayoría de los usuarios querrán establecer un tiempo de prohibición más largo. Cambia el valor a tu gusto:

(En el fichero hay dos directivas bantime una comentada con almohadilla y otra sin comentar, hay que usar la que esta sin comentar)

```

bantime  = 1d
findtime  = 10m
maxretry = 5

```

## Cárceles Fail2ban
Fail2ban utiliza un concepto de cárceles. Una cárcel describe un servicio e incluye filtros y acciones. Se cuentan las entradas de registro que coinciden con el patrón de búsqueda y, cuando se cumple una condición predefinida, se ejecutan las acciones correspondientes.

Fail2ban se envía con un número de cárcel para diferentes servicios. También puede crear sus propias configuraciones de cárcel.

De forma predeterminada, la cárcel ssh no está habilitada. Para habilitar una cárcel, debe agregar enabled = true después del título de la cárcel. El siguiente ejemplo muestra cómo habilitar la cárcel ssh:

```
[sshd]
enabled   = true
maxretry  = 3
findtime  = 1d
bantime   = 4w

```

Cada vez que edite un archivo de configuración, debe reiniciar el servicio Fail2ban para que los cambios surtan efecto:

```sh

sudo systemctl restart fail2ban

```
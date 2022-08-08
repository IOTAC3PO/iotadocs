# Instalación de NGINX.

> NGINX es un servidor web y proxy inverso, que realizará las siguientes funciones:
> - Gestionar el certificado SSL
> - Redirigir las peticiones no seguras del puerto 80(Http) a un puerto 443(Https)
> - Redirigir las peticiones de internet a nuestro nodo (Hornet, Bee, GoShimmer, Shimmer).

## Antes de comenzar

Antes de iniciar la instalación debemos tener el sistema operativo actualizado.

Para esto ejecutamos en la consola:

```sh

sudo apt update -y && sudo apt upgrade -y

```

## Instala NGINX.

Debemos tener en cuenta que partimos de una instalación limpia, es decir acabamos de instalar el sistema operativo en el VPS en Hetzner.

Ejecutando este script nos instala Nginx, estable el autoarranque del servicio al iniciar el Sistema Operativo e inicia el servicio en la sesión actual.

Para esto ejecutamos en la consola:

```sh

sudo apt install nginx -y
sudo systemctl enable nginx.service

```

El directorio de instalación se encuentra en /etc/nginx.- posteriormente haremos cambios en ficjeros de configuración dentro de esta carpeta.

## Después de instalar Nginx

En este momento hay que configurar el servidor como proxy inverso.

Para esto ejecutamos en la consola:

```sh

mkdir cache
touch hornet

cat << 'EOF' > hornet
limit_req_zone $binary_remote_addr zone=mylimit:10m rate=5r/s;
proxy_cache_path  /root/cache  levels=1:2    keys_zone=STATIC:10m
inactive=24h  max_size=1g;
server {
    server_name hornet; 
    location / {
        proxy_pass         http://localhost:8081;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection keep-alive;
        proxy_set_header   Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }
    location /ws {
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header Host $host;
      proxy_pass http://localhost:8081/ws;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";
    }
}
EOF

sudo rm /etc/nginx/sites-enabled/default
sudo mv hornet /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/hornet /etc/nginx/sites-enabled/hornet


```

Una vez que tenemos nuestro fichero /etc/nginx/sites-enabled/hornet comprabamos que es correcto ejecutando en la consola:

```sh

sudo nginx -t

Si todo es correcto mostrará el siguiente mensaje:
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful


```

Adicionalmente abrimos el puerto 80 de nuestro servidor y cerramos el puerto 8081, ejecutando:

```sh

sudo nginx -t
sudo ufw allow 80/tcp
sudo ufw reload
sudo systemctl restart nginx

```

En el caso que tengamos corriendo un nodo Hornet en estos momentos podriamos acceder a el por el puerto 80 de nuestro VPS ya que NGINX está actuando de proxy y redirigiendo las peticiones del puerto 80 al puerto 8081 de nuestro servidor localhost. 

Si ejecutaramos en el navegador web **http://ippublicademivps** veriamos nuestro dashboard.

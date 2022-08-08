# Intalación de Let´s Encrypt (Certbot)

> Dado que tener un nodo en propiedad no solo proporciona a la red Iota más seguridad al ofrecer más descentralización de las transacciones, tener un nodo nos brinda la posibilidad de usarlo para no depender de terceros en realizar nuestras transacciones de valor, por lo tanto podemos conectar nuestra billetera FireFly a nuestro nodo teniendo la seguridad de que siempre estará disponible para nosotros y que los datos que manadamos desde FireFly están cifrados de extremo a extremo.


## Instalando Certbot

El primer paso para utilizar Let’s Encrypt para obtener un certificado SSL es instalar el software Certbot en su servidor.

Instalar Certbot y su complemento de Nginx con apt:

```sh

sudo apt install certbot python3-certbot-nginx -y

```

En este momento necesitamos un nombre de dominio para que Certbot pueda ejecutarse correctamente, aquí optamos por la opción barata ya que vamos a utilidar el servidor de dominio de nuestra en el VPS de Hetzner.

Para esto ejecutamos en la terminal:

```sh

'dig -x nuestraippublicadelnodos'

dig -x 141.209.108.33

y nos devuelve 'static.141.209.108.33.clients.your-server.de'

```

Con este dato (**static.141.209.108.33.clients.your-server.de**) lo guardamos para un uso posterior ya que nos lo pedirá en el momento de generar el certificado SSL.

## Habilitar el puerto Https

Durante la instalación de Certbot se comprueba que el puerto 443 esté abierto para recibir peticiones seguras y para ello abrimos el puerto 443.

Ejecutamos en la terminal linux:

```sh

sudo ufw allow 'Nginx Full'

```

## Generar el certificado SSL

En este momento pedimos la generación del certificado e intalacion dentro de NGINX. De nuevo usamos el nombre de dominio de nuestro servidor Hetzner (**static.141.209.108.33.clients.your-server.de**)

Ejecutamos en la terminal linux:

```sh

sudo certbot --nginx -d static.141.209.108.33.clients.your-server.de

```

Si todo es correcto nos preguntará que accion tomar con el servidor NGINX:
- No redireccionar las peticiones http
- Redireccionar las peticiones http a https

Lo ideal es la opción 2.- seleccionamos la opción 2.

```sh

Output
Please choose whether or not to redirect HTTP traffic to HTTPS, removing HTTP access.
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1: No redirect - Make no further changes to the webserver configuration.
2: Redirect - Make all requests redirect to secure HTTPS access. Choose this for
new sites, or if you're confident your site works on HTTPS. You can undo this
change by editing your web server's configuration.
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Select the appropriate number [1-2] then [enter] (press 'c' to cancel):

```

Si todo fue correctamente nos contestará esto en la consola:

```sh

Output
IMPORTANT NOTES:
 - Congratulations! Your certificate and chain have been saved at:
   /etc/letsencrypt/live/static.141.209.108.33.clients.your-server.de/fullchain.pem
   Your key file has been saved at:
   /etc/letsencrypt/live/static.141.209.108.33.clients.your-server.de/privkey.pem
   Your cert will expire on 2020-08-18. To obtain a new or tweaked
   version of this certificate in the future, simply run certbot again
   with the "certonly" option. To non-interactively renew *all* of
   your certificates, run "certbot renew"
 - If you like Certbot, please consider supporting our work by:

   Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
   Donating to EFF:                    https://eff.org/donate-le


```

En este momento podremos acceder a nuestro dashboard del nodo(Hornet) con este formato **https://static.141.209.108.33.clients.your-server.de**.


## Renovación del certificado.

LOs certificados Certbot son validos por 90 días, pasado ese tiempo es necesario ejecutar el proceso de instalación. 
Para evitar esto y que sea un proceso automático ejecutamos en la consola linux.

```sh

sudo systemctl restart certbot.timer
sudo systemctl status certbot.timer

```

Nos devuelve:

```sh

Output
● certbot.timer - Run certbot twice daily
     Loaded: loaded (/lib/systemd/system/certbot.timer; enabled; vendor preset: enabled)
     Active: active (waiting) since Mon 2020-05-04 20:04:36 UTC; 2 weeks 1 days ago
    Trigger: Thu 2020-05-21 05:22:32 UTC; 9h left
   Triggers: ● certbot.service

```

Con esto tendremos ls renovación certificado cada 90 días de forma automatica y sin nuestra intervención.

## Instalación de Certbot para noip.com

Hasta el momento hemos cesitado de un VPS para instalar un nodo el proxy NGINX y el certificado SSL.

Existe la posibilidad de no necesitar un VPS y utilizar una raspberry en nuestra casa y tener un dominio gratuito con noip.com y generar el certificado SSL.

Todos los pasos son iguales con la diferencia que no necesitamos hacer un __'dig -x ip'__ ya que tenemos un dominio con noip.com, logicamente ademas hay que abrir los puertos necesarios incluido el 443 SSL de nuestro router.
# Antes de empezar
> Debemos tener en cuenta la necesidades mínimas para la instalación un certificado SSL para nuestro nodo.
> Esta guía no cubre el ámbito de seguridad del nodo ni del sistema operativo.

## Requerimientos hardware

No existen requerimientos de hardware para la instalación de un certificado SSL.
Sin embargo tenemos los mismos requerimientos de un nodo Hornet, ya que la finalidad es aportar seguridad a nuestro nodo.

Por esto optaremos por tener un nodo en [Heztner](https://www.hetzner.com).

## Requerimientos software

Esta guía está basada en el sistema operativo:
- Linux Ubuntu 20.
- Bien puede correr correctamente en sistemas Ubuntu/Debian.
- El resultado de la instalación puede variar en función del estado del SO o la variación del código fuente y ficheros de configuración NGINX.
- Debe tener instalado un proxy NGINX.
- Un nombre de dominio valido.
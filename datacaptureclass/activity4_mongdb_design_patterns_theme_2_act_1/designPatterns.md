# Ejercicio : Patrones de diseño


## Ejercicio 1: Colección de posts

```javascript
{
  _id: 1001,
  titulo: “Primeros pasos con MongoDB”,
  autor: “Juan”,
  comentarios: [
    {
      autor: “Anónimo”,
      texto: “Interesante post, gracias por los consejos.”
    },
    {
      autor: “Ignacio”,
      texto: “¡Muy buen artículo!.”
    }
  ]
}
```
El anterior es un ejemplo de un patrón de diseño **Uno a Muchos con documentos embebidos**.
Se puede apreciar que todos los datos existen en la misma fuente de datos y dentro de cada documento, hay un arreglo de otros objetos/documentos con sus propios atributos. Además analizando la razón de esta colección, aparentemente de un blog, resulta necesario el tener la información de esta forma para una rápida visualización con un webservice que accediera al artículo N=1001.

## Ejercicio 2:

#### categories collection
```javascript
{
  _id: 101,
  nombre: “Alimentos”,
  parent: null,
},
{
  _id: 102,
  nombre: “Lácteos”,
  parent: 101,
},
{
  _id: 103,
  nombre: “Legumbres”,
  parent: 101
}
```
#### products collection

```javascript
{
  _id: 83982,
  nombre: “Leche”,
  categories: [101, 102]
  }, {
  _id: 83985,
  nombre: “Queso”,
  categories: [101, 102]
  }, {
  _id: 83993,
  nombre: “Lentejas”,
  categories: [101, 103]
}
```
Existen dos patrones de diseño. Por una parte las categorías cuentan con una **Estructura de árbol ccon referencia a nodo padre** muy bien colocada para subclasificar productos y evitar la repetición de información. De esta manera, si la zanahoria es alimento y vegetal, no es necesario clasificarla con ambas, bastaría la más específica.

Por su cuenta, la colección de productos cuenta con el patrón de **Uno a muchos documentos referidos** colocado para que un producto tenga uno o más categorías de diferentes elementos. En este sentido un juego de cocina para niños puede al mismo tiempo ser parte de "juguetes" y de "cocina".

## Ejercicio 3

```javascript
{
  _id: 92321,
  mensaje: “¡Estoy preparándome para el examen de estadística!”,
    autor: {
    _id: 2301,
    nombre: “Juan”,
  },
  fecha: “2013-12-14 21:17”
}
```

En este único ejemplo, la colección de documentos de publicaciones de redes sociales está estructurada con un patrón de diseño de **Uno a uno documentos embebidos**. Toda la información de la publicación existe en la misma colección, incluyendo y administrando los datos del autor.

## Ejercicio 4


Para este ejercicio se debe "Utiliza los patrones de diseño uno-a-uno con documentos embebidos y diseño uno-a-muchos con documentos embebidos"

Collection ordenes:
```javascript
{
  _id: 10184,
  fecha: “2012-07-02 10:29”,
  total: 90.00
}
```

Collection clientes:
```javascript
{
  _id: 10009,
  nombre: “Javier García”,
  ciudad: “Madrid”
}
```

Collection productos:
```javascript
{
  _id: 22913,
  nombre: “Camisa”,
  precio: 20.00
},
{
  _id: 22917,
  nombre: “Falda”,
  precio: 30.00
},
{
  _id: 22922,
  nombre: “Pantalones”,
  precio: 40.00
}
```

En el cambio, la colección *venta* se podría ver de la siguiente manera:

```javascript
{
  _id: 10184,
  fecha: “2012-07-02 10:29”,
  total: 90.00
  cliente: {
    _id: 10009,
    nombre: “Javier García”,
    ciudad: “Madrid”
  },
  productos: [
    {
      _id: 22913,
      nombre: “Camisa”,
      precio: 20.00
    },
    {
      _id: 22917,
      nombre: “Falda”,
      precio: 30.00
    },
    {
      _id: 22922,
      nombre: “Pantalones”,
      precio: 40.00
    }    
  ]
}
```

Para este caso, el patrón de **uno a uno documentos embebidos** se debe colocar para la relación entre órdenes y clientes. No es posible (al menos a priori) que las órdenes tengan más de un cliente.

Por su parte, una orden puede tener más de un producto, por lo que el patrón de **uno a muchos documentos embebidos** es ideal.

## Ejercicio 5

Usar **diseño uno-a-uno con documentos referidos**

Colección usuarios:
```javascript
{
_id: 1001,
nombre: “Alberto”,
foto: “1001.png”
},
{
_id: 1002,
nombre: “Ana”,
foto: “1002.png”
},
{
_id: 1003,
nombre: “Jorge”,
foto: “1003.png”
},
{
_id: 1004,
nombre: “María”,
foto: “1004.png”
}
```
Dado que el objetivo es no tener en una misma colección los datos de los usuarios, se debe crear otra:

Colección relacion:

```javascript
{
_id: 1,
usuarios:[1003,1002]
},
{
_id: 2,
usuarios:[1001,1004]
},
{
_id: 3,
usuarios:[1004,1003]
},
```

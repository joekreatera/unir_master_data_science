# Ejercicio : Patrones de diseño
1 página (Georgia 11, interlineado 1,5).

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
El anterior es un ejemplo de un patrón de diseño Uno a Muchos con documentos embebidos.
Se puede apreciar que todos los datos existen en la misma fuente de datos y dentro de cada documento, hay un arreglo de otros objetos/documentos con sus propios atributos. Además analizando la razón de esta colección, aparentemente de un blog, resulta necesario el tener la información de esta forma para una rápida visualización con un webservice que accediera al artículo N=1001. 

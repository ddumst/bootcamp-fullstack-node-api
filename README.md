# Full-stack Web developer
### Hola, soy Diego Becerra o **dDumst** 👋

![https://github.com/ddumst](https://user-images.githubusercontent.com/1307894/212375663-b2b2b89b-0530-4320-a254-928f1878ba86.png)

Este es un repositorio para un Master que ando cursando a la fecha (13/11/2023), en donde debemos levantar un pequeño servidor con NodeJs y una base de datos no relacional usando MongoDB. También se nos pidió **dockerizar** ambos servicios para que corran en una misma network.

Mi ejemplo es sobre un listado de los campeones de **League of Legends: WildRift**, en donde podemos hacer lo siguiente:

`GET CHAMPS: "http://localhost:6030/wildrift/champs"`

`GET CHAMP BY ID: "http://localhost:6030/wildrift/champs/655258a4841cf4747ec827dd"`

`UPDATE CHAMP BY ID: "http://localhost:6030/wildrift/champs/655258a4841cf4747ec827dd"`

`DELETE CHAMP BY ID: "http://localhost:6030/wildrift/champs/655258a4841cf4747ec827dd"`

## Correr proyecto localmente

Clonar el proyecto

```bash
  git clone git@github.com:ddumst/bootcamp-fullstack-node-api.git
```

Ir al directorio del repositorio

```bash
  cd bootcamp-fullstack-node-api
```

Instalar las dependencias

```bash
  yarn install
```

Iniciar el servidor

```bash
  yarn dev
```

## Correr proyecto dockerizado

Clonar el proyecto

```bash
  git clone git@github.com:ddumst/bootcamp-fullstack-node-api.git
```

Ir al directorio del repositorio

```bash
  cd bootcamp-fullstack-node-api
```
Iniciar el contenedor de Docker (recuerda tener el servicio de Docker ya iniciado en tu ordenador)

```bash
  docker compose up --build -d
```

## Mis redes sociales:

[![Twitter](https://img.shields.io/badge/Twitter-@ddumst-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white&labelColor=101010)](https://twitter.com/ddumst)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Diego_Becerra-0077B5?style=for-the-badge&logo=linkedin&logoColor=white&labelColor=101010)](https://www.linkedin.com/in/diego-becerra-correa-3898b683)
[![Web](https://img.shields.io/badge/Web-ddumst.dev-14a1f0?style=for-the-badge&logo=dev.to&logoColor=white&labelColor=101010)](https://ddumst.dev)

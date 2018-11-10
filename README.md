# super-api

API en Node.js protegida con JWT y gestión de usuarios, roles, permisos y envíos de email.

### Requerimientos:

* SQLite3
* Postman

Nota: Puedes cambiar la contraseña desde el endpoint **localhost:3001/users/:id**

### Para instalar las dependencias y poder ejecutar el proyecto

```bash
npm install
```

### Para ejecutar el proyecto en modo desarrollo

```bash
npm run dev
```

### Para compilar el proyecto para producción 

```bash
npm run build
```

### Visión general
Esto describe los recursos que conforman la API 

#### Usuarios por defecto

| ID | Nombre de usuario | Contraseña | 
|----|-------------------|------------|
| 1  | admin             |password    |
| 2  | user              |password    |


#### Autenticación

```bash
curl -d '{"username":"admin", "password":"password"}' -H "Content-Type: application/json" -X POST http://localhost:3001/login
```

```json
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTQxODg4NDA3LCJleHAiOjE1NDE5NzQ4MDd9.yPH8VVDOl1KuSa62av_7X4-xcKnf01iNR5EwukrNAmY",
    "token_type": "Bearer"
}
```

### Screenshots

![Screenshot 1](https://raw.githubusercontent.com/edgarjaviertec/super-api/master/screenshots/1.png)

![Screenshot 2](https://raw.githubusercontent.com/edgarjaviertec/super-api/master/screenshots/2.png)

![Screenshot 3](https://raw.githubusercontent.com/edgarjaviertec/super-api/master/screenshots/3.png)

![Screenshot 4](https://raw.githubusercontent.com/edgarjaviertec/super-api/master/screenshots/4.png)

![Screenshot 5](https://raw.githubusercontent.com/edgarjaviertec/super-api/master/screenshots/5.png)

![Screenshot 6](https://raw.githubusercontent.com/edgarjaviertec/super-api/master/screenshots/6.png)

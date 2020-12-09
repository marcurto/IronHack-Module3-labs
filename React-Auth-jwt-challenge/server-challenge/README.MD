Vamos a comenzar con la implementación de las rutas necesarias en nuestro backend.

```bash
cd server-boilerplate

npm i
```

Configuramos nuestro archivo .env

```
MONGODB_URI=mongodb://localhost:27017/backend-server
PUBLIC_DOMAIN=http://localhost:3000
SECRET_SESSION=ironhack
PORT=4000
```

Verificamos el modelo Users en el archivo `/models/User.js`

Esto nos permite crear objetos User que tienen sus propios campos de email único y password que luego se pueden guardar y recuperar de MongoDB para autenticar a los usuarios.

```js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
```

En helpers/middleware.js abstraemos funcionalidades para saber si el usuario está logueado.

Estableceremos más adelante, una forma de emitir tokens firmados a usuarios autorizados, por lo que necesitamos definir qué rutas en nuestra aplicación están fuera del alcance de los usuarios no autenticados. En este caso, queremos que nuestra ruta '/home' solo sea accesible si el cliente solicitante tiene un token válido.

Primero, asegurémonos de tener instalado cookie-parser para que express pueda hacer parsing de las cookies que pasa nuestro navegador:

```npm install --save cookie-parser```

y de que el middleware esté en nuestra configuración de express:

```js
// app.js
const cookieParser = require('cookie-parser');
...
app.use(cookieParser());
```

A continuación, crearemos nuestro propio middleware express personalizado que se ubicará entre una solicitud y una ruta protegida y verificaremos si la solicitud está autorizada.

Esta función de middleware buscará el token en las cookies de la solicitud y luego la validará.

```js
// /helpers/middleware.js
const jwt = require("jsonwebtoken");

const secret = process.env.SECRET_SESSION;

const withAuth = function (req, res, next) {
  // obtenemos el token de las cookies a través del objecto request
  const token = req.cookies.token;
  // si no hay token, devolvemos un error
  if (!token) {
    res.status(401).send("Unauthorized: No token provided");
  } else {
    // verificamos el token
    jwt.verify(token, secret, function (err, decoded) {
      if (err) {
        // si hay un error, devolvemos un mensaje
        res.status(401).send("Unauthorized: Invalid token");
      } else {
        // si el token valida, configuramos req.email con el valor del decoded email
        req.email = decoded.email;
        next();
      }
    });
  }
};

module.exports = withAuth;
```

Creamos la ruta de signup en `routes/auth.js`

Para asegurar nuestras contraseñas usaremos una biblioteca llamada bcryptjs. Esto nos permitirá codificar nuestras contraseñas (si no sabe lo que eso significa, lea [esto](https://auth0.com/blog/hashing-passwords-one-way-road-to-security/)).

Si tiene curiosidad sobre para qué se utiliza saltRounds, lea [esto](https://stackoverflow.com/questions/46693430/what-are-salt-rounds-and-how-are-salts-stored-in-bcrypt).

#### Generando tokens

Ahora que tenemos todas las herramientas en su lugar, podemos comenzar a emitir tokens a los clientes.

Nota: Aquí hay un resumen rápido de la [autenticación basada en token](https://stormpath.com/blog/token-authentication-scalable-user-mgmt).

El primer paso, necesitamos una cadena secreta para usar al firmar los tokens. 

Usaremos la constante process.env.SECRET_SESSION definida en el archivo .env

A continuación, debemos verificar que esté instalada la biblioteca jsonwebtoken que nos permitirá emitir y verificar tokens web JSON:

```npm install --save jsonwebtoken```


Creamos la ruta /signup en `routes/auth.js`

```js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
const User = require("../models/User");

// HELPER FUNCTIONS
const withAuth = require("../helpers/middleware");

//  POST '/signup'

router.post("/signup", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // chequea si el email ya existe en la BD
    const emailExists = await User.findOne({ email }, "email");
    // si el usuario ya existe, devuelve un error
    if (emailExists) {
      return res.status(400).json({ errorMessage: "Email already exists!" });
    } else {
      // en caso contrario, si el usuario no existe, hace hash del password y crea un nuevo usuario en la BD
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashPass = bcrypt.hashSync(password, salt);
      const newUser = await User.create({ email, password: hashPass });

      // definimos el payload que enviaremos junto con el token
      const payload = { email };
      // creamos el token usando el método sign, el string de secret session y el expiring time
      const token = jwt.sign(payload, process.env.SECRET_SESSION, {
        expiresIn: "1h",
      });
      // enviamos en la respuesta una cookie con el token
      // Este método de emisión de tokens es ideal para un entorno de navegador porque establece una cookie httpOnly que ayuda a proteger al cliente de ciertas vulnerabilidades como XSS.
      res.cookie("token", token, { httpOnly: true }).sendStatus(200);
    }
  } catch (error) {
    next(error);
  }
});
```

Finalmente podemos crear una nueva ruta que, dado un email y password, encontrará un User con el email dado y verificará que el password es correcto. Si el password es correcto, emitiremos un token firmado al cliente.

Creamos la ruta /login en `routes/auth.js`

```js
//  POST '/login'

router.post("/login", async function (req, res) {
  const { email, password } = req.body;
  try {
    // revisa si el usuario existe en la BD
    const user = await User.findOne({ email });
    // si el usuario no existe, devuelve un error
    if (!user) {
      return res.status(404).json({ errorMessage: "User does not exist!" });
    }
    // si el usuario existe, hace hash del password y lo compara con el de la BD
    // si coincide, creamos el token usando el método sign, el string de secret session y el expiring time
    // enviamos en la respuesta una cookie con el token
    else if (bcrypt.compareSync(password, user.password)) {
      // Issue token
      const payload = { email };
      const token = jwt.sign(payload, process.env.SECRET_SESSION, {
        expiresIn: "1h",
      });
      res.cookie("token", token, { httpOnly: true }).sendStatus(200);
    } else {
      return res.status(401).json({ errorMessage: "Password does not match!" });
    }
  } catch (error) {
    next(error);
  }
});
```

Parece que están sucediendo muchas cosas, pero básicamente estamos verificando si tenemos un usuario registrado con el email dado y si lo hacemos, luego verificamos si el password proporcionado es correcto y si lo es, emitimos un token al cliente.

Una cosa particular a tener en cuenta aquí es que cuando emitimos el token, lo configuramos como una cookie y configuramos el flag httpOnly en true. Este método de emisión de tokens es ideal para un entorno de navegador porque establece una cookie httpOnly que ayuda a proteger al cliente de ciertas vulnerabilidades como XSS.

Definitivamente, hay otras formas de emitir tokens dependiendo del cliente, pero este método en particular funciona bien para la autenticación del navegador.

Creamos la ruta para /logout en `/routes/auth.js`

```js
// GET '/logout'

// para hacer logout, configuramos un valor cualquiera para reemplazar el token
router.get("/logout", withAuth, function (req, res) {
  // seteamos el token con un valor vacío y una fecha de expiración en el pasado (Jan 1st 1970 00:00:00 GMT)
  res.cookie("token", "", { expires: new Date(0) });
  return res.status('200').json({
    message: "signed out"
  })
});
```

Creamos la ruta /home en `/routes/auth.js`

Finalmente, podemos usar este middleware withAuth siempre que queramos tener una ruta protegida editando su configuración de ruta para usar el nuevo middleware:

```js
// GET '/home'
// accedemos a una ruta privada usando el middleware withAuth
router.get("/home", withAuth, function (req, res, next) {
  res.json("Protected route");
});
```

Exportamos el router en /routes/auth.js

```js
module.exports = router;
```

#### En Postman, probamos las rutas en el siguiente orden:

#### `/signup`, `/home` ,`/logout` ,`/login` y de nuevo `/home`.

Si en Postman vamos a `import` podemos abrir el archivo auth-server.postman_collection.json para importar la collection auth-server donde tenemos ya todas las rutas configuradas y listas para probar.

Postman guardará la cookie con el token para los próximos requests.

Ejemplo: luego de `/signup` una cookie es devuelta en la respuesta y Postman seteará esta cookie en todos los requests en la collection, por lo que la próxima vez que enviemos un request, la cookie con la key 'token' es enviada automáticamente al servidor.

#### Verificando tokens

Será mucho más evidente más adelante por qué esto es útil, pero a veces necesitamos una forma de simplemente preguntarle a nuestro servidor si tenemos un token válido guardado en las cookies de nuestro navegador.

Para esto, simplemente crearemos una ruta simple que devolverá un estado HTTP 200 y la información del usuario si nuestro solicitante tiene un token válido:

Creamos la ruta /me en `routes/auth.js`

```js
// GET '/me'

// obtenemos los datos del usuario
router.get("/me", withAuth, async function (req, res) {
  try {
    // si el token valida en el middleware withAuth, tenemos disponible el email del usuario en req.email
    const user = await User.findOne({ email: req.email }).select("-password");
    // devolvemos el usuario
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});
```
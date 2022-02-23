# NodeJS-Server
Express Framework and MongoDB
- ☑️ REST APIs
- ☑️ User Authentication with Cookies and Sessions
- ☑️ User Authentication with Passport
- HTTPS and Secure Communication
- OAuth and User Authentication
- Backend as a Service (BaaS)



## Quick Start

- Install Dependencies

  ```
  npm install
  ```

- Start MongoDB

  1. Direct to a directory where containing an empty directory called "data" .

  2. ```
     mongod --dbpath=data --bind_ip 127.0.0.1
     ```

- Start Express

  ```
  npm start
  ```

  

## Generate Private Key

```
openssl genrsa 1024 > private.key
```

```
openssl req -new -key private.key -out cert.csr
```

```
openssl x509 -req -in cert.csr -signkey private.key -out certificate.pem
```


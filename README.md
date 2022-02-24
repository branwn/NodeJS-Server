# NodeJS-Server
Based on Express Framework and MongoDB (Mongoose)
- ☑️ REST APIs
- ☑️ User Authentication with Cookies and Sessions
- ☑️ User Authentication with Passport (Express Framwork)
- ☑️ HTTPS and Secure Communication
- ☑️ Files Uploading
- ☑️ Cross-Origin Resource Sharing (CORS)
- OAuth and User Authentication

## Quick Start

- Generate Private Key in "bin" folder

  ```
  openssl genrsa 1024 > private.key
  ```

  ```
  openssl req -new -key private.key -out cert.csr
  ```

  ```
  openssl x509 -req -in cert.csr -signkey private.key -out certificate.pem
  ```

- Install Dependencies

  ```
  npm install
  ```

- Start MongoDB

  Direct to a directory where containing an empty directory called "data" .

  ```
  mongod --dbpath=data --bind_ip 127.0.0.1
  ```

- Start Express

  ```
  npm start
  ```




<p align="center" width="100%">
  <img src="https://i.ibb.co/wc4yVfC/fz.png" />
</p>
<br>

## Goals

Create an app for connecting people easily

## Fonctionnalités

### MVP

- Button “Send Request”
- Friend list
- Add Friend
- Remove Friend
- Get Friends from tel numbers
- Get Friends from whatApp Friends
- Create friend list
- Modify Friend list
- Remove friend list
- Add friend to list
- Remove friend from list
- Register
- Unregister
- Login
- Logout
- Option to specify what to do
- Option to specify @ what time
- Invite
- Get pending requests

## Technologies Utilisées

- **Database** : Psql with Datamapper
- **Backend** : Node.js and Express.js
- **Frontend** : +//+

## Team

This project is leaded by :

- Nicolas.C

# Initiate

This readme explains how to set up **MEIT**.

This project uses **Postgresql** and **Nodejs**

## Clone

1. Open terminal
2. Use `git clone` command followed by the url :

```bash
git clone exemple.git
```

## Dependencies

Next, make sure to have all the required dependencies installed. This information can usually be found in the package.json file, if present.

To install the required dependencies, run the following command:

```bash
npm install
```

## Scripts

Once the installation is complete, you can run scripts that are part of the project. These scripts can typically be found in the scripts section of the package.json file.

To initialize the database, run the following command:

```bash
bash script/init.sh
```

To initialize the functions within the database, run the following command:

```bash
bash script/init_function.sh
```

# Run

Finally, to start the project, run the following command:

In development mode:

```bash
npm run dev
```

In production mode:

```bash
npm start
```

# Documentation

For API documentation, visit `localhost:3000/docs`

# Contribute

To contribute to this project, please contact the authors.

# License

MIT License

Copyright (c) 2023 Nicolas Corroyez

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

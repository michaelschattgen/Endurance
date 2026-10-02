# Endurance

Endurance is a little sideproject I hacked together in a weekend as a personal tool to interact with the SportCity (aka Electrolyte) API. It is designed to monitor and notify users when a spot in a previously fully booked class becomes available. This is particularly useful for anyone wanting to participate in a class without the need to constantly check the SportCity app.

A live version of this project can be found at: [https://endurance.schattgen.dev](https://endurance.schattgen.dev)

## Screenshots

![Venue picker](media/1.png)
![Class picker](media/2.png)
![Set notifier](media/3.png)

## Raycast / Vicinae support

This repository also contains a working extension for Raycast or Vicinae which allows you to set up a notification for a class from within your launcher. Because why not.

<div align="center">
<video center src="https://github.com/user-attachments/assets/625d44b3-fcd6-4285-9a57-8b7f2341700a" width="600" controls></video>
</div>

## Project Structure

The project is divided into two main parts:

- **Backend**: Built with .NET, the backend serves as gateway for the SportCity API, a watcher for fully booked classes and sending the notifications.
- **Frontend**: A website built with Vite, React, TypeScript and Shadcn. The frontend provides an interface to communicate with the backend, allowing the users to save watchers for their preferred classes at their venue.

## Self-hosting

Endurance runs as a self-contained Docker Compose stack — the API, the background class
watcher, the web interface and the database. No images are published to a registry;
compose builds them from this repository on your own machine. All you need is Docker
with the Compose plugin.

```bash
git clone https://github.com/michaelschattgen/Endurance.git
cd Endurance

cp .env.example .env
# Edit .env — the database passwords and the SMTP block need filling in.

docker compose up -d
```

Then open [http://localhost:8088](http://localhost:8088).

The port is bound to localhost by default, since Endurance has no login. Running it on
a server? Set `ENDURANCE_BIND_ADDRESS=0.0.0.0` in `.env` and browse to that host's own
address instead — and set `ENDURANCE_PUBLIC_URL` to that same address, since the
verification and unsubscribe links in its emails point there.

The frontend reaches the API through a relative `/api` path that nginx proxies, so you
can serve it on any domain or port without rebuilding anything.

**[docs/SELF-HOSTING.md](docs/SELF-HOSTING.md)** covers the rest: the full configuration
reference, SMTP settings for common mail providers, putting it behind your own reverse
proxy or the optional built-in Caddy profile for automatic HTTPS, backups, updates and
troubleshooting.

## Development

For working on Endurance itself, rather than just running it.

### Prerequisites

- .NET 8.0
- Node.js and npm
- MySQL (`docker compose up -d db` starts one, preloaded with the schema)

### Configuration

- **Backend Configuration**: Use an untracked `appsettings.Development.json` for local settings. Use environment variables in production.

  ```
  {
   "Settings": {
       "ConnectionStrings": {
           "MySql": "{MySQL ConnectionString}"
       },
       "Smtp": {
           "Server": "{SMTP host}",
           "Port": {SMTP port},
           "EnableSsl": true,
           "From": "{From email address}",
           "Username": "{SMTP username}",
           "Password": "{SMTP password}"
       },
       "FrontendBaseUrl": "https://your-public-frontend-url.example"
   }
  }
  ```

- **Frontend Configuration**: Configure `VITE_API_BASEURL` in an untracked `.env` file pointing to the backend.

### Setting up locally

1. **Clone the Repository**

   ```
   git clone https://github.com/michaelschattgen/Endurance.git
   cd Endurance
   ```

2. **Backend Setup**
   - Navigate to the backend directory:
     ```
     cd dotnet
     ```
   - Restore dependencies and build the project:
     ```
     dotnet restore
     dotnet build
     ```

3. **Frontend Setup**
   - Navigate to the frontend directory:
     ```
     cd ../frontend
     ```
   - Install dependencies:
     ```
     npm install
     ```
   - Start the development server:
     ```
     npm run dev
     ```

### Database

The compose stack can provide just the database, with the [schema](db/schema.sql)
already applied, while you run the API and frontend from your IDE:

```bash
cp .env.example .env
# Set MYSQL_ROOT_PASSWORD and MYSQL_PASSWORD — they ship blank, and compose will
# refuse to start until they are filled in.

docker compose up -d db
```

Uncomment the `ports` block on the `db` service in [`compose.yaml`](compose.yaml) to
reach it from the host on `127.0.0.1:3306`, and point the connection string in
`appsettings.Development.json` at it.

## License

This project is licensed under the GNU General Public License v3.0. See the
[LICENSE](LICENSE) file for details.

# Self-hosting Endurance

Everything Endurance needs — the API, the background class watcher, the web interface
and the database — runs from a single `docker compose up -d`. No images are published
to a registry; compose builds them from this repository on your own machine.

## Contents

- [What gets started](#what-gets-started)
- [Quick start](#quick-start)
- [Configuration](#configuration)
- [Setting up email](#setting-up-email)
- [Serving it on your own domain](#serving-it-on-your-own-domain)
- [Building the images yourself](#building-the-images-yourself)
- [Updating](#updating)
- [Backups](#backups)
- [Using the Raycast extension with your instance](#using-the-raycast-extension-with-your-instance)
- [Troubleshooting](#troubleshooting)

## What gets started

```
                    ┌──────────────────────────────────────────────┐
  browser ──────────▶ web        nginx, serves the built React SPA │
  :8088             │            and proxies /api to the backend   │
                    └───────────────────────┬──────────────────────┘
                                   /api/*   │
                    ┌───────────────────────▼──────────────────────┐
                    │ api        .NET 8 API + the background       ├──▶ electrolyte.sportcity.nl
                    │            watcher that polls every 5 min    ├──▶ your SMTP server
                    └───────────────────────┬──────────────────────┘
                    ┌───────────────────────▼──────────────────────┐
                    │ db         MySQL 8, holds your watchers      │
                    └──────────────────────────────────────────────┘
```

Only `web` publishes a port, unless you enable the TLS profile, which puts Caddy on 80
and 443 in front of it. The API and database are reachable only from inside the compose
network, and the browser talks to the API through nginx on the same origin — which is
why the frontend never needs to know which domain it is served from.

Endurance has no user accounts, by design: anyone who can reach the web interface can
set watchers. Each email address must first be verified through a link sent to it, and
can watch at most five classes at a time. That is how the original public instance runs.
To keep yours to yourself, leave it bound to localhost, or put a login in front of it as
described under [Customising Caddy](#customising-caddy).

## Quick start

You need [Docker](https://docs.docker.com/get-docker/) with the Compose plugin
(included in Docker Desktop, and in `docker-compose-plugin` on Linux). Nothing else —
the .NET SDK and Node are only needed for local development, not for running this.

```bash
git clone https://github.com/michaelschattgen/Endurance.git
cd Endurance

cp .env.example .env
# Edit .env — the two database passwords are blank and have to be set, and the SMTP
# block needs to point at a mailbox you can send from.

docker compose up -d
```

The first build takes a few minutes (it compiles the .NET API and the frontend bundle).
Then open <http://localhost:8088>.

By default the port is bound to localhost only, so nothing else can reach it until you
choose otherwise. **Running it on a server you reach over SSH?** Set
`ENDURANCE_BIND_ADDRESS=0.0.0.0` in `.env`, along with `ENDURANCE_PUBLIC_URL` set to that
host's own address — `http://192.168.1.20:8088` or similar — and re-run
`docker compose up -d`. Then browse to that address rather than `localhost`. Everyone on
that network can then use it.

Check that everything came up:

```bash
docker compose ps       # all three running, db and web reporting (healthy)
docker compose logs -f  # ctrl-c to stop following
```

The containers start again by themselves after a reboot, and their logs are capped at
3 × 10 MB per service, so a long-running host does not fill its disk. To stop it:

```bash
docker compose down             # stop, keep your watchers
docker compose down -v          # stop and delete the database as well
```

## Configuration

All configuration lives in `.env` next to `compose.yaml`. `.env` is gitignored, so your
credentials stay out of version control. After changing it, apply with
`docker compose up -d`.

It holds your SMTP password, so on a shared machine tighten it up: `chmod 600 .env`.

Values are read literally with two exceptions: `$` starts a variable reference and
` #` starts a comment, and either one silently cuts a password short. Wrap such a value
in single quotes — `SMTP_PASSWORD='pa$word'` — since double quotes still expand `$`.

### Where it is served

| Variable | Default | Notes |
| --- | --- | --- |
| `ENDURANCE_PORT` | `8088` | Host port for the web interface. |
| `ENDURANCE_BIND_ADDRESS` | `127.0.0.1` | This host only. Set to `0.0.0.0` to reach it from other machines on your network. |
| `ENDURANCE_PUBLIC_URL` | `http://localhost:` + port | The address people open Endurance at. See below. |
| `ENDURANCE_DOMAIN` | unset | Only used by the optional `tls` profile. See [below](#option-b-the-built-in-caddy-profile). |

**Set `ENDURANCE_PUBLIC_URL` whenever Endurance is reached at anything other than
`http://localhost:8088`.** The emails it sends link back to it, to verify an address and
to unsubscribe. With the default, those links only work on the machine running Docker,
so nobody else can verify their address — and an unverified address never gets
notified. Use the exact address people type, such as `http://192.168.1.20:8088` or
`https://endurance.example.com`.
| `COMPOSE_PROFILES` | unset | Set to `tls` to enable the Caddy profile for every `docker compose` command. |

### Database

| Variable | Default | Notes |
| --- | --- | --- |
| `MYSQL_ROOT_PASSWORD` | — | Required, no default. |
| `MYSQL_PASSWORD` | — | Required, no default. Avoid `;` and `"` — both are special inside a connection string. |
| `MYSQL_USER` | `endurance` | Account the API connects with. |

The database itself is always named `endurancedatabase`; there is nothing to gain from
changing it, so it is not a setting.

> These are applied when the database volume is first created. **Changing them later
> has no effect on an existing database** — MySQL only reads them on initialisation.
> To rotate the password afterwards, either change it inside the database
> (`docker compose exec db mysql -u root -p`) or start over with
> `docker compose down -v`, which deletes all your watchers.

The schema in [`db/schema.sql`](../db/schema.sql) is applied automatically the first
time the database starts, so a new install is always current. An existing database is
brought up to date with the scripts in [`db/migrations`](../db/migrations) — see
[Updating](#updating).

### Email

| Variable | Default | Notes |
| --- | --- | --- |
| `SMTP_SERVER` | — | Required. |
| `SMTP_PORT` | `587` | |
| `SMTP_FROM` | — | Required. Most providers insist this matches the authenticated account. |
| `SMTP_USERNAME` | empty | Leave empty for a relay that does not authenticate. |
| `SMTP_PASSWORD` | empty | |
| `SMTP_ENABLE_SSL` | `true` | STARTTLS. Set to `false` only for a plain-SMTP relay on your own network — never together with a username and password, which would then cross the network in plain text. |

### Miscellaneous

| Variable | Default | Notes |
| --- | --- | --- |
| `ASPNETCORE_ENVIRONMENT` | `Production` | `Development` enables Swagger; you will also need to publish the API port, which is commented out in `compose.yaml`. It also switches on detailed error pages that show stack traces to whoever triggers an error, so only use it where nobody else can reach the API. |

There is deliberately no timezone setting. The containers run on UTC, and the application
relies on that: it compares class start times with both its own UTC clock and the
database's, and only gets consistent answers when they agree. Class times inside
notification emails are always shown in Central European time, which the application
hardcodes — reasonable for a chain of Dutch gyms, and unaffected by the server's clock.

## Setting up email

Notifying you is the entire point of Endurance, so this is the one part worth getting
right before you rely on it. Any SMTP server works.

**Port 587 with STARTTLS is the supported setup.** Implicit TLS on port 465 is *not* —
the .NET mail client Endurance uses does not speak it. Providers that advertise 465
almost always offer 587 as well; use that.

Common providers:

| Provider | `SMTP_SERVER` | `SMTP_PORT` | Credentials |
| --- | --- | --- | --- |
| Gmail | `smtp.gmail.com` | 587 | Requires 2FA plus an [app password](https://support.google.com/accounts/answer/185833) — your normal password will not work. |
| Fastmail | `smtp.fastmail.com` | 587 | App password. |
| Outlook / Microsoft 365 | `smtp.office365.com` | 587 | |
| Postmark | `smtp.postmarkapp.com` | 587 | Server API token as both username and password. |
| Mailgun | `smtp.mailgun.org` | 587 | SMTP credentials from the domain settings. |

For a relay on your own network that accepts unauthenticated mail:

```ini
SMTP_SERVER=192.168.1.10
SMTP_PORT=25
SMTP_FROM=endurance@your-lan.example
SMTP_USERNAME=
SMTP_PASSWORD=
SMTP_ENABLE_SSL=false
```

### Testing that it works

You do not have to wait for a full class to free up. Pick a class that **already has
spots available** and set a watcher on it.

The first time an address is used, Endurance sends a **verification email** instead,
and the watcher waits until the link in it is opened. That email is itself the first
test: if it arrives, sending works, and if its link opens Endurance, `ENDURANCE_PUBLIC_URL`
is right. Each address only has to be verified once.

Once verified, the watcher polls every five minutes and notifies as soon as it sees a
free spot, so the notification arrives on the next cycle. Watch it happen with:

```bash
docker compose logs -f api
```

A watcher is disabled automatically once it has notified you, so this test fires once
and leaves nothing behind. If the send fails the watcher stays active and is retried on
the next poll, five minutes later — so a mistyped password costs you log noise rather
than the watcher itself. Fix the setting, `docker compose up -d`, and the next cycle
picks it up.

## Serving it on your own domain

Because the frontend talks to the API through a relative `/api` path, **you can change
the domain freely without rebuilding anything.** Nothing in the built bundle refers to
a hostname. The one thing that does need to know is the email links: whichever option
you pick, set `ENDURANCE_PUBLIC_URL` to the final `https://` address.

### Option A: your own reverse proxy

If you already run nginx, Caddy, Traefik or a tunnel, keep Endurance on plain HTTP and
point your proxy at it. The default `ENDURANCE_BIND_ADDRESS=127.0.0.1` is already what
you want here — the port stays private to this host, and only the proxy can reach it.

Caddy:

```caddy
endurance.example.com {
	reverse_proxy 127.0.0.1:8088
}
```

nginx:

```nginx
server {
    listen 443 ssl;
    server_name endurance.example.com;

    # ssl_certificate ... ;

    location / {
        proxy_pass http://127.0.0.1:8088;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Option B: the built-in Caddy profile

If you have no proxy yet, the bundled `tls` profile adds Caddy in front and obtains a
Let's Encrypt certificate automatically. Like the original public instance, it serves
Endurance without a login; [Customising Caddy](#customising-caddy) shows how to add one.

Set your domain in `.env`:

```ini
ENDURANCE_DOMAIN=endurance.example.com
ENDURANCE_PUBLIC_URL=https://endurance.example.com
COMPOSE_PROFILES=tls
```

`COMPOSE_PROFILES` in `.env` enables the profile for every `docker compose` command in
this project, so `up`, `down`, `logs` and the rest all include Caddy without a flag:

```bash
docker compose up -d
```

This requires the domain's DNS record to point at this host and ports 80 and 443 to be
reachable from the internet — that is how Let's Encrypt validates the domain. Certificate
renewal is automatic.

No domain at all? Set `ENDURANCE_DOMAIN` to this machine's LAN address, such as
`192.168.1.10`, and `ENDURANCE_PUBLIC_URL` to `https://192.168.1.10`, for HTTPS on your
home network only. Nothing needs forwarding on your
router. Caddy issues the certificate from its own local authority, so each browser warns
once until you accept it.

Leave `ENDURANCE_BIND_ADDRESS` at its default while doing this: Caddy reaches the web
container over the compose network, so port 8088 does not need to be exposed at all.

If you would rather not keep the setting in `.env`, pass `--profile tls` on every
command instead (`docker compose --profile tls up -d`).

#### Customising Caddy

Editing the tracked `Caddyfile` would make the next `git pull` conflict. Copy it instead,
and mount the copy from a `compose.override.yaml` next to `compose.yaml`; both files are
gitignored:

```bash
cp Caddyfile Caddyfile.local
```

```yaml
services:
  caddy:
    volumes:
      - ./Caddyfile.local:/etc/caddy/Caddyfile:ro
```

The comments at the end of the Caddyfile cover the usual changes:

- a login in front of the whole site, with `basic_auth`;
- a self-signed certificate for a domain that only resolves on your own network, which
  Let's Encrypt cannot validate;
- an email address for certificate expiry notices.

Apply them with `docker compose up -d --force-recreate caddy`. The copy will not pick up
later changes to the upstream `Caddyfile`, so compare the two after updating.

## Building the images yourself

`docker compose up -d` already builds both images locally from this repository — there
is nothing to pull and no registry account involved. To build and tag them by hand
instead:

```bash
docker build -t endurance-api:latest ./dotnet
docker build -t endurance-web:latest ./frontend
```

The frontend accepts one build argument, `VITE_API_BASEURL`, which defaults to `/api`.
Leave it alone unless you are serving the API from a different origin than the web
interface — the default is what makes the image domain-independent.

## Updating

```bash
git pull
docker compose up -d --build
```

Your watchers live in the `db-data` volume and survive rebuilds.

**Check for new database migrations.** `db/schema.sql` only runs when the database is
first created, so an existing database needs any new scripts from
[`db/migrations`](../db/migrations) applied by hand. See what the pull brought in:

```bash
git diff --name-only --diff-filter=A ORIG_HEAD HEAD -- db/migrations
```

Apply each new file once, in numbered order, after the `up` above:

```bash
docker compose exec -T db sh -c \
  'MYSQL_PWD="$MYSQL_ROOT_PASSWORD" mysql -u root endurancedatabase' \
  < db/migrations/001_add_verified_emails.sql
```

The client stops at the first error, so a migration that was already applied normally
fails on its first statement without changing anything. Take a [backup](#backups) first
all the same.

## Backups

The database volume is the only state worth keeping.

```bash
# Back up  (-T matters: without it compose allocates a TTY and corrupts the dump)
docker compose exec -T db sh -c \
  'MYSQL_PWD="$MYSQL_ROOT_PASSWORD" mysqldump -u root endurancedatabase' > endurance-backup.sql

# Restore
docker compose exec -T db sh -c \
  'MYSQL_PWD="$MYSQL_ROOT_PASSWORD" mysql -u root endurancedatabase' < endurance-backup.sql
```

The password goes in through `MYSQL_PWD` rather than `-p` because a command-line
argument is readable by every user on the host, via `ps`, while the command runs.

## Using the Raycast extension with your instance

The [Raycast / Vicinae extension](../raycast) has an **API Base URL** preference. Point
it at your instance's API, which nginx serves under `/api`:

```
https://endurance.example.com/api
```

or `http://localhost:8088/api` if you are running it on the same machine.

## Troubleshooting

**`required variable MYSQL_ROOT_PASSWORD is missing a value`** (or `MYSQL_PASSWORD`)
Either you have no `.env` (`cp .env.example .env`), or you have one and have not filled
in the two database passwords yet. They deliberately ship blank.

**The page does not load at all.**
By default the port is bound to `127.0.0.1`, so it only answers on the machine running
Docker. To reach it from elsewhere on your network set `ENDURANCE_BIND_ADDRESS=0.0.0.0`
in `.env` and run `docker compose up -d`.

**The web interface loads but venues never appear.**
The venue list comes straight from SportCity and does not touch the database, so this is
either the browser failing to reach `/api` or the API failing to reach SportCity. Check
the browser's network tab for the status of `/api/get-venues`: a 502 means nginx could
not reach the API container, while a 500 means the API could not reach
`electrolyte.sportcity.nl`. `docker compose logs api` shows which.

**`docker compose logs api` shows `Error refreshing scheduled classes`.**
The watcher could not reach the database. Right after a reboot this resolves itself on
the next cycle. If it persists, a connection-string error is the usual cause — check for
a `;` or `"` in `MYSQL_PASSWORD` and pick a password made of letters and digits.

**Setting a watcher fails with "Unable to add the class alert", or emails never arrive.**
Both usually mean sending mail fails: the first is the verification email failing, the
second a notification. The API logs the cause — `docker compose logs api | grep -i -A5
"failed to"`. The usual culprits are a provider that requires an app password rather
than an account password, a `SMTP_FROM` address that does not match the authenticated
account, a password containing `$` or ` #` that `.env` cut short (wrap it in single
quotes), or `SMTP_PORT=465`, which is not supported (use 587). A watcher is kept when a
notification fails, so correcting the setting and running `docker compose up -d` is
enough — you do not need to recreate it.

**The verification link does not open Endurance.**
The link is built from `ENDURANCE_PUBLIC_URL`, so it must be the address you actually
browse to — with the default of `http://localhost:8088`, the link only works on the
machine running Docker. Fix it in `.env`, run `docker compose up -d`, and set the
watcher again: a new verification email can be sent once 15 minutes have passed since
the last one.

**The class times in the email are not in my timezone.**
They are always rendered in Central European time, which the application hardcodes.

**Port 8088 is already in use.**
Change `ENDURANCE_PORT` in `.env` and run `docker compose up -d`.

**I changed `MYSQL_PASSWORD` and now the API cannot connect.**
MySQL only reads those variables when it first initialises the volume. Either set the
password back, change it inside the database, or run `docker compose down -v` to start
fresh — that deletes your watchers.

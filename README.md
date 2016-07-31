# plateau :sunrise:

S3 backed image host in Node.js.

## Install

```sh
git clone git@github.com:benjaminparnell/plateau.git
npm install
```

## Usage

### Server setup

Before using plateau you will need to provision an Amazon S3 Bucket to store
images. Make sure that the permissions are set correctly on the bucket so anyone
can *view* the images.

When you have the bucket provisioned, you will need to set the following
environment variables:

```
AWS_ACCESS_KEY_ID=superseceretkey
AWS_SECRET_ACCESS_KEY=supersecretkey
AWS_DEFAULT_REGION=eu-west-1
AWS_BUCKET=my.bucket.name
API_KEY=123
LEVELDB_PATH=/var/data/plateau/db
```

You can also set `PORT` to run plateau on a port that is not 9001 (the default port).

After these are set, run `node server.js` to run plateau.

### Uploading images

Running the following command will upload your image to the S3 bucket and return
the URL to your image, or a 403 if your API key is incorrect.

```sh
curl -XPOST -H "X-API-KEY: $YOUR_API_KEY" -F file="@./file.jpg" http://127.0.0.1:9001
```

## License

MIT © [Benjamin Parnell](http://benparnell.com)

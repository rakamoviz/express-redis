rm -rf tmp/express-api
mkdir -p tmp
cp -r ../../../dev/express-api tmp
rm -rf tmp/express-api/node_modules
rm -rf tmp/express-api/.git
rm -rf tmp/express-api/.gitignore

docker build -t express-api-container:0.0.1 .
ng build --output-path=dist/es --base-href /es/ --localize=es
ng build --output-path=dist/pt --base-href /pt/ --localize=pt
ng build --output-path=dist/en --base-href /en/ --localize=en

sudo cp -r dist/es /var/www/dashboard
sudo cp -r dist/pt /var/www/dashboard
sudo cp -r dist/en /var/www/dashboard


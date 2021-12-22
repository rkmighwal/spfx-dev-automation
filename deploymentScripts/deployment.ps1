$solution_folder_path = "./sharepoint/solution"
$app_catalog_url = "<App Catalog Site URL>"

$packages = Get-ChildItem -path $solution_folder_path *.sppkg

m365 login -t browser

foreach ($package in $packages) {
    m365 spo app add -p $package.fullname -u $app_catalog_url -s sitecollection --overwrite --verbose
    m365 spo app deploy -n $package.name -u $app_catalog_url -s sitecollection --verbose
}

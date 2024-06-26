###### У цьому файлі наведено команди, щодо фізичного розгортання платформи Cyber ICE Box Platform на вашому сервері. Команди слід виконувати у строгій послідовності, яку вказано у цьому файлі. Кожен файл потребує змін відповідно до ваших облікових даних, які ви отримали під час проходження підготовчого етапу.

curl -sSLf https://get.k0s.sh | sudo sh

sudo k0s install controller --single

sudo k0s start

sudo k0s status

sudo k0s kubectl apply -f https://raw.githubusercontent.com/projectcalico/calico/v3.28.0/manifests/calico.yaml

curl -sSLf https://raw.githubusercontent.com/cybericebox/docs/main/config.yml

sudo k0s kubectl apply -f config.yml

sudo k0s kubectl apply -f https://github.com/cybericebox/docs/blob/72dac1c100b7fc66dea9c16258735f14308f313b/platform.yml

  

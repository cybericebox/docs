### У цьому файлі наведено команди, щодо фізичного розгортання платформи Cyber ICE Box Platform на вашому сервері. Команди слід виконувати **у строгій послідовності**, яку вказано у цьому файлі. Кожен файл потребує змін відповідно до ваших облікових даних, які ви отримали під час проходження [підготовчого етапу.](https://github.com/cybericebox/docs/blob/main/README.md)


1. Команда завантажує сценарій установки **K0s** (інструмент для управління Kubernetes-кластерами) з вебсайту [https://get.k0s.sh](https://get.k0s.sh) за допомогою утиліти **curl**, а потім передає цей сценарій на виконання команді **sh** з правами адміністратора **sudo**
   
       curl -sSLf https://get.k0s.sh | sudo sh
2. Команда встановлює керуючий вузол кластеру, а прапор **--single** вказує на те, що на даному хості також встановлюється робочий вузол.

       sudo k0s install controller --single
3. Команда запускає створений кластер **Kubernetes**, під керуваням **k0s**.

       sudo k0s start
4. Команда виконує перевірку поточного стану кластеру **Kubernetes**, який керується за допомогою **k0s**.
   
       sudo k0s status
5. Ці команди встановлють мережевий плагін **Calico** для **Kubernetes**. Виконуючи команди, ви завантажуєте та застосовуєте маніфести для **Calico**, що налаштовують мережеву політику та маршрутизацію в кластері **Kubernetes**. Це забезпечує надійну мережеву інфраструктуру для взаємодії між подами та іншими компонентами в кластері.
   * Команда № 1
   
         sudo k0s kubectl create -f https://raw.githubusercontent.com/projectcalico/calico/v3.28.0/manifests/tigera-operator.yaml
   * Команда № 2 
   
         sudo k0s kubectl create -f https://raw.githubusercontent.com/projectcalico/calico/v3.28.0/manifests/custom-resources.yaml
6. Команда налаштовує доступ до ресурсів кластеру з зовнішньої мережі

       sudo k0s kubectl apply -f https://raw.githubusercontent.com/metallb/metallb/v0.14.5/config/manifests/metallb-native.yaml
7. Команда завантажує файл конфігурації платформи **config.yml**. Певні параметри цього файлу необхідно змінити відповідно дo [підготовчого етапу](https://github.com/cybericebox/docs/blob/main/README.md)!
   
       curl https://raw.githubusercontent.com/cybericebox/docs/main/config.yml -O
8. Команда застосовує конфігурацію платформи з файлу **config.yml** до **Kubernetes-кластеру**.

       sudo k0s kubectl apply -f config.yml
9. Команда виконує розгортання інфрастриктури платформи **Kubernetes** з файлу **platform.yml**, використовуючи **kubectl**, що входить до складу **k0s**. Це означає, що **Kubernetes** об'єкти, визначені в **platform.yml**, будуть створені або оновлені в кластері.

       sudo k0s kubectl apply -f https://raw.githubusercontent.com/cybericebox/docs/main/platform.yml
10. Команда перевіряє готовність інфрастуктури платформи. У разі готовності всі компоненти матимуть статус "Running", як це показано нище.

       sudo k0s kubectl get all -n cybericebox

     ![Приклад стану системи](https://github.com/cybericebox/docs/assets/49611889/2e69cd22-867f-4a64-82d8-50bfdd87f768)
11. **Після успішного розгортання платформи перейдіть до Адміністративної панелі за посиланням, наприклад: https://admin.cybericebox.com**.


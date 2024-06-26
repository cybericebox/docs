### У цьому файлі наведено команди, щодо фізичного розгортання платформи Cyber ICE Box Platform на вашому сервері. Команди слід виконувати **у строгій послідовності**, яку вказано у цьому файлі. Кожен файл потребує змін відповідно до ваших облікових даних, які ви отримали під час проходження [підготовчого етапу.](https://github.com/cybericebox/docs/blob/main/README.md)


1. Команда завантажує сценарій установки **K0s** (інструмент для управління Kubernetes-кластерами) з веб-сайту [https://get.k0s.sh](https://get.k0s.sh) за допомогою утиліти **curl**, а потім передає цей сценарій на виконання команді **sh** з правами адміністратора **sudo**
   
        curl -sSLf https://get.k0s.sh | sudo sh
2. Команда встановлює **k0s** де **controller** означає, що встановлюється контролерний вузол (головний компонент кластера), а **--single** вказує на те, що буде створені кластери та робочі вузли, які будуть функціонувати на одному сервері.

        sudo k0s install controller --single
3. Команда запускає створений кластер **Kubernetes**, під керуваням **k0s**.

        sudo k0s start
4. Команда виконує перевірку поточного стану кластеру **Kubernetes**, який керується за допомогою **k0s**.
   
        sudo k0s status
5. Ця команда встановлює мережевий плагін **Calico** для **Kubernetes** за допомогою **k0s**, спрощеного дистрибутива **Kubernetes**. Виконуючи команду, ви завантажуєте та застосовуєте маніфест для **Calico** з вказаного **URL**, що налаштовує мережеву політику та маршрутизацію в кластері **Kubernetes**. Це забезпечує надійну мережеву інфраструктуру для взаємодії між подами та іншими компонентами в кластері.
   
        sudo k0s kubectl apply -f https://raw.githubusercontent.com/projectcalico/calico/v3.28.0/manifests/calico.yaml
6. Команда завантажує файл **config.yml** з репозиторію на **GitHub** за вказаною **URL-адресою**. Певні параметри цього файлу необхідно змінити відповідно дo [підготовчого етапу.](https://github.com/cybericebox/docs/blob/main/README.md)!
   
        curl -sSLf https://raw.githubusercontent.com/cybericebox/docs/main/config.yml
7. Команда запускає інструмент **k0s**, щоб застосовати конфігурацію з файлу **config.yml** до **Kubernetes-кластера**, який управляється за допомогою **k0s**, розгортання або оновлення ресурсів, визначених у цьому файлі

        sudo k0s kubectl apply -f config.yml
8. Команда виконує застосування конфігурацій **Kubernetes** з файлу **platform.yml**, розташованого за вказаним **URL**, використовуючи **kubectl**, що входить до складу **k0s**. Це означає, що **Kubernetes** об'єкти, визначені в **platform.yml**, будуть створені або оновлені в кластері.

        sudo k0s kubectl apply -f https://github.com/cybericebox/docs/blob/72dac1c100b7fc66dea9c16258735f14308f313b/platform.yml

  
{@a schematics}
# Схемы

Схема - это генератор кода на основе шаблонов, который поддерживает сложную логику.
Это набор инструкций для преобразования программного проекта путем генерации или изменения кода.
Схемы упакованы в [коллекции](guide/glossary#collection)и установлены с помощью npm.

Коллекция схем может быть мощным инструментом для создания, изменения и поддержки любого программного проекта, но особенно полезна для настройки проектов Angular в соответствии с конкретными потребностями вашей организации.
Вы можете использовать схемы, например, для генерации часто используемых шаблонов пользовательского интерфейса или определенных компонентов, используя предопределенные шаблоны или макеты.
Вы можете использовать схемы для обеспечения соблюдения архитектурных правил и соглашений, делая ваши проекты согласованными и функциональными.

{@a schematics-for-the-angular-cli}
## Схемы для Angular CLI

Схемы являются частью Angular экосистемы. [Angular CLI](guide/glossary#cli) использует схему, чтобы применить преобразования в проект веб-приложения.
Вы можете изменить эти схемы и определить новые для таких вещей, как обновление кода, например, для исправления критических изменений в зависимости, или для добавления нового параметра конфигурации или инфраструктуры в существующий проект.

Схемы, которые включены в `@schematics/angular` Коллекция по умолчанию запускается командами `ng generate ` и ` ng add`.
Пакет содержит именованные схемы, которые настраивают параметры, доступные для CLI для `ng generate` подкоманды, такие как `ng generate component ` и ` ng generate service`.
Подкоманды для `ng generate` - это сокращение для соответствующей схемы. Вы можете указать конкретную схему (или коллекцию схем) для генерации, используя длинную форму:

<code-example language="bash">
ng generate my-schematic-collection:my-schematic-name
</code-example>

или

<code-example language="bash">
ng generate my-schematic-name --collection collection-name
</code-example>

{@a configuring-cli-schematics}
### Конфигурирование схем CLI

Схема JSON, связанная со схемой, сообщает Angular CLI, какие параметры доступны для команд и подкоманд, и определяет значения по умолчанию.
Эти значения по умолчанию можно переопределить, указав другое значение для параметра в командной строке.
Смотрите [Конфигурация рабочей области](guide/workspace-config)для получения информации о том, как вы можете изменить параметры генерации по умолчанию для вашего рабочего пространства.

Схемы JSON для схем по умолчанию, используемых CLI для генерации проектов и частей проектов, собраны в пакет [ `@ schematics / angular` ](https://raw.githubusercontent.com/angular/angular-cli/v7.0.0/packages/schematics/angular/application/schema.json).
Схема описывает параметры, доступные для CLI для каждого из `ng generate` подкоманды, как показано в `--help` выводе.

{@a developing-schematics-for-libraries}
## Разработка схем для библиотек

Как разработчик библиотеки, вы можете создавать свои собственные коллекции пользовательских схем для интеграции вашей библиотеки с Angular CLI.

* Схема*добавления * позволяет разработчикам устанавливать вашу библиотеку в рабочей среде Angular, используя `ng add`.

* *Схемы генерации* могут рассказать `ng generate` подкоманды для изменения проектов, добавления конфигураций и сценариев, а также артефактов скаффолдов, определенных в вашей библиотеке.

* Схема*обновления * может сказать `ng update` Команда как обновить зависимости вашей библиотеки и откорректировать их, когда вы выпускаете новую версию.

Для более подробной информации о то, что они выглядят как и как создавать их, см:
* [Авторские схемы](guide/schematics-authoring)
* [Схемы для библиотек](guide/schematics-for-libraries)

{@a add-schematics}
### Добавить схемы

Схема добавления обычно поставляется с библиотекой, так что библиотека может быть добавлена ​​в существующий проект с `ng add`.
 `add` Команда использует менеджер пакетов для загрузки новых зависимостей и вызывает скрипт установки, который реализован в виде схемы.

Например, [ `@ angular / material` ](https://material.angular.io/guide/schematics)схема сообщает `add` команду, чтобы установить и настроить Angular материал и темы и зарегистрировать новые компоненты стартера, которые могут быть созданы с помощью `ng generate`.
Вы можете посмотреть на это как на пример и модель для своей собственной схемы добавления.

Партнерские и сторонние библиотеки также поддерживают Angular CLI с добавлением схем.
Например, `@ng-bootstrap/schematics` добавляет [ng-bootstrap](https://ng-bootstrap.github.io/) в приложение и `@clr/angular` устанавливает и настраивает [Clarity от VMWare](https://vmware.github.io/clarity/documentation/v1.0/get-started).

Добавление схемы также может обновить проект с изменениями конфигурации, добавить дополнительные зависимости (такие как полифиллы) или код инициализации, специфичный для пакета лесов.
Например, `@angular/pwa` Схема превращает ваше приложение в PWA, добавляя манифест приложения и работника службы, а также `@angular/elements`   Схема добавляет `document-register-element.js` polyfill и зависимости для Angular элементов.

{@a generation-schematics}
### Схемы генерации

Схемы генерации являются инструкциями для `ng generate` команду.
Документированные подкоманды используют схемы генерации углов по умолчанию, но вы можете указать другую схему (вместо подкоманды) для генерации артефакта, определенного в вашей библиотеке.

Например, Angular Material предоставляет схемы генерации для определяемых им компонентов пользовательского интерфейса.
Следующая команда использует одну из этих схем для визуализации Angular материала. `<mat-table>` которая предварительно сконфигурирована с источником данных для сортировки и разбивки на страницы.

<code-example language="bash">
ng generate @angular/material:table <component-name>
</code-example>

{@a update-schematics}
### Обновление схемы

 `ng update` Команда может использоваться для обновления зависимостей библиотеки вашего рабочего пространства. Если вы не предоставите никаких опций или используете опцию справки, команда проверит ваше рабочее пространство и предложит обновить библиотеки.

<code-example language="bash">
ng update
    We analyzed your package.json, there are some packages to update:

      Name Version Command to update
     --------------------------------------------------------------------------------
      @angular/cdk 7.2.2 -> 7.3.1 ng update @angular/cdk
      @angular/cli 7.2.3 -> 7.3.0 ng update @angular/cli
      @angular/core 7.2.2 -> 7.2.3 ng update @angular/core
      @angular/material 7.2.2 -> 7.3.1 ng update @angular/material
      rxjs 6.3.3 -> 6.4.0 ng update rxjs


    There might be additional packages that are outdated.
    Run "ng update --all" to try to update all at the same time.
</code-example>

Если вы передаете команду, набор библиотек для обновления (или `--all` flag), он обновляет эти библиотеки, их одноранговые зависимости и зависимости от них.

<div class="alert is-helpful">

Если есть несоответствия (например, если зависимости между равноправными узлами не могут быть сопоставлены простым [semver](https://semver.io/)диапазоном), команда генерирует ошибку и ничего не меняет в рабочей области.

Мы рекомендуем вам не устанавливать принудительное обновление всех зависимостей по умолчанию. Попробуйте сначала обновить определенные зависимости.

Подробнее о том, как `ng update` Команда работает, см. [Команда обновления](https://github.com/angular/angular-cli/blob/master/docs/specifications/update.md).

</div>

Если вы создаете новую версию своей библиотеки, которая вводит потенциальные критические изменения, вы можете предоставить *схему обновления,* чтобы включить `ng update` Команда для автоматического разрешения любых таких изменений в обновляемом проекте.

Например, предположим, что вы хотите обновить библиотеку Angular материалов.

<code-example language="bash">
ng update @angular/material
</code-example>

Эта команда обновляет оба `@angular/material` и его зависимость `@angular/cdk` в вашем рабочем пространстве `package.json`.
Если какой-либо из пакетов содержит схему обновления, охватывающую переход с существующей версии на новую версию, команда запускает эту схему в вашей рабочей области.

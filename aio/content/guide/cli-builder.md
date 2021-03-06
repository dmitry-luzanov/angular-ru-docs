{@a angular-cli-builders}
# Angular сборщики CLI

Ряд команд Angular CLI запускают сложный процесс в вашем коде, такой как лининг, сборка или тестирование.
Команды используют внутренний инструмент под названием Architect для запуска *компоновщиков CLI*, которые применяют другой инструмент для выполнения желаемой задачи.

В Angular версии 8 API-интерфейс CLI Builder стабилен и доступен для разработчиков, которые хотят настроить Angular CLI путем добавления или изменения команд. Например, вы можете предоставить сборщик для выполнения совершенно новой задачи или изменить какой сторонний инструмент используется существующей командой.

Этот документ объясняет, как компоновщики CLI интегрируются с файлом конфигурации рабочей области, и показывает, как вы можете создать свой собственный компоновщик.

<div class="alert is-helpful">

   Вы можете найти код из примеров, используемых здесь [этот репозиторий GitHub](https://github.com/mgechev/cli-builders-demo).

</div>

{@a cli-builders}
## CLI строители

Внутренний инструмент Architect делегирует работу функциям-обработчикам, которые называются [* builders*](guide/glossary#builder).
Функция обработчика построителя получает два аргумента; набор ввода  `options`  (объект JSON) и  `context`  (а  `BuilderContext`  Объект).

Разделение проблем здесь такое же, как и для [схемы](guide/glossary#schematic), которые используются для других команд консоли, которые касаются вашего кода (например, `ng generate`).

* Параметры задаются пользователем CLI, контекст предоставляется и предоставляет доступ к API CLI Builder, а разработчик обеспечивает поведение.

*  `BuilderContext` Объект обеспечивает доступ к методу планирования,  `BuilderContext.scheduleTarget()`  . Планировщик выполняет функцию обработчика построителя с заданной [целевой конфигурацией](guide/glossary#target).

Функция обработчика построителя может быть синхронной (возвращать значение) или асинхронной (возвращать обещание), или она может наблюдать и возвращать несколько значений (возвращать наблюдаемое).
Возвращаемое значение или значения всегда должны иметь тип  `BuilderOutput`.
Этот объект содержит логическое значение  `success`  поле и опционально  `error`  поле которое может содержать сообщение об ошибке.

Angular предоставляет некоторые компоновщики, которые используются CLI для таких команд, как `ng build `, ` ng test`, и `ng lint`.
Конечные конфигурации по умолчанию для этих и других встроенных компоновщиков CLI можно найти (и настроить) в разделе «architect» [файл конфигурации рабочей области](guide/workspace-config),  `angular.json`.
Вы также можете расширить и настроить Angular, создав собственные компоновщики, которые вы можете запустить с помощью [CLI-команда  `ng run` ](cli/run).

{@a builder-project-structure}
### Структура проекта застройщика

Конструктор находится в папке «проект», которая по структуре похожа на рабочую область Angular, с глобальными файлами конфигурации на верхнем уровне и более конкретной конфигурацией в исходной папке с файлами кода, которые определяют поведение.
Например, ваш  `myBuilder`  Папка может содержать следующие файлы.

| ФАЙЛЫ | ЦЕЛЬ |
| : ----------------------- | : ------------------------------------------ |
|  `src/my-builder.ts`        | Основной исходный файл для определения сборщика. |
|  `src/my-builder.spec.ts`  | Исходный файл для тестов. |
|  `src/schema.json`          | Определение параметров ввода строителя. |
|  `builders.json`            | Тестирование конфигурации. |
|  `package.json`             | Зависимости. См. Https://docs.npmjs.com/files/package.json. |
|  `tsconfig.json`            | [Конфигурация TypeScript](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html). |

Вы можете опубликовать строитель  `npm`  (см. [Публикация вашей библиотеки](https://angular.io/guide/creating-libraries#publishing-your-library)). Если вы опубликуете это как  `@example/my-builder`, вы можете установить его с помощью следующей команды.

<code-example language="sh">

npm install @example/my-builder

</code-example>

{@a creating-a-builder}
## Создание застройщика

В качестве примера давайте создадим конструктор, который выполняет команду оболочки.
Чтобы создать строитель, используйте  `createBuilder()`  CLI Builder и возвращает  `Promise<BuilderOutput>`  Объект.

<code-example
  path="cli-builder/src/my-builder.ts"
  header="src/my-builder.ts (builder skeleton)"
  region="builder-skeleton">
</code-example>

Теперь давайте добавим немного логики.
Следующий код извлекает команду и аргументы из пользовательских параметров, порождает новый процесс и ожидает его завершения.
Если процесс успешен (возвращает код 0), он разрешает возвращаемое значение.

<code-example
  path="cli-builder/src/my-builder.ts"
  header="src/my-builder.ts (builder)"
  region="builder">
</code-example>

{@a handling-output}
### Обработка вывода

По умолчанию  `spawn()` Метод выводит все в стандартный вывод процесса и выдает ошибку.
Чтобы упростить тестирование и отладку, мы можем вместо этого перенаправить вывод в регистратор CLI Builder.
Это также позволяет самому сборщику выполняться в отдельном процессе, даже если стандартный вывод и ошибка деактивированы (как в [приложение Electron](https://electronjs.org/)).

Мы можем извлечь экземпляр Logger из контекста.

<code-example
  path="cli-builder/src/my-builder.ts"
  header="src/my-builder.ts (handling output)"
  region="handling-output">
</code-example>

{@a progress-and-status-reporting}
### Отчет о проделанной работе и статусе

CLI Builder API включает в себя инструменты отчетов о ходе выполнения и состоянии, которые могут предоставлять подсказки для определенных функций и интерфейсов.

Чтобы сообщить о прогрессе, используйте  `BuilderContext.reportProgress()`  Метод, который принимает текущее значение, (необязательно) итоговое значение и строку состояния в качестве аргументов.
Всего может быть любое число; например, если вы знаете, сколько файлов вам нужно обработать, общее количество может быть числом файлов, а текущим должно быть число, обработанное до сих пор.
Строка состояния не изменяется, если вы не передадите новое строковое значение.

Вы можете увидеть [пример](https://github.com/angular/angular-cli/blob/ba21c855c0c8b778005df01d4851b5a2176edc6f/packages/angular_devkit/build_angular/src/tslint/index.ts#L107)того, как  `tslint`  строитель сообщает о прогрессе.

В нашем примере команда оболочки либо завершается, либо все еще выполняется, поэтому нет необходимости в отчете о ходе выполнения, но мы можем сообщить о состоянии, чтобы родительский сборщик, который вызвал нашего сборщика, знал, что происходит.
Использовать  `BuilderContext.reportStatus()`  Метод для генерации строки состояния любой длины.
(Обратите внимание, что нет никакой гарантии, что длинная строка будет показана целиком; она может быть обрезана, чтобы соответствовать пользовательскому интерфейсу, который ее отображает.)
Передайте пустую строку, чтобы удалить статус.

<code-example
  path="cli-builder/src/my-builder.ts"
  header="src/my-builder.ts (progess reporting)"
  region="progress-reporting">
</code-example>

{@a builder-input}
## Строитель ввода

Вы можете вызвать компоновщик косвенно через команду CLI или напрямую через Angular CLI `ng run` Команда.
В любом случае вы должны предоставить требуемые входные данные, но можете разрешить другим входам по умолчанию значения, которые предварительно сконфигурированы для конкретной [* target*](guide/glossary#target), предоставляют предварительно определенную именованную конфигурацию переопределения и предоставляют дополнительные значения параметров переопределения при командная строка.

{@a input-validation}
### Подтверждение ввода

Вы определяете входные данные компоновщика в схеме JSON, связанной с этим компоновщиком.
Инструмент Architect собирает разрешенные входные значения в  `options`  объекта и проверяет их типы по схеме, прежде чем передать их в функцию построителя.
(Библиотека Schematics выполняет тот же тип проверки пользовательского ввода).

Для нашего примера строителя, мы ожидаем  `options`  значение чтобы быть  `JsonObject`  с двумя ключами:  `command`  которая является строкой, и  `args`  массив строковых значений.

Мы можем предоставить следующую схему для проверки типа этих значений.

<code-example language="json" header="command/schema.json">
{
  "$schema": "http://json-schema.org/schema",
  "type": "object",
  "properties": {
    "command": {
      "type": "string"
    },
    "args": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  }
}

</code-example>

<div class="alert is-helpful">

Это очень простой пример, но использование схемы для проверки может быть очень мощным.
Для получения дополнительной информации см. [Веб-сайт схем JSON](http://json-schema.org/).

</div>

Чтобы связать нашу реализацию компоновщика с ее схемой и именем, нам нужно создать *определения компоновщика* файл, на который мы можем указать в  `package.json`.

Создайте файл с именем  `builders.json`  Файл который выглядит следующим образом.

<code-example language="json" header="builders.json">

{
  "builders": {
    "command": {
      "implementation": "./command",
      "schema": "./command/schema.json",
      "description": "Runs any command line in the operating system."
    }
  }
}

</code-example>

в  `package.json`  файл, добавить  `builders`  ключ который сообщает инструменту Architect, где найти наш файл определения Builder.

<code-example language="json" header="package.json">

{
  "name": "@example/command-runner",
  "version": "1.0.0",
  "description": "Builder for Command Runner",
  "builders": "builders.json",
  "devDependencies": {
    "@angular-devkit/architect": "^1.0.0"
  }
}

</code-example>

Официальное имя нашего застройщика сейчас ` @example/command-runner:command`.
Первая часть - это имя пакета (разрешается с помощью разрешения узла), а вторая часть - имя построителя (разрешается с помощью  `builders.json`  файл).

Используя один из наших  `options`  очень просты, мы сделали это в предыдущем разделе, когда мы получили доступ  `options.command`.

<code-example
  path="cli-builder/src/my-builder.ts"
  header="src/my-builder.ts (report status)"
  region="report-status">
</code-example>

{@a target-configuration}
### Конфигурация цели

Строитель должен иметь определенную цель, которая связывает его с определенной входной конфигурацией и [проектом](guide/glossary#project).

Цели определены в  `angular.json`   [файл конфигурации CLI](guide/workspace-config).
Цель указывает используемый компоновщик, его конфигурацию параметров по умолчанию и именованные альтернативные конфигурации.
Инструмент Architect использует определение цели для разрешения параметров ввода для данного прогона.

 `angular.json` Файл содержит раздел для каждого проекта, а раздел «architect» каждого проекта настраивает цели для сборщиков, используемых командами CLI, такими как «build», «test» и «lint».
По умолчанию, например,  `build`  команда запускает компоновщик   `@angular-devkit/build-angular:browser` для выполнения задачи сборки и передает значения параметров по умолчанию, как указано для  `build`  цель в    `angular.json`.

<code-example language="json" header="angular.json">
{
  "myApp": {
    ...
    "architect": {
      "build": {
        "builder": "@angular-devkit/build-angular:browser",
        "options": {
          "outputPath": "dist/myApp",
          "index": "src/index.html",
          ...
        },
        "configurations": {
          "production": {
            "fileReplacements": [
              {
                "replace": "src/environments/environment.ts",
                "with": "src/environments/environment.prod.ts"
              }
            ],
            "optimization": true,
            "outputHashing": "all",
            ...
          }
        }
      },
      ...

</code-example>

Команда передает сборщику набор параметров по умолчанию, указанных в разделе «Параметры».
Если вы передадите  `--configuration=production`  флаг, он использует значения переопределения, указанные в  `production`  альтернативной конфигурации.
Вы можете указать дополнительные опции отдельно в командной строке.
Вы также можете добавить больше альтернативных конфигураций к  `build`  цель, чтобы определить другие среды, такие как  `stage`  или  `qa`.

{@a target-strings}
#### Целевые строки

Универсальный `ng run` Команда CLI принимает в качестве первого аргумента целевую строку проекта формы *: target [: configuration]*.

* *project*: имя проекта Angular CLI, с которым связан целевой объект.

* *target*: именованная конфигурация компоновщика из  `architect`  отдел  `angular.json`  файл.

* *configuration*: (необязательно) Имя определенной переопределения конфигурации для данной цели, как определено в  `angular.json`  файл.

Если ваш конструктор вызывает другого, ему может понадобиться прочитать переданную целевую строку.
Вы можете разобрать эту строку в объект, используя  `targetFromTargetString()`  из  `@angular-devkit/architect`.

{@a schedule-and-run}
## Расписание и запуск

Архитектор управляет строителями асинхронно.
Для вызова компоновщика вы планируете запуск задачи, когда все настройки конфигурации завершены.

Функция построителя не выполняется, пока планировщик не вернет  `BuilderRun`  объект.
CLI обычно планирует задачи, вызывая  `BuilderContext.scheduleTarget()`  Функция, а затем разрешает параметры ввода с использованием определения цели в  `angular.json`  файл.

Архитектор разрешает параметры ввода для заданной цели, беря объект параметров по умолчанию, затем перезаписывая значения из использованной конфигурации (если есть), а затем перезаписывая значения из объекта переопределения, передаваемого в  `BuilderContext.scheduleTarget()`.
Для Angular CLI объект переопределения создается из аргументов командной строки.

Архитектор проверяет полученные значения параметров по схеме компоновщика.
Если входные данные действительны, Architect создает контекст и выполняет компоновщик.

Для получения дополнительной информации см. [Настройка рабочей области](guide/workspace-config).

<div class="alert is-helpful">

   Вы также можете вызвать сборщик напрямую из другого сборщика или выполнить тестирование, вызвав  `BuilderContext.scheduleBuilder()`.
   Вы передаете  `options`  возражают непосредственно к методу, и значения этих опций проверяются по схеме компоновщика без дальнейшей корректировки.

   Только   `BuilderContext.scheduleTarget()` Метод разрешает конфигурацию и переопределяет через  `angular.json`  файл.

</div>

{@a default-architect-configuration}
### Стандартная конфигурация архитектора

Давайте создадим простой  `angular.json`  файл который помещает целевые конфигурации в контекст.

Мы можем опубликовать строитель в НПМ (см [Публикация вашей библиотеки](guide/creating-libraries#publishing-your-library)), и установите его с помощью следующей команды:

<code-example language="sh">

npm install @example/command-runner

</code-example>

Если мы создадим новый проект с `ng new builder-test`, сгенерированный  `angular.json`  Файл выглядит примерно так, только с конфигурациями компоновщика по умолчанию.

<code-example language="json" header="angular.json">

{
  // ...
  "projects": {
    // ...
    "builder-test": {
      // ...
      "architect": {
        // ...
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            // ... more options...
            "outputPath": "dist/builder-test",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": "src/polyfills.ts",
            "tsConfig": "src/tsconfig.app.json"
          },
          "configurations": {
            "production": {
              // ... more options...
              "optimization": true,
              "aot": true,
              "buildOptimizer": true
            }
          }
        }
      }
    }
  }
  // ...
}

</code-example>

{@a adding-a-target}
### Добавление цели

Давайте добавим новую цель, которая запустит наш конструктор для выполнения определенной команды.
Эта цель скажет строителю бежать  `touch` на файл, чтобы обновить дату его изменения.

Нам нужно обновить  `angular.json`  Файл для добавления цели для этого компоновщика в раздел «архитектор» нашего нового проекта.

* Мы добавим новый целевой раздел к объекту "architect" для нашего проекта.

* Цель с именем "touch" использует наш конструктор, который мы опубликовали для  `@example/command-runner`  . (См. [Публикация вашей библиотеки](guide/creating-libraries#publishing-your-library))

* Объект параметров предоставляет значения по умолчанию для двух входных данных, которые мы определили;  `command`, которая является командой Unix для выполнения, и  `args`  - массив, содержащий файл для работы.

* Ключ конфигурации является необязательным, мы его пока оставим.

<code-example language="json" header="angular.json">

{
  "projects": {
    "builder-test": {
      "architect": {
        "touch": {
          "builder": "@example/command-runner:command",
          "options": {
            "command": "touch",
            "args": [
              "src/main.ts"
            ]
          }
        },
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "outputPath": "dist/builder-test",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": "src/polyfills.ts",
            "tsConfig": "src/tsconfig.app.json"
          },
          "configurations": {
            "production": {
              "fileReplacements": [
                {
                  "replace": "src/environments/environment.ts",
                  "with": "src/environments/environment.prod.ts"
                }
              ],
              "optimization": true,
              "aot": true,
              "buildOptimizer": true
            }
          }
        }
      }
    }
  }
}

</code-example>

{@a running-the-builder}
### Работает строитель

Чтобы запустить наш конструктор с конфигурацией по умолчанию для новой цели, используйте следующую команду CLI в оболочке Linux.

<code-example language="sh">

   ng run builder-test:touch

</code-example>

Это запустит  `touch`  команды на  `src/main.ts`  файл.

Вы можете использовать аргументы командной строки, чтобы переопределить настроенные значения по умолчанию.
Например, запустить с другим  `command`  Значение, используйте следующую команду CLI.

<code-example language="sh">

ng run builder-test:touch --command=ls

</code-example>

Это назовет  `ls`  команда вместо  `touch`  команды.
Поскольку мы не переопределили параметр *args*, в нем будет показана информация о  `src/main.ts`  Файл (значение по умолчанию для цели).

{@a testing-a-builder}
## Тестирование строителя

Используйте интеграционное тестирование для своего сборщика, чтобы вы могли использовать планировщик Architect для создания контекста, как в этом [пример](https://github.com/mgechev/cli-builders-demo).

* В каталоге с исходным кодом компоновщика мы создали новый тестовый файл  `my-builder.spec.ts`  . Код создает новые экземпляры  `JsonSchemaRegistry`  (для проверки схемы),  `TestingArchitectHost`  (реализация в памяти  `ArchitectHost`) и  `Architect`.

* Мы добавили  `builders.json`  Файл рядом с файлом компоновщика [файл  `package.json` ](https://github.com/mgechev/cli-builders-demo/blob/master/command-builder/builders.json)и изменил файл пакета так, чтобы он указывал на него.

Вот пример теста, который запускает компоновщик команд.
Тест использует строитель для запуска `node --print 'foo'`, затем проверяет, что  `logger`  содержит запись для  `foo`.

<code-example
  path="cli-builder/src/my-builder.spec.ts"
  header="src/my-builder.spec.ts">
</code-example>

<div class="alert is-helpful">

   При запуске этого теста в вашем репо вам необходим [  `ts-node`  ](https://github.com/TypeStrong/ts-node)пакет . Вы можете избежать этого, переименовав  `my-builder.spec.ts`  to  `my-builder.spec.js`.

</div>

{@a watch-mode}
### Смотреть режим

Архитектор ожидает, что сборщики запустятся один раз (по умолчанию) и вернутся.
Это поведение не полностью совместимо со сборщиком, который следит за изменениями (например, Webpack).
Архитектор может поддерживать режим просмотра, но есть некоторые вещи, на которые стоит обратить внимание.

* Для использования в режиме наблюдения функция обработчика должна возвращать Observable. Архитектор подписывается на Observable до тех пор, пока он не завершит работу, и может использовать его повторно, если построитель запланирован снова с теми же аргументами.

* Строитель всегда должен испускать  `BuilderOutput`  Объект после каждого выполнения. После того, как он был выполнен, он может войти в режим просмотра, который будет вызван внешним событием. Если событие запускает его для перезапуска, сборщик должен выполнить  `BuilderContext.reportRunning()`  Функция сообщает архитектору, что он снова работает. Это не позволяет архитектору остановить конструктор, если запланирован другой запуск.

Когда ваш строитель звонит  `BuilderRun.stop()`  чтобы выйти из режима наблюдения, Архитектор отписывается от Observable для сборщика и вызывает для его очистки логику демонтажа.
(Такое поведение также позволяет останавливать и очищать долго работающие сборки.)

В общем, если ваш строитель наблюдает за внешним событием, вы должны разделить свой пробег на три этапа.

1. **Запуск**
   Например, веб-пакет компилируется. Это заканчивается, когда веб-пакет заканчивается, и ваш конструктор выдает  `BuilderOutput`  Объект.

1. **Наблюдение**
   Между двумя запусками смотрите внешний поток событий. Например, webpack следит за файловой системой на предмет любых изменений. Это заканчивается, когда Webpack возобновляет сборку, и  `BuilderContext.reportRunning()`  вызывается. Это восходит к шагу 1.

1. **Завершение**
   Либо задача полностью выполнена (например, веб-пакет должен был запускаться несколько раз), либо запуск компоновщика был остановлен (с помощью  `BuilderRun.stop()`  ). Ваша логика демонтажа выполнена, и Архитектор отписывается от Observable вашего строителя.

{@a summary}
## Резюме

API-интерфейс CLI Builder предоставляет новый способ изменения поведения Angular CLI с помощью компоновщиков для выполнения пользовательской логики.

* Построители могут быть синхронными или асинхронными, выполняться один раз или отслеживать внешние события и могут планировать других построителей или цели.

* У строителей есть опции по умолчанию, указанные в  `angular.json`  конфигурации, который может быть перезаписан альтернативной конфигурацией для цели и дополнительно перезаписан флагами командной строки.

* Мы рекомендуем использовать интеграционные тесты для тестирования сборщиков архитектуры. Вы можете использовать модульные тесты для проверки логики, которую выполняет построитель.

* Если ваш строитель возвращает Observable, он должен очиститься в логике разрыва этого Observable.

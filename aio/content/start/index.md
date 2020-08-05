{@a getting-started-with-angular-your-first-app}
# Начало работы с Angular: Ваше первое приложение

Добро пожаловать в Angular!

Этот учебник знакомит вас с основами Angular, он проведет вас через простой сайт электронной коммерции с каталогом, корзиной покупок и формой оформления заказа.
Чтобы помочь вам начать работу сразу, в этом руководстве используется простое готовое приложение, которое вы можете изучить и поиграть в интерактивном режиме.

<div class="callout is-helpful">
<header>Новичок в веб-разработке?</header>


Есть много ресурсов, чтобы дополнить Angular Docs. Руководства Mozilla по MDN включают в себя введения по [HTML](https://developer.mozilla.org/en-US/docs/Learn/HTML "Learning HTML: Guides and tutorials") и [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript "JavaScript"). [Документация TypeScript](https://www.typescriptlang.org/docs/home.html "TypeScript documentation"), включая 5-минутное руководство. Различные платформы онлайн-курсов, такие как [Udemy](http://www.udemy.com "Udemy online courses") и [Codecademy](https://www.codecademy.com/ "Codecademy online courses"), также охватывают основы веб-разработки.

</div>


{@a new-project}
{@a create-a-new-project}
## Создание нового проекта

<h4>
<live-example name="getting-started-v0" noDownload>Нажмите здесь, чтобы создать готовый пример проекта в StackBlitz.</live-example>
</h4>

<div class="lightbox">
  <img src="generated/images/guide/start/new-app-all.gif" alt="Starter online store app">
</div>

* Панель предварительного просмотра справа показывает начальное состояние примера приложения Angular.
Он определяет фрейм с верхней панелью (содержащей название магазина и значок оформления заказа) и заголовок списка товаров (который будет заполняться и динамически обновляться данными из приложения).

* На панели проекта слева отображаются исходные файлы, из которых состоит приложение, включая все файлы инфраструктуры и конфигурации. Текущий выбранный файл отображается посередине панели редактора.

Прежде чем перейти к исходной структуре, в следующем разделе показано, как заполнить HTML *шаблон* для списка товаров, используя предоставленные образцы данных.
Это должно дать вам представление о том, как легко динамически изменять и обновлять страницу.

<div class="callout is-helpful">
<header>Советы StackBlitz</header>

* Войдите в StackBlitz, чтобы иметь возможность сохранять и продолжать работу.
Если у вас есть учетная запись GitHub, вы можете войти в StackBlitz
с этим аккаунтом. Для того, чтобы сохранить ваш прогресс, в первую очередь
разверните проект с помощью кнопки Fork вверху слева,
тогда вы сможете сохранить свою работу в своей учетной записи StackBlitz, нажав кнопку Save.
* Чтобы скопировать пример кода из этого учебника, щелкните на значок
в правом верхнем углу окна примера кода, а затем вставьте
фрагмент кода из буфера обмена в StackBlitz.
* Если панель предварительного просмотра StackBlitz не показывает, то что вы
ожидаете, нажмите Save, а затем кнопку Refresh.
* StackBlitz постоянно совершенствуется, так что могут быть
небольшие различия в сгенерированном коде, но в приложении
поведение будет таким же.
* При генерации учебного приложения из этой документации, StackBlitz создаст стартовые
файлы и тестовые данные для вас. Файлы, которые вы будете использовать во время прохождения обучения находятся в папке `src` в примере приложения StackBlitz.

</div>

<div class="alert is-helpful">

Если вы перейдете непосредственно в [среду онлайн-разработки StackBlitz](https://stackblitz.com/) и выберете [start a new  Angular workplace](https://stackblitz.com/fork/angular), вы получите приложение-заглушку, а не этот [иллюстративный пример](#new-project). Как только вы познакомитесь с основными понятиями здесь, это может быть полезно для интерактивной работы во время изучения Angular.

В реальной разработке обычно вы будете использовать [Angular CLI](guide/glossary#command-line-interface-cli) - мощный инструмент командной строки, который позволяет создавать и изменять приложения. Для получения дополнительной информации см. [Обзор CLI](cli).

</div>


{@a template-syntax}
## Синтаксис шаблона

Шаблонный синтаксис Angular расширяет HTML и JavaScript.
В этом разделе вы узнаете о синтаксисе шаблонов путем расширения области «товары».

<div class="alert is-helpful">

Чтобы помочь вам начать работу, следующие шаги используют предварительно определенные данные о товаре из файла `products.ts` (уже созданного в приложении-примере в StackBlitz) и методы из `product-list.component.ts`.

</div>

1. В папке `product-list`, откройте файл шаблона `product-list.component.html`.

1. Измените шаблон списка товаров, чтобы отобразить список названий товаров.

    1. Каждый товар в списке отображается одинаково, один за другим на странице. Чтобы перебрать предварительно определенный список товаров, добавьте директиву `*ngFor` на `<div>`, следующим образом :

      <code-example header="src/app/product-list/product-list.component.html" path="getting-started/src/app/product-list/product-list.component.2.html" region="ngfor">
      </code-example>

      С `*ngFor`, `<div>` повторяется для каждого товара в списке.

      <div class="alert is-helpful">

       `*ngFor` - это «структурная директива». Структурные директивы формируют или изменяют структуру DOM, обычно добавляя, удаляя и манипулируя элементами, к которым они добавлены. Директивы со звездочкой, `*`, являются структурными директивами.

      </div>

    1. Чтобы отобразить названия товаров, используйте синтаксис интерполяции `{{ }}` . Интерполяция отображает значение свойства в виде текста. Внутри `<div>`, добавьте `<h3>` чтобы отобразить интерполированное свойства имени товара:

      <code-example path="getting-started/src/app/product-list/product-list.component.2.html" header="src/app/product-list/product-list.component.html" region="interpolation">
      </code-example>

      Панель предварительного просмотра мгновенно обновляется, чтобы отобразить название каждого товара в списке.

      <div class="lightbox">
        <img src="generated/images/guide/start/template-syntax-product-names.png" alt="Product names added to list">
      </div>

1. Чтобы сделать каждое название товара ссылкой на детальную информацию о товаре, добавьте элемент `<a>` и определите его title как название товара, используя синтаксис связывания свойства `[ ]`, это выглядит следующим образом:

    <code-example path="getting-started/src/app/product-list/product-list.component.2.html" header="src/app/product-list/product-list.component.html">
    </code-example>

    На панели предварительного просмотра удерживайте курсор над именем товара,
    чтобы увидеть значение связанного свойства, которое является
    названием товара плюс слово «details».
    Интерполяция `{{ }}` позволяет вам визуализировать
    значение свойства в виде текста; привязка свойства `[ ]` позволяет вам
    использовать значение свойства в шаблоне.

    <div class="lightbox">
      <img src="generated/images/guide/start/template-syntax-product-anchor.png" alt="Product name anchor text is product name property">
    </div>


4. Добавьте описания товаров. Для элемента `<p>` используйте `*ngIf` чтобы Angular создавал элемент `<p>` только если текущий товар имеет описание.

    <code-example path="getting-started/src/app/product-list/product-list.component.3.html" header="src/app/product-list/product-list.component.html">
    </code-example>

    Приложение теперь отображает название и описание каждого товара в списке. Обратите внимание, что последний товар не имеет  параграфа описания. Поскольку свойство description товара пустое, Angular не создает `<p>` элемент - включая слово «Description».

    <div class="lightbox">
      <img src="generated/images/guide/start/template-syntax-product-description.png" alt="Product descriptions added to list">
    </div>

5. Добавьте кнопку, чтобы пользователи могли поделиться товаром с друзьями. Свяжите событие `click` кнопки с методом `share()` (в `product-list.component.ts`). Для привязки событий используйте скобки, `( )`, вокруг события, как в примере для элемента `<button>`:

    <code-example path="getting-started/src/app/product-list/product-list.component.4.html" header="src/app/product-list/product-list.component.html">
    </code-example>

    Каждый товар теперь имеет кнопку «Share»:

    <div class="lightbox">
      <img src="generated/images/guide/start/template-syntax-product-share-button.png" alt="Share button added for each product">
    </div>

    Проверьте кнопку «Share»:

    <div class="lightbox">
      <img src="generated/images/guide/start/template-syntax-product-share-alert.png" alt="Alert box indicating product has been shared">
    </div>

Приложение теперь состоит из списка товаров и функции Поделиться.
На данном этапе, вы научились использовать пять общих черт синтаксиса шаблона ANGULAR:
* `*ngFor`
* `*ngIf`
* Интерполяция `{{ }}`
* Связывание свойств `[ ]`
* Связывание событий `( )`


<div class="alert is-helpful">

Для получения дополнительной информации о полных возможностях синтаксиса шаблона Angular
см. [Синтаксис шаблона](guide/template-syntax "Template Syntax").

</div>


{@a components}
{@a components}
## Компоненты

*Компоненты* определяют области ответственности в пользовательском интерфейсе и позволяют вам повторно использовать наборы функциональности.
Вы уже создали один компонент списка товаров.

Компонент состоит из трех вещей:
* **Класс компонента** - отвечает за данные и функциональность. В предыдущем разделе данные о товаре и метод `share()` в классе компонента обрабатывает данные и функциональность соответственно.
* **HTML-шаблон** - определяет пользовательский интерфейс. В предыдущем разделе HTML-шаблон списка товаров отображал название, описание и кнопку «Share» для каждого товара.
* **Компонент-специфичные стили** - определяют внешний вид.
Хотя в нашем случае список товаров не имеет стилей, это то место, где компонент определяет CSS.

<!--
### Class definition

Let's take a quick look a the product list component's class definition:

1. In the `product-list` directory, open `product-list.component.ts`.

1. Notice the `@Component` decorator. This provides metadata about the component, including its templates, styles, and a selector.

    * The `selector` is used to identify the component. The selector is the name you give the Angular component when it is rendered as an HTML element on the page. By convention, Angular component selectors begin with the prefix such as `app-`, followed by the component name.

    * The template and style filename also are provided here. By convention each of the component's parts is in a separate file, all in the same directory and with the same prefix.

1. The component definition also includes an exported class, which handles functionality for the component. This is where the product list data and `Share()` method are defined.

### Composition
-->

Приложение Angular состоит из дерева компонентов, в котором каждый компонент Angular имеет определенную цель и ответственность.

В настоящее время, например, наше приложение состоит из трех компонентов:

<div class="lightbox">
  <img src="generated/images/guide/start/app-components.png" alt="Online store with three components">
</div>

* `app-root` (оранжевая рамка) - оболочка приложения. Это первый загружаемый компонент, который является родителем всех других компонентов. Вы можете думать об этом как о базовой странице.
* `app-top-bar` (синий фон) - это название магазина и кнопка оформления заказа.
* `app-product-list` (фиолетовый ящик) - это список товаров, который вы изменили в предыдущем разделе.

Следующий раздел расширяет возможности приложения, добавляя новый компонент - оповещение о товаре - как дочерний компонент компонента списка товаров.


<div class="alert is-helpful">

Для получения дополнительной информации о компонентах и ​​их взаимодействии с шаблонами см. [Введение в компоненты](guide/architecture-components "Architecture > Introduction to Components").

</div>


{@a input}
## Ввод

Сейчас в списке товаров отображается название и описание каждого товара.
Компонент списка товаров также определяет свойство `products`, содержащее импортированные данные для каждого товара из массива `products` в `products.ts`.

Следующим шагом является создание новой функции оповещения, которая принимает товар в качестве входных данных. Уведомление проверяет цену товара и, если цена превышает 700 долларов США, отображает кнопку «Notify Me», которая позволяет пользователям подписываться на уведомления, когда товар поступит в продажу.

1. Создайте новый компонент оповещений о товаре.

    1. Щелкните правой кнопкой мыши на папку `app` и используйте `Angular Generator` для генерации нового компонента с именем `product-alerts`.

        <div class="lightbox">
          <img src="generated/images/guide/start/generate-component.png" alt="StackBlitz command to generate component">
        </div>

        Генератор создаст файлы для всех трех частей компонента:
        * `product-alerts.component.ts`
        * `product-alerts.component.html`
        * `product-alerts.component.css`

1. Откройте `product-alerts.component.ts`.

    <code-example header="src/app/product-alerts/product-alerts.component.ts" path="getting-started/src/app/product-alerts/product-alerts.component.1.ts" region="as-generated"></code-example>

    1. Обратите внимание на декоратор `@Component()`. Это указывает на то, что следующий класс является компонентом. Он предоставляет метаданные о компоненте, включая его селектор, шаблоны и стили.

        * `selector` идентифицирует компонент. Селектор - это имя, которое вы даете компоненту Angular, когда он отображается в виде HTML-элемента на странице. По соглашению, Angular селекторы компонентов начинаются с префикса `app-`, сопровождаемый именем компонента.

        * Имена файлов шаблонов и стилей ссылаются на файлы HTML и CSS, которые генерирует StackBlitz.

    1. Определение компонента также экспортирует класс, `ProductAlertsComponent`, который обрабатывает функциональность для компонента.

1. Настройка оповещения о новом товаре компонента для получения товара в качестве входных данных:

    1. Импортируйте `Input` из `@angular/core`.

        <code-example path="getting-started/src/app/product-alerts/product-alerts.component.1.ts" region="imports" header="src/app/product-alerts/product-alerts.component.ts"></code-example>

    1. В классе `ProductAlertsComponent`, определите свойство `product` с декоратором `@Input()`. `@Input()` указывает на то, что значение свойства передается из родительского компонента, компонента списка товаров.

        <code-example path="getting-started/src/app/product-alerts/product-alerts.component.1.ts" region="input-decorator" header="src/app/product-alerts/product-alerts.component.ts"></code-example>

1. Определите представление для нового компонента оповещения о товаре.

    1. Откройте шаблон `product-alerts.component.html` и замените абзац кнопкой «Notify Me», которая появляется, если цена товара превышает 700 долларов США.

    <code-example header="src/app/product-alerts/product-alerts.component.html" path="getting-started/src/app/product-alerts/product-alerts.component.1.html"></code-example>

1. Отобразите новый компонент оповещения о товаре как дочерний элемент списка товаров.

    1. Откройте `product-list.component.html`.

    1. Чтобы добавить новый компонент, используйте его селектор `app-product-alerts` как элемент HTML.

    1. Передайте текущий товар в качестве входных данных для компонента, используя привязку свойства.

        <code-example header="src/app/product-list/product-list.component.html" path="getting-started/src/app/product-list/product-list.component.5.html" region="app-product-alerts"></code-example>

Новый компонент оповещения о товаре принимает товар в качестве входных данных из списка товаров. При этом, в зависимости от цены товара, отображается или скрывается кнопка «Notify Me». Цена телефона XL превышает 700 долларов, поэтому для этого товара появляется кнопка «Notify Me».

<div class="lightbox">
  <img src="generated/images/guide/start/product-alert-button.png" alt="Product alert button added to products over $700">
</div>

<div class="alert is-helpful">

Смотрите [Взаимодействие компонентов](guide/component-interaction "Components & Templates > Component Interaction") для получения дополнительной информации о передаче данных от родительского к дочернему компоненту, перехвате и обработке значения родительского объекта, а также об обнаружении и воздействии на изменения значений входных свойств.

</div>


{@a output}
## Вывод

Для того, чтобы заработала кнопка «Notify Me», вам нужно настроить две вещи:

  - компонент оповещения о товаре генерирует событие, когда пользователь нажимает кнопку «Notify Me»
  - компонент списка товаров реагирует на это событие

1. Откройте `product-alerts.component.ts`.

1. Импортируйте `Output` и `EventEmitter` из `@angular/core` :

    <code-example header="src/app/product-alerts/product-alerts.component.ts" path="getting-started/src/app/product-alerts/product-alerts.component.ts" region="imports"></code-example>

1. В классе компонента определите свойство `notify` с `@Output()` как экземпляр `EventEmitter()`. Это позволит компоненту оповещения о товаре генерировать событие при изменении значения свойства notify.

<div class="alert is-helpful">

  Когда Angular CLI генерирует новый компонент, он включает в себя пустой конструктор, интерфейс `OnInit` и метод `ngOnInit()`.
  Поскольку в следующем примере они не используются, для краткости они здесь опущены.

</div>

    <code-example path="getting-started/src/app/product-alerts/product-alerts.component.ts" header="src/app/product-alerts/product-alerts.component.ts" region="input-output"></code-example>

1. В шаблоне оповещения о товаре `product-alerts.component.html`, обновите кнопку «Notify Me», добавьте привязку события с методом `notify.emit()`.

    <code-example header="src/app/product-alerts/product-alerts.component.html" path="getting-started/src/app/product-alerts/product-alerts.component.html"></code-example>

1. Затем определите поведение, которое должно происходить, когда пользователь нажимает кнопку. Напомним, что когда дочерний элемент генерирует событие, реагирует на это родительский компонент списка товаров, а не компонент оповещения о товаре. В `product-list.component.ts`, определите метод `onNotify()`, аналогичный методу `share()`:

    <code-example header="src/app/product-list/product-list.component.ts" path="getting-started/src/app/product-list/product-list.component.ts" region="on-notify"></code-example>

1. Наконец, обновите компонент списка товаров, чтобы получать выходные данные из компонента оповещений товара.

    В `product-list.component.html`, свяжите компонент `app-product-alerts` (который отображает кнопку «Notify Me») с методом `onNotify()` компонента списка товаров.

    <code-example header="src/app/product-list/product-list.component.html" path="getting-started/src/app/product-list/product-list.component.6.html" region="on-notify"></code-example>

1. Попробуйте нажать на кнопку «Notify Me»:

    <div class="lightbox">
      <img src="generated/images/guide/start/product-alert-notification.png" alt="Product alert notification confirmation dialog">
    </div>


<div class="alert is-helpful">

См. [Взаимодействие компонентов](guide/component-interaction "Components & Templates > Component Interaction") для получения дополнительной информации о прослушивании событий от дочерних компонентов, чтении дочерних свойств или вызове дочерних методов, а также об использовании службы для двунаправленной связи между компонентами.

</div>


{@a next-steps}
## Следующие шаги

Поздравляем! Вы создали свое первое приложение Angular!

У вас есть основной каталог интернет-магазина со списком товаров, кнопкой «Share» и кнопкой «Notify Me».
Вы узнали об основах Angular: компонентах и синтаксисе шаблона.
Вы также узнали, как класс компонента и шаблон взаимодействуют, и как компоненты взаимодействуют друг с другом.

Чтобы продолжить изучение Angular, выберите один из следующих вариантов:
* [Перейдите к разделу «Маршрутизация»](start/start-routing "Getting Started: Routing"), чтобы создать страницу детальной информации о товаре , имеющую собственный шаблон URL, доступ к которой можно получить, щелкнув по названию товара.
* [Перейдите к разделу «Развертывание»](start/start-deployment "Getting Started: Deployment"), чтобы развернуть приложение в Firebase или перейти к локальной разработке.

Общее строение файлов конфигурации XKB.
---------------------------------------

Возможны три типа файлов конфигурации

*   ["Простая" конфигурация](https://web.archive.org/web/20190519184541/http://pascal.tsu.ru/other/xkb/gram-file.html#simple)
*   [Последовательность из "простых" блоков.](https://web.archive.org/web/20190519184541/http://pascal.tsu.ru/other/xkb/gram-file.html#blocks)
*   [Последовательность из "составных" блоков.](https://web.archive.org/web/20190519184541/http://pascal.tsu.ru/other/xkb/gram-file.html#complex)

### "Простая" конфигурация

Если в файле находится "простая" конфигурация, то в начале файла должен быть заголовок

  \[ Флаги \] ТипФайла \[ Имя \]  

после которого сразу следуют объявления (или инструкции). Например,

xkb\_keyсodes      <TLDE> = 49;    <AE01> = 10;  .......  

### Последовательность из "простых" блоков.

Однако, чаще используется другой формат файла - последовательность "простых" блоков. В таком файле объявления группируются в блоки, которые ограничиваются фигурными скобками - '**{...}**' (после каждого блока должна быть "точка с запятой" - '**;**').

Перед каждым блоком должен быть заголовок, такой же как и в файле с "простой" конфигурацией

 \[ Флаги \] ТипФайла   \[ Имя1 \] '{' \[ Объявления \] '};'   \[ Флаги \] ТипФайла   \[ Имя2 \] '{' \[ Объявления \] '};'  ...  

Например,

xkb\_symbols "basic" {....};  xkb\_symbols "us" {....};  ....  

### Типы файлов.

И в том и в другом формате используются одинаковые **"Типы Файлов"**. Это может быть одно из пяти слов

*   **xkb\_keycodes** - файл (или блок), в котором числовым значения скан-кодов даются символические имена
*   **xkb\_types** - файл, в котором описываются возможные типы клавиш (тип определяет - сколько различных значений может иметь одна и та же клавиша в зависимости от состояния модификаторов)
*   **xkb\_compat** - файл, в котором описывается "поведение" модификаторов
*   **xkb\_symbols** - основной файл, в котором каждому скан-коду (заданному символическим именем) назначаются все возможные значения, которые может выдавать конкретная клавиша (другими словами - "раскладка клавиатуры").
*   **xkb\_geometry** - описание расположения кнопок и индикаторов на клавиатуре

Надо отметить, что, если файл состоит из нескольких блоков, то все блоки должны быть одного типа. Отличаются они только именем.

Имя представляет собой произвольное слово в двойных кавычках.

Как можно заметить, в формате заголовка только **"ТипФайла"** должен присутствовать обязательно, а **"Имя"** может отсутствовать. Естественно, если файл предствляет собой "простую" конфигурацию или содержит только один блок, то именовать их необязательно. В этом случае, чтобы сослаться в настройках X-сервера на такую конфигурацию достаточно указать имя файла.

Но, если в файле находится несколько блоков, разумеется они должны иметь имена, причем разные. При этом, чтобы сослаться на конкретную конфигурацию, ее указывают в виде

 имя\_файла(имя\_блока)  

например,

 us(pc104)  

### Флаги.

В каждом заголовке может быть несколько флагов

*   **default** - этот флаг имеет смысл, если файл состоит из нескольких блоков. Он помечает один из блоков (только один !) как блок "по умолчанию". То есть, если где-то будет указано, что конфигурацию надо брать из такого файла, но при этом не сказано - из какого блока, то будет взят именно тот из блоков, который помечен флагом **"default"**.
*   **partial** - означает, что в этом блоке дано не полное описание соответствующего типа, а только его часть. Например, это может быть блок типа **xkb\_symbols**, в котором описаны только "функциональные" клавиши, или блок типа **xkb\_geometry**, в котором описано только расположение индикаторов.
*   **hidden** - означает, что определения из этого блока в "нормальном" состоянии клавиатуры (когда не активен ни один из модификаторов) не видны, и проявляются только при нажатии какого-нибудь модификатора. Например, блок типа **xkb\_symbols** в котором описаны коды которые выдает "дополнительная цифровая клавиатура" (keypad) при нажатом **Num\_Lock**.

Следующие флаги имеют смысл только для файлов (и блоков) типа **xkb\_symbols** и просто отмечают - какие группы клавиш описаны в этом блоке

*   **alphanumeric\_keys** - "алфавитно-цифровые"
*   **modifier\_keys** - модификаторы (Control, Alt, Meta и т.п.)
*   **keypad\_keys** - клавиши "дополнительной цифровой" клавиатуры
*   **function\_keys** - "функциональные" клавиши
*   **alternate\_group** - "альтернативная" группа, то есть символы какого-нибудь национального алфавита.

Надо заметить, что для самого X-сервера (точнее, для программы **xkbcomp**) имеет значение только флаг **"default"**, поскольку от него может зависеть выбор нужного блока. Остальные флаги нужны скорее юзеру, чтобы лучше ориентироваться в куче различных блоков и файлов.

Кстати, сводный список всех блоков конфигураций с их флагами можно найти в файлах **\*.dir** в директории **{XROOT}/lib/X11/xkb**. Названия файлов аналогичны названиям типов конфигурации - **keycodes, types, symbols** и т.д. Флаги там обозначаются одной буквой - первой буквой из названия соответствующего флага.

### Последовательность из "составных" блоков.

Наконец, рассмотрим третий тип конфигурационного файла - последовательность из "составных" блоков. Каждый такой "Составной Блок" оформляется как "простой" блок

 \[ Флаги \] СложныйТип \[ Имя \] '{' Блок { Блок } '}' ';'  

но внутри содержит не просто объявления, а блоки "простых" типов, например

xkb\_keymap "complete" {  	xkb\_keycodes  {...};  	xkb\_types     {...};  	xkb\_compat    {...};  	xkb\_symbols   {...};  	xkb\_geometry  {...};  };  

Так же, как и файл с "простыми" блоками, файл с "составными" блоками может содержать несколько таких "составных" блоков, отличающихся именами (один из блоков может быть помечен флагом **"default"**).

Существует три типа "составных" блоков

*   **xkb\_semantics** - такой блок должен содержать блок **xkb\_compat** и может также иметь в себе блок **xkb\_types**;
*   **xkb\_layout** - должен содержать блоки **xkb\_keycodes**, **xkb\_types**, **xkb\_symbols** и может, также, иметь в себе блок **xkb\_geometry**;
*   **xkb\_keymap** - наиболее полный блок, должен включать в себя все, что должны содержать предыдущие два типа (то есть - **xkb\_keycodes, xkb\_types, xkb\_compat xkb\_symbols**) и может включать дополнительно те компоненты, которые могут иметь в себе два предыдущих типа.
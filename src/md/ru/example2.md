Добавляем новую "старую" раскладку клавиатуры.
----------------------------------------------

Рассмотрим - как добавить еще одну группу с другой расскладкой клавиатуры.

Зачем это может понадобится?

Ну, например, проблема (описанная в ["Почему руссификация не работает?"](https://web.archive.org/web/20190621182120/http://pascal.tsu.ru/other/xkb/problems.html)) - у вас есть программы, в "бинарниках", статически слинкованные, которые напрочь отказываются понимать коды типа **Cyrillic\_\***. Можно специально для них изготовить раскладку, в которой будут не двубайтные коды русских букв, а однобайтные коды **KOI8-R**.

Возможно, вам захочется добавить раскладку в кодировке **cp1251** или еще какой-нибудь, которая отличается от стандартной расположением русских букв.

(Надо заметить, что этот путь (добавление новой кодировки русских букв с помощью дополнительной группы) - в общем-то, плохое решение. Тем более, если вы не используете новую locale. Правильно было бы - добавить соответствующую таблицу перекодировки в Xlib и изготовить подходящую "иксовую" locale.  
Но, как я уже сказал, я не предлагаю правильные решения :-), а только привожу примеры - как это можно сделать.)

Итак, давайте в этом примере сосредоточимся на задаче - добавление "однобайтной **koi8-r** кодировки" для "старых" или "тупых" клиентских программ.

Прежде всего, надо заметить, что у вас должны быть задействованы уже две группы. Первая - "латиница", вторая - "кириллица" с "правильными" кодами для русских букв (**Cyrillic\_\***).

Новую группу надо добавлять не "в конец" (как третью), а "в середину" - так чтобы она была второй, а "правильная" кириллица - третьей.

Почему? Потому, что "традиционные" программы (со старой Xlib) понимают только первую и вторую группу. Причем, вторую выбирают тогда, когда установлен модификатор, соответствующий символу **Mode\_switch**. Ну, об установке модификатора позаботится "таблица" совместимости XKB. Если она у вас стандартная, то соответствующий модификатор будет выставляться для всех групп, кроме первой (то есть, в нашем случае и для "старой" кодировки и для "новой").

А вот искать символы "старые" программы будут всегда только во второй группе (об остальных они даже не подозревают). А "новые" программы, совместимые с XKB и так найдут свою раскладку, будь она во второй, третей, или даже в четвертой группе.

Еще одно замечание. Естественно, добавлять новые символы мы будем в **xkb\_symbols**. При этом будет логично не писать ее "с нуля", а взять за основу уже существующий файл **symbols/ru** и дополнить его. Если мы наш файл "приплюсуем" к соответствующему описанию **xkb\_symbols**, то у нас получится два фйла описания одних и тех же клавиш, при этом второй полностью переписывает первый.

Поэтому, логично, если мы из описания вообще выкинем "стандартный" файл "**ru**", а оставим только свой.

То есть соответствующая строчка в нашем "полном описании конфигурации" будет выглядеть не как

xkb\_symbols { include "en\_US(105)+ru+new-ru" };

а немного короче

xkb\_symbols { include "en\_US(105)+new-ru" };

Итак. Берем в свою директорию файл **symbols/ru** и начинаем его "корежить".  
Надо заметить, что, скорее всего в нем вы обнаружите три блока -

xkb\_symbols "toggle" {...}; xkb\_symbols "shift\_toggle" {...}; xkb\_symbols "basic" {...};

Причем, реально расположение русских букв описывает только третий, а первые два просто добавляют два разных способа преключения "рус/лат".

Обычно, если у вас в полной конфигурации указан просто файл **ru**, загружается первый блок. И переключателем "рус/лат" становится клавиша **CapsLock**.

Во-первых, для нашей задачи это очень плохо (то, как описаны символы для этой конопки). Но об этом поговорим немного [позже](https://web.archive.org/web/20190621182120/http://pascal.tsu.ru/other/xkb/example2.html#Lock).

А сейчас я предлагаю просто выкинуть ("вычистить") два первых блока и оставить только блок "**basic**". А переключатель допишем потом прямо в блок "**basic**", или "приплюсуем" подходящий блок из файла **symbols/group** (в нем описано аж шесть разных способов переключения).

Итак. Выкинули два первых блока и начали исправлять/дополнять блок "**basic**".  
Нам нужно для каждой кнопки, которая в описаниях содержит символы **Cyrillic**, дописать в середину (второй группой) еще одну группу с однобайтными символами в кодировке **koi8**. Напомню, что символы можно задавать не только символическими именами (типа **Cyrillic\_\***), а просто цифровым кодом. Например, клавишу

key <AB01> { \[ z, Z \], \[ Cyrillic\_ya, Cyrillic\_YA \] };

мы должны описать как

key <AB01> { \[ z, Z \], \[ 0xd1, 0xf1 \], \[ Cyrillic\_ya, Cyrillic\_YA \] };

Естественно, первый код соответсвует маленькой букве, а второй - большой.

Как подобрать коды? Ну, во-первых, по названию букв можно догадаться - какую русскую букву они имеют ввиду и, если у вас есть под рукой табличка - какой русской букве, какой код **koi8-r** соответствует, просто переписать оттуда.

А во-вторых, могу подсказать, что младший байт кода **Cyrillic** на самом деле соответствует коду этой буквы в **koi8**, а в старшем байте всегда шестерка.

Поэтому, можно взять файл, в котором описываются числовые значения для кодов типа **Cyrillic\_\*** - это файл **/usr/X11R6/include/X11/keysymdef.h**. И списать соответствующие коды оттуда, отбрасывая первую шестерку.

Особо ленивые могут взять готовый файл [здесь](https://web.archive.org/web/20190621182120/http://pascal.tsu.ru/other/xkb/ru-koi-3gr).

Итак, мы составили новый файл описания клавиатуры, в котором теперь три группы. Надо не забыть о переключателе меджу группами.

Во-первых, надо заметить, что все варианты переключателей используют для своих целей специальный символ - **ISO\_Next\_Group**, а его семантика, описанная в **xkb\_compat** такова, что он просто перебирает все возможные группы. То есть, при нажатии клавиши (или комбинации клавиш) с таким символом просто текущее значение группы увеличивается на единицу, а когда счетчик доходит до последней группы, он просто возвращается на первую (см. ["Внутренности":"Методы выравнивания номера группы"](https://web.archive.org/web/20190621182120/http://pascal.tsu.ru/other/xkb/internals.html#wrap)).

Таким образом тем же самым перключателем "рус/лат" мы можем последовательно перебирать все три группы.

Вы можете выбрать ваш любимый способ переключения из файла **symbols/group** и "приплюсовать" его к описанию **xkb\_symbols**, например,

xkb\_symbols { include "en\_US(105)+new\_ru+group(shift\_toggle)" };

Только одно замечание о переключении клавишей **CapsLock**.  
Дело в том, что традиционно на эту же клавишу "подвешивают" и символ **Caps\_Lock**, чтобы она могла выполнять и свою основную функцию (нажатая с Shift'ом).

Проблема в том, что к этому символу присоединен реальный модификатор **Lock**. При этом, в конечном счете, XKB привязывает реальные модификаторы не к символу, а к скан-коду клавиши. Поэтому при нажатии этой клавиши в "состоянии модификаторов" появится не только модификатор, который указывает на то, что выбрана альтернативная группа, но и реальный модификатор **Lock** (хотя вы нажимаете клавишу как **ISO\_Next\_Group**, а не как **Caps\_Lock**).

В результате, клиентская программа увидит, что вы не только выбрали альтернативную группу, но "намертво" прижали **Shift** (хотя **Shift** должен отменять действие **Lock**, но... почему-то не работает). Естественно, при этом жми, не жми **Shift** - у вас всегда будут получаться только маленькие (или только большие буквы).

Для того, чтобы этого не происходило, надо бы "отцепить" реальный модификатор **Lock** от этой клавиши. К сожалению, "привязка" модификатора к символу **Caps\_Lock** "зарыта" глубоко в файлах, которые "инклюдятся" в **en\_US**. А отменить это присвоение в дополнительных файлах уже нельзя.

Поэтому, чтобы не "перелопачивать" все файлы, которые неявно включаются в нашу полную конфигурацию, лучше просто убрать символ **Caps\_Lock** из описания клавиши **<CAPS>**.

Если вам жалко расставаться с этой функцией - "подвесьте" ее на какую-нибудь другую клавишу. А если вы используете для "рус/лат" другой способ - то и описанной проблемы у вас не будет.

Итак. Если ваш любимый способ переключения - клавиша **CapsLock**, то последнее, что нам надо сделать - не "приплюсовывать" этот способ из файла **symbols/group** (там эта клавиша с кодом **Caps\_Lock**), а просто вписать в нашу новую раскладку определение для клавиши **<CAPS>** -

key <CAPS> { \[ISO\_Next\_Group\] };

Теперь можно прегрузить конфигурацию программой **xkbcomp** и посмотреть результат.

Кстати, забавно, что "старые" программы теперь работают когда у вас включена и вторая группа и третья. Потому, что они в обоих случаях видят в "состоянии модификаторов" модификатор, который указывает, что включена альтернативная группа, а коды символов всегда берут из второй группы. То есть, для них не заметна разница между двумя состояниями XKB (включена вторая или третья группы).  
Интересно, что некоторые "новые" программы, например - xterm, тоже правильно работают с обоими группами. Потому, что... фиг его знает - почему :-)

Единственное неудобство - сложное переключение групп (особенно, если вы не пользуетесь никаким индикаторами перключения групп). Очень непривычно, когда переключатель "рус/лат" вдруг обретает не два, а три состояния.

А вот о том, как сделать переключение между тремя (и больше) группами более приятным, мы рассмотрим в следующем примере -

### ["Вариации на тему" - переключатели "рус/лат" (и еще раз - "рус").](https://web.archive.org/web/20190621182120/http://pascal.tsu.ru/other/xkb/example3.html)
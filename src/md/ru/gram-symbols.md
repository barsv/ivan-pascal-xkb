Файл типа xkb\_symbols.
-----------------------

В этих файлах собственно и описыватся "раскладка клавиатуры". То есть, для каждой физической клавиши (скан-кода) задается набор всех возможных символов, которые будут выдаваться в зависимости от текущего "состояния клавиатуры" (номера группы и состояния модификаторов).

Напомню, что с каждой клавишей связана таблица символов (**symbols**). Эта таблица делится на под-таблицы - группы (**group**), выбор конкретной группы зависит от текущего номера группы в "состоянии клавиатуры". Каждая группа, в свою очередь делится на колонки - уровни (**shift level**), выбор уровня зависит от типа клавиши (**type**) в данной группе и состояния модификаторов.

Надо заметить, что разные клавиши могут иметь разное количество групп, и разные группы одной клавиши могут иметь разное количество уровней.

Также, с некоторыми клавишами может быть связана аналогичная двумерная таблица "действий" (**actions**). Хотя обычно, действия "привязывают" не к скан-кодам в файлах **xkb\_symbols**, а к соответствующим символам в файлах типа **xkb\_compat**.

Прежде чем рассматривать грамматику файла **xkb\_symbols**, рассмотрим - какие еще данные могут быть связанны со скан-кодами, кроме таблиц символов и "действий". Как правило, для всех этих данных есть значения по умолчанию, поэтому, обычно они в файлах **xkb\_symbols** явно не указываются. Но, если есть необходимость, их можно также явно задать в файлах этого типа.

Итак. С каждым скан-кодом связаны

*   **тип клавиши** - типы описываются в файлах **xkb\_types** и определяют зависимость уровня от состояния модификаторов. Заметьте, что тип клавиши может быть свой в каждой группе. Но если все группы для данного скан-кода имеют один и тот же тип, то в описании клавиши можно указать его один раз, не "расписывая" по всем группам.
*   **"метод выравнивания" номера группы** - напомню, что некоторые клавши могут иметь меньшее количество групп, чем все остальные. Поэтому, при нажатии такой клавиши может оказаться, что номер группы в "состоянии клавиатуры" выходит за границы, допустимые для данной клавиши. В этом случае он "выравнивается" до приемлимого значения. "Методы выравнивания" для отдельных клавиш такие же, как и глобальные (см. ["Внутренности...":Метод Выравнивания](https://web.archive.org/web/20190720050736/http://pascal.tsu.ru/other/xkb/internals.html#wrap))
*   **автоповтор (autorepeat)** - логический "флаг", который определяет - нужен ли автоповтор для данной клавиши.
*   **"поведение" клавиши (behavior)** - набор флагов и дополнительный аргумент, которые определяют...
    *   **"залипание" (locking)** - если клавиша "залипающая", то при первом нажатии/отжатии выдается только сообщение о нажатии клавиши, а при повторном нажатии/отжатии - только сообщение об отжатии клавиши.
    *   **"радио-группа"** - клавиша принадлежит к радио-группе клавиши, дополнительный аргумент определяет номер этой радио-группы. Напомню, что клавши одной радио-группы являются взаимозависимыми. То есть, при нажатии одной из клавиш группы, она "залипает", а остальные клавиши этой группы "отжимаются".
    *   **допускается "отжатие всех" (allow none)** - имеет смысл для клавиш радио-группы. если этот флаг установлен, то повторное нажатие на клавшу - члена радио-группы, она "отжимается". При этом все члены группы могут находиться в отжатом состоянии. Если же этот флаг не стоит, то для отжатия клавиши надо нажать любую другую из той же группы. При этом в группе одна из клавиш остается нажатой.
    *   **перекрытие 1** - указывает, что клавиша относится к группе "перекрывающихся" клавиш (**overlay**). Если в состоянии клавиатуры установлен "управляющий флаг" **Overlay1**, то эта клавиша должна "отослать" XKB к другому скан-коду, который задан дополнительным аргументом.
    *   **перекрытие 2** - то же самое, что и предыдущий, только эти клавиши зависят от "управляющего флага" **Overlay2**.
    *   **permanent** - может комбинироваться с другими флагами и означает, что соответствующая функция выполняется "железом" клавиатуры и нет необходимости эмулировать её в XKB программно.
*   **виртуальный модификатор** (или несколько модификаторов) - этот модификатор может использоваться в качестве аргумента для "действия", если с клавишей связаны какие-нибудь "действия". Надо заметить, что, как правило, виртуальные модификатооры "назначаются" не в файлах **xkb\_symbols**, а, как и "действия", в файлах **xkb\_compat**.
*   **"набор исключений"** - запрещает выполнении "интепретаций" - изменения привязки "действий" при изменении привязки символов к скан-кодам. Можно запретить выполнение всех действий "интерпретации" для данной клавиши или только отдельных ее шагов - перенос виртуального модификатора, перенос "автоповтора", перенос "залипания".
*   и, наконец, в отдельной таблице может быть задана "привязка" реальных модификаторов к скан-кодам. Если с клавишей связан реальный модификатор, то, при нажатии клавиши, автоматически меняется состояние соответствующего модификатора в наборе "традиционных модификаторов", который эмулируется XKB для старых клиентских программ, "не знающих об XKB". Кроме того, "привязка" реальных модификаторов может использоваться при выполнении "интерпретаций" (**interptation**).

### Объявления в файле xkb\_symbols.

В файлах этого типа могут встретиться

*   [Объявление виртуальных модификаторов.](https://web.archive.org/web/20190720050736/http://pascal.tsu.ru/other/xkb/gram-symbols.html#vmodDec)
*   [Объявление имени группы.](https://web.archive.org/web/20190720050736/http://pascal.tsu.ru/other/xkb/gram-symbols.html#name)
*   [Описание клавиши.](https://web.archive.org/web/20190720050736/http://pascal.tsu.ru/other/xkb/gram-symbols.html#key)
*   [Объявление "привязки" реальных модификаторов.](https://web.archive.org/web/20190720050736/http://pascal.tsu.ru/other/xkb/gram-symbols.html#modmap)
*   [Объявление "умолчаний".](https://web.archive.org/web/20190720050736/http://pascal.tsu.ru/other/xkb/gram-symbols.html#defaults)

### Объявление виртуальных модификаторов.

Просто перечисляет названия виртуальных модификаторов, которые могут встретиться в описаниях "действий" и в качестве модификатора "привязанного" к клавише.

Имеет вид

'virtual\_vodifiers' список\_модификаторов ';'

Надо заметить, что обычно ни действия, ни связанные с клавишей виртуальные модификаторы, не "привязываются" непосредственно к скан-кодам. Как правило, они описываются в файле **xkb\_compat**, как часть "интерпретаций". Поэтому, это обявление, обычно, в файлах **xkb\_symbols** не встречается.

### Объявление имени группы.

Задает символическое имя для группы. Это имя может потом использоваться прикладными программами, которые рисуют изображение клавиатуры или показывают "состояние клавиатуры". Для самого XKB эти имена значаения не имеют.

Это объявление имеет вид

'name\[' название\_группы '\]=' имя\_группы ';'

Например,

name\[Group1\] = "English" ; name\[Group2\] = "Russian" ;

### Описание клавиши.

Это основное обявление в файлах этого типа. Именно оно описывает таблицу символов (и, если надо, "действий") связанных со скан-кодом.

Имеет вид

'key' имя\_скан-кода '{' описания '};'

Напомню, что "имя\_скан-кода" описывается в файлах типа **xkb\_keycodes** и представляет собой произвольную строчку символов (но длиной не более четырех), ограниченную "угловыми скобками".  
Например,

key <LCTL> {...};

"Описания" внутри фигурных скобок разделяются запятой. Обратите внимание, что именно "запятой", а не "точкой с запятой", как это делается в файлах других типов.

Итак, внутри скобок могут быть строчки типа

*   [type = ..., или type\[...\] = ...,](https://web.archive.org/web/20190720050736/http://pascal.tsu.ru/other/xkb/gram-symbols.html#type)
*   [locks = ...,](https://web.archive.org/web/20190720050736/http://pascal.tsu.ru/other/xkb/gram-symbols.html#locks) (синоним - **locking**)
*   [repeat = ...,](https://web.archive.org/web/20190720050736/http://pascal.tsu.ru/other/xkb/gram-symbols.html#repeat) (синонимы - **repeats, repeating**)
*   [groupswrap, или warpgroups,](https://web.archive.org/web/20190720050736/http://pascal.tsu.ru/other/xkb/gram-symbols.html#wrap)
*   [groupsclanp, или clampgroups,](https://web.archive.org/web/20190720050736/http://pascal.tsu.ru/other/xkb/gram-symbols.html#wrap)
*   [groupsredirect = ..., или redirectgroups = ...,](https://web.archive.org/web/20190720050736/http://pascal.tsu.ru/other/xkb/gram-symbols.html#wrap)
*   [radiogroup = ...,](https://web.archive.org/web/20190720050736/http://pascal.tsu.ru/other/xkb/gram-symbols.html#radiogroup)
*   [allownone = ...,](https://web.archive.org/web/20190720050736/http://pascal.tsu.ru/other/xkb/gram-symbols.html#radiogroup)
*   [overlay1 = ..., или overlay2 = ...,](https://web.archive.org/web/20190720050736/http://pascal.tsu.ru/other/xkb/gram-symbols.html#overlay)
*   [permanent...](https://web.archive.org/web/20190720050736/http://pascal.tsu.ru/other/xkb/gram-symbols.html#permanent)
*   [vmods = ...,](https://web.archive.org/web/20190720050736/http://pascal.tsu.ru/other/xkb/gram-symbols.html#vmods) (синонимы - **virtualmods, virtualmodifiers**)
*   [symbols\[...\] = ...,](https://web.archive.org/web/20190720050736/http://pascal.tsu.ru/other/xkb/gram-symbols.html#symbols)
*   [actions\[...\] = ...,](https://web.archive.org/web/20190720050736/http://pascal.tsu.ru/other/xkb/gram-symbols.html#actions)
*   [просто \[...\]](https://web.archive.org/web/20190720050736/http://pascal.tsu.ru/other/xkb/gram-symbols.html#brackets)

#### type

Определяет тип клавиши. Справа от присваивания должно стоять название одного из типов, определенных в файле **xkb\_types**.

Обратите внимание, поскольку разные группы могут иметь разные типы (напомню, что тип определяет количество уровней в группе), то это описание в общем случае должно иметь вид

type\[ номер\_группы \] = название\_типа,

например,

type\[ Group1 \] = "ONE\_LEVEL", type\[ Group2 \] = "ALPHABETIC",

Но, если все группы имеют одинаковое количество уровней и относятся к одному типу, то указание группы (вместе с квадратными скобками) можно пропустить. Например,

type = "ALPHABETIC",

Надо заметить, что для всех клавиш, внутри XKB имется значения типа "по умолчанию". Поэтому, как правило, тип клавиши (группы) не указывется.

#### locks

Логический флаг, который указывает на то, что клавиша должна быть "залипающей".

Справа от присваивания могут стоять слова - **true, yes, on** ("поднять" флаг) или - **false, no, off** ("сбросить" флаг). Кроме того, там же может встретиться слово **permanent**. В этом случае подразумевается, что клавиша "залипающая", но ее "залипание" делается "железом" клавиатуры (в общем-то, это означает, что самому XKB об этой клавише заботиться не надо).

По умолчанию все клавише не "залипающие".

#### repeat

Логический флаг, который определяет - нужен ли "автоповтор" для данной клавиши. Так же, как и для флага **locks**, справа от присваивания могут быть слова - **true, yes, on** (нужен автоповтор) или - **false, no, off** (автоповтор не нужен).

Кроме того, там же может стоять слово **default**. Дело в том, что автоповтор, обычно, выполняет само "железо" клавиатуры. Поэтому, XKB не надо заботиться о повторении нажатия клавши. Чаще всего, ему приходится наоборот - "подавлять" автоповтор для некоторых клавиш. Так вот, значение "**default**" означает, что автоповтор надо "оставить на совести" "железа" и не пытаться что-либо менять.

По умолчанию большинство клавиш отрабатывают автоповтор и значения **repeat** для них - **default**. А для клавиш-модификаторов - **Control, Shift, Alt, CapsLock, NumLock** и т.п., автоповтор подавляется, и **repeat** для них - **false**.

#### groupswrap, groupsclanp, groupsredirect

Определяют "метод выравнивания" номера группы (подробности см. в ["Внутренности":Метод выравнивания](https://web.archive.org/web/20190720050736/http://pascal.tsu.ru/other/xkb/internals.html#wrap)). Естественно, имеет смысл в описании клавиши указывать только один из них.

Объявления **groupswrap** и **groupsclamp** являются просто логическими переменными. Поэтому они задаются либо в виде присваивания, где в правой части могут быть только слова **True** или **False**, либо в виде  
**groupswrap,** - подразумевается "**\= True**"  
или  
**!groupswrap,** - подразумевается "**\= False**"

А вот метод **groupsredirect** подразумевает дополнительный аргумент - "куда redirect". Поэтому всегда имеет вид присваивания, где в правой части должен стоять номер группы. Например,

groupsredirect = 1,

По умолчанию для всех клавиш метод выравнивания - **Wrap**.

#### radiogroup и allownone

Означает, что данная клавиша является членом радио-группы. Справа от знака присваивания должен быть номер группы.

Номер группы может быть произвольный, в пределах 2-128 (обратите внимание, что нельзя сделать радио-группу номер 1, хотя это скорее всего "баг" в реализации XKB).

**Allownone** устанавливает соответствующий флаг для этой радио-группы и является просто логической переменной.

По умолчанию никаких радио-групп нет.

#### overlay1 или overlay2

Означает, что данная клавиша принадлежит к одной из двух групп "перекрытий". Напомню, что когда режим "перекрытия" активен (установлен соответствующий "управляющий флаг" в состоянии клавиатуры), такая клавиша эмулирут нажатие клавиши с другим скан-кодом. Поэтому, справа от знака присваивания должно быть "название скан-кода" клавиши, нажатие которой эмулируется. Это название имеет такой же вид, как и в заголовке описания клавиши и должно быть определено в файле типа **xkb\_keycodes**.  
Например,

overlay1 = <XY01>,

По умолчанию никаих "групп перекрытий" нет.

#### permanent...

Это не отдельное слово, а префикс, который может соединяться со словами **radiogroup, overlay1, overlay2.** Например,

permanentradiogroup = ..., permanentoverlay1 = ..., permanentoverlay2 = ...,

Означает, что данная функция и так отрабатывается "железом" и XKB не надо об этом заботиться.

#### vmods

Задает список виртуальных модификаторов, связанных с этой клавишей. Справа от знака присваивания должно быть название модификатора (или нескольких модификаторов через знак '+').

Напомню, что обычно виртуальные модификаторы "привязываются" не здесь, а в файлах **xkb\_compat**.

#### symbols

Основная часть описания. Задает набор символов для клавиши. Одно такое объявление задает набор символов для одной группы. Поэтому, в левой части, в квадратных скобках указывается название группы, а в правой части, опять же в квадратных скобках - список символов для всех уровней этой группы (через запятую).  
Например,

symbols\[Group1\] = \[ semicolon, colon \], symbols\[Group1\] = \[Cyrillic\_zhe, Cyrillic\_ZHE\],

В качестве "символов" могут быть числовые значения кодов (десятичные, восьмеричные, шестнадцатеричные) или специальные "названия символов".

Названия символов можно найти в файле **X11R6/include/X11/keysymdefs.h**. Только там они еще имеют префикс "**XK\_**". То есть, если в это файле есть, например, определения

#define XK\_Escape 0xFF1B #define XK\_Delete 0xFFFF ....

это означает, что в файле типа **xkb\_symbols** можно использовать слова **Escape** и **Delete** в качестве "названий символов".

Надо заметить, что если в качестве символа указаны числа 0 - 9, то они интерпретируются как коды символов '**0**' - '**9**', а не как числовой код символа.

Если для какого-то уровня в группе символ не нужен (не определен), можно использовать специальное "название символа" - **NoSymbol**.

#### actions

Аналогично предыдущему объявлению, только задает не список символов, а список "действий" для данной клавиши. Имеет такой же вид как объявление **symbols**, только вместо "имен символов" должны быть описания "действий". Немного подробнее об этих описаниях смотри ["Описание действий"](https://web.archive.org/web/20190720050736/http://pascal.tsu.ru/other/xkb/gram-action.html).

Здесь замечу только, что если какой-то уровень не имеет соответствующего "действия", можно использовать специальное название - **NoAction()**.

#### просто \[...\]

Чаще всего, описание клавиши состоит из списков символов, заключенных в квадратные скобки без всякого указания типа - "**symbols\[...\] =**". Поскольку обычно для клавиши задается только набор символов, можно использовать сокращенную форму описания.  
Например, описание

key <AE03> { \[ 3, numbersign \], \[ apostrophe, 3 \] };

полностью эквивалентно описанию

key <AE03> { symbols\[Group1\]= \[ 3, numbersign \], symbols\[Group2\]= \[ apostrophe, 3 \] };

То есть, первая пара квадратных скобок (с неким содержимым внутри) интерпретируется как описание **symbols** для первой группы, втора пара скобок - как описание **symbols** для второй группы и т.д.

Кстати, в некоторых файлах может содержаться только частичное описание полной "раскладки клавиатуры", например только символов второй группы. Естественно, такой файл как правило используется как добавка к другому файлу **xkb\_symbols**, содержащему описание символов из первой группы.  
Для того, чтобы явно пояснить, что символы из этого файла следует "загрузить" во вторую группу, а первую группу оставить без изменения, можно использовать два способа:

*   В каждом описании клавши явно указывать группу:
    
    key <AE03> { symbols\[Group2\]= \[ apostrophe, 3 \] };
    
*   Или для пропущенной группы использовать "пустые скобки":
    
    key <AE03> { \[\], \[ apostrophe, 3 \] };
    

#### "Набор исключений".

Напомню, что с каждой клавишей может быть связан набор исключений, который запрещает изменять "привязку" "действий", флагов "залипания" и автоповтора и набора виртуальных модификаторов при выполнении "интерпретаций".

Заметьте, что в описании клавиши нет явных инструкций для задания "набора исключений". Но этот набор все-таки создается в некоторых случаях

*   если в описании клавши явно указан набор "действий" (инструкция **actions**), то устанавливается запрет "выполнения интерпретации" для этой клавиши;
*   если задан явно автоповтор (инструкция **repeat**) - запрещается "изменение автоповтора";
*   если задан явно флаг "залипания" или радио-группа (инструкции **locks** и **radiogroup**) - запрещается "изменение залипания";
*   и, наконец, если указан явно список виртуальных модификаторов (инструкция **vmod**), то устанавливается "запрет изменения" набора модификаторов.

### Объявление "привязки" реальных модификаторов.

Это объявление заполняет внутреннюю табицу XKB - **modmap**, которая "привязывает" реальные модификаторы к клавишам (скан-кодам). Напомню, что эти модификаторы будут автоматически устанавливаться/сбрасываться, при нажатии/отпускании клавиши, в "эмулируемом наборе модификаторов".

Объявление имеет вид

'modifier\_map' имя\_модификатора '{' список\_клавиш '};'

Вместо слова "**modifier\_map**" могут использоваться синонимы - **modmap** или **mod\_map**.

"**Имя\_модификатора**" должно быть названием одного из реальных модификаторов - **Shift, Lock, Control, Mod1, Mod2, Mod3, Mod4, Mod5**.

А вот "**список\_клавиш**" может состоять из названий скан-кодов (через запятую), например,

modifier\_map Control { <LCTL>, <RCTL> };

или из названий символов, например,

modifier\_map Mod1 { Alt\_L, Alt\_R };

Во втором случае, XKB (точнее - **xkbcomp**) должен найти скан-коды, к которым "привязаны" эти символы и занести в **modmap** эти скан-коды.

Обратите внимание, один и тот же модификатор может быть "привязан" ко многим скан-кодам, но не наоборот - разные модификаторы к одному скан-коду. Это означает, что название скан-кода может появиться в определениях **modmap** только один раз. Это же ограниичение действует, если клавиши предствлены не скан-кодами, а символами.

Однако, как ни странно, **xkbcomp** не проверяет ситуацию, когда одна и та же клавиша представлена один раз скан-кодом, а другой - символом, или разными символами "привязанными" к одному скан-коду. В этом случае может получиться ситуация, когда к одному скан-коду "привязаны" несколько реальных модификаторов.

### Объявление "умолчаний".

Это объявление задает значение "по умолчанию" для некоторых аттрибутов клавиш и выглядит как присвоение значения "полю структуры" в языке C.  
Например,

key.repeat = no;

При этом, в левой части присваивания первое слово (до точки) должно быть слово "**key**", а второе - любое из допустимых в описании клавиши (**type, locks, radiogroup** и т.п.).

Естественно, это "умолчание" будет действовать, пока в тексте не встретится другое объявление для того же аттрибута.

Кроме того, объявление "умолчаний" может спользоваться для "умолчаний" в описании "действий" (подробнее см. ["Описание действий"](https://web.archive.org/web/20190720050736/http://pascal.tsu.ru/other/xkb/gram-action.html)). В этом случае первое слово будет названием "действия", например,

SetMods.clearLocks = True;

И, наконец, к объявлениям "умолчания" можно отнести инструкцию, которая устанавливает флаг "**допускается отжатие всех**" (**allownone**) для радио-групп.

Напомню, что этот флаг можно указать непосредственно в описании клавиши, относящейся к радио-группе. Но, поскольку радио-группа "размазана" по нескольким клавишам, а флаг **allownone** является аттрибутом радио-группы, а не конкретной клавиши, можно указать флаг для нее отдельной инструкцией (не внутри описании какой-либо клавиши). Например,

allownone = 10;

означает, что для радио-группы 10 устанавливается соответствующий флаг.
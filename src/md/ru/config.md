Еще один способ описания конфигурации XKB.
------------------------------------------

Кроме опций в общем файле конфигурации X-сервера (**XF86Config**) XKB может иметь свой отдельный файл конфигурации. Правда он в XFree86 не применяется и (увы) не описан. В то же время, с помощью этого файла можно

*   задать конфигурацию XKB для каждого дисплея по отдельности (если на машине запущено несколько X серверов на разных дисплеях)
*   настроить намного больше внутренних параметров XKB, чем это позволяет **XF86Config**.

Собственный файл конфигурации XKB (назовем его так) должен находится в директории **{XRoot}/lib/X11/xkb** и называться **X**<цифра>**\-config.keyboard**  
где <цифра> - номер дисплея (обычно - **X0-config.keyboard**)

### Формат этого файла.

Прежде всего надо заметить, что все инструкции в этом файле выглядят как операторы присваивания языка C.

параметр\_XKB = выражение ;

Если оператор один в строке, то знак '**;**' в конце не обязателен. В любом месте строки могут находится комментарии, которые должны начинаться с '**#**' или '**//**'.

"Выражение" представляет собой

*   числовое значение (например - величина задержки или номер группы);
*   логическое значение - **on** или **off**;
*   строка в кавычках - **""** (например - имя файла/блока содержащего описание компонентов конфигурации XKB)
*   название модификатора, "управляющего флага" и т.п.

Если в выражении требуется указать несколько модификаторов (флагов) одновременно, они перечисляются через '**+**'.

Кроме того, в файле могут встретиться некоторые разновидности "присваивания". Если инструкция определяет, например, начальные значения для "набора управляющих флагов", в котором некоторые флаги и так уже установлены по умолчанию, то возможны следующие операции

*   убрать из набора флаги, указанные в инструкции  
    набор\_флагов **\-=** флаг1 + флаг2 + ...
*   добавить в набор указанные флаги  
    набор\_флагов **+=** флаг1 + флаг2 + ...
*   и наконец, полностью заменить набор флагов на тот, что вы укажете  
    набор\_флагов **\=** флаг1 + флаг2 + ...

Итак. В этом файле можно задать следующие параметры

### Компоненты конфигурации.

**rules = "..." model = "..." layout = "..." variant = "..." options = "..." keymap = "..." keycodes = "..." geometry = "..." types = "..." compat = "..." symbols = "..."** (или **symbolstouse = "..."**)

Описывают те же параметры, что и в главном конфигурационном файле X сервера (**XF86Config**).

Напомню, что собственный файл конфигурации XKB может быть составлен для каждого дисплея по отдельности. Поэтому, если компоненты конфигурации уже описаны в **XF86Config**, то здесь имеет смысл указывать только те компоненты (или **rules/model/layout/**etc.), которые для данного дисплея отличаются от общих. Естественно, все эти параметры, указанные в "дополнительном файле конфигурации" имеют больший приоритет и переписывают соответствующие значения из файла конфигурации X сервера.

### Начальное значения для набора [модификаторов.](https://web.archive.org/web/20190511065228/http://pascal.tsu.ru/other/xkb/internals.html#mods)

**modifiers** **\[ = | -= | += \]** модификатор1 + модификатор2 + ...

"Модификатор" - название одного из "реальных" модификаторов - **shift, lock, control** (или **ctrl**), **mod1, mod2, mod3, mod4, mod5**.

Как я уже говорил, здесь вместо присваивания могут использоваться операции '**\-=**' - убрать модификатор(ы), '**+=**' - добавить модификатор(ы), '**\=**' - заменить набор модификаторов на указанные в этой инструкции.  
(Надо заметить, что по умолчанию при старте X сервера этот набор модификаторов пустой. Поэтому, имеют смысл только операции '+=' и '='. Причем разницы между ними нет.)

### Начальное значение для набора ["управляющих флагов"](https://web.archive.org/web/20190511065228/http://pascal.tsu.ru/other/xkb/internals.html#controls).

**controls** **\[ = | -= | += \]** флаг1 + флаг2 + ...

Как и в предыдущей инструкции, операция может быть убрать/добавить/заменить (**'-='/'+='/'='**).

#### "Флаги" могут быть

**repeat** (или **repeatkeys**)

разрешить автоповтор клавиш  
(по умолчанию он и так разрешен, поэтому имеет смысл только его убрать  
controls -= repeat);

**mousekeys**

включить [эмуляцию мыши](https://web.archive.org/web/20190511065228/http://pascal.tsu.ru/other/xkb/internals.html#mouse);

**mousekeysaccel**

включить режим "ускорения" для эмуляции движения курсора мыши

**overlay1  
overlay2**

включить соответствующие ["перекрытия"](https://web.archive.org/web/20190511065228/http://pascal.tsu.ru/other/xkb/internals.html#overlay).

**ignoregrouplock**

игнорировать "текущую группу" в режиме GrabKey

**audiblebell**

включить (выключить) звуковой сигнал.  
(Напомню, что XKB может вместо звукового сигнала посылать [bell-event'ы](https://web.archive.org/web/20190511065228/http://pascal.tsu.ru/other/xkb/internals.html#bell) для проигрывания звуков или мелодий "звуковой приставкой". Если такая "приставка" у вас есть, то обычную "пищалку" можно и выключить.

**accessxkeys  
slowkeys  
bouncekeys  
stickykeys  
accessxtimeout  
accessxfeedback**

включение различных режимов [AccessX](https://web.archive.org/web/20190511065228/http://pascal.tsu.ru/other/xkb/internals.html#accessx) (для людей с "ограниченными физическими возможностями")

### Список модификаторов, которые игнорируются в режиме GrabKey

**ignorelockmods** **\[ -= | += | = \]** модификатор1 + модификатор2 + ... (или **ignorelockmodifiers** ...)

### Список "внутренних" модификаторов

**internalmods** **\[ -= | += | = \]** модификатор1 + модификатор2 + ... (или **internalmodifiers** ...)

Это модификаторы, которые используются только внутри X сервера (для выбора "действия" клавиши, если таковое есть) и не сообщаются в клавиатурных event'ах, посылаемых приложениям.

### ["Метод выравнивания"](https://web.archive.org/web/20190511065228/http://pascal.tsu.ru/other/xkb/internals.html#wrap) групп.

**groups** = \[ **wrap** | **clamp** | число \] (или **outofrangegroups** ...)

Задает "метод выравнивания групп". Напомню, что метод может быть **wrap**, **clamp** или **redirect**. В последнем случае нужен дополнительный параметр - куда "редирект", если номер группы выходит за границы диапазона.  
Так вот, метод **redirect** задается в виде

**groups** = номер\_группы

### Параметры "пищалки".

**bell** = число (или **bellvolume** = число ) **bellpitch** = число **bellduration** = число **click** = число (или **clickvolume** = число )

Все эти инструкции устанавливают параметры "пищалки" (**bell**) и "клика" клавиатуры (обычно это более короткий сигнал, чем bell).

Инструкции **bell** и **click** могут также иметь вид

**bell** = \[ **on | off** \] **click** = \[ **on | off** \]

что (как нетрудно догадаться) просто означают включить/выключить эти сигналы. Если сигнал просто включен и не указано его "volume", то оно считается - 100.

### Различные задержки (таймауты).

**repeatdelay** = число

задержка (в миллисекундах) между нажатием клавиши и началом автоповтора;

**repeatinterval** = число

интервал (в миллисекундах) между автоповторами;

**slowkeysdelay** = число

в режиме **slowkeys** клавиша считается нажатой, если она удерживается некоторый промежуток времени, чтобы избежать срабатывания при случайном "задевании" клавиши. Этот параметр и определяет указанную задержку.

**debouncedelay** = число

в режиме **bouncekeys** клавиша после нажатия/отпускания некоторое время не реагирует на повторные нажатия/отпускания, чтобы избежать ложных срабатываний при неаккуратном нажатии клавиши. Этот параметр и определяет указанную задержку.

**accessxtimeout** = число (или **axtimeout** = число)

промежуток времени (в секундах) после которого режим AccessX автоматически отключается. Имеет смысл только если установлен соответствующий флаг  
(**controls += ... accessxtimeout ...**);

### Параметры "ускорения" [курсора мыши](https://web.archive.org/web/20190511065228/http://pascal.tsu.ru/other/xkb/internals.html#mouse).

**mousekeysdelay** = число

задержка (в миллисекундах) до начала автоповтора клавиши эмулирующей движение "мышиного" курсора (то же самое, что и repeatdelay для обычных клавиш);

**mousekeysinterval** = число

интервал автоповтора (то же, что и repeatinterval);

**mousekeysmaxspeed** = число

максимальная скорость движения курсора в пикселах за один event (точнее - если в соответствующем "действии" эмуляции движения курсора - **MovePtr** уже задан параметр "смещение за один event" больше единицы, то максимальная скорость будет "смещение"\*maxspeed);

**mousekeystimetomax** = число

через сколько повторов курсор достигает максимальной скорости

**mousekeyscurve** = число (в диапазоне -1000:1000)

"степень кривизны" кривой ускорения (в "режиме ускорения" скорость курсора нарастает от начального "смещения" до максимального не линейно, а пропорционально **X^(1 + curve/1000)**.  
Если **mousekeyscurve** = 0, то зависимость линейная)

### Включение/выключение отдельных событий [дополнительной звуковой индикации](https://web.archive.org/web/20190511065228/http://pascal.tsu.ru/other/xkb/internals.html#accessxfeedback) в AccessX

**accessxtimeoutctrlson** \[ -= | += | = \] событие1 + событие2 + ... (или **axtctrlson** ...) **accessxtimeoutctrlsoff** \[ -= | += | = \] событие1 + событие2 + ... (или **axtctrlsoff** ...)

где "событие" - **slowkeyspss, slowkeysaccept, feature, slowwarn, indicator, stickykeys, slowkeysrelease, slowkeysreject, bouncekeysreject, dumbbell.**

Подробнее об этих событиях можно прочитать в документации (**XKBlib**), поставляемой в "исходниках" **XFree86**.
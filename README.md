X Keyboard Extension
--------------------

*   [How to configure XKB.](https://web.archive.org/web/20190724015820/http://pascal.tsu.ru/en/xkb/setup.html)
*   [One another way to describe a XKB configuration.](https://web.archive.org/web/20190724015820/http://pascal.tsu.ru/en/xkb/config.html)
*   [The XKB internals.](https://web.archive.org/web/20190724015820/http://pascal.tsu.ru/en/xkb/internals.html)
*   XKB configuration files.
    *   [Common notes about XKB configuration files language.](https://web.archive.org/web/20190724015820/http://pascal.tsu.ru/en/xkb/gram-common.html)
    *   [Common structure of XKB configuration files.](https://web.archive.org/web/20190724015820/http://pascal.tsu.ru/en/xkb/gram-file.html)
    *   The xkb\_keycodes type file.
    *   [The xkb\_types type file.](https://web.archive.org/web/20190724015820/http://pascal.tsu.ru/en/xkb/gram-types.html)
    *   [The xkb\_compat type file.](https://web.archive.org/web/20190724015820/http://pascal.tsu.ru/en/xkb/gram-compat.html)
    *   [The xkb\_symbols type file.](https://web.archive.org/web/20190724015820/http://pascal.tsu.ru/en/xkb/gram-symbols.html)
    *   ["Actions" description.](https://web.archive.org/web/20190724015820/http://pascal.tsu.ru/en/xkb/gram-action.html)
*   Some examples.
    *   New type for Enter key.
    *   Group number switchers.
*   Why national language input doesn't work?
    *   What to do with 'incorrect' applications?
*   XKB related utilites.How to configure XKB.
---------------------

*   [The XKB 'database'](https://web.archive.org/web/20190727020850/http://pascal.tsu.ru/en/xkb/setup.html#database)
*   [Three methods to describe XKB full configuration.](https://web.archive.org/web/20190727020850/http://pascal.tsu.ru/en/xkb/setup.html#setup)
    *   [The first method.](https://web.archive.org/web/20190727020850/http://pascal.tsu.ru/en/xkb/setup.html#1)
    *   [The second method.](https://web.archive.org/web/20190727020850/http://pascal.tsu.ru/en/xkb/setup.html#2)
    *   [The third method.](https://web.archive.org/web/20190727020850/http://pascal.tsu.ru/en/xkb/setup.html#3)
*   [Some suggestions.](https://web.archive.org/web/20190727020850/http://pascal.tsu.ru/en/xkb/setup.html#suggest)

### The XKB 'database'

At the Xserver start its keyboard module XKB reads all needed data from text files that are the 'database' of the XKB configuration.

Strictly speaking most of these files XKB doesn't read itself. It calls **xkbcomp** to translate these files to a binary form that XKB can understand.

But for users this is not important because **xkbcomp** is called automatically and this action is invisible for users.

The XKB configuration database consists of 5 components:

**keycodes**

tables that define symbolic names for key scan-codes  
For example  
<TLDE>= 49;  
<AE01> = 10;

**types**

describes key types. A key type defines, how the code produced by a key must be changed in dependence of 'modifiers' (Control, Shift and so on). For example 'letter' keys have type ALPHABETIC. This means that they will produce different codes depending on the states of the \[Shift\] and \[CapsLock\] keys. The \[Enter\] key has another type: ONE\_LEVEL. That means that its code is always the same independent of any modifiers state.

**compat** (abridged from compatibility)

describes modifiers 'behavior'. XKB has some internal variables that finally define, symbol will be produced when a key is pssed in every specific case. The 'compat' files describe, how these internal variables must change when any modifier key pssed. These files also describe the behaviour of the LED-indicators on the keyboard.

**symbols**

This is the main table in which for every scan-code (the symbolic names are defined in 'keycodes') all posible values ('symbols') are specified. Of course the number of such values depends on the key type (that is described in 'types') and what value will result in a specific case depends on the modifiers state and their behavior (described in 'compat').

**geometry**

describes keyboard geometry - key placement on a physical keyboard. This description XKB doesn't use by itself but it can be useful for applications like **xkbprint** that draw keyboard images.

All these components correcpond to subdirectories in directory **{XROOT}/lib/X11/xkb**. (I will write it as **{XKBROOT}**).

It must be mentioned that every such directory has several files (sometimes many) with different settings. Each file can contain several sections (parts, blocks) like

component\_type "section\_name" {........};

So to specify a single setting one has to write something like  
**file\_name(section\_name)**  
for example  
**us(pc104)**

At the same time usually one of sections in such file is marked with 'flag' **default**. For example

xkb\_symbols "pc101" {...}; default xkb\_symbols "pc101euro" {...}; xkb\_symbols "pc102" {...}; xkb\_symbols "pc102euro" {...};

This means that if one specifies only a file name, this section from the file will be used.

### Three methods to describe XKB full configuration.

All components needed for XKB configuration can be described in the Keyboard section of the X server config file.

#### The first method.

The first way is to specify explicitly every component. For example

XkbKeycodes "xfree86" XkbTypes "default" XkbCompat "default" XkbSymbols "us(pc104)" XkbGeometry "pc(pc104)"

or for XFree86 4.x version

Option "XkbKeycodes" "xfree86" Option "XkbTypes" "default" Option "XkbCompat" "default" Option "XkbSymbols" "us(pc104)" Option "XkbGeometry" "pc(pc104)"

As you guess it means that

*   **keycodes** description must be taken from file **"xfree86"** from **{XKBROOT}/keycodes** directory and namely section marked **default** from this file;
*   **types** description must be taken from file **"default"** from **{XKBROOT}/types** directory;
*   **compat** description must be taken from file **"default"** from **{XKBROOT}/compat** directory;
*   **symbols** description must be taken from file **"us"** from **{XKBROOT}/symbols** directory, section **"pc104"**;
*   **geometry** description must be taken from file **"pc"** from **{XKBROOT}/geometry** directory, section **"pc104"**;

It needs to be mentioned that any section in any component can contain an instruction

**include "file\_name(section\_name)"** (of course section\_name can be omitted)

That means (as you guess) that some other description must be inserted from specified file/section to current section.

So the full description can include data from many other files besides files you explicitly specify in the X server configuration file.

#### The second method.

You can specify the full set of components by one name. Such components sets are named **keymaps** and like single components are placed in separate files (that can contain any number of sections) in **{XKBROOT}/keymap** directory.

Usually every **keymap** section contains 'include' instructions only that define from which files XKB has to get every component. (In the most general case it can contain a full description of every component.) For example

xkb\_keymap "ru" { xkb\_keycodes { include "xfree86" }; xkb\_types { include "default" }; xkb\_compatibility { include "default" }; xkb\_symbols { include "en\_US(pc105)+ru" }; xkb\_geometry { include "pc(pc102)" }; };

Note that one **include** instruction can contain several files (sections) separated by "+" signs. Of course it means that all these sections must be inserted sequentially.

Thus you can specify one complete **keymap** instead of five separate components. For example

XkbKeymap "xfree86(ru)"

or for XFree86 4.x

Option "XkbKeymap" "xfree86(ru)"

Unfortunately this method is very unflexible. Since XKB ignores all other options when an XkbKeymap option is found, you can't 'tune' a single component in the X server configuration file.

#### The third method.

And here is the third method that differs from the two pvious methods.

A configuration can be defined not only by a components list, but in terms of 'Rules', 'Model', 'Layout', 'Variant' and 'Options'. In this list only 'Rules' is a file that contains a table of rules that tell how to select all five components in dependence of the values of 'Model', 'Layout', etc.

All other terms are 'keywords' only that are used to search component files (**keycodes, types, compat, symbols** and **geometry**) in the **rules** table. Of course this search will be performed by XKB itself at startup time.

In the other words 'Rules' defines a function (in mathematical meaning) which arguments are 'Model', 'Layout', 'Variant' and 'Options'. And the return value is a vector of components - **keycodes, types, compat, symbols** and **geometry** (or a full **keymap**).

The Rules files also are placed in the **{XKBROOT}/rules** directory. If you look at such file, you can find lines that begin with a "!" sign. This is 'pattern' that describes, how to interpt the following lines (rules itself).

For example pattern

! model = keycodes geometry

means that the following lines are rules and specify how to select **keycodes** and **geometry** files by 'Model' value. For example

pc104 = xfree86 pc(pc104)

means that if 'Model' value is **"pc104"** word so **keycodes** must be taken from **{XKBROOT}/keycodes/xfree86** file and **geometry** must be taken from **{XKBROOT}/geometry/pc** file **"pc104"** section.  
And for example pattern

! model layout = symbols

means that the following lines define, how to select **symbols** file and section in dependence of 'Model' and 'Layout' values.

You can see also, that some lines from **rules** file can contain wildcards - "\*" sign. It means that you cannot only use words listed in rules file. If XKB can't find specified words exactly in left parts of rules it will anyway select appropriate component file name.  
For example rule

! model layout = symbols .... \* \* = en\_US(pc102)+%l%(v)

means that if your 'Model' and 'Layout' was not found in pvious lines XKB has to take **pc102** section from **en\_US** file as **symbols** and add to it a section which name is defined by 'Variant' value from a file which name is defined by 'Layout' value. (Thus in some case argument values can be file or section names. But in the common case they are 'keywords' only).

Also you can see that...  
not all these terms are mandatory. Usually 'Model' and 'Layout' (and of course - 'Rules') are enough and Variant and/or Options are needed in some cases only.  
And also -

*   Model usually defines hardware (keyboard) type.
*   Layout defines language (or rather alphabet) - which letters must be bound to keyboard keys.
*   Variant - means variant of letter placement on the keyboard of a language (Layout).
*   Options - usually defines behavior or placement of modifier keys Control and Group\_switch (group\_switch is switch for languages, for example English/Russian).

By the way note that although all Options consist of two words separated by a ":" sign, it doesn't mean that you can compose new options from two such parts of different options.

So if you decide to use the third method, you need to write in the X server configuration file XkbRules, XkbModel, XkbLayout words and if you need something non-standard, you have to write also XkbVariant and XkbOptions.  
For example

XkbRules "xfree86" XkbModel "pc104" XkbLayout "ru" XkbVariant "" XkbOptions "ctrl:ctrl\_ac"

or for XFree86 4.x

Option "XkbRules" "xfree86" Option "XkbModel" "pc104" Option "XkbLayout" "ru" Option "XkbVariant" "" Option "XkbOptions" "ctrl:ctrl\_ac"

that means XKB has to

*   in accordance with rules described in **{XKBROOT}/rules/xfree86** file choose settings for
*   keyboard **"pc104"** type (104 buttons),
*   Russian alphabet (English alphabet will be included by default),
*   default variant (so this line can be omitted)
*   and finally - additional options for your 'keyboard map' - **"ctrl:ctrl\_aa"**.

By the way, you can find descriptions - what meaning has what option and what Models and Layouts are defined in Rules (and what they mean) in **xfree86.lst** file (or another **\*.lst** file if you use no **xfree86** rules) that is placed in the same directory **{XKBROOT}/rules**.

### Some suggestions.

These suggestions were written for Russian users, so all examples assume that the needed language (alphabet) is Russian. Also note that the Cyrillic (Russian) alphabet is very different from Latin one, so in Russian 'symbols map' Latin and Cyrillic are placed in different XKB 'symbols group' and so russian users need a special 'group\_switch' key to switch between these groups.

All examples are written for XFree 3.x version. If you use XFree 4.x I hope you understand how to change it.

#### The simplest way is to use special program for X's configuration.

In XFree86 this program has the name XF86Setup. It uses the third method for XKB configuration with rules (**XkbRules**) - xfree86. All you need is to choose 'Model' (**XkbModel**), 'Layout' (**XkbLayout**) and 'group\_switcher' ("Russian/Latin" switcher).

Also if you need you can change 'Ctrl key place'. Of course in file it will look like **XkbOptions** lines.

So, let's run the XF86Setup program and choose the **Keyboard** section. In this screen you have to choose from menu **Model** (keyboard type) and **Layout** (language). Don't forget to choose needed 'group\_switcher' and (if you want) - 'Ctrl place'.

When you exit the program, it will write appropriate lines to the Keyboard section of the XFree configuration file.

But if you want to write such lines manually, I can make some suggestions.

First of all note that 'key words' will be

*   **xfree86** - X-Window 'architecture' name;
*   **pc101** (**pc104, pc105** and so on) - keyboard type (number of buttons);
*   **ru** - name of 'symbols map' with needed alphabet.

(If you have another architecture/hardware/alphabet you have to change these words accordingly.)

#### Let's begin with the second method - full keymap.

There are sets of full **keymaps**" for **xfree86** architecture (in XKB configuration files) that differ in language. They are all placed in **xfree86** file and the section names reflect names of languages (or alphabets) - **xfree86(us), xfree86(fr), xfree86(ru)** and so on. The full list of **keymaps** you can find in the **{XKBROOT}/keymap.dir** file.

For 'russified' keyboard appropriate keymap is

XkbKeymap "xfree86(ru)"

Unfortunately some time ago russian full keymap had a 'default group\_swither' inside **symbols** file, but frome some XFree version this switcher was removed from **symbols** (it is right because an 'alphabetical' symbols map is not the appropriate place for such keys). But at the same time such switcher was not added in any place in any russian **keymap**. Therefore if you choose this method, you can't switch on Russian language anyway.

The only way to add this group\_switcher is to edit **{XKBROOT}/keymap/xfree86** file. You can find this file in your system, then go to section "ru" in this file and add to line **xkb\_symbols** appropriate switcher name. For **CapsLock** key it is **group(caps\_toggle)**. It means that this line must look like

xkb\_symbols { include "en\_US(pc105)+ru+group(caps\_toggle)"};

#### If you want to use the third method - by Rules, Model, Layout

As I told above

*   **rules** name must match with architecture (**xfree86**);
*   **model** name must match with keyboard type (**pc101, pc102**, etc.);
*   **layout** name reflects language name (**ru**).

So an appropriate configuration looks like

XkbRules "xfree86" XkbModel "pc104" XkbLayout "ru"

With help of **XkbOptions** you can choose the behaviour of modifier keys. Possible values of **XkbOptions** and their descriptions you can see in the **{XKBROOT}/rules/xfree86.lst** file.

Don't forget that in recent versions of XFree there is no 'default group\_switcher', so you have to specify it explicitly. For **CapsLock** key it will be

XkbOptions "grp:caps\_toggle"

#### And finally the first method - by separate XKB components (keycodes, compat, types, symbols, geometry).

If you don't know how to begin, you can look at any appropriate component set in a **keymap** file. Or try to figure it out from **rules/model/layout**. (For more details about such 'computation' see ["Examples: Where we will make our experiments?"](https://web.archive.org/web/20190727020850/http://www.tsu.ru/%7Epascal/en/xkb/examples.html))

I can suggest you

*   for **keycodes** use **xfree86** value;
*   for **types** and **compat** files **default** or **complete** will be suitable;
*   **geometry** will be **"pc"** (of course only if your computer is IBM PC clone) and the number of buttons will define name of section in **pc - pc(pc101), pc(pc102), pc(pc104)**. (The full list of possible geometries you can find in the **{XKBROOT}/geometry.dir** file .)

The **symbols** require special attention. The **symbols/ru** file describes 'alphabetical' keys only. So if you want to write to the **XkbSymbols** line this file name only you will loose all other keys (including Enter, Shift/Ctrl/Alt, F1-F12, etc.).

Therefore **symbols** must consist of at least two files - **en\_US(pc101)** (section name depends of number of keys) and **ru** itself.  
The full list of possible symbols is in **{XKBROOT}/symbols.dir** file.

Also you have to add a description of an appropriate "Russian/Latin" switcher to **symbols**. Description of all pdefined group\_swithers is in **{XKBROOT}/symbols/group** file.

So for the first method the configuration can look like

XkbKeycodes "xfree86" XkbTypes "complete" XkbCompat "complete" XkbSymbols "en\_US(pc101)+ru+group(caps\_toggle)" XkbGeometry "pc(pc101)"

If you additionally want to change the behavior of other control keys (that in third method was defined by **XkbOptions**), you can find appropriate addition in **{XKBROOT}/rules/xfree86.lst** file. Then you have to 'plus' it to the **XkbSymbols** line. For example

XkbSymbols "en\_US(pc101)+ru+group(shift\_toggle)+ctrl(ctrl\_ac)"One another way to describe XKB configuration.
----------------------------------------------

There are one another way to describe XKB configuration. But in XFree it isn't used and isn't described. At the same time it allow

*   to set configuration for each display separately (if you have runned some Xservers with different displays)
*   to set initial values for XKB internal variables.

The additional configure file must be placed in **{XRoot}/lib/X11/xkb** directory and has name **X**<digit>**\-config.keyboard**  
where <digit> is display number (usualy - **X0-config.keyboard**)

### This file format.

First of all note all statements in this file looks like C language assignment statement

XKB\_option = expression ;

If statement is one per line then '**;**' sign at the end is unneeded. In any line (any place in line) comments can be inserted. Comments must begin from '**#**' or '**//**'.

"Expression" can be

*   numeric value (for example - timeout value or group number)
*   logical value - **on** or **off**;
*   string in quotas - **""** (for example - file name)
*   name of modifier, 'control flag' and so on.

If you need several modifiers (or flags) in one expression they have to be separated by '**+**' sign.

Also this file can use some variants of assignment statement. If statement defines initial value for control flags set (for example) that already have some flags by default the possible actions are

*   to remove specified files from flags set  
    flag\_set **\-=** flag1 + flag2 + ...
*   to add specified files to flags set  
    flag\_set **+=** flag1 + flag2 + ...
*   completly replace existent flags set by specified in the statement  
    flag\_set **\=** flag1 + flag2 + ...

In this file you can specify...

### XKB configuration components.

**rules = "..." model = "..." layout = "..." variant = "..." options = "..." keymap = "..." keycodes = "..." geometry = "..." types = "..." compat = "..." symbols = "..."** (or **symbolstouse = "..."**)

They describe the same options that in general Xserver configure file (**XF86Config**).

Remind that 'additional configuration file' can be composed for each display separately. So it makes sense to use here components (or **rules/model/layout/**etc.) that for this display are differ from 'general' (from **XF86Config**). Of course all such options here have bigger priority and overrides corresponding options from Xserver configuration file.

### Initial value for [modifiers](https://web.archive.org/web/20190718063330/http://pascal.tsu.ru/en/xkb/internals.html#mods) set.

**modifiers** **\[ = | -= | += \]** modifier1 + modifier2 + ...

Where 'modifier\*' is name of one of 'real modifiers' - **shift, lock, control** (or **ctrl**), **mod1, mod2, mod3, mod4, mod5**.

As I told above in this statement 'variants of assignment' can be used - '**\-=**' - remove modifier(s), '**+=**' - add modifier(s), '**\=**' - replace modifier set by specified one in statement.  
(It need to be mentioned that by default at server start this modifiers set is empty. So operation '+=' or '=' only makes sense. And their actions in this case have no differences.)

### Initial value for ["control flags"](https://web.archive.org/web/20190718063330/http://pascal.tsu.ru/en/xkb/internals.html#controls) set.

**controls** **\[ = | -= | += \]** flag1 + flag2 + ...

As in prevous statement operation can be remove/add/replace (**'-='/'+='/'='**).

#### "Flags" can be

**repeat** (or **repeatkeys**)

allow key autorepeat  
(it is allowed by default so only their removing makes sense -  
controls -= repeat);

**mousekeys**

switch on 'mouse emulation';

**mousekeysaccel**

switch on 'accelerated mode' for mouse cursor movement

**overlay1  
overlay2**

switch on corresponding ['overlays'](https://web.archive.org/web/20190718063330/http://pascal.tsu.ru/en/xkb/internals.html#overlay).

**ignoregrouplock**

to ignore 'current group' in GrabKey mode

**audiblebell**

switch on (off) keyboard bell.  
(Remind that XKB can send [bell-events](https://web.archive.org/web/20190718063330/http://pascal.tsu.ru/en/xkb/internals.html#bell) to 'juke-box' (that will play sounds or music) instead of ordinar 'cheep'. If you system have such 'juke-box' you can switch of keyboard bell.

**accessxkeys  
slowkeys  
bouncekeys  
stickykeys  
accessxtimeout  
accessxfeedback**

switch on several modes of AccessX (for Physically Impaired Persons).

### Modifiers that must be ignored in GrabKey mode

**ignorelockmods** **\[ -= | += | = \]** modifier1 + modifier2 + ... (or **ignorelockmodifiers** ...)

### List of 'internal modifiers'

**internalmods** **\[ -= | += | = \]** modifier1 + modifier2 + ... (or **internalmodifiers** ...)

This is modifiers set that must be used inside Xserver (for 'action' selection if exists) and must not be reported to client applications in keyboard events

### Group ['adjust method'](https://web.archive.org/web/20190718063330/http://pascal.tsu.ru/en/xkb/internals.html#wrap).

**groups** = \[ **wrap** | **clamp** | number \] (or **outofrangegroups** ...)

It defines 'group adjustment method'. Remind that such method can be **wrap**, **clamp** or **redirect**. In the last case additional data required - group number 'what number redirect to' if original group number is out of bounds.  
So **redirect** method can be specified in form

**groups** = group\_number

### Bell parameters.

**bell** = number (or **bellvolume** = number ) **bellpitch** = number **bellduration** = number **click** = number (or **clickvolume** = number )

All this statements define 'cheeper' parameters (**bell**) and 'keyboard click' (ordinary click is sound shorter than bell).

Statements **bell** and **click** also can looks like

**bell** = \[ **on | off** \] **click** = \[ **on | off** \]

that means (as easy to guess) that these signals must be switched on/off. If command is "to switch on signal" without any volume the volume assumed 100.

### Some timeouts.

**repeatdelay** = number

delay (in milliseconds) between key press and autorepeat begin;

**repeatinterval** = number

interval (in milliseconds) between autorepeats;

**slowkeysdelay** = number

in **slowkeys** mode key considered as pressed when it is in pressed (physicaly) state some time interval to avoid 'accidental bump' of key. This parameter define such time interval.

**debouncedelay** = number

in **bouncekeys** mode XKB temporary desible key after key press or release to avoid 'key bounce' when it pressed inaccurately. This parameter define time interval when key be disabled.

**accessxtimeout** = number (or **axtimeout** = number)

delay (in seconds) after what AccessX mode will be swithed off automaticaly. This parameter have sense if corresponding 'control flag' is up -  
(**controls += ... accessxtimeout ...**);

### Parameters of 'mouse cursor acceleration'.

**mousekeysdelay** = number

delay (in milliseconds) between 'mouse key' press and its autorepeat begin (the same as **repeatdelay** for other keys);

**mousekeysinterval** = number

autorepeat interval (the same as **repeatinterval** for other keys);

**mousekeysmaxspeed** = number

maximum speed of cursor movement in pixels per event (precisely - if XKB 'action' of mouse movement key **MovePtr** have argument 'move per event' more than one than maximum speed will be product <move per event>x<mousekeysmaxspeed>);

**mousekeystimetomax** = number

how many repeats have to occur before speed reach max value;

**mousekeyscurve** = number (in bounds -1000:1000)

acceleration 'curve Factor' ( in accelerated mode cursor speed grows from initial value to maximun not linear but as **X^(1 + curve/1000)**.  
If **mousekeyscurve** = 0 than growth is linear)

### Switch on/off AccessX 'sound indication' modes

**accessxtimeoutctrlson** \[ -= | += | = \] option1 + option2 + ... (or **axtctrlson** ...) **accessxtimeoutctrlsoff** \[ -= | += | = \] option1 + option2 + ... (or **axtctrlsoff** ...)

here 'options' can be - **slowkeyspress, slowkeysaccept, feature, slowwarn, indicator, stickykeys, slowkeysrelease, slowkeysreject, bouncekeysreject, dumbbell.**

For more details about these modes see documentation (**XKBlib**) from **XFree86** distributive.Some words about XKB internals.
-------------------------------

*   [The basic terms - codes and symbols.](https://web.archive.org/web/20190718184358/http://pascal.tsu.ru/en/xkb/internals.html#codes)
*   [Two parts of XKB and compatibility problem.](https://web.archive.org/web/20190718184358/http://pascal.tsu.ru/en/xkb/internals.html#two-part)
*   [Symbols table.](https://web.archive.org/web/20190718184358/http://pascal.tsu.ru/en/xkb/internals.html#symbols)
*   [Actions table.](https://web.archive.org/web/20190718184358/http://pascal.tsu.ru/en/xkb/internals.html#actions)
*   [XKB state: current group number.](https://web.archive.org/web/20190718184358/http://pascal.tsu.ru/en/xkb/internals.html#state-group)
*   ["Keeping in range" methods for group number.](https://web.archive.org/web/20190718184358/http://pascal.tsu.ru/en/xkb/internals.html#wrap)
*   [Modifiers.](https://web.archive.org/web/20190718184358/http://pascal.tsu.ru/en/xkb/internals.html#mods)
*   [XKB state: current modifiers set.](https://web.archive.org/web/20190718184358/http://pascal.tsu.ru/en/xkb/internals.html#state-mods)
*   [Shift level calculation. Key types.](https://web.archive.org/web/20190718184358/http://pascal.tsu.ru/en/xkb/internals.html#types)
*   [What other data each keycode description has.](https://web.archive.org/web/20190718184358/http://pascal.tsu.ru/en/xkb/internals.html#key)
    *   [Keep group number in range method.](https://web.archive.org/web/20190718184358/http://pascal.tsu.ru/en/xkb/internals.html#key-wrap)
    *   [Key behavior.](https://web.archive.org/web/20190718184358/http://pascal.tsu.ru/en/xkb/internals.html#key-behavior)
    *   [Exceptions set.](https://web.archive.org/web/20190718184358/http://pascal.tsu.ru/en/xkb/internals.html#key-explicit)
    *   [Real and virtual modifiers.](https://web.archive.org/web/20190718184358/http://pascal.tsu.ru/en/xkb/internals.html#key-mods)
*   [XKB state: control flags (XKB Controls).](https://web.archive.org/web/20190718184358/http://pascal.tsu.ru/en/xkb/internals.html#controls)
*   [Indicators.](https://web.archive.org/web/20190718184358/http://pascal.tsu.ru/en/xkb/internals.html#indicators)
*   [Compatibility table.](https://web.archive.org/web/20190718184358/http://pascal.tsu.ru/en/xkb/internals.html#compat)
*   [Radio Groups](https://web.archive.org/web/20190718184358/http://pascal.tsu.ru/en/xkb/internals.html#radio)
*   [Overlays.](https://web.archive.org/web/20190718184358/http://pascal.tsu.ru/en/xkb/internals.html#overlay)
*   [AccessX. Additional services for physically impaired persons.](https://web.archive.org/web/20190718184358/http://pascal.tsu.ru/en/xkb/internals.html#accessx)
*   [Mouse events emulation.](https://web.archive.org/web/20190718184358/http://pascal.tsu.ru/en/xkb/internals.html#mouse)
*   [Bell features extension.](https://web.archive.org/web/20190718184358/http://pascal.tsu.ru/en/xkb/internals.html#bell)

### The basic terms - codes and symbols.

The main XKB module function is convertion of the pressed keys scan-codes to the symbol codes.

In the XKB documentation scan-codes are named **keycodes** and the symbols codes are named simply **symbols**.

Of course the "symbols" term doesn't mean printable symbol codes only (letters, digits, punctuation, etc.). This term includes "control symbols" (such as Esc, Enter, Backspace, etc.) and codes that can influence to state of XKB itself and so to other symbols choice procedure (alphabet switcher, Control, Shift, Alt, etc.).

### Two parts of XKB and compatibility problem.

First of all I should tell some words how scan-codes to symbols conversion occurs in the X Window System without XKB module.

The X-server itself doesn't converts keycode to symbol. When you press or release any key X-server keyboard module sends "message about event" (or simply **event**) to application.

Such message contains scan-code and "keyboard state" only. The keyboard state is bit flags set that reflects the state of "modifer keys" - **Shift, Control, Alt, CapsLock**, etc.

So namely application has to decide what symbol match to this scan-code when such modifiers are set.

Of course for this purpose application can use "keyboard map table" stored in the X-server that contain lists of all possible symbols for each scan-code. Usually application gets this table from the X-server at start time.

Of course nobody writes such scan-code interpretation procedure for each application. There are special subroutines for this purpose in Xlib library.  
Remind that the Xlib is set of low-level procedures for communication between application and the X-server. And even application use only hight-level library or toolkit (such as Xaw, Motif, Qt, gtk, etc.) this library in its own turn use Xlib as base.

So Xlib procedures knowing scan-code and modifiers state from event message choose appropriate symbol from keyboard map table derived from server at startup.

And the XKB module too sends to application scan-code and own state only. But unlike old module XKB have more complicated symbols table, different modifiers set and some other components of keyboard state.

Therefore for right working Xlib must contain procedures that are "XKB aware". Of course X's that have server with XKB module also has XKB-aware Xlib.

So we can say that the XKB consists of two parts - module built in server and Xlib subroutines set that are part of each application.

But nobody forbids to use applications that was linked with old Xlib that doesn't know about XKB. It leads to "compatibility problem". XKB must be able to communicate with own Xlib and with old "non XKB-aware" Xlib too.  
Of course such communication is not limited with messages about key press or release. Xlib procedures can send to X-server some requests (for example get symbols map) and commands (for example change some symbol placement in this table).  
And even working with old Xlib XKB must react to such requests and commands to allow application work as correctly as possible.

### Symbols table.

What is simbols table that binds symbols with keycodes and modifiers state? Lets look for begining to "traditional" symbols table being used before XKB.

Like in many another keyboard modules it can be represented as simple two-dimensional table where each row corresponds to keycode and each column corresponds to modifier or modifiers combination.

First of all note that in the key press/release event only one byte (octet) allocated for modifiers. So there can be eight modifiers only. First three ones are named **Shift, Lock, Control** and all other are "unnamed" - **Mod1, Mod2, Mod3, Mod4, Mod5**.  
I should note that though names of first three modifiers obviously hints what keys they should correspond actually they can be binded (it means modifiers will change own state at corresponded key press/release) to any other keys

But it's more important that the eight modifiers can form up to 256 different combinations. So in theory symbols table can include up to 256 columns. In the same time old standard strongly defines only first four columns. You can guess that only two modifiers are used to distinguish these columns, they are **Shift** and **Mode\_switch**. (You can see that there isn't modifier with name **Mode\_switch**. Yes, it's right. One of unnamed modifiers plays this role. And **Mode\_switch** is name of one of control symbols. When application requests symbol table from server it also asks what modifier is bound to this control symbol.)

So first four columns corresponds to states:

none modifiers

Shift

Mode\_switch

Mode\_switch+Shift

  
In core protocol terms we can say that the **Mode\_switch** choose one of two column groups (note that here "group" means not the same that the "XKB group" about which we will talk below). And **Shift** state choose one of two columns inside group.  
Of course you know that the different group usually used for different alphabets and **Shift** choose small or capital letters inside one alphabet.

�

Group 1

Group 2

�

Shift

Mode\_switch

Mode\_switch+Shift

...

keycode 38

a

A

Cyrillic\_ef

Cyrillic\_EF

keycode 39

s

S

Cyrillic\_yeru

Cyrillic\_YERU

keycode 40

d

D

Cyrillic\_ve

Cyrillic\_VE

...

Also note that neither **Lock** nor **Control** don't paricipate in symbol choice. If these modifiers are active so special Xlib subroutines makes additional convertion for symbol after its choice.

Lets return to XKB module. You can see that the main disadvantage of traditional symbols table is its unflexibility. Though there can be up to 256 columns but only first four can be standardly processed and their dependence on modifiers hardcoded in Xlib.

Therefore one of the basic improvements brought by XKB is large flexibility in the table construction.

*   First of all in XKB columns aren't strongly bound to concrete modifiers. One of XKB configuration file describes column number dependence on any modifiers set. Of course you can add or change such dependence by editing of this file. (More detaily about it see below: [Shift level calculation. Key types.](https://web.archive.org/web/20190718184358/http://pascal.tsu.ru/en/xkb/internals.html#types))
*   The second one: in the same keyboard map different keys can contain different number of symbols and their dependence on modifiers. For example
    *   **Enter** key doesn't depend on any modifiers state so in table its row has only one column.
    *   key with symbols '1' and '!' has in table two columns and column choice depends on only **Shift** state.
    *   but key with symbols '-','\_' and '=' can have three columns and their choice depends on two modifiers - **Shift** and **Mod1**
*   With such approach term "group" significantly change meaning. We can't define group as "pack of columns" becouse such pack size will be different for different keys.  
    Generally with such flexibility of columns\_to\_modifiers binding we can forget about groups or simply speak that the "group" is group of columns united by one modifier state (**Mode\_switch** for example) but ...

It is very usefull to devide table into groups. First of all it makes easier to separate different alphabets in one keyboard map. Note that someone use two and more alphabets simultaneously. And strong bounds between alphabets allow to complete such parts independly.  
And the second one is than more modifiers we involve to column choice then more complicated and difficult to understand keyboard map become.

So XKB design use radical approach - one keybord map can contain some (up to four) tables. And these different table in XKB has name "XKB groups" (or simply **groups**).

It is more correctly to tell not "some two-dimensional tables in one map" but "each **keycode** can have up to four one-dimensional tables - groups".  
Becouse...

*   Some keys meaning (**Enter** for example) is the same for all alphabets. So they need not table division to separate groups.
*   Even inside one group (alphabed) different keys can have different number of columns. It means that the table width varies not only "from group to group" but also "from keycode to keycode". So it is more convenient to describe each separate group for each separate keycode.
*   And finally each keycode also has some other data (see [below](https://web.archive.org/web/20190718184358/http://pascal.tsu.ru/en/xkb/internals.html#key) ) that doesn't depends on group number. So if we would have some "global" tables and would describe such data for the same key in different tables then this information could be inconsistent.

So...

*   XKB keyboard map has keeps some one-dimensional tables of symbols for each **keycode**. Such table name is **group**.
*   Each **group** table can contain some columns - **shift levels**.
*   What one-line table is current is pointed by "current group number" (or simply **group**). X-server keeps current group number and reports it with keycode and current modifiers set in **key event**.
*   Column (**shift level**) inside group is chosen by current modifiers set.
*   Different **keycode** keycode can have different number of **groups**.
*   Different group of the same **keycode** can have different number of **shift levels**.

keycode

groups number

levels number

�

36

1

one column

**Enter**

�

38

1

two columns

a

A

�

2

three columns

Cyrillic\_ef

Cyrillic\_EF

�

3

two columns

Greek\_alpha

Greek\_ALPHA

�

21

1

two columns

+

\=

�

2

four columns

+

\=

\\

;

...

And finally I should say that the number of groups can be from 1 to 4 and number of levels can be up to 64.

### Actions table.

Besides "symbols table" keycode can have bound "**actions** table". This table also can be devided to **group** sub-tables and **levels**.

Unlike symbols table that is used by application (X-server only keeps it) actions table is used by server itself.

This table cells contains pointers to XKB internal procedures that changes "XKB state" - current [group](https://web.archive.org/web/20190718184358/http://pascal.tsu.ru/en/xkb/internals.html#state-group), current [modifiers set](https://web.archive.org/web/20190718184358/http://pascal.tsu.ru/en/xkb/internals.html#state-mods) and [internal control flags set](https://web.archive.org/web/20190718184358/http://pascal.tsu.ru/en/xkb/internals.html#controls).

But it's more correctly to say that the **actions** functions isn't limited by XKB state changing. They also are used for:

*   [mouse events emulation](https://web.archive.org/web/20190718184358/http://pascal.tsu.ru/en/xkb/internals.html#mouse) (pointer movement and mouse buttons press)
*   special events generation
*   screen switching
*   X-server termination
*   etc.

More detaily about all possible **actions** you can read in [Actions description](https://web.archive.org/web/20190718184358/http://pascal.tsu.ru/en/xkb/gram-actions.html).

It is important that if some cell (defined by **group** and **shift level**)in action table is filled with **action** so corresponded cell in symbols table must exist and be filled with symbol (usually it's "control symbol").

Note that the old keyboard module has not actions mechanism.

### XKB state: current group number.

XKB keeps current group number in "internal state" table.  
Strictly speaking, there are three internal variables for group number

*   **locked group** - analogue **CapsLock** key action for groups
*   **latched group** - analogue **Shift** key action for groups
*   **base group** - one another shift value for group number

These variables values can be changed by **actions** bound to appropriate keys (**keycodes**).

And there is term **effective group** that is sum of all three mentioned variables. This value XKB server part calculates at every key press or release and reports to application in **key event** to allow aplication choose needed symbol. (Of course the same value server uses for **action** choice.)

### "Keeping in range" methods for group number.

Of course this sum can be bigger than number of groups are really used in keyboard map. To make from it some reasonable value XKB can use one of three methods:

*   **Wrap** - XKB devides sum to number of defined groups and takes rest. It's method by default.
*   **Clamp** - if sum is bigger than highest group it will be replaced with "last group number", if sum less than one the first group will be used.
*   **Redirect** - if this method is used it need in XKB state one another value defined - number "where redirect to" (or "what replace with"). If sum is out of bounds this additional value will be used. By the way if this value also is out of bounds XKB will use first group.

### Modifiers.

Besides group number variables "XKB state" contains variables for bit flags that are named modifiers. These flags changes own state when keys like **Shift, CapsLock, Alt, Control**, etc. are pressed or released.

As I said above old protocol also has modifiers set. Their names are **Shift, Lock, Control, Mod1-Mod5**. In dependence on their state Xlib choose symbol from symbols table and can perform some additional actions such as make control symbols from ordinar symbols, change small letters to capital ones and so on.  
Also application can interpert modifiers in own way and so change own behavior.

XKB has more modifiers and thier behavior dependence on modifiers can be flexibly changed (not at start only but at work time too). But becouse of compatibility problem XKB needs to emulate traditional modifiers set for old client program (linked with old Xlib).

So traditional modifiers set in XKB have name **real modifiers** and names of each modifier are the same as in old standard.  
And XKB also has 16 own internal modifiers that was named **virtual modifiers**.

Unfortunatly one part of compatibility problem is that the **key event** allocates only eight bits for modifiers. So there is not way to report all sixteen XKB internal modifiers to the application in **key event** message. And XKB needs to map own **virtual modifiers** to **real modifiers** even when it communicates with XKB-aware application. The only consolation is you can map to one real modifiers as many virtual modifiers as you want.

Modifiers has some function:

*   their state is used for **shift level** calculation for symbol and/or **action** choice;
*   their state is used for indicators state calculation;
*   and since they are used for **action** choice so they influence to all that the **actions** do - group number calculation, other modifiers state changing and so on.

### XKB state: modifiers.

Like group number modifiers set inside XKB distributed to three variables

*   **locked modifiers**
*   **latched modifiers**
*   **base modifiers**

These variables values can be changed by **actions**.

And as for group there is term **effective modifiers** that is boolean sum (bitwise OR) of three mentioned variables. Of course since it is boolean addition XKB needn't any additional acts to keep sum in range.

### Shift level calculation. Key types.

XKB doesn't keep **shift level** like **group** number inside but calculates it from modifiers state every time when need it. And for each key level from modifiers dependence can be different.

To allow such flexibility XKB uses "key type".  
Key type is some function (in mathematic meaning) that describes what modifiers need to be used for shift level calculation and what level match to certain modifiers combination.  
And so each **group** sub-table for each **keycode** contains key type identifier.

When key is pressed XKB takes key type description from sub-table and useing this description and modifiers state as argument calculates cell number (what **shift level** means) symbol have to be chosen from.

I should note that though key type for each keycode sub-table can be changed flexibly XKB has "basic set" of key types and each keycode has any type as default. Therefore usually one needn't specify key types in keyboard map.

### What other data each keycode description has.

Besides symbols and actions tables each keycode description has some other variables:

*   method for keeping group in range specific for this key;
*   key behavior;
*   exceptions set;
*   real (modmap) and virtual (vmodmap) modifiers

#### Keep group number in range method.

Since different keys can have different number of groups it can occur that the **effective group** value legal for whole keyboard map is too big for some particilar keys.  
In such case effective group must be corrected especially for current key.

Possible methods are the same as ["global" ones](https://web.archive.org/web/20190718184358/http://pascal.tsu.ru/en/xkb/internals.html#wrap). By default **Wrap** method is used.

#### Key behavior.

This variable consists of two parts - boolean flags and additional argument. In most cases additional argument is not needed but some flags assume additional numeric value. Of course argument meaning depends on flag meaning.

These flags defines:

*   need this key "autorepeat" or not. (To say correctly this flag is stored in another place but it make no sense for our consideration.)
*   must this key be "lockable" (it means that after first press/release this key stay logicaly pressed and will be unpressed after next press/release.) Such locking can be performed by hardware or emulated by XKB module.
*   is this key the member of any [radio group](https://web.archive.org/web/20190718184358/http://pascal.tsu.ru/en/xkb/internals.html#radio). For this flag additional argument means radio group identifier.
*   is this key the member of any [overlay group](https://web.archive.org/web/20190718184358/http://pascal.tsu.ru/en/xkb/internals.html#overlay) There can be only two such group. What group is active in current time can be managed by one of two [XKB control flags](https://web.archive.org/web/20190718184358/http://pascal.tsu.ru/en/xkb/internals.html#controls) (names of flags are **Overlay1** and **Overlay2**). So there are two flags in **key behavior** - "is it the member of the first overlay group" and "is it the member of the second overlay group". The additional argument means keycode which will replace this key keycode if the corresponded overlay group is active.

#### Exceptions set.

It is bit mask that defines what keycode related data is "specified explicitly" and must not be changed in some cases. The thing is that the X-protocol include commands that allow application change symbol\_to\_keycode binding in keyboard map inside X-server. Of course these commands changes symbols placement only but doesn't change other data such as **action**, key behavior or key bound modifiers.

To allow XKB to move this data at symbol moving there is special mechanism - symbol [interpretation](https://web.archive.org/web/20190718184358/http://pascal.tsu.ru/en/xkb/internals.html#compat). Useing this mechanism XKB can move non-symbol data bound to keycode when application requests the symbol moving.

But in some cases such changes can be considered as unwanted. So **exceptions set** can protect keycode related data against such implicit changes.  
If application uses special XKB-protocol requests this protection is unneeded.

This mask can forbid

*   to change key type (number of shift levels) for each group sub-table;
*   changes that can occur at **interpretation** processing; you can forbid:
    *   all changes;
    *   **autorepeat** or **lock** flags changes;
    *   keycode bound modifiers changes;

#### Real and virtual modifiers.

First of all note that there are two variables for each keycode (**modmap** and **vmodmap**) one variable for real modifier and anoter one for virtual modifiers.

The real modifier is used for traditional modifiers set emualtion but virtual modifier can be used as argument for actions bound to this key.

I should say that the virtual modifiers set (**base, locked** and **latched** can be changed by appropriate **action**. Of course this action must has argument that describes what modifiers will be switched on/off. And if you describe such action you can specify modifiers names explicitly or refer to **vmodmap** (that means "set/unset modifiers bound to this key").

But modifiers in the "emulated traditional modifiers set" changes automaticaly at key press/release. You can guess that the "emulated modifier" for particular key is modifier keeped in the real modifier variable (**modmap**) of this key.

Also these two variable are used for the virtual\_to\_real modifier mapping. Remember that the virtual modifier has not any effect while it is not mapped to any real modifier.

### XKB state: control flags (XKB Controls).

Besides group number and modifiers set there is another one set of bit flags in XKB state. But in difference to group and modifiers that are distributed to three variables (**base, locked, latched**) this set occupate only one variable.

Control flags set contain flags that are used for switching XKB modes and isn't reported to application.  
These flags are used for

*   switching [overlay mode](https://web.archive.org/web/20190718184358/http://pascal.tsu.ru/en/xkb/internals.html#overlay) for keyboard parts;
*   switching [mouse events emulation](https://web.archive.org/web/20190718184358/http://pascal.tsu.ru/en/xkb/internals.html#mouse) modes.
*   switching [AccessX](https://web.archive.org/web/20190718184358/http://pascal.tsu.ru/en/xkb/internals.html#accessx) subsystem modes.
*   and some other XKB properties.

XKB controls (like group number and modifers) can be changed by appropriate [action](https://web.archive.org/web/20190718184358/http://pascal.tsu.ru/en/xkb/internals.html#actions) bound to some keys.

### Indicators.

You know that besides key keyboard has some indicator LEDs. These indicators management is XKB duty too.  
XKB can have up to 32 indicators.  
Of course keyboard has only 3-4 LEDs and so can show state of first 3-4 XKB indicators. These indicators have name "physical indicators" and all other are "virtual indicators". Virtual indicators state can be read from XKB and be showed by special programs (**xkbvleds**, **mxkbledpanel**).

Each indicator can be bound to some component of "XKB state" (modifier, group number or XKB control flag) and so indicator state will reflect state of own XKB state component.

And there are special XKB protocol requests that can be used by application to change some indicator state (to switch on/off). Note that I talk about possibility to switching on/off LED only but not about changeing keyboard state component bound to this lamp.

Therefore each indicator description has some flags that defines:

*   could application change this indicator state (or to switch it on/off you need to change keyboard state);
*   is this indicator bound to some keyboard state component or it is used by applications only;
*   and finally, has this indicator "feedback". It means you can make indicator has influence to bound component and request to change indicator state will cause change of component state (modifer state or group number or control flag state).

### Compatibility table.

As I already mentioned above, XKB needs to solve the "compatibility problem" working with application that aren't XKB-aware and that use traditional protocol requests.

Of course XKB can process such requests but the problem is that the XKB has some new terms and mechanisms absent in traditional protocol (core protocol). You guess that the core protocol requests doesn't deal with these mechanisms.

*   First of all XKB has more modifiers (and can change their behavior flexibly). Therefore XKB needs to support eight traditional modifiers and to map own modifiers to these ones (as I told above).
*   The second one is that the group number in the core protocol has another meaning. I already said that there are only two groups that can be switched by the **Mode\_Switch** key and the current group in keyboard state can be reflected by one of unnamed (**Mod1-Mod5**) modifiers that is bound to **Mode\_Switch**.
    
    Thus in core protocol the current group (base/alternative group) indication needs only one bit and this bit is one of modifiers. But XKB for current group number delivering heeds two-bit field and in keyboard event this field placed separately from the modifiers set.
    
    Also in old keyboard protocol standard each group consists of two levels exactly though each keycode can have up to 256 symbols. First four cells in keycode row are "two groups of two levels". All other cells application can choose in dependence on Mod1-Mod5 modifiers state in own way.
    
    Therefore for compatibility XKB needs ...
    
    *   First of all convert own "group sub-table" to one row of traditional symbols table (to say honestly I still don't understand this action rules except simplest case such as "two group of two levels").
    *   And the second one, to convert own group number to any real modifier state.
*   The last problem is that the old keyboard module hasn't **actions** that are main feature provide XKB behavior flexibility. It leads to problem when non XKB-aware program will request change of some symbol\_to\_keycode binding. Since such program even doesn't suspect that this keycode can have also some action bound, it's possible that the application will move "alphabet switcher" to another key but **action** that really do such switching will stay on old place.
    
    To solve this problem XKB has table of "control symbols interpretation" (or simply **interpretation** table). This table connects symbols codes and corresponded **actions**. Of course only control symbols (such as **Caps\_Lock, Shift, Num\_Lock, "alphabet switcher"**, etc.) presents in this table.
    
    Besides symbols and actions itself each **interpretation** keeps some additional data that is "real modifier list" and "match criterion" (such as "any of modifiers", "all of modifiers", "specified modifiers only", etc.).
    
    Every time at symbos binding change XKB searchs this symbol in **interpretation** table (note that the XKB also do it at X-server start time). If symbol is found XKB with symbol binding also perform corresponded action binding to the same position in keycode table. The additional data (modifier and match criterion) also can be used for seeking appropriate place for action.
    
    Also interpretation can change some other keycode properties such as autorepeat and locking flags and virtual modifier (bound to keycode).
    
    I should remind that the keycode can have "exceptions set" that protects keycode properties against such changes.
    
    I should mention that though **actions** can be specified in keyboard map tables but to place all **actions** in **interpretation** table is "right thing". Since in this table each action is bound to control symbol (not to some position in keycode tables) and XKB moves action from interpretation table to keyboard map at configuration load time so it allow XKB to find most appropriate place for each action. Thus all symbols and actions will be bound to keycode in most correct way.
    

Few other terms.
----------------

### Radio Groups.

XKB module allow to unite some keys to one radio-group. It means that all keys states in such group depends on each other. At one key press all other keys become unpressed.

Of course pressed key will stay in pressed state until some other key of group will be pressed. The belonging of concrete key to radio-group can be defined in "key behavior".

In the same place you can specify one additional property for radio-group that defines possibility to release all keys simultaneously. Usual radio-group definition assumes that the one of keys always must be in pressed state. To release it you need to press any another key but in such case this second key become pressed. If radio-group has property "allow to release all keys" you can simply press logicaly pressed key one more time and this key (and all other from group) will become logicaly unpressed.

XKB allow to have up to 127 radio groups.

### Overlay group.

XKB allow some keys to have alternative scan-code (keycode). It means that in normal state when such key is pressed and keyboard generates its scan-code XKB use this scan-code in usual way. But when overlay mode is switched on XKB replaces this scan-code by alternative one ant then deal with this new code.

Such group of keys that has alternative keycodes is named "overlay group" (or simply **overlay**). There can be only two such group. The belonging of concrete key to overlay group and alternative keycode itself can be defined in "key behavior".

### AccessX. Additional services for physically impaired persons.

There are people who has limited mobility of hands (fingers) or need to use some devices to access keyboard.

The problems can occur are:

*   It's impossible to press two (or more) keys at the same time (for example **Shift**+"letter"). To solve this problem XKB has **StickyKeys** mode. This mode change behavior of modifier keys and allow to press they in sequence instead of simultaneously. For example instead of **Shift+Control+C** one can press and release **Shift** key then press and release **Control** key and then press **C** key. Note that only modifier keys become "sticky". It means that after modifier key press the XKB waits another key press but when ordinary (letter) key press the XKB gnerates keyboard event.  
    On the other hand this mode itself can cause problem if modifier key was pressed by a mistake. Therefore **StickyKeys** mode has special delay time when the XKB waits another key. After this time expire key become logicaly unpressed.
*   Some user can accedentally "bounce" key when he press or release it. To avoid such "bounce effect" the XKB has **BounceKeys** mode. This mode means that after first physical key press this key become "insensible" and so will ignore other press/release at some time.
*   Some user can accidenally bump unneeded key while moving hand from key to key. To solve this problem the XKB has **SlowKeys** mode. In this mode each key is considered as pressed if it is physically pressed while some time. In the other words if you will press key and then release it quickly the XKB will ignore such short term press.
*   It can be hard or impssible to move mouse device. To solve this problem the XKB can emulate mouse events by keyboard. More detaily about this mode see [below](https://web.archive.org/web/20190718184358/http://pascal.tsu.ru/en/xkb/internals.html#mouse).

All these modes are performed by part of XKB module that has name AccessX. Each mode can be switched on/off by change of XKB control flags with the same names.

Also note the AccessX modes switching on itself can be a problem. (Lets imagine that user needs **StickyKeys** mode but to switch it on he need to press complex key combination). Therefore to switch on some modes the special actions are used:

*   If **Shift** key is physicaly pressed and stay in such state more then 8 seconds the **SlowKeys** mode become active.
*   If **Shift** key is pressed sequentally five times the **StickyKeys** mode become active.

But to make the XKB recognize such "magic sequences" a special mode (**AccessXKeys**) must be switched on in its own turn. To activate it you can ...

*   to specify special command line option at X-server start or
*   to set needed control flag in XKB configuration file or
*   to set the same flag by pressing key with appropiate **action**. (by default such key absent but you can add it in keyboard map if you need).

On the other hand if one of AccessX modes is active but computer is used by different users this mode can disturb some people. Therefore the XKB has special option that allow automatically switch off AccessX modes if keyboard stay not in use long time. And **StickyKeys** mode (simultaneous key pressing emulation by sequental press) become inactive if you will press some keys really simultaneously.  
This automatical deactivation (as the other modes) can be switched on/off by corresponded XKB control flag (**AccessXTimeout**).

And finally, AccessX has special mode of additional sound indication of all events such as several timeouts begin and end and LEDs switching. To allow users distinguish these events (especially when more then one AccessX mode is active) the XKB tries to make different sounds (in pitch and duration) for different events as far as hardware allow.  
This mode as the other modes can be switched on/off by corresponded XKB control flag (**AccessXFeedback**). Also sound for separate events can be switched on/off seprately.

### Mouse emulation.

The XKB can emulate mouse events by keyboard. It means that it can be configured to produce events about mouse movement and mouse button pressing instead of key press events.

It can be done by corresponded [actions](https://web.archive.org/web/20190718184358/http://pascal.tsu.ru/en/xkb/internals.html#actions) such as "pointer movement", "mouse button press", "mouse mouse button choice".

Some details:

*   In pointer movement **action** you can specify both coordinates or their changes. Coordinates can be absolute (it means that you spesify point on screen exactly) or realtive that means movement to some points to needed direction. Usualy there are some **action** with the same direction but with different distance values - one point, ten points, etc. These **action** can be bound to the same key but to different shift levels. It means that press such key alone you will get one-point movement but being pressed with Shift key the same key will cause more long movement per one key press.
*   In mouse button press **action** you can specify "repeat counter" besides button number. It means that by key one press you can produce double-click (or triple or more).
*   Also there is variant of such action that not only press mouse button but leaves it logicaly pressed after key release (as all **Lock** keys do) It means that with such action you can "press mouse button" then move pointer and then "release mouse button" by second press of the same key.
*   And finally, note that mouse can have up to 5 buttons and with multi-click and lockable variants it could happen that you will need many different keys for muse buttons. To reduce their number XKB has a **default button** term. To deal with this button there is special **action** that allow specify concrete button as default button or relative change of current default button number. Using last one you can change current default button in cycle by one key. And in all "mouse button **actions**" you can specify that this action is related to button that is default button in current time. (There is only one problem - to remember what button is default now :-).

Also there are two modes of mouse pointer movement - the simple movement and the movement with acceleration. At single press there is not difference between these two modes. But if you will keep key pressed and it begin to autorepeat so in normal mode pointer will be moved on the same number of pixels (on value specified in **action** arguments). But in **accelerated mode** size of one step will grow from step to step.

This acceleration process has some additional parameters that are saved in XKB internal variables (are the part of XKB state). (I should note that accelearted mode has own autorepeat parameters - delay between physical key press and autorepeat begin and time interval between autorepeat events). So these numeric parameters are:

*   **delay** - delay (in milliseconds) between key first press and autorepeat first event.
*   **interval** - interval (in milliseconds) between autorepeat events.
*   **maxspeed** - maximum speed (in pixels per event).
*   **timetomax** - number of events after which speed become **maxspeed**. You can see that there is not explicit acceleration value. XKB calculates it from initial step size (specified in action agruments), **maxspeed** and **timetomax**.
*   **curve** - acceleration "curve factor". The thing is that speed can grow not lineary only. In general speed grows proportialy to **X^(1 + curve/1000)** function. Thus with curve=0 growth is linear but with another values (from -1000 to 1000) growth has some curvature.

By deafult accelerated mode is active.

Mouse emulation switching on/off and movement mode choice can be performed by two [XKB control flags](https://web.archive.org/web/20190718184358/http://pascal.tsu.ru/en/xkb/internals.html#controls) - **MouseKeys** and **MouseKeysAccel**.

I should note that by default all needed actions are described in the XKB configuration and are bound to **NUMPAD** keys. To switch on/off the mouse emulation mode you can use **Shift+NumLock** keys combination.

### Bell features extension.

It can seems that this part has not relation to keyboard.  
Moreover, for users of computers where keyboard, display and "speaker" are independent devices such combination can looks very strange. But since in some hardware bell is placed in keyboard and produce **key\_click** sound at every key press so X's design consider that bell control is keyboard mode duty.

I should note that bell control presents in old (core protocol) keyboard module. With special requests to X-server application can change **key\_click** parameters (tone, duration and loudness) and produce this sound when it needs.

The XKB module offers advanced bell features and allows not only cause **click** sound but play music fragment. Of course to provide such "music accompaniment" is too complex task for keyboard module. First aff all it needs some 'sound database' and the second it has to support many different hardware (sound cards).

Therefore XKB design assumes that there must exists special application ("juke-box") for sound play. And the XKB simply generates special event (instead og click sound) that can be delivered to any application as all other events. Juke-box has to say to X-server at start that it acceps some kind of events (in this case xkb **bell-events**).

Of course, if such music box presents its ability is not limited with bell sound with different tone/duration play. It would can play many music fragments from own database.  
Therefore XKB **bell events** contains not sound parameters but simply some "sound name" (or "bell name"). And music box has to have some table where each bell name is bound to concrete music fragment.

So application working with XKB can request not simple bell but any sound specifying its name. Note that XKB doesn't perform any check of such sound names but simply retranslate them to juke-box.

Of course XKB not only retranslates "sound requests" from applications to juke-box but can request sound for own needs (when it changes own state).Common notes about XKB configuration files language.
----------------------------------------------------

For a configuration description XKB uses a language similar to **C** program language.

A format of numeric and string constants usualy match a format of C language constants.

String constants are char sequences bounded with 'double quotas' (for example - "Num Lock"). Also inside such constants one can use 'special symbols' in C-like notation - \\r, \\n, \\t, \\v, \\b, \\f or by octal codes - \\0\*\*.

Numeric constants can be written in decimal (for example - 123), hexadecimal (0x123, 0xff) and octal (033) formats.

The main difference from C language is that small and capital letters in key words aren't distinguished (language is 'case insensitive'). It means that for example **SETMODS, SetMods, setMods** and **setmods** mean the same.

Statements that are common for all file types.
----------------------------------------------

Each file or section consists of statements (declarations, instructions, definitions).

What statements are legal in particular file depengs on 'File Type' (or component type).

Though there are some words that can be used in files (sections) of any type.

### 'include' statement.

Of course, it means that some portion of text must be inserted into this section from other file (section). Note that argument of this statement can be not a single file (section) name but a more complex string. For example

  include "en\_US(pc104)+ru"  

Of course, all words in such string (concatenated with plus sign) must be names of existent files and their internal sections. And each such file must have a type the same as the current section (where 'include' statement occur) has.

### Merge mode.

Before each single section there can be additional words that defines 'how to add' this section to a common configuration. Their name is **merge mode**.

That mode defines what a program has to do if a similar section already presents in the common configuration and a new declaration conflicts with a previous one. For example such declaration can be a keycode name definition (**xkb\_symbols** type section) for scan-code that is already defined (and named) or a modifier behavior description (**xkb\_compat** type) for a modifier that is already described.

Thus a merge mode can be one of

*   **augment** if two declaration conflicts keep old declaration and ignore new one;
*   **override** change old declaration to new one;
*   **replace** in many cases is the same as **override** but for **xkb\_symbols** type section its meaning is slightly different. Since every keycode has whole array of posible values - keysyms (which value will be selected depends on a modifiers state), different declarations for the same keycode may describe values for a part of array cells only. If new declaration describes a few sells only and merge mode is **override** it means that these a few cells must be overriden but all other cells must be unchanged. But if a merge mode is **replace** it means that the whole old array must be removed and replaced by array from the new declaration (even if it is incomplete).
*   **alternate** is allowed for **xkb\_keycodes** type sections and means that if a new keycode name conflicts with an old one, consider it as a 'keycode alias' (another one name for the same keycode).

### More details about 'include' statement.

Lets return to **include** statement. If declaration from a section that must be inserted conflicts with existen declarations a merge mode **override** is assumed by default (if inside file this section is not 'marked' with another merge mode). The same defaults are used if in the **include** argument string there are more then one file and additional files are concatenated with plus sign.

But if '|' sign instead of plus sign is used it means that next file must be added with **augment** merge mode (of course some declarations in the file can have own merge mode).

Also each 'merge mode' name (exept **altrenate**) can be used instead of 'include' word. E.g. instead of

include "group(toggle)"  

one can use for example

replace "group(toggle)"  

statement.

You guess it means that all decalration from **"group(toggle)"** section must be inserted in the current section but merge mode for all declaration from new section must be **replace** (not **override** as by default).Common structure of XKB configuration files.
--------------------------------------------

The XKB configuration file can have one of three forms:

*   [Simple configuration.](https://web.archive.org/web/20190724011542/http://pascal.tsu.ru/en/xkb/gram-file.html#simple)
*   [Set of simple sections.](https://web.archive.org/web/20190724011542/http://pascal.tsu.ru/en/xkb/gram-file.html#blocks)
*   [Set of complex sections.](https://web.archive.org/web/20190724011542/http://pascal.tsu.ru/en/xkb/gram-file.html#complex)

### Simple configuration.

If file contain the "simple configuration" there must begins from heading like

\[ Flags \] FileType \[ Name \]

after which instructions follows. For example:

xkb\_key�odes <TLDE> = 49; <AE01> = 10; .......

### Set of simple sections.

But often another form is used that is sequence of "simple sections". In such file all instruction are grouped to blocks or section that are bounded by figure brackets '**{...}**'. And each section must be terminated by semicolon sign '**;**'.

Each section has own heading the same as for "simple configuration" file.

\[ Flags \] FileType \[ Name1 \] '{' \[ instructions \] '};' \[ Flags \] FileType \[ Name2 \] '{' \[ instructions \] '};' ...

For example:

xkb\_symbols "basic" {....}; xkb\_symbols "us" {....}; ....

### File types.

Both mentioned formats uses the same **File Types**. It can be one of five words:

*   **xkb\_keycodes** - file (or section) that contains names to scan-code numeric values assignments.
*   **xkb\_types** - file where **key types** are described (key type defines how many shift levels one key has in dependence on modifiers state).
*   **xkb\_compat** - file that describe modifiers behavior.
*   **xkb\_symbols** - keyboard map itself that describes all possible symbols for each keycode.
*   **xkb\_geometry** - describes keys and indicators physical placement on keyboard.

Note that if file consists of some sections all sections must have the same type. But, of course, they have different names.

Name in heading is any character string in double quotes.

You can see that **FileType** in headings must presents always but **Name** can be ommited. Of course, if file is "simple configuration" or contains only one section the name presence is not necessary. To refer to this section in X-server configuration file the file name specifying is enough.

But if there are some sections in one file they has to have differnt names. To refer to particular section it can be specified like

file\_name(section\_name)

for example:

us(pc104)

### Flags.

Each heading can contain some flags such as:

*   **default** - this flag makes sense when file consists of more than one section. It marks one of sections (one only !) as "default section". It means that if somewhere this file name specified without section name namely this marked section has to be taken.
*   **partial** - means that this section is not full description but some part only. For example it can be **xkb\_symbols** type section that contains only "numpad key" description or it can be **xkb\_geometry** type section that describes only indicators placement.
*   **hidden** - means that definitions from this section are invisible in "normal state" and will become visible when XKB internal state will be changed. For example it can be **xkb\_symbols** type section that contains keypad symbols that will be generated when **Num\_Lock** modifier is set.

The next flags makes sense only for **xkb\_symbols** type files and sections. They only marks kind of symbols this section contains.

*   **alphanumeric\_keys** - alphabetic and numeric keys,
*   **modifier\_keys** - modifiers (Control, Shift, Alt, Meta, etc.),
*   **keypad\_keys** - keypad keys,
*   **function\_keys** - F1, F2, etc. keys
*   **alternate\_group** - symbols from any national alphabet.

I should note that X-server (or **xkbcomp** program) can use only **default** flag becouse it can help to choose needed section. All other flags are needed rather for users for navigation in lot of files and sections.

By the way, complete list of all sections with their flags you can find in **\*.dir** files inside **{XROOT}/lib/X11/xkb** directory. These files names reflects XKB file types - **keycodes, types, symbols**, etc. Flags in these files are represented by one letter that is first letter in flag name.

### Set of complex sections.

And finally lets consider third type of configuration file that is sequence of "complex sections". Each "Complex section" has form the same as "simple section":

\[ Flags \] ComplexType \[ Name \] '{' Section { Section } '};'

but contains not instruction but blocks of simple type sections. For example

xkb\_keymap "complete" { xkb\_keycodes {...}; xkb\_types {...}; xkb\_compat {...}; xkb\_symbols {...}; xkb\_geometry {...}; };

Like simple sections file this file can contain some sections of the same type but with different names (one of sections can be marked by **"default"** flag).

There are three "complex types":

*   **xkb\_semantics** - such section MUST contain **xkb\_compat** type section and CAN contain **xkb\_types** type section also.
*   **xkb\_layout** - MUST contain **xkb\_keycodes**, **xkb\_types** and **xkb\_symbols** types sections and CAN contain **xkb\_geometry** type section.
*   **xkb\_keymap** - most complete type, MUST contain all types that must contain both previous type sections (**xkb\_keycodes, xkb\_types, xkb\_compat xkb\_symbols**) and additionaly CAN contain types that are optional for both previous types sections (it is only **xkb\_geometry** type).The xkb\_types type file.
-------------------------

This file contents describes rules of **shift level** computation that are used in symbols map.

I should remind that to each **keycode** (key scan-code) can be bound from one to four one-line table of **symbols** (symbol code). Such one-line table must be chosen according to current **group number** and concrete symbol in table must be shosen according to **shift level** value.

Usualy different groups are used for different alphabets and different levels are used for small/capital letters. But note that XKB allow to have up to 64 **shift levels**.

So the xkb\_types type file contents describes **shift level** dependence on state of modifier keys (**Shift, Control, Alt**, etc.). Strictly speaking this file describes **key types**. Each type has any name and type description consists of rules for level calculation.

Then these types are used in **xkb\_symbols** type files where for each group table bound to keycode its own **key type** can be specified. But note that for most groups there are "default types" already defined so in most symbols maps you will not find explicit key type spcifying.

The **xkb\_types** type files can contain records:

*   [Virtual modifiers declaration.](https://web.archive.org/web/20190724070654/http://pascal.tsu.ru/en/xkb/gram-types.html#vmodDec)
*   [Key type description.](https://web.archive.org/web/20190724070654/http://pascal.tsu.ru/en/xkb/gram-types.html#type)

### Virtual modifiers declaration.

Such record simply itemises virtual modifiers names that cam be met in followed key type descriptions.

I should remind that there are eight "traditional" modifiers (**Shift, Lock, Control, Mod1-Mod5**) named in XKB as **real** modifiers. And additionaly XKB can have up to 16 own modifiers named as **virtual** modifiers. Usualy their names are **NumLock, ScrollLock, Alt, AltGr**, etc.  
Modifiers are bound to keys in **xkb\_symbols** type files.

Any key type description can use both real and virtual modifiers. Since real modifiers always has standard names it is not necessary to declare these names any where but virtual modifier name can be any so it can be declared before using in key type descriptions.

Virtual modifiers declaration looks simple:

'virtual\_modifiers' modifiers\_list  ';'  

where **modifiers\_list** - is simple sequence of modifiers names divided by comma. For example line

virtual\_modifiers NumLock, Alt;  

means that besides real modifiers also virtual modifiers **NumLock** and **Alt** can be used in key type descriptions.

### Key type description

This records looks like:

'type' TypeName '{' Instructions '};'  

**Type name** is any STRING type constant (or string of symbols in double quotas). This name is used in **xkb\_symbols** files for key type specifying.

And **Instructions** are some records that looks like value to variable assignment. Each single instruction must be termonated by semicolon.

Instruction inside key type description can be:

*   [modifiers = ...;](https://web.archive.org/web/20190724070654/http://pascal.tsu.ru/en/xkb/gram-types.html#modifiers)
*   [map\[...\] = ...;](https://web.archive.org/web/20190724070654/http://pascal.tsu.ru/en/xkb/gram-types.html#map)
*   [level\_name\[...\] = ...;](https://web.archive.org/web/20190724070654/http://pascal.tsu.ru/en/xkb/gram-types.html#level_name)
*   [preserve\[...\] = ...;](https://web.archive.org/web/20190724070654/http://pascal.tsu.ru/en/xkb/gram-types.html#preserve)

#### modifiers

This instruction simply itemise real and virtual modifiers that are used for level computation in this concrete type. If there are more that one modifier they are concatenated by plus sign.  
For example:

modifiers = NumLock;  

or

modifiers = Shift+Lock;  

#### map\[...\]

Namely this instruction describes what level value match to each modifier or their combination. So inside squere brackets modifier or combination is specified and at right side of assignment corresponded level value is placed. For level value one can use "level names" (**Level1, Level2**, etc.) or simply numeric value. (The xkbcomp program undestand level names from **Level1** to **Level8** only. So if you need level value more than eight you need to specify it as number.)  
Also as modifier name the special word "None" can be used. It means that this instruction defines what level value match to state where all modifiers are inactive.  
For example:

map\[None\] = Level1;  

means that if none of modifiers are set the Level1 value must be chosen.

map\[Shift\] = Level2;  

means that if **Shift** is set (and nothing else) the Level2 value must be chosen..

map\[Control+Alt\] = Level3;  

means that if both **Control** and **Alt** modifiers are active the Level3 value must be chosen.

Note that in the last example it can be that each of **Control** and **Alt** modifiers separately doesn't match to any level value but only pressed together can change level. In such case instructions with **map\[Control\]** and **map\[Alt\]** will be absent.  
But **map\[None\]** usualy presents in each key type description.

#### level\_name\[...\]

This instruction assigns any symbolic name to each level described in this key type. So inside squere brackets level value (**Level1, Level2**, etc.) must be specified and at right side any symbols string (in double quotas) must be placed.  
For eaxmple,

level\_name\[Level1\] = "Base";  level\_name\[Level2\] = "Shifted";  

(**levelname** word can be used instead of **level\_name**).

I should mention that for XKB work these names (and so these instructions) doesn't make sense. They can be used by application that shows keyboard state. But on the other hand X-server "don't like" incomplete description and outputs error messages if level names are absent in type description.

#### preserve\[...\]

This instruction needs additional explanation.  
Remind that X-server sends to application some message about key press or release event. This message contain keycode and "state" that is set of modidifiers.

Then this message must be converted to symbols by appropriate Xlib subroutines using keycode and modifiers set.

In Xlib there are some subroutines that process this message step by step. Each subroutine performing own step can use only part of modifiers. To avoid any "side effects" each step subroutine cleans modifiers that it has used from modifiers set.

But in the same time in some cases such behavior is undesirable and one of modifiers must be considered by more than one subroutines.

Namely for such cases instruction **preserve** can be used. There "preserve" means "preserve modifier in state".

In this instruction in squere brackets modifier (or their combination) must be specified and it must be the same as in one of **map\[...\]** isnructions. In right part one has to specify modifier (or combination) that has to be preserverd.

Note that combination in brackets must be exactly the same as in one of **map\[...\]** isnructions.  
The point is that **preserve\[...\]** instruction isn't independent one. In XKB internal data it is continuation of corresponded **map\[...\]** instruction.  
But in right part there can be only part of modifiers (or only one modifier). It means that this level will be chosen when all needed modifiers are active but only modifier specified in right part has to be preserved.

Also note that in right side as modifier name the "None" word can be used. It means that none of modifiers has to be preserved. But since it is deafault behavior (don't save any modifiers) such instructions doesn't make sense and can be ommited.

### Predefined types.

The XKB module already has for key types defined as "default types":

*   **"ONE\_LEVEL"** - for keys that has only one symbol indpendently on any modifiers state (**Enter, Escape, Space**, etc.)
*   **"TWO\_LEVEL"** - for keys with two levels (but non-alphabetical), the second level can be chosen by **Shift** modifier but this type keys doesn't depends on **Lock** modifier state. They are keys like 1/!, 2/@, 3/#, etc.
*   **"ALPHABETIC"** - for alphabetical keys. They has two levels (small and capital letters) but in difference from **"TWO\_LEVEL"** keys these keys depends on **Shift** state and on **Lock** state too.
*   **"KEYPAD"** - **keypad** keys. Thses keys has two levels too. But they depends on **NumLock** and **Shift** modifiers state.

Note that the number of cells in symbols table in key description (in **xkb\_symbols** file) has to be the same as number of levels in key type description for this key.

Therefore althogh you can redefine any of "predefined" types (changing modifiers or laevel names in description) but it's dangerous to change number of values in these types. If you need more levels for some keys you can invent new type for them.

Examples of key type description you can find in files from **{XKBROOT}/types/** directory.

And one example of new type invention and usage you can see in section [Examples:New type for the Enter key."](https://web.archive.org/web/20190724070654/http://pascal.tsu.ru/en/xkb/example1.html).The xkb\_compat type files.
---------------------------

This file contents describes modifier keys behavior. Or in the other words how keyboard state changes when you press such keys.

I should remind that the XKB module has internal tables named **Xkb Compability Map**. This data consists of two parts:

*   table of **interpretation**;
*   four single variables that defines **real** modifiers that will indicate current group number for 'old' application (that doesn't know about "current group" field in key event).

An application can request X-server to change symbol to keycode binding. If the symbol is ordinar "printable" symbol there is no problem. But if it is "control" symbol that imply change of modifier, group number or XKB internal state the XKB module has to bind an "action" to corresponded place in keycode bound table. But "old standard" request has no information about "action" so XKB has to decide what action must be bound using own data.  
And the **Xkb Compability Map** is used for this problem solution.

The xkb\_compat type files can contain records:

*   [Virtual modifier declarstion.](https://web.archive.org/web/20190723235757/http://pascal.tsu.ru/en/xkb/gram-compat.html#vmodDec)
*   [Interpretation desctription.](https://web.archive.org/web/20190723235757/http://pascal.tsu.ru/en/xkb/gram-compat.html#interpret)
*   [Group number to modifier mapping.](https://web.archive.org/web/20190723235757/http://pascal.tsu.ru/en/xkb/gram-compat.html#group)
*   [Indicator behavior description.](https://web.archive.org/web/20190723235757/http://pascal.tsu.ru/en/xkb/gram-compat.html#indicator)
*   [Defaults declaration.](https://web.archive.org/web/20190723235757/http://pascal.tsu.ru/en/xkb/gram-compat.html#defaults)

### Virtual modifier declaration.

As in **xkb\_types** type files a virtual modifiers that can be used in followed inctructions must be declared here. A real modifiers that can be used doesn't need to be declared becouse they have standard names. But the virtual modifiers can have any names therefore parser program need to know these names before all other instruction will be parsed.

Virtual modifier declaration looks like:

'virtual\_modifiers' modifiers list ';'

For example:

virtual\_modifiers NumLock, AltGr ;

### Interpretation description.

Each **interpretation** defines relation between some control **symbol** code and an **action** that the XKB has to perform at key pressing.

Internal structure that describes interpretation consists of fields

*   symbol code
*   key **action**
*   real modifiers set
*   modifiers "match condition"
*   **autorepeat** and **lock** flags
*   virtual modifier for key

Of course, not all fields need to be filled.

The main fields are "symbol code" that defines symbol to which action has to be bound and "action" field that describes this action itself.

Also interpretation can contain filled "real modifiers" and "match condition" fields.

What these two fields are used for?  
Remind that to each **keycode** a real modifier can be bound. Searching appropriate place for **action** bunding the XKB can use not only control symbol code but these real modifiers placement too.

If these two fields isn't specified the XKB places **action** to the same key (to the same cell) where control symbol will be placed to.

But if these fields aren't empty the XKB before **action** placing compares modifier bound to **keycode** with "real modifiers set" specified in **interpretation**. The "match condition" defines how modifiers has to be compared (details see below).  
Only if compare result is successful the **action** will be bound to keycode.

By the way, if these two fields are specified the **interpretation** can have not "symbol code". It means that the XKB can find place for **action** using compare result only. For example, **interpretation** can mean - "place the **action** to keycode that has **Lock** modifier bound independently on what symbol is bound to that keycode".

So.. The "real modifiers" field is one or more modifiers.  
And "match condition" is one of conditions:

*   **AnyOfOrNone** - actually means that the real modifiers field doesn't make sense; this condition means that the keycode can have any of modifiers specified in the **interpretation** or none of them so it always is true.
*   **NoneOf** - keycode must have no one of specified modifiers.
*   **AnyOf** - keycode must have at least one of specified modifiers.
*   **AllOf** - keycode must have all specified modifiers.
*   **Exactly** - similar to previous one; keycode must have all specified modifiers but must have no one of other modifiers.

Also there is another one confition that can be used together with any of above conditions:

*   **LevelOneOnly** - this condition is true if symbol has to be placed in first level of first group of keycode symbols table. Usualy this condition is used if **interpretation** has to change keycode flags or virtual modifiers.

Of course, by default the "real modifiers" field is empty and "match condition" is **AnyOfOrNone**.

The fields "flags" and "virtual modifier" also can be moved into keycode description. Since such fields are common for whole keycode description (not for particular symbol cell) the **interpretation** that binds these fields to keycode usualy contain **LevelOneOnly** condition.

Flags will be added to "key behavior" and "virtual modifier" will be placed to "firtual modifiers" field of keycode description (each keycode has these fields).

By default "virtual modifier" field is empty and "flags" field contains "autorepeat" flag. Thus, the **interpretation** whole description looks like:

'interpret' symbol '{' description '};'

or

'interpret' symbol '+' modifier '{' description '};'

or

'interpret' symbol '+' condition '(' modifiers ') {' description '};'

For example:

interpret Num\_Lock {...}; interpret ISO\_Level2 + Shift {...}; interpret ISO\_Lock + AnyOf(Lock+shift) {...};

*   If in heading only symbol code is specified it means that the match condition is **AnyOfOrNone** and real modifier field is empty.
*   If one has specified symbol code and modifier name (but no conditions) it means that condition is **Exactly**.
*   If condition is specified the string inside parenthesis is list of modifiers or special word **all**. You guess that the last one means "all modifiers".
*   Also instead of condition and modifiers list you can use word **Any**. It means the same as **AnyOf(all)**.
*   And as I already said, if interpretation has modifiers list and condition the symbol code can be absent. In this case the symbol name in heading must be replaced with word **Any**.  
    For example:
    
    interpret Any + Any {...};
    
    means that this **interpretation** has to be applied to each keycode that have any real modifier.

Instructions inside interpretation description looks like assignment instruction:

*   [useModMapMods = ...; or useModMap = ...;](https://web.archive.org/web/20190723235757/http://pascal.tsu.ru/en/xkb/gram-compat.html#usemodmap)
*   [repeat = ...;](https://web.archive.org/web/20190723235757/http://pascal.tsu.ru/en/xkb/gram-compat.html#repeat)
*   [locking = ...;](https://web.archive.org/web/20190723235757/http://pascal.tsu.ru/en/xkb/gram-compat.html#repeat)
*   [virtualModifier = ...; or virtualMod = ...;](https://web.archive.org/web/20190723235757/http://pascal.tsu.ru/en/xkb/gram-compat.html#vmod)
*   [action = ...;](https://web.archive.org/web/20190723235757/http://pascal.tsu.ru/en/xkb/gram-compat.html#action)

#### useModMapMods

Is used for specifying **LevelOneOnly** condition. If a word in right side is "**level1**" or "**levelone**" the condition has to be checked. But words "**anylevel**" or "**any**" means that the condition has to be ignored. By the way, by default this condition has to be ignored, so lines like

useModMapMods = anylevel;

doesn't make sense.

#### repeat and locking

These instruction are used for specifying "autorepeat" and "locking" flags. The word in right side must be name of logical value - **True** or **False**.  
For example:

repeat = True; locking = False;

#### virtualModifier

This instruction defines a virtual modifier for keycode. Since such modifier is attribute of keycode (not of particular symbol), the interpretation with **virtualModifier** usualy uses **LevelOneOnly** condition.

A word in right side is name of any virtual modifier.  
For example:

virtualModifier = AltGr;

#### action

This instruction describes an **action**. More details about format of action description you can read in [Actions description](https://web.archive.org/web/20190723235757/http://pascal.tsu.ru/en/xkb/gram-action.html).  
Here I only note that the **action** field can be empty. If **interpretation** is needed for binding flags or virtual modifiers only its description can looks like:

interpret ... { repeat = False; locking = True; action = NoAction(); };

### Group number to modifier mapping.

I should remind that group number occupates two bit field in XKB internal state and in key event meassage. But old application know nothing about XKB groups and this two bit field in event. Such application decides that group (remind that old keyboard module has two "group" too) is changed using one of modifier.

Therefore for such application the XKB needs to map group number value to some modifier state.

For each value (from one to four) separate mpodifier can be used. (But usualy for all groups except first one modifier is used.)

This declaration looks simply:

'group' group number '=' modifier ';'

For example:

group 2 = AltGr;

### Indicator behavior description.

Although indicators behavior has no relation to **compability map**, they also are described in **xkb\_compat** type files.

I should remind that the XKB can manage up to 32 indicators. The first 3-4 ones (in dependence on hardware type) match to real LEDs on keyboard. All other indicators are "virtual" and can be showed by spaecial programs.

In **xkb\_keycodes** type file the a symbolic names are assigned to each used indicator (specified by number).

And **xkb\_compat** type file describes how these indicators behave in dependence on keyboard state. Remind that ...  
First of all, indicators can reflect state of

*   modifiers,
*   group number,
*   XKB control flags.

And since first two "state components" are distributed to three variables (**base, locked, latched**) particular indicator can be bound to any of these variable or to their "effective" (summary) value.

I should note that one modifier can reflect simultaneously changes of some modifier and a group number and a control flag. (Don't ask me what it can be needed for :-).

And the second point is that the indicator also can be switched by application. Thus describing indicator we can allow/deny such "external" switching and describe "feedback" (it means that when program changes indicator state the reflected "state components" also has to be changed).

The indicator behavior whole description looks like:

'indicator' inducator\_name '{' description '};'

Here **indicator\_name** is symbolic name (in double quotas) assigned to the indicator in **xkb\_keycodes** type file.

And **description** consists of instructions that looks like assignment instruction.

They can be one of:

*   [modifiers = ...; or mods = ...;](https://web.archive.org/web/20190723235757/http://pascal.tsu.ru/en/xkb/gram-compat.html#mods-group-ctrl)
*   [groups = ...;](https://web.archive.org/web/20190723235757/http://pascal.tsu.ru/en/xkb/gram-compat.html#mods-group-ctrl)
*   [controls = ...; or ctrls = ...;](https://web.archive.org/web/20190723235757/http://pascal.tsu.ru/en/xkb/gram-compat.html#mods-group-ctrl)
*   [whichModState = ...; or whichModifierState = ...;](https://web.archive.org/web/20190723235757/http://pascal.tsu.ru/en/xkb/gram-compat.html#which)
*   [whichGroupState = ...;](https://web.archive.org/web/20190723235757/http://pascal.tsu.ru/en/xkb/gram-compat.html#which)
*   [allowExplicit = ...;](https://web.archive.org/web/20190723235757/http://pascal.tsu.ru/en/xkb/gram-compat.html#explicit)
*   [drivesKeyboard = ...;](https://web.archive.org/web/20190723235757/http://pascal.tsu.ru/en/xkb/gram-compat.html#driveskbd) (has lot of synonyms, see below)
*   [index = ...;](https://web.archive.org/web/20190723235757/http://pascal.tsu.ru/en/xkb/gram-compat.html#index)

#### modifiers, groups � controls

These ones define what "state components" the indicator has to reflect.  
Thus, value in right side must be

*   for **modifiers** - one modifier name or some modifiers names concatenated by plus sign "+";
*   for **groups** - group number;
*   for **controls** - control flag(s) name.

Note that the group number can be specified ...

*   as simple numeric value;
*   as names - **group1, group2**, etc.;
*   as special word **none** (0) and **all** (0xFF);
*   and finally, as simple math expression, for example **All-1** ("all except the first one").

#### whichModState and whichGroupState

Since modifiers set and group number are distributed to three separate variable (**base, locked, latched**) these instructions are needed to specify which variable state must be reflected by indicator.

The word in the left part can be

*   **base** - reflect change of needed modifiers or group number in **base** variable (**base Group** or **base Modifiers** respectively);
*   **locked** - the same for **locked** variables;
*   **latched** - the same for **latched** variables;
*   **effective** - reflect changes of 'effective' values (that means sum of all three variables);
*   **any** - reflect changes in any of all three variables; Note that for modifiers set (**whichModState**) this condition is equal to **effective** becouse setting of some modifier in any of three variable will cause its setting in 'effective' set.
*   **none** - "nowhere". Such instruction can make sense if you need to cancel indicator binding to modifier or group made in some another file.

By default (if **which...State** isn't specified) **effective** value implied.

#### allowExplicit

It is logical flag that allow/disallow applications switch on/off indicator. The point is that any application (for example, **xset** with **led** option) can send request to change state of indicator. And this flag is used for set/unset the indicator protection against such changes.

Note that even if allowed such request changes indicator state only but XKB state (group, modifier, control flag reflected by this indicator) will stay unchanged.

Since this **allowExplicit** is boolean flag it can be specified in form

allowExplicit = True; or allowExplicit = False;

or in short form

allowExplicit; (is equivalent to 'allowExplicit = True;' )

or

!allowExplicit; (is equivalent to 'allowExplicit = False;')

By default its value is **True**. It means that all application is allowed to change indicators.

#### drivesKeyboard

It has many synonyms - **drivesKbd, ledDrivesKbd, ledDrivesKkeyboard, indicatorDrivesKbd, indicatorDrivesKeyboard**.

It is also boolean flag that force the XKB to make 'feedback' between indicator and keyboard state. It means that if this flag is set (and **allowExplicit** too) and an application changes indicator state the XKB has to change own state components related to this indicator.

Note that

*   it will change components specified by **modifiers**, **group** or **controls** instruction (usualy only one of such components is bound to indicator);
*   instructions **whichModState** or **whichGroupState** points - in which of variables (**base, locked, latched**) the modifier or group number must be changed.

Herewith if "**which...state**" is **none**, **base** or **any** it will not have any effect. And **effective** in this case is equivalent to **locked**. Remind that by default "**which...state**" value is **effective** so if "**which...state**" isn't specified for the indicator all changes will be made in **locked Group** or **locked Modifiers** variable respectively.

As for **allowExplicit** flag the **drivesKeyboard** declaration looks like

drivesKeyboard = True; (or simply - drivesKeyboard;)

or

drivesKeyboard = False; (or simply - !drivesKeyboard;)

#### index

This instruction allow to specify number of indicator (physical or virtual one). Normally a relation between indicator name and its number is set up in the **xkb\_keycodes** type file. But you can specify it here.

### Defaults declaration.

This declaration is optional and allow specify some field (instruction) for all next record such as **interpret** or **indicator**. Usualy such declaration are placed at the begin of file or begin of separate section.

The looks like assignment where left side looks like 'field of structure' in C language.  
For example,

indicator.allowExplicit = False;

means that in all next **indicator** descriptions the **allowExplicit** flag imply **False** value (of course, if such instruction isn't specified explicitly in the description).

The first word in left side (before period sign) must be

*   **interpret** - if it is defaults for **interpret** description;
*   **indicator** - if it is defaults for **indicator** description;
*   or name of **action** that can occur in some of **interpret** description. In this case the instruction declare default values for particular field in the **action** description.  
    For example,
    
    SetMod.clearLock = True;
    
    (more details about action description and posible fields see in [Actions description.](https://web.archive.org/web/20190723235757/http://pascal.tsu.ru/en/xkb/gram-action.html))Actions description.
--------------------

*   [Actions description in common.](https://web.archive.org/web/20190728062500/http://pascal.tsu.ru/en/xkb/gram-action.html#actions)
*   [Actions for the XKB state change.](https://web.archive.org/web/20190728062500/http://pascal.tsu.ru/en/xkb/gram-action.html#state)
    *   [Modifiers change.](https://web.archive.org/web/20190728062500/http://pascal.tsu.ru/en/xkb/gram-action.html#mods)
    *   [Group number change.](https://web.archive.org/web/20190728062500/http://pascal.tsu.ru/en/xkb/gram-action.html#group)
    *   [Control flags (XKB Controls) change.](https://web.archive.org/web/20190728062500/http://pascal.tsu.ru/en/xkb/gram-action.html#controls)
    *   [The ISO\_Lock action.](https://web.archive.org/web/20190728062500/http://pascal.tsu.ru/en/xkb/gram-action.html#iso-lock)
*   [Actions for mouse events emulation.](https://web.archive.org/web/20190728062500/http://pascal.tsu.ru/en/xkb/gram-action.html#mouse)
    *   [Cursor movement.](https://web.archive.org/web/20190728062500/http://pascal.tsu.ru/en/xkb/gram-action.html#mouse-move)
    *   [Mouse buttons press.](https://web.archive.org/web/20190728062500/http://pascal.tsu.ru/en/xkb/gram-action.html#mouse-but)
    *   [Mouse buttons press with locking.](https://web.archive.org/web/20190728062500/http://pascal.tsu.ru/en/xkb/gram-action.html#mouse-but-lock)
    *   [A "defaul button" choice.](https://web.archive.org/web/20190728062500/http://pascal.tsu.ru/en/xkb/gram-action.html#mouse-but-default)
*   [Other action.](https://web.archive.org/web/20190728062500/http://pascal.tsu.ru/en/xkb/gram-action.html#misc)
    *   [Message sending.](https://web.archive.org/web/20190728062500/http://pascal.tsu.ru/en/xkb/gram-action.html#message)
    *   [Another key press emulation.](https://web.archive.org/web/20190728062500/http://pascal.tsu.ru/en/xkb/gram-action.html#key)
    *   [X-server termination.](https://web.archive.org/web/20190728062500/http://pascal.tsu.ru/en/xkb/gram-action.html#terminate)
    *   [Screens switching.](https://web.archive.org/web/20190728062500/http://pascal.tsu.ru/en/xkb/gram-action.html#screen)
    *   [Pressing buttons of another device served by XKB.](https://web.archive.org/web/20190728062500/http://pascal.tsu.ru/en/xkb/gram-action.html#device)
*   ["Special" actions.](https://web.archive.org/web/20190728062500/http://pascal.tsu.ru/en/xkb/gram-action.html#spec)
    *   ["Empty action".](https://web.archive.org/web/20190728062500/http://pascal.tsu.ru/en/xkb/gram-action.html#noaction)
    *   ["Raw" action.](https://web.archive.org/web/20190728062500/http://pascal.tsu.ru/en/xkb/gram-action.html#raw)
*   [Defaults declaration.](https://web.archive.org/web/20190728062500/http://pascal.tsu.ru/en/xkb/gram-action.html#defaults)

Actions decsriptions are used in the **xkb\_symbols** type file where an **action** can be bound to scan-code and in the **xkb\_compat** type file where the **action** can be bound to control symbols. (Remind that the **xkb\_compat** file contains "interpretations" that are special tables which helps to change actions-to-keycode binding when control symbols-to-keycode binding has been changed).

In common the action description looks like the function declaration in C language:

action\_name **'('** arguments\_list **');'**

But a difference is that arguments are not values only but name-value pairs:

argument\_name **'='** argument\_value

For example:

MovePointer(x=10, y=10, repeat=False);

By the way, the **xkbcomp** program which compiles XKB configuration files in many cases understand different names for the same action and different names for the same argument.

Inside the XKB the action is some structure which contains:

*   an action code (or number);
*   field of flags that modifies in some way the action;
*   fields that contain action arguments (it can be some of them or even none)

Of course, the number of arguments and their meanings depends on the action meaning. But flags in many actions have the same names and mean the same. And note that not all flags can be specified in the configuration file explicitly.

For example, some actions have arguments that can be either absolute values or some addition to current value. It can be cursor coordinates, symbols group number, etc. Internaly for distinguish these two types of arguments an **Absolute** flag is used. But this flag can't be specified explicitly. The XKB (xkbcomp) guess about argument type looking at presence of '+' or '-' signs before the argument value.  
It means that a

SomeAction(x=10, y=10)

declaration means absolute values for **x** and **y** but a

SomeAction(x=+10, y=+10)

declaration mena positive additions for the same variables.

Another example of such flags are flags that defines when action must be performed - at the key press or release. Almost every action has such flags although in some cases it makes no sense (for example, would you feel any difference if the **CapsLock** modifier will be set at the corresponded key press or at its release?).

These flags can't be specified in the action description or their specification are made with some 'pseudo-argument' ('pseudo' means that this argument doesn't have any corresponded field or flag in the internal structure described the action).  
(You can ask - "if such flags can't be specified why them had been designed"? The thing is that the XKB protocol has special requests to X server that allows to load or change any action from application. This requests have none limits and allows to set any flags available for the action.)

And some other word about flags specification inside action description. Although they are separate bits of one feld inside internal structure (which describes the action) but in the description they are specified as separate variables of boolean type. Since they are boolean variables their values can be 'true' or 'false' but the xkbcomp also understands another words as boolean values. The 'true' value can be written as **yes, on** or **true** and for the 'false' you can use words **no, off, false**.

But it is not all. Specially for boolean variables there is short record. You can write simply variable name (without value) and it will mean the variable have value 'true'. But if you put a '!' or '~' sign before the name it means that the variable have value 'false'.

For example, all next lines are completely equivalent:

SomeAction(..., SomeFlag=yes, ...); SomeAction(..., SomeFlag=on, ...); SomeAction(..., SomeFlag=true, ...); SomeAction(..., SomeFlag, ...);

and all next lines are equvivalent too:

SomeAction(..., SomeFlag=no, ...); SomeAction(..., SomeFlag=off, ...); SomeAction(..., SomeFlag=false, ...); SomeAction(..., !SomeFlag, ...); SomeAction(..., ~SomeFlag, ...);

But note that every flag has some default value so in mant cases it is not needed to specify these flags explicitly.

Actions for the XKB state change.
---------------------------------

I should remind that the XKB state includes [current modifiers set](https://web.archive.org/web/20190728062500/http://pascal.tsu.ru/en/xkb/internals.html#state-mods), [current group number](https://web.archive.org/web/20190728062500/http://pascal.tsu.ru/en/xkb/internals.html#state-group) and ["set of control flags"](https://web.archive.org/web/20190728062500/http://pascal.tsu.ru/en/xkb/internals.html#controls) (XKB Controls).  
And it being known that the modifiers set and the group number are distributed into three variables which value can be changed independly. Threrfore there are three action for modifiers change (each action changes own variable) and three actions for the group number change.

### Modifiers change.

As I have said above there are three variables for modifiers - **base modifiers, latched modifiers** and **locked modifiers**.  
Corresponded actions for their change are:

*   **SetMods** - changes the **base modifiers** variable,
*   **LatchMods** - changes the **latched modifiers** variable,
*   **LockMods** - changes the **locked modifiers** variable.

The main argument for all three actions is - **modifiers** (or shortly - **mods**). And its value must be name of virtual or real modifier. (Strictly speaking all modifiers here are virtual ones but all real modifiers have virtual 'relatives' with the same names and there are some other virtual modifiers with another names.) If one action has to change some modifiers all their names can be specified in one argument through plus sign. For example:

SetMods(mods=Shift+Control);

Instead of modifier names a special word **UseModMapMods** (or **ModMapMods**) can be used here. It means that modifiers itself must be taken from the 'virtual modifiers' field which is part of the key description (see [Internals: modmap and vmodmap](https://web.archive.org/web/20190728062500/http://pascal.tsu.ru/en/xkb/internals.html#key-mods)).

Also it must be mentioned that these three action have some other differences besides different variables them change. They perform different tasks at keypress and key release time. Lets remember what is different in **Shift** and **CapsLock** keys action. The first one has to affect other keys while it stais pressed only. It means at moment when it is pressed the **Shift** modifier must appear ant this modifier must disappear automatically when the key will be released.  
But the **CapsLock** must affect long time, at the first press of the key its modifier must become active and stais in such state even after you release the key. But after the second press/release the modifier must become unactive.

Thus first two actions are designed for modifiers like **Shift**. It means when key with such action is pressed the modifier specified in argument will been added to corresponded variable (**base** or **latched**) but at the key release the same action preforms inverse operation - removes the modifier.

But the **LockMods** action at the first call adds only modifier and do nothing at the key release. But it the modifier is already set (it means that it is secondary press of the same key) the actions removes the modifier from the **locked modifiers** variable.

Note that it is not necessary to use **SetMods** action for the **Shift** modifier or use **LockMods** action for the **Lock** modifier. You can 'to lock' the **Shift** or contrary - make the **Lock** active while the key stay pressed. But it depends on what you really what to get. :-)

Also the behavoir of two first actions can be slightly changed by two flags that are **clearLocks** and **latchToLock**.

Therefore the complete description of all details looks like

Action

At press

At release

**SetMods**

Adds modifiers to **base modifiers**

*   Removes modifiers from **base modifiers**
*   if **clearLocks=yes** and between press and release of this key no one other key has been pressed the same modifiers will be removed from **locked modifiers** too.

**LatchMods**

Adds modifiers to **latched modifiers**

*   Removes modifiers from **latched modifiers**
*   if **clearLocks=yes** and between press and release of this key no one other key has been pressed the same modifiers will be removed from **locked modifiers** too.
*   if **latchToLock=yes** the same modifiers will be stored in **locked modifiers**

**LockMods**

*   Adds modifiers to **base modifiers**,
*   if these modifiers are absent in **locked modifiers** adds them there and removes them from **locked modifiers** otherwise.

*   Removes modifiers from **base modifiers**,
*   **locked modifiers** stay unchanged.

### Group number change.

Like the modifiers set the group number is distributed to three variables - a **base group**, a **latched group** and a **locked group**. The real or effective group number is sum of these three varibales. If the sum result (it can be negative too) is out of bounds (less than first group or more than number of groups really used in keyboard map ) it will be adjusted using one of three [adjusting methods](https://web.archive.org/web/20190728062500/http://pascal.tsu.ru/en/xkb/internals.html#wrap). By the way, the value of each variable also must be adjusted with the same method at every time the value is changed.

Actions for group number change are similar to actions for modifier set change:

*   **SetGroup** - changes the **base group**
*   **LatchGroup** - changes the **latched group**
*   **LockGroup** - changes the **locked group**

Of course, the argument of such actions is not the modifiers set but group number (or simply **group**). But the main difference from 'modifiers actions' is that group number can be either absolute value or increment to current value of corresponded variable (increment can be negative).

As I told abowe, to make xkbcomp understand that you mean the increment but not the absolute value the argument must be specified with '+' or '-' sign. For example:

*   **LockGroup(group=1)** means - write to the **locked group** one;
*   **LockGroup(group=+1)** means - increase the **locked group** value by one;
*   **LockGroup(group=-1)** means - decrease the **locked group** value by one.

And like 'modifiers actions' these actions have difference in acts they perform at key press and release. The **SetGroup** action and the **LatchGroup** action at the press puts needed value into own variable but cleans the variable at the key release.

By the way, note that group number varies from 1 to 4 and never is zero. So everywhere I say the variable is 'cleaned' it means set the value 'first group'.

The **LockGroup** action behavior is slightly siffer from the **LockMods** behavior. It only puts (or increases) needed value to the **locked group** at the key press and never cleans this variable. Therefore if you need that sequental presses of keys with the **LockGroup** action switches all group, always use increments but not the absolute values  
I should remind that after increase or decrease of the **locked group** variable its value will be corrected to fit available values range. So if your keybord map consists of two groups and the current value of the **locked group** is 'group 2' after increasing by one this value become illegal (out of range) and the XKB will turn it back to the 'group 1' value. And if the current value is 'group 1' the addition of 1 will make the 'group 2' value without any additional tricks. Thus the action

LockGroup(group=+1);

will switch groups successfuly (the first to the second and vice versa) in any state.

First two actions can have **clearLocks** and **latchToLock** flags (like **{Set,Latch}Mods** have them).

The complete description of these actions:

Action

At press

At release

**SetGroup**

puts the argument value or adds the increment to the **base group** variable

*   substracts the increment or the absolute value from the **base group** variable
*   if **clearLocks=yes** and between press and release of this key no one other keys has been pressed the action cleans the **locked group** variable.

**LatchGroup**

puts the argument value or adds the increment to the**latched group** variable

*   substracts the increment or the absolute value from the **latched group** variable
*   if **clearLocks=yes** and between the press and release of this key no one other key has been pressed the action cleans the **locked group** variable.
*   if **latchToLock=yes** the action adds to the **locked group** the same value that is substracted from the **latched group** variable.

**LockGroup**

puts the argument value or adds the increment to the**locked group** variable

nothing changes

### Control flags (XKB Controls) change.

The control flags set in difference from the modifiers set or the group numer represented by one variable only.

Therefore for this set changes there are only two actions - **SetControls** and **LockControls**. Both these actions works with the same variable but (as you can guess looking at their names) the first action sets flags at the key press and removes the flags at the key release and the second one only sets flags at the first press of key and removes these flags at the second press of the same key.

The argument for both actions is named **controls** or **ctrls**.  
If you want to change more than one flag they can be concatenated by '+' sign.

These actions have not any flags.

'Control flags' that can be changed by these actions are:

*   **RepeatKeys**, or **Repeat**, or **AutoRepeat** - switch on/off autorepeat for all keys (it is switched on by default)
*   **AccessXKeys** - switch on/off a '[AccessX](https://web.archive.org/web/20190728062500/http://pascal.tsu.ru/en/xkb/internals.html#accessx) magic sequences' recognizing (key sequences that switches on/off other AccessX modes).
*   **SlowKeys** - switch on/off SlowKeys mode
*   **BounceKeys** - switch on/off BounceKeys mode
*   **StickyKeys** - switch on/off StickyKeys mode
*   **AccessXTimeout** - automatical deactivation of AccessX modes after timeout.
*   **AccessXFeedback** - 'additional sound indication' for AccessX modes.
*   **MouseKeys** - switch on/off [mouse events emulation](https://web.archive.org/web/20190728062500/http://pascal.tsu.ru/en/xkb/internals.html#mouse)
*   **MouseKeysAccel** - accelerated mouse cursor movement (makes sense when MouseKeys mode is active).
*   **Overlay1** - switch on/off the first [overlay group](https://web.archive.org/web/20190728062500/http://pascal.tsu.ru/en/xkb/internals.html#overlay)
*   **Overlay2** - switch on/off the second [overlay group](https://web.archive.org/web/20190728062500/http://pascal.tsu.ru/en/xkb/internals.html#overlay)
*   **AudibleBell** - switch on/off 'beeper' (is 'on' by default). Remind that the XKB can send special [sound events](https://web.archive.org/web/20190728062500/http://pascal.tsu.ru/en/xkb/internals.html#bell) instead of ordinary 'cheep'. If these events are used (it means that there is some application running which uses such events) it makes sense to switch off the 'cheeper'.
*   **IgnoreGroupLock** - partial control for 'state' field in key event message in the GrabKey mode. If this flag is set the **locked group** value will not be included to event message.
*   **all** - to set all flags
*   **none** - none of control flags

### ISO\_Lock action.

Its name is **ISOLock**.  
This action is additional one for described abowe actions. It changes behavior of other actions making them 'lockable'.

It means you can press **ISO\_Lock** and keeping it pressed press some of key with actions such as **SetMods, SetGroup, SetControls** or **PointerButton** (about this action see [below](https://web.archive.org/web/20190728062500/http://pascal.tsu.ru/en/xkb/gram-action.html#ptrbtn)) so their behavior becomes the same as **LockMods, LockGroup, LockControls** or **LockPointerButton** respectively.

The main argument is **affect**. It allows to filter actions must be changed. Possible values are:

*   **modifiers** or **mods** - change only **{Set,Latch}Mods** to **LockMods**.
*   **groups** or **group** - change only **{Set,Latch}Group** to **LockGroup**.
*   **controls** or **ctrls** - change only **SetControls** to **LockControls**.
*   **pointers** ��� **ptr** - change only **PointerButton** to **LockPointerButton**.
*   **all** - change all mentioned actions.
*   **none** - none.

Of course, you can specify as value any combination of these words (separated by '+' sign). By default **affect=all**.

Also this key (key with this action) can be used alone. In such usage it can change the group or modifers but in some unusual way. Its effect depends on does any other key have been pressed between its press and realise moments.

If it is used for group change ...

*   first of all it must have **group** argument
*   at the key press the action puts the argument value into **base group**
*   but at the key release the work it do can be different
    *   if after its press you have pressed some other keys (letters, for example) at the key release the group number will be simply removed from **base group**. Thus the group change will be the same as the **SetGroup** do.
    *   but if none other key you have pressed (only have pressed and released the **ISOLock** key) the argument value will be moved to the **locked group**. In this case the action works like the **LockGroup**.

Similar acts will be done when this key is used for any modifiers change:

*   the argument **modifiers** (or **mods**) must be specified;
*   at the key press these modifiers will be added to **base modifiers**;
*   at the key release ...
    *   if some other keys have been pressed these modifiers will be removed from **base modifiers** as at the **SetMods** action performing;
    *   if none other keys have been pressed the modifiers will be removed from **base modifiers** too but will be added to the **locked modifiers** as at the **LockMods** performing.

In summary: possible arguments are **affect, group, modifiers (mods)**.  
At that the **group** and **modifiers** agruments are alternative. Without any arguments this action is the same as

ISOLock(modifiers=Lock, affect=all);

There are not any additional flags (strictly speaking there are flags but their valies is implicitly defined by mentioned above arguments).

Actions for mouse events emulation.
-----------------------------------

### Cursor movement.

The action name is **MovePtr** or **MovePointer**.  
Arguments are: **x** and **y** coordinates.  
It is one of actions where arguments can mean absolute values or increments to current value. I should remind that for relative values you should specify '+' or '-' sign before the argument value. Note that

MovePtr(x=+10, y=0);

means - increase the **x** coordinate by 10 points but the **y** set to zero exactly (i.e. move cursor to the upper row of pixels).  
But to specify you want to move pointer 10 points right but don't change the y coordinate you need to write

MovePtr(x=+10, y=+0);

(in reality you can omit argument if you don't want action to change it).

This action has only one flag - **accel** (other names are **accelerate** or **repeat**). To understand what it means we need to remember that there are two modes of the cursor movement - ordinary and accelerated ones.

This flag allows to switch off the acceleration at this action performing but not vice versa. It means that at the current time the movement mode is not acclerated one this flag value changes nothing. But only when accelerated mode is switched on this flag allows to perform movement without acceleration.

Since the name of argument means 'allow acceleration' its value by default is **yes**. And you need to specify it explicily only when you want a **no** value.

### Mouse buttons press.

this action has name **PtrBtn** or **PointerButton**.  
Arguments are: the button number - **button** and the repeat counter - **count**.  
The button number can be specified as an integer number (1-5) or as a 'button name' - **button1, button2 ... button5**.

The repeat counter is optional and is needed if you want to make 'double click' (or triple, quadruple, etc.) by one key press. The **count** value must be positive integer.

Also instead of button number you can specify a **default** word.  
Remind that in the XKB there is term such as 'default button' which values can be changed by another action. But here (in this action arguments) it can be specified that the button must be pressed is one which number is saved as 'default button'.

There are not flags for this action.

### Mouse buttons press with locking.

The name is: **LockPtrBtn**, or **LockPointerButton**, or **LockPtrButton**, or **LockPointerBtn**.

This action is some different from previous one.  
Of course you know, for some operation with the mouse (for example, the text selection) you need to press the mouse button and keeping it pressed move the mouse to another position. At the mouse emualtion by keyboard it means you need to press a key (or even keys combination) that emulates the mouse button and keeping it (or them) pressed manipulate with some other keys that emulate the mouse movement. It can be very unhandly especialy whan for emulation not single keys but keys combinations are used (for example, Shift+'arrow').

Therefore in the XKB some actions are designed which allow to press buttons 'with locking'. It means that unlike previous action which at the key press emulates the bitton press but at the key release emulates the button release, this action works like **CapsLock** or **NumLock** keys.  
I.e. the first press of key emulates only press of button and leave it pressed and the second press of key generates the 'mouse button is released' event.

(Actualy inside the XKB this action and previous one have the same 'action code' and their different behavior is controled by one of flags).

Arguments in general are the same as for previous action - **button** and **count**. (Althogh I can't imagine what the **count** can mean here). And like in previous case the **button** can refer to the **default button**.

But this action has one additional argument (optional) - **affect**. Using it you can specify that the action will only press the button or contrary only release it. It means you can place bind the press and release of button to different keys (of course actions on the keys must have different **affect** value).

The value of the **affect** argument can be one of:

*   **lock** - only to press and lock the key (all next press will not release the button);
*   **unlock** - only to release the button (if it is not pressed the action can't press it);
*   **both** - the first press of key presses and locks the button and the second press of the same key releases the button. It is a default mode.
*   **neither** - don't press and don't release the button. (Funny. Of course the action with such **affect** doesn't make sense.)

### A "defaul button" choice.

The action name is: **SetPtrDflt** or **SetPointerDefault**.  
The main argument is: the button number - **button**.  
This action remembers what button in the current time is the 'default button' (remind that actions for pressing the button can refer to this button).

Note that this action allow specify either absolute button number or relative change of button number. In the last case the button number must be some integer value with '+' or '-' sign.

It is clear that if the button number after increasing on decreasing come out of available values the XKB will return it to available range. Thus you can using one key to choose the button in cycle making each one the **default button** by turns.

The action can have the additional argument - **affect**.  
But for it only one value available (but this value has many names - **Button**, **DefaultButton**, **DfltBtn**) and namely this value is the default one. Therefore you never need to specify it although you can meet it in some existent files.

Other actions.
--------------

### Message sending.

The XKB allow to generate own special events instead of (or together with) usual key press/release event.  
A program that want to receive such events has to request them from the server by special request sending. Note that usual key events are delivered to 'focused windows' (to applications that have requested key events for this window) but the special XKB events will be delivered to any application which have requested them regardless of what window is currently focused.  
Such event message besides usual event attributes (such as the event type, Display, time, etc.) includes 6 bytes of arbitrary data which are specified in the action description and can be interpreted by the application that has received the event.

The action itself has name: **ActionMessage**, or **MessageAction**, or simply **Message**.

The main argument is: arbitrary data for the meassage - **data**.  
You can specify it in two ways. If these six (or less) bytes can be represented as string of printable symbols they can be specified in string form. For example:

Message(data="Hello!");

But if it is some binary data you can specify the value of each element of the **data** array separately as numeric value. For example:

Message(data\[0\]=123, data\[0\]=0, data\[0\]=200, data\[0\]=255, ...);

Two additional arguments are **report** and a logical flag **genkeyevent** (its another name is **generatekeyevent**).

The **report** argument defines at what moment the message must be sent - at the key press or release. It can have values:

*   **press** (or **keypress**) - the message must be sent at the key press moment;
*   **release** (or **keyrelease**) - the message must be sent at the key release moment;
*   **all** - to send message in both moments. Note that the **data** in both cases will be the same but the message event structure has field which points what has happened with key when the message has been sent (the key press or release).
*   **none** - never send the message.

By default the **report** value is **none** (it means you need to specify its value explicitly if you want the message will really be delivered).

The **genkeyevent** flag defines - has this key to generate the ordinary key event too. It is clear that with **genkeyevent=yes** the normal key event will be sent besides the **message** event and in contrary case the **message** event only will be sent. By default **genkeyevent=no**.

### Another key press emulation.

This action allow to emulate a pressing of key with anothe scan-code (**keycode**). It can be usefull for 'redused' keyboard that have not all needed physical keys.  
The same problem can be silved using [overlay groups](https://web.archive.org/web/20190728062500/http://pascal.tsu.ru/en/xkb/internals.html#overlay). So these two mechanisms are similar and partialy duplicates each other functionality.

Significant difference of this method (using action) is that besides the **keycode** itself you can specify the set of modifiers that will be included into the key event message instead of the current modifiers set.

And the second difference is that the overlay group method 'redirects' the whole keycode but the action always is placed in some cell in the 'actions table' bound to the keycode. So using the actions method you will redirect only one cell of the real key table to the one cell of the emulated key table.

The action name is: **Redirect** or **RedirectKey**.  
The main argument is: **keycode** (its other names are **key** or **kc**).  
Its value must be a name (not a numeric code!) of **keycode** as it defined in **xkb\_keycodes** type file.

Two other arguments serves for specifying the set of modifiers. Their names are **clearmodifiers** (or **clearmods**) and **modifiers** (or **mods**). As you can guess, the first one describes modifiers that must be cleaned from the current modifiers set and the second one describes modifiers must be added. Of course, both arguments are optional and if no one of them is specified the current modifiers set will be reported in the emulated key event.

The value of such arguments is the same as in actions for chanding the modifiers set. It means it consists of real and/or virtual modifiers names separated by '+' sign.

### X-server termination.

The action name is: **Terminate** or **TerminateServer**.  
The result of this action is the same as after pressing of a 'magic combonation' **Control+Alt+BackSpace**.

Tha action has not any arguments or flags.  
I'd like to note that the **Control+Alt+BackSpace** combination is processed before the XKB module and have no relation to the XKB actions. Therefore you can't cancel it in the XKB configuration but only add another one combination with the same effect.

### Screen switching.

This action isn't implemented in the XFree86. It means you can to bind it to some key but will not get any effect.

By idea it has to switch sigle screens of the X-server or switch between X-server and console terminals.

The action name is: **SwitchScreen**.  
The argument is: **screen**. Its value must be integer number.  
This is anoter one case where the argument can mean absolute value or relative increment.  
In the last case there must be '+' or '-' sign before value specified.

This action has one flag named **Same** (or **SameServer**).  
If the flag value is 'true' it implies switching of X-server screens (it means 'the same server'). Otherwise this action has to switch to some console terminal.

### Pressing buttons of another device served by XKB.

Except a mouse events the XKB can emulate events of other input devices (**joystick** for exampl). For such device buttons emulation there are two actions like **PointerButton** and **LockPointerButton**.

The first action name is **DevBtn**, or **DeviceBtn**, or **DevButton**, or **DeviceButton**.  
The second one name is **LockDevBtn**, or **LockDeviceBtn**, or **LockDevButton**, or **LockDeviceButton**.

Like mouse's actions these actions have arguments - **button** and **count**. But they have one another mandatory argument - **dev** (or **device**) that means the device number.

'Special' actions.
------------------

### 'Empty action'.

In some cases there can be some empty cells in the actions table. For example, a type of key implies two shift levels but you really need an action in only one of cells. To fill empty cells there is special 'empty action' - **NoAction()**.

### 'Raw' action.

Remind that we talk about how actions are described in the text files which then will be compiled by the xkbcomp program. Compiled actions are processed inside X-server by the XKB module.

It is posible that the server can perform some actions but the xkbcomp doesn't know them yet. (I should mention that there are not such action in XFree86).  
For such case the xkbcomp offers posibility to describe complete internal structure (that describes action) as numeric codes.

For this purpose there is specila action - **Private**.

Also remind that any actions inside the server represented by some structure that contains fileds such as code, flags ans some arguments fields.  
All these fields are bytes. There are 6 bytes allocated for all arguments. If some arguments has bigger size it simply occupates some bytes.

Therefore the **Private** action arguments are:

*   **type** - the action code (or number)
*   **data** - byte array that contains flags and all arguments.

Values for the **data** can be specified in the same way as for the **Message** action.  
I.e. it can be string of printable symbols (although in this case it is rather useless)

Private(type=123, data="abcde");

or you can assign numeric value to each element of the **data** array

Private(type=123, data\[1\]=0, data\[2\]=100, data\[3\]=12);

Defaults declaration.
---------------------

In files where actions descriptions can appear (**xkb\_compat** and **xkb\_symbols**) also instructions such as 'defaults declaration' can be used.

They looks like assignment some values to fields of structire in C language. It means that the left side is combination of two words separated by period sign.

These declarations can be used for specifying actions flags values by default. In this case the first word (in the left side of assignment) is an action name and the second one is a flag name. Of course the value in the right side can be **True** or **False** only.

For example:

setMods.clearLock = True;

means that in all next **SetMods** action description the **clearlock** flag must be added implicitly. And

latchMods.clearLock = True; latchMods.latchToLock = True;

means that in all **LatchMods** actions **clearLock** and **latchToLock** are implied.
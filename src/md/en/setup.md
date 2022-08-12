How to configure XKB.
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

XkbSymbols "en\_US(pc101)+ru+group(shift\_toggle)+ctrl(ctrl\_ac)"
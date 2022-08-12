Some words about XKB internals.
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

Of course XKB not only retranslates "sound requests" from applications to juke-box but can request sound for own needs (when it changes own state).
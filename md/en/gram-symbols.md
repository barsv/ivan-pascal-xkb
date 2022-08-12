The xkb\_symbols type file.
---------------------------

It is main part of the XKB configuration description. Namely these files contain a 'symbols map' for keyboard. It means that such file defines for each physical key (its scan-code) a set of all possible symbols (keysyms) that can be emited in dependence on current 'keyboard' state (group number and state of modifiers).

Remind that each key has a symbols table. Such table is devided to **group** sub-tables that will be chosen in dependence on current **group number** in keyboard state. Each group sub-table in own turn is devided to a **shift level** and the level choise depends on key **type** and modififiers state.

Remind also that differnt keys can have different number of groups and differntt groups of the same key can have different number of levels.

Besides symbol table some of keys can have analogous table of **actions**. Although usually **actions** are bound not to keys itself but to special symbols (in **xkb\_compat** type files).

Before considering this file grammar lets remember what other data (description fields) besides **simbols** and **actions** can be bound to key scan-code. Generally all these fields have values for default so usually you will not find their specification inside the **xkb\_symbols**file. But if you need you can specify them here explicitly.

Each scan-code description have

*   common **key type** - types are described in **xkb\_types** type files and define dependence of **shift level** on modifiers state. Note that each group sub-table can have own **type**. But if all groups for this key have the same **type** it can be specified once as common for all groups.
*   **adjustment method** for group number - remind that some keys can have number of groups less then other keys have. The XKB adjusts group number if it comes out of bounds but the bounds in this case means maximum value of group number used in all key descriptions. Therefore at pressing such few-group key it is possible that for this key even adjusted number is 'out-of-bounds'. In this case the number must be adjusted additionaly specialy for this key. The methods itsel are the same as 'global' ones (see [The XKB internals:"Keep in range" methods...](https://web.archive.org/web/20190723233834/http://pascal.tsu.ru/en/xkb/internals.html#wrap) ).
*   **autorepeat** - a boolean flag that defines - need it key autorepeating or no;
*   **key 'behavior'** - it is set of flags and one additional argument that defines ...
    *   **locking** - if key is lockable it means that after the first press/release the key stays logicaly down (and keyboard emits key press event only) and after second press it become released and keyboard emits key release event only.
    *   **radio-group** - the key belongs to some radio-group and 'additional' argument in this case is radio-group number. Remind that all keys in one radio-group are interdependent. It means that at press one of such keys it become 'locked' but all other become released.
    *   **allow release all keys (allow none)** - this flag makes sense for radio-group members. Without this flag at least one of radio-group members must be in pressed state and to release it you need to press another one key from the radio-group which in own turn become pressed. But with this flag you can release key simple pressing it second time. Tust such mode **allow none** of radio-group members is in pressed state.
    *   **Overlay 1** - defines that key belongs to overlay group of keys. If in the XKB 'control flags' a **Overlay1** flag is active so this key generates another scan-code (**keycode**) which specified by 'additional argument'.
    *   **Overlay 2** - the same as previous flag but the behavior of key with this flag depends on **Overlay2** 'control flag'.
    *   **permanent** - this flag can be combined with any other flag and means that corresponded behavior is supported by hardware and the XKB module don't need to emulate it. (For example, some keyboard allow to forbid autorepeat for separate key. In this case the XKB has to send special command to hardware at symbols map loading and then don't care about supress unneeded key press events.)
*   **virtual modifier** - this modifier can be used as argument for an **action** bound to the key (of course, if key has any actions). I should note that genarally these **virtual modifiers** are specified not in the **xkb\_symbols** file but in **xkb\_compat** ones (where **actions** are specified).
*   **'Exceptions set'** - it is set of flags that protects the key description against **interpretation** performing (changing **actions** binding when symbols-to-keycodes binding was changed). By these flags one can forbid the whole interpreatation or some its parts performing - changes of virtual modifier, 'autorepeat' flag or 'lock' flag.
*   and the last, in a separate table one can specify binding of **real modifiers** to scan-codes. If the real modifier (one of 'core protocol' modifiers) is bound to some key its state will be changed automaticaly (none **actions** are needed) at key press/release. Also real modifiers-to-scan-code binding can be used by XKB when it search appropriate key for the **interpretation** applying.

### Declaration in xkb\_symbols type file.

The records in such type file can be:

*   [Virtual modifier declaration.](https://web.archive.org/web/20190723233834/http://pascal.tsu.ru/en/xkb/gram-symbols.html#vmodDec)
*   [Group name declaration.](https://web.archive.org/web/20190723233834/http://pascal.tsu.ru/en/xkb/gram-symbols.html#name)
*   [Key description.](https://web.archive.org/web/20190723233834/http://pascal.tsu.ru/en/xkb/gram-symbols.html#key)
*   [Real modifier to key binding.](https://web.archive.org/web/20190723233834/http://pascal.tsu.ru/en/xkb/gram-symbols.html#modmap)
*   [Defaults declaration.](https://web.archive.org/web/20190723233834/http://pascal.tsu.ru/en/xkb/gram-symbols.html#defaults)

### Virtual modifier declaration.

This instruction sipmply declare list of virtual modifiers names which can be met in any next records.

It looks like

**'virtual\_modifiers'** list of modifiers **';'**

Remind that virtual modifiers can be used in the **action** description or as attribute of the key description. At the same time usually neither action description nor 'virtual modifier field' are specified in the **xkb\_symbols** type files (generally they are specified in the **xkb\_compat** type file). So your will hardly find such instruction in any 'standard' xkb\_symbols file.

### Group name declaration.

This instruction assigns to group some symbolic name. The name of group is short description of group map content. For the XKB itself this name is not needed but can be used by some special application that draws keyboard image or shows 'keyboard state'.

The instruction looks like

**'name\['** group **'\]='** group name **';'**

For example,

name\[Group1\] = "English" ; name\[Group2\] = "Russian" ;

### Key description.

This is the main type of records in xkb\_symbols type files. Namely this record describes symbols table (and action table if needed) bound to scan-kode.

It looks like

**'key'** scan-code\_name **'{'** descriptions **'};'**

Remind that the 'scan-code\_names' are declared in **xkb\_keycodes** type files and it is string of any printable symbols (but no longer than four symbols) bounded by 'angle brackets'.  
For example,

key <LCTL> {...};

The 'descriptions' inside figure brackets are devided by comma. Note that it is namely comma but not semicolon that is used in other type records or files.

The 'description' can be

*   [type = ..., or type\[...\] = ...,](https://web.archive.org/web/20190723233834/http://pascal.tsu.ru/en/xkb/gram-symbols.html#type)
*   [locks = ...,](https://web.archive.org/web/20190723233834/http://pascal.tsu.ru/en/xkb/gram-symbols.html#locks) (**locking** is synonym)
*   [repeat = ...,](https://web.archive.org/web/20190723233834/http://pascal.tsu.ru/en/xkb/gram-symbols.html#repeat) (**repeats, repeating** are synonyms)
*   [groupswrap, or warpgroups,](https://web.archive.org/web/20190723233834/http://pascal.tsu.ru/en/xkb/gram-symbols.html#wrap)
*   [groupsclanp, or clampgroups,](https://web.archive.org/web/20190723233834/http://pascal.tsu.ru/en/xkb/gram-symbols.html#wrap)
*   [groupsredirect = ..., or redirectgroups = ...,](https://web.archive.org/web/20190723233834/http://pascal.tsu.ru/en/xkb/gram-symbols.html#wrap)
*   [radiogroup = ...,](https://web.archive.org/web/20190723233834/http://pascal.tsu.ru/en/xkb/gram-symbols.html#radiogroup)
*   [allownone = ...,](https://web.archive.org/web/20190723233834/http://pascal.tsu.ru/en/xkb/gram-symbols.html#radiogroup)
*   [overlay1 = ..., or overlay2 = ...,](https://web.archive.org/web/20190723233834/http://pascal.tsu.ru/en/xkb/gram-symbols.html#overlay)
*   [permanent...](https://web.archive.org/web/20190723233834/http://pascal.tsu.ru/en/xkb/gram-symbols.html#permanent)
*   [vmods = ...,](https://web.archive.org/web/20190723233834/http://pascal.tsu.ru/en/xkb/gram-symbols.html#vmods) (**virtualmods, virtualmodifiers** are synonyms)
*   [symbols\[...\] = ...,](https://web.archive.org/web/20190723233834/http://pascal.tsu.ru/en/xkb/gram-symbols.html#symbols)
*   [actions\[...\] = ...,](https://web.archive.org/web/20190723233834/http://pascal.tsu.ru/en/xkb/gram-symbols.html#actions)
*   [\[...\]](https://web.archive.org/web/20190723233834/http://pascal.tsu.ru/en/xkb/gram-symbols.html#brackets) only.

#### type

It defines key **type**. The word in the right side must be name of one of types desribed in the **xkb\_types** type file.

Note that since differnt **groups** table of the same key can have different types (remind, the type defines number of **shift levels** inside the **group**) this description in common case must looks like

type\[ group \] = type\_name,

for example,

type\[ Group1 \] = "ONE\_LEVEL", type\[ Group2 \] = "ALPHABETIC",

But if all groups have the same number of levels and belong to the same type the group specification (together with square brackets) can be ommited. For example:

type = "ALPHABETIC",

I should note that all keys have the 'deafult group' value. So generally the type is not specified in key description.

At the same time there is one point (can be considered as bug) in these defaults. There is two similar types with two levels each - "TWO\_LEVEL" and "ALPHABETIC". Both types imply two levels and the levels choice depends on Shift modifier. But the "ALPHABETIC" type keys also depends on CapsLock key (I hope everybody know what such dependences means). But by default only first group of each 'alphabetic' key have "ALPHABETIC" type. If you will have made symbols map with any national alphabet (for exapmle some kind of Cyrillic) placed into second group this second group will have "TWO\_LEVEL" type. It means such key will depend on CapsLock when the keyboard is switched to the first group but the CapsLock will not have any effect for the same key when you will switch to your national alphabet. So in this case you need to specify the type for second group explicitly. (But you need not do it in each key description but can use 'defaults declaration'. See [below](https://web.archive.org/web/20190723233834/http://pascal.tsu.ru/en/xkb/gram-symbols.html#defaults).)

#### locks

It is boolean flag that defines must be this key 'lockable' or not.

Since it is boolean flag the word in the right side must be 'boolean value'. It can be **true, yes, on** if you need this key lockable or **false, no, off** otherwise.

Remind that this word can be combined with word **permanent**. It makes sense when keyboard hardware itself can make separate key lockable. In this case the XKB only sends special command to keyboard at the map loading and then do nothing with such key.

By default all keys are not localble.

NOTE: You can answer that keys such as CapsLock, NumLock or ScrollLock behaves as lockable by default. It is right. But they use another mechanism. The point is that some **actions** behaves as lockable. It means that the key sends to the XKB both events - key press and key release. But if a symbol bound to this key is Caps\_Lock, Num\_Lock, etc. the XKB has to perform the corresponded action which filters out the release event at the first press and ignores the key press event at the second one. Thus this key behavior looks like 'lock key'. At the same time this key can have some other symbols that will be chosen if the key is pressed with some other 'modifier key'. In this case the key will not behave as lockable one. But if you specify 'lockability' in the key description it means that the XKB will filter out unneded events (release event at the first press and press event at the second time) before any action processing and for any symbols (independly on any modifiers state).

#### repeat

It is bboolean flag that defines need this key autorepeat or not. As for previous flag the value in the right side can be **true, yes, on** if you desire autorepeat for the key and **false, no, off** otherwise.

Also the value can be **default**. The thing is that usually hardware performs autorepeat. So the XKB must not cary about emulate repeated events but more often it need to discard unnecessary events coming from keyboard for some separate keys. The **default** value means that the XKB has to leave autorepeat for hardware and do nothing (neither generate repeat events nor discard them).

By default all keys have value for **autorepeat** as **default**.

As for previous flag (**lock**) you can note that some keys don't generates autorepeat events even with default values. It is right too. And as in previous case another mechanism is working here. If key has any real modifier bound to the key the autorepeat events for this keys will be discarded (even before the XKB module) by keyboard 'core driver'. Thus you can remember it as simple rule - all modifier keys (Shift, Alt, Ctrl, etc.) are non-autorepeatable independly on what you specify in the key description.

#### groupswrap, groupsclamp, groupsredirect

These words defines "keeping in range" method for group number (see [The XKB internals:"Keeping in range" method](https://web.archive.org/web/20190723233834/http://pascal.tsu.ru/en/xkb/internals.html#wrap) ). Each word means own method and it makes sense to specify only one of them.

Flags **groupswrap** and **groupsclamp** are simple boolean variables. Therefore they can be specified as assignment with some logical value (**true, yes, on** or **false, no, off** in the right side) or in short form  
**groupswrap,** - implies "**\= True**"  
���  
**!groupswrap,** - implies "**\= False**"

But the **groupsredirect** method needs one additional argument which means "what number redirect to". Therefore this method specification always looks like assignment where the right side part is group number. For example:

groupsredirect = 1,

By default all keys have method 'Wrap' (**groupswrap**).

#### radiogroup and allownone

The first word being used in the key description means that the key is radio-group member. The number in the left side of assignment means number of such radio-group.

The radio-group number can be any in range 1-128.  
WARNING: Old version of XFree86 (and probably other vendors X-servers) has bug in XKB that disallow to use 1 as radio-group number. It means that you can specify such number but it leads to server crash if will try to press such key. So it is more safe to use numbers from 2 up to 128.

The word **Allownone** sets corresponded flag for radio-group and it is simple boolean variable. Note that **Allownone** is attribute of whole radio-group but not some of its members. So you can specify it only once in any key description (of course, I mean the key that is member of this group).

By defaut there is not any radio-groups and their members.

#### overlay1 and overlay2

This instruction means that key belongs to one of two 'overlay group'. Remind that when the 'overlay mode' is active (the corresponded flag in in keyboard state is set) such key has to emulate press of key with another scan-code. Therefore on the right side of assignment there must be scan-code name which press has to be emulated. This name has the same look as scan-code name in the key description head and must be defined in the **xkb\_keycodes** type file.  
For example:

overlay1 = <XY01>,

By default there is not any overaly groups and their members.

#### permanent...

This word can not be used alone but is a prefix for words **radiogroup, overlay1, overlay2**, etc. For example:

permanentradiogroup = ..., permanentoverlay1 = ..., permanentoverlay2 = ...,

It means that such behavior is provided by hardware and the XKB don't need to emulate it but only send corresponded setup commands to keyboard at map loading.

#### vmods

This instruction defines virtual modifier (or set of modifiers) that has to be bound to key. The right side of assignment must be virtula modifier name (or list of names devided by plus sign).

Remind that generally virtual modifiers are bound not here but in the **xkb\_compat** type files.

#### symbols

It is the main part of the **key** description. It defines set of symbols for this key. One such instruction specifies the symbols set for one **group**. Therefore square brackets in the left side must contain name of group and the right side is list of symbols for all **shift levels** of this **group** (list must be bounded by square brackets too).  
For example,

symbols\[Group1\] = \[ semicolon, colon \], symbols\[Group1\] = \[Cyrillic\_zhe, Cyrillic\_ZHE\],

The 'symbols' here can be numeric codes of symbols (in decimal, octal or hexidecimal format) or special 'symbol names' (or **keysym** names).

Possible names of keysyms you can find in the **X11R6/include/X11/keysymdefs.h** file. But note that there names have prefix "**XK\_**". Thus if you see in this file definitions like

#define XK\_Escape 0xFF1B #define XK\_Delete 0xFFFF ....

it means that keysym names that can be used in the **xkb\_symbols** file are **Escape** and **Delete**.

NOTE: If digits 0 - 9 are used as symbols they will be considered as names of symbols '**0**' - '**9**' but not as numeric codes.

The recent versions of XFree allow to use 'Unicode keysyms'. (Internally they are codes like 0x1000000+'unicode value'). Such symbols have names that looks like **U1234** where number after 'U' letter is the symbol's Unicode value in hexidecimal representation. So you can specify such symbols as numeris code or as a special 'Unicode keysym name'. For example:

symbols\[Group1\] = \[ 0x100003a, 0x1000038 \], symbols\[Group1\] = \[ U410, U430\],

If one of shift levels is undefined and symbol there is not needed you can use a special 'empty symbol' name - **NoSymbol**.

#### actions

Like previous instruction this one defines set of **actions** the key. It has the same look as **symbols** instruction but instead of symbols an action descriptions are used there.  
For example:

actions\[Group1\] = \[ SetGroup(group=2), SetGroup(group=1) \],

Detail description of possible actions and their arguments you can read in [Actions description.](https://web.archive.org/web/20190723233834/http://pascal.tsu.ru/en/xkb/gram-action.html).

I mention only here that if one of levels don't need any actions you can use a special name for 'empty action' - **NoAction()**.

#### \[...\] only.

Often description of key consists of symbols lists only (in square brackets) without any words like "**symbols\[...\] =**". Since usually most of keys need for description the symbols set only you can use a brief form of description.  
For example, the description

key <AE03> { \[ 3, numbersign \], \[ apostrophe, 3 \] };

is complete equvivalent for

key <AE03> { symbols\[Group1\]= \[ 3, numbersign \], symbols\[Group2\]= \[ apostrophe, 3 \] };

You see that the first pair of square brackets (with content inside) is interpreted as **symbols\[...\]** instruction for the first group, the second pair of brackets - as description for the second group and so one.

By the way, some **xkb\_symbols** files can contain a partial description of full keyboard map. For example it can be some national alphabet symbols placed in the second **group**. Of course such files generally are used as addition to some other file (**xkb\_symbols** type) that contains first group description.  
For specifying that the symbols from this file must be loaded to the second group but the first group must not be touched you can use two ways:

*   To specify group number explicitly in each key description:
    
    key <AE03> { symbols\[Group2\]= \[ apostrophe, 3 \] };
    
*   or use 'empty brackets' for the skiped group:
    
    key <AE03> { \[\], \[ apostrophe, 3 \] };
    

#### 'Set of exceptions'.

Remind that each key can have a 'set of exceptions' which prohibits change of action binding, 'autorepeat' and 'lock' flags and key's virtual modifier at **interpretation** processing.

Note that there are not special instructions for specifying these exceptions in the key description. But this set will be created implicitly in some cases:

*   if the table of **actions** is specified explicitly in the key description the 'prohibition of whole interpretation processing' will be set;
*   if the **repeat** flag is specified it prohibits its change at interptretation processing;
*   if either **lock** flag or **radiogroup** membership are specified it prohibits changes of 'locking';
*   and finally, if the virtual modifier is specified in the key description (**vmod** instruction) it prohibits changes of the virtual modifier (or set of virtual modifiers).

### The real modifiers binding description.

This instruction fills the internal XKB table **modmap** which describes relation between keys and real modifiers. Remind that these modifiers will be set on/off in the state field of the 'key event' automatically at the key press/release.

The instruction looks like

**'modifier\_map'** real\_modifier\_name **'{'** keys\_list **'};'**

Synonyms **modmap** or **mod\_map** can be used instead of **modifier\_map**" word.

The **real\_modifier\_name** there must name of one of real modifiers - **Shift, Lock, Control, Mod1, Mod2, Mod3, Mod4, Mod5**.

But **keys\_list** can consist of either names of scan-codes (keycodes), for example:

modifier\_map Control { <LCTL>, <RCTL> };

or names of symbols (keysyms), for example:

modifier\_map Mod1 { Alt\_L, Alt\_R };

Since the internal **modmap** table is 'scan\_code to modifiers' mapping, in the second case the XKB has to find scan-codes where specified symbols are bound to and then place these scan-codes into **modmap**.

Note that the same real modifier can be bound to many keycodes but not vice versa - many modifiers to one keycode. It means that scan-code name can appears in **modmap** instructions only once (the xkbcomp checks it). The same limitation is applied to keys specified **modmap** instruction by symbol names.

However the **xkbcomp** doesn't checks state where the same key one time is specified as keycode and another time - as symbol or represented by two different symbols bound to the same keycode. In this case ie is posible that more than one real modifier will be bound to key.

### Defaults declaration.

This instruction defines the default value for some key attributes and looks like assignment to the 'field of structure' in the C language.  
For example:

key.repeat = no;

or

type\[Group2\]="ALPHABETIC";

The first word (before period sign) in the left side must be "**key**" and the second one can be any of available in the key description - **type, locks, radiogroup**, etc.

Of course, this default value will be actual until another deafult declaration for the same parameter will occur in the text. And if the corresponded parameter doesn't specified in the key description body explicitly.

Also the default declaration can be used for arguments in the **action** descriptions (details read in the [Actions description](https://web.archive.org/web/20190723233834/http://pascal.tsu.ru/en/xkb/gram-action.html)). In this case the first word is the action name, for example

SetMods.clearLocks = True;

And the last one, there is one another instruction that can be considered as the 'defaults declaration'. It is instruction which sets the **allownone** flag ("all members can be released") for radio-groups.

Remind that this flag can be specified inside any key description. But since it is whole radio-group attribute but no attribute of the radio-group member key this flag can be specified outside of any key description. For example:

allownone = 10;

means the tenth radio-group has this flag.

* * *

Ivan Pascal [pascal@tsu.ru](https://web.archive.org/web/20190723233834/mailto:pascal@tsu.ru)
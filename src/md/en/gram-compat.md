The xkb\_compat type files.
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
    
    (more details about action description and posible fields see in [Actions description.](https://web.archive.org/web/20190723235757/http://pascal.tsu.ru/en/xkb/gram-action.html))
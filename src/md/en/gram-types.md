The xkb\_types type file.
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

And one example of new type invention and usage you can see in section [Examples:New type for the Enter key."](https://web.archive.org/web/20190724070654/http://pascal.tsu.ru/en/xkb/example1.html).
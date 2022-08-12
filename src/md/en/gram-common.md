Common notes about XKB configuration files language.
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

You guess it means that all decalration from **"group(toggle)"** section must be inserted in the current section but merge mode for all declaration from new section must be **replace** (not **override** as by default).
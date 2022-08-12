Common structure of XKB configuration files.
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
*   **xkb\_keymap** - most complete type, MUST contain all types that must contain both previous type sections (**xkb\_keycodes, xkb\_types, xkb\_compat xkb\_symbols**) and additionaly CAN contain types that are optional for both previous types sections (it is only **xkb\_geometry** type).
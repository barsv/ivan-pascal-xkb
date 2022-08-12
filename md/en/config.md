One another way to describe XKB configuration.
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

For more details about these modes see documentation (**XKBlib**) from **XFree86** distributive.
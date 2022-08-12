Actions description.
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
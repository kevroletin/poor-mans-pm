# Poor man's project management

The System:
* mark files using #project, #todo, etc. tags
* link tasks to project using project property

Below is a todo file named **LazyVim** linked to Desktop project.

**LazyVim**
```
---
project: "[[Desktop]]"
---
#todo

Read LazyVim book
[Online book](https://lazyvim-ambitious-devs.phillips.codes/course/chapter-2/)
```

This plugin automates creating of new tasks. todo-from-selection function
turns selection into a new file (similarly to note-refactor-obsidian). It
copies project property, so the new todo file is linked to the same project
as active file.

The example above (given the last two lines were selected) will turn into:

**LazyVim**
```
---
project: "[[Desktop]]"
---
#todo

[[Read LazyVim book]]
```

..plus a new file:

**Read LazyVim book**
```
---
project: "[[Desktop]]"
parent: "[[LazyVim]]"
---
#todo
[Online book](https://lazyvim-ambitious-devs.phillips.codes/course/chapter-2/)
```

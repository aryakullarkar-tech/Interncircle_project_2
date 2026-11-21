PROJECT 02 - INTERACTIVE TO-DO LIST WITH LOCALSTORAGE
=====================================================

Author: Arya

ABOUT
-----
A simple task manager built with HTML, CSS and JavaScript.
Tasks can be added, marked complete, deleted and filtered.
All tasks are saved in the browser using LocalStorage, so they
are still there after the page is reloaded or the browser is closed.

FEATURES
--------
- Add a task with the "Add" button or by pressing the Enter key
- Mark a task as complete or incomplete with its checkbox
- Delete a single task
- Filter tasks: All / Active / Completed
- "Clear completed" button to remove finished tasks
- Live counter showing how many tasks are left
- Validation: empty tasks are not added
- Responsive layout that works on phones and computers

CONCEPTS USED
-------------
- DOM manipulation (creating, updating and removing elements)
- Event listeners (click, keydown for the Enter key, change, input)
- Event delegation (one listener on the list handles all tasks)
- LocalStorage with JSON.stringify and JSON.parse
- State handling (a tasks array drives what is shown on screen)

FILES
-----
index.html  - page structure
style.css   - styling and responsive layout
script.js   - all the logic (tasks, events, LocalStorage)
README.txt  - this file

HOW TO RUN
----------
1. Keep all files in the same folder.
2. Open index.html in any modern browser (Chrome, Edge, Firefox).
3. Add a few tasks, reload the page and check that they are still there.

NOTE
----
LocalStorage keeps data only in the browser it was saved in.
Clearing the browser's site data will also clear the tasks.

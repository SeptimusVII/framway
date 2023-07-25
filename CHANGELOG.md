# Framway


2.4.0 - 2023-07-20
- Fix: utils.findParentWithCSS now return document.body, as document alone was not a valid element to return
- Feat: add `isWithinViewport` checking function


2.3.5 - 2023-07-19
- Fix: .quote font-color
- Fix: remove usage of useFA global variable
- Fix: remove usage of useTarteaucitron global variable
- Feat: make button's padding variable available to an override in themes


2.3.4 - 2023-07-06
- Fix: moderate severity vulnerabilities on dependencies
- Fix: set position of a tooltip's parent to relative if its not already defined (aka is static)
- Feat: add `cols-autofill` class variant for grid system. make use of css vars for dynamic customization with html/js


2.3.3 - 2023-06-14
- Fix framway's rewriting script, allowing proper rem and ch units transcription
- Feat: add griditem-minwidth var for grid width `cols-autofit` class


2.3.2 - 2023-06-13
- Fix: update default configuration so it's up to date with the latest available components


2.3.1 - 2023-06-12
- Fix: add possibility to negate the background/font color treatment on a paper() inclusion
- Fix: get `cols-span-all` class out of d-grid scope
- Feat: add width utility classes
- Feat: add responsive centering classes
- Feat: improve button centering support


2.3.0 - 2023-05-15
- Feat: apply same stashing politic as framway's core repo to components and themes
- Feat: add cols-autofit to grid system. allow a simple grid setup based on a minimum block width of 35ch
- Feat: add color parameter for `paper` function (default block-background var). Add a generic `paper` utility class
- Feat: add `cols-span-all` class for css grid
- Feat: add `checkIntegrity` function to update procedure; forbid update components or themes have uncommitted changes and display them
- Fix: utils.checkForm doesn't take disabled inputs from now


2.2.0 - 2023-04-27
- Feat: move `findParentWithCSS` function from Framway to Utils. Make it return the Document instead of null if no match was found
- Fix: disable toggling files index on framway's init. No more fail on git pull
- Feat: improvement on update procedure; now you just need to run 'npm run framway update'. All stashing, pulling and dependencies installing is taken care of


2.1.1 - 2023-04-26
- Feat: improve tooltip by adjusting their lateral position if they're overlapping their closest overflowing parent. Add them a floating carret pointing to the hovered item
- Fix: replace the window resize event from jQuery syntax to native js. This avoid double firing at loading and reduce the overall need for jQuery


2.1.0 - 2023-04-13
- feat: add 'paper' mixin, to replace the `%paper` class placeholder. The goal is to improve performance by reducing the code mass, as %paper generated massive chunk of selectors
- feat: add tooltip feature. To use it, add a 'tooltip' attribute with a string value to any element (needs to be explicit or implicit relative positioned)


2.0.6 - 2023-04-12
- fix: remove the pbreak extend in texts scss and move it to utilities. remove it from the ol and ul element, was causing too much issues


2.0.5 - 2023-03-30
- feat: add inputs type time to list of supported inputs
- fix: button with icon- classes not being centered with class `center`


2.0.4 - 2023-03-29
- fix: titles with `sep-` class now have a rem sized margins
- fix: adjust default css config
- feat: add `utils.getInputLabel` function. Allow to retrieve the corresponding label text of a given input.


2.0.3 - 2023-03-15
- fix: dependencies vulnerabilities
- fix: adjustments for various margins values
- feat: utils.checkForm now properly display input's label on errors


2.0.2 - 2023-02-16
- fix: dependencies vulnerabilities
- fix: remove input range from default input styling
- feat: add `getAttr` function to Component class, similar to getData

2.0.1 - 2023-02-09
- two years of various updates, majors and minors, to bring the code base at a satisfaying state from 1.4.18 to a proper 2.0.0 version

2.0.0 - 2020-09-17 
- init git repository from the old 1.4.18, located on the Web-Ex-Machina github account

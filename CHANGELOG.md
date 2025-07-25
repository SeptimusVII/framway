# Framway
2.6.1 - 2025-xx-xx
- Feat:
	- add flexvalues `start` and `end`
	- add `utils.request` function. Used for async request without relying on jQuery
	- Improve `utils.checkForm` function, by making use of native javascript Validation API 
	- add `h-min-100vh` utility class
	- add mixin for `container` styles
	- better management of btn's radius configuration
	- add features `autocols` and `autorows` to grid's construction mixin
- Fixes:
	- fix grid element width no `cols-` class not registering max-width on children
	- try moving default grid templating to `d-grid` class instead of `grid` mixin
	- set figures having img to `display:contents`
	- fix grid's cols-autofit/fill item's min width on low resolution

2.6.0 - 2025-03-28
- Feat:
	- update to `dart-sass`
	- add `w-full` mixin
	- add `shdw` class for base shadowing on blocks
	- add `lcnm` utility class, used to add the "last child no margin" effect on blocks
- Fixes:
	- update dependencies
	- fix `quote` element inheritance for font size and color

2.5.2 - 2024-12-03
- Feat:
	- improve `container` max width management with a custom property system, using `--container-mw` var 
	- add `min-width` property to direct children of a grid with `auto-fill/fit` 
	- apply `container` rules to `container-fluid`
	- add input type `search` to input type text `chain`
	- add `grid-min-max-cols` mixin to `grid`. allow to define a grid with automated min/max number and min size of columns
	- remove the default reduction of spacing below `xs` resolution
	- add ratio 3/4 to images styles
	- `d-grid` with any `flex` class attached will now be forced into display flex
- Fixes:
	- move grid spanning classes outside of the scope of `d-grid` class
	- fix `btn` border size in `input-group`
	- fix `error-container` margin
	- fix text wrap for text content in `txt-balance` container
	- fix multi-ellipsis mixin 's line height calculation
	- display none on empty `d-grid` children
	- fix background and font color on tooltips
	- update flex partials, as we don't need the prefixers mixins anymore

2.5.1 - 2024-07-03
- Feat: 
	- add `button-as-btn` global config boolean. If true, buttons type `button` and `submit` are styled like buttons
	- add `cols-span-#{$key}-all` classes
	- add `background` opacity utility classes, written `bg-o-#{$index}`. Remove old var `enable-bg-extended`
	- add `auto-rows` class to grid system. makes all undefined rows the same height
	- add `center-y` classes, allow vertical centering in a height defined space
	- add `ft-inherit` class
	- add `text-wrap: pretty` on text basic element. Supposedly, does avoid orphans at end of paragraphs
	- add `utils.invertColor` function
	- add `btn-group` styles. Wrap any number of buttons in a `.btn-group` container to group them nicely
	- add `btn-bd-input` styles. Used to make a `btn`'s border alike with inputs while being in a `input-group`
- Fixes: 
	- disable `url()` process in css files
	- fix links font color for btn width `bg/bd-none`
	- fix `center` class, it no longer change the margins top and bottom of element 
	- `utils.getInputLabel`, fix/improve retrieving of radios and checkboxes label

2.5.0 - 2024-02-14
- Fix: correct input use of the custom radius
- Update: postcss-focus plugin
- Buttons update
	- remove `exclude` feature - not enough use and causing issues with selector priorities.
	- replace `btn` classes declaration with a couple mixin/placeholder - classes `btn`, `btn-sm`, `btn-lg` and such now extend the `%btn` placeholder, making styles overriding a lot less cumbersome, and generating a lots less classes and 50ft long selectors.
	- add a set of css custom properties, complete with default values and possibility to override them from themes config. `btn` classes make use of these CP, allowing us to do contextual styling based on their values instead of altering styles
	- add `input-as-btn` global config boolean. If true, inputs type `button` and `submit` are styled like buttons
	- keep a `$exclude` empty string var for backward compatibility 
	- remove `btn` classes extensions
- Fix: button's margins in `border` classes and `lastChildNoMargin` mixin
- Fix: udpate `inputs` to new btn system

2.4.4 - 2024-02-05
- Feat: add a background parameter to `img-container` mixin
- Feat: add a grid() mixin, to replace extending the `.d-grid` class
- Fix: Iframes in `img-container` now takes 100% width available
- Feat: add `last-child-no-m` margin utility class
- Fix: tweaks the button's squared class
- Feat: set `img-container` to be compatible with background classes
- Fix: remove occurrences of `tertiary` var
- Feat: add `enable-bg-extended` config var. lock background opacity classes generation behind this var, for optimization sake
- Feat: add `str-split` mixin
- Feat: add color aliases management; at Dom loading time, a script look for occurrences of color classes named after an alias and replace them with their true color name. Aliases are set in scss config files, as an independent key/value array named `aliases`

2.4.3 - 2023-11-23
- Feat: add postcss-gap-properties plugin, and update postcss to latest version
- Fix: switch misc properties using `color(alias)` instead of `alias` var directly
- Fix: `utils.copyToClipboard`, change fake textarea position to fixed to avoid scroll jumping when the script focus in
- Feat: `utils.copyToClipboard `can now copy outer html of an element, when the `full` parameter is set to true
- Feat: img-container revamp; 
it is now a mixin instead of an inherited class/placeholder, resulting in more control over it and less cumbersome selectors. 
change the previous model of a container + image positioned in absolute, in favor of the aspect-ratio css specs now largely supported.
change default global behaviors, such as fitting the picture (previously cover by default, now scale-down)
keep the old img-container css rules in a separate mixin (`img-container--old`) for legacy and potential retro compatibility

2.4.2 - 2023-10-24
- feat: make framway's config file more "json friendly"
- feat: add `txt-balance` and `txt-balance-reset` classes
- fix: change `cols-autofill/autofit` declaration order

2.4.1 - 2023-09-06
- feat: add `w-100vw` utility class
- feat: add `w-[breakpoint]-100vw`, `w-[breakpoint]-100` and `w-[breakpoint]-auto` utility classes
- Fix: `getViewportHeight` function now use `.headerFW `selector instead of `#header`
- Feat: add `cols-start-` and `cols-end-` class type, allowing custom and precise placement of items in grids

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

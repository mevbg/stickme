# jQuery StickMe Plugin v1.0.2

Fixed elements depending on the scroll position.

## Description

jQuery StickMe Plugin gives the control to make any element on a website fixed on a certain scroll position of the document page wherever and whenever it needs. It's easy to setup with the given options and it's also a great module to interact with due to its methods and callback events.

## Demo

<a href="http://stickme.martinmetodiev.com" target="_blank">stickme.martinmetodiev.com</a>

## Getting Started

You can [download the plugin as an archive][zip].

[zip]: https://github.com/martinmethod/stickme/zipball/master

Or you can grab it by using **npm**:

```javascript
npm install stickme
```

Or you can grab it by using **Bower**:

```javascript
bower install stickme
```

## Installation

Include the script after the jQuery library (unless you package scripts otherwise):

```html
<script src="/path/to/stickme.min.js"></script>
```

## Usage

### Initialization

*Please keep in mind that DOM elements you would like to be fixed at some point are better to stay clean of any styles which might influence their positions (float, margin…). A good practice would be having a clean, wrapping child element inside of the desired target only for StickMe purposes.*

Now, there are two ways of initializing StickMe:

#### I. jQuery function

The first way is as follows:

```javascript
$.stickme(); // returns the target
```

This is the most basic initialization. By calling it so, the plugin will look for any element that has a "**stickme**" class. If no such elements, nothing will happen.

Of course, you can also provide specific target/s with a custom selector by doing so:

```javascript
$.stickme({
    target: $('selector') 
});
```

#### II. Method function

The second way is as an object method. So, we can also use the plugin this way:

```javascript
$('selector').stickme(); // returns the target
```

### Options

#### target

Defines a custom target selector.

*The target property is only available when initialize StickMe as a jQuery function like the example below.*

```javascript
$.stickme({
    target: $('selector') 
});
```

#### top

Defines an offset from the top of the viewport.

```javascript
$('selector').stickme({
    top: 10
});
```

### Methods

#### update()

Updates the styles of the target when it's in a fixed position.

```javascript
var stickedElement = $('selector').stickme();

stickedElement.update();
```

#### destroy()

Removes StickMe from the target.

```javascript
var stickedElement = $('selector').stickme();

stickedElement.destroy();
```

### Events

There are two ways of binding StickMe events.

**1.** As option properties:

```javascript
$('selector').stickme({
    onStick: function(e, target) {
        // do something
    },
    onUnstick: function(e, target) {
        // do something
    }
});
```

**2.** As jQuery events:

```javascript
$('selector').stickme()
    .bind('onStick', function(e, target) {
        // do something
    })
    .bind('onUnstick', function(e, target) {
        // do something
    });
```

And here are all available events:

#### onStick

Triggers when the target is being switched to fixed position.

```javascript
var stickedElement = $('selector').stickme();

stickedElement.bind('onStick', function(e, target) {
    // do something
});
```

#### onUnstick

Triggers when the target is being switched to static position.

```javascript
var stickedElement = $('selector').stickme();

stickedElement.bind('onUnstick', function(e, target) {
    // do something
});
```

#### onDestroy

Triggers when StickMe is being removed from the target.

```javascript
var stickedElement = $('selector').stickme();

stickedElement.bind('onDestroy', function(e, target) {
    // do something
});
```

## Browsers compatibility

- Apple Safari
- Google Chrome
- Microsoft Internet Explorer 9+
- Mozilla Firefox
- Opera

## Dependencies

- [jQuery][jq]

[jq]: https://github.com/jquery/jquery.git

## License

Copyright © 2015 Martin Metodiev. Licensed under the MIT license. [See here for more details.][licence]

[licence]: https://raw.github.com/martinmethod/stickme/master/LICENSE-MIT
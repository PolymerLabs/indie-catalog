[![Build status](https://travis-ci.org/PolymerElements/iron-doc-viewer.svg?branch=master)](https://travis-ci.org/PolymerElements/iron-doc-viewer)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://beta.webcomponents.org/element/PolymerElements/iron-doc-viewer)

## &lt;iron-doc-viewer&gt;

***
⚠️ The version of iron-doc-viewer described below is coming soon, but not quite
yet tagged for release. See [this
issue](https://github.com/PolymerElements/iron-component-page/issues/121) for
status. ⚠️
***

A collection of elements that display documentation about custom elements,
mixins, classes, and more using the JSON descriptor format produced by [Polymer
Analyzer](https://github.com/Polymer/polymer-analyzer).

You may also be interested in
[`<iron-component-page>`](https://github.com/PolymerElements/iron-component-page),
which composes the iron-doc elements into a more complete documentation
browser.

### Elements

* `<iron-doc-nav>` Show a table-of-contents.
* `<iron-doc-viewer>` Manage routing and delegate to a child doc element.
* `<iron-doc-element>` Show docs about a custom element.
* `<iron-doc-behavior>` Show docs about a Polymer behavior.
* `<iron-doc-namespace>` Show docs about a JavaScript namespace.
* `<iron-doc-class>` Show docs about a JavaScript class.
* `<iron-doc-mixin>` Show docs about a JavaScript mixin.

### Routing

`<iron-doc-viewer>` handles URL routing to provide permanent addresses for all
locations in the documentation tree, including scroll anchor targets.

By default it uses the URL fragment for routing (e.g.
`docs.html#/elements/my-element#property-foo`), in order to support simple
static file hosts.

To use the real URL path for routing, set the `base-href` property to the
server mount point (e.g. `/` or `/docs/`). Note that this requires a host that
serves the application from all paths that should be handled by the doc viewer.

### Styling

The iron-doc elements come with an optional material-design default theme that
must be explicitly included as custom style:

```html
<link rel="import" href="../iron-doc-viewer/default-theme.html">

<custom-style>
  <style is="custom-style" include="iron-doc-default-theme"></style>
</custom-style>
```

The following custom properties and mixins are available for styling:

Custom property | Description | Default
----------------|-------------|----------
`--iron-doc-accent-color1` | Color for emphasis (e.g. hyperlinks). | `black`
`--iron-doc-accent-color2` | Color for bright emphasis (e.g. hyperlink hover). | `black`
`--iron-doc-font-code` | Mixin applied to code snippets. | `{}`
`--iron-doc-font-body` | Mixin applied to non-code text. | `{}`
`--iron-doc-title` | Mixin applied to titles. | `{}`

### Previous versions

The 3.x iron-doc elements described here have major breaking API and behavioral
changes versus the 1.x and 2.x versions. Previous versions were based on
*Hydrolysis*, the predecessor to Polymer Analyzer. Hydrolysis is no longer
maintained and does not support analysis of Polymer 2 elements.

If you still need the previous version, see the
[2.x branch](https://github.com/PolymerElements/iron-doc-viewer/tree/2.x).

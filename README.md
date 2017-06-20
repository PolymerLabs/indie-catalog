# indie-catalog

## Configuration
The elements that you want to appear in the catalog are listed in `catalog.json`:

```
{
  "packages": {
    "an-element": { ... }
    "another-element": { ... }
  }
}
```

There's different setups you might be interested in:

### Using an element from git
If you want to access the code from a git repo, use the `git` field:

```
{
  "packages": {
    "paper-input": {
       "git": "https://github.com/polymerelements/paper-input",
       "description": "A Material Design input"
    }
  }
}
```

This assumes that your demo will be accessible in a `demo` subfolder
of the git repo (i.e. `paper-input/demo/index.html`).

### Externally hosted the demo and docs
If the demo and docs are already hosted in a different place, you can use the
`docs` and `demo` fields to link directly to them:
```
{
  "packages": {
    "paper-checkbox": {
      "description": "A Material Design checkbox with remote docs and demo",
      "demo": "https://raw-dot-custom-elements.appspot.com/PolymerElements/paper-checkbox/v2.0.0/paper-checkbox/demo/index.html",
      "docs": "https://www.webcomponents.org/element/PolymerElements/paper-checkbox"
    }
  }
}
```

You can also use these properties this if your element has a demo not
in a `/demo` subdirectory, but in some different directory, by using relative paths.
This relative path should look like `dist/{element-name}/bower_components/{element-name}/...`

```
"lazy-image": {
  "git": "https://github.com/notwaldorf/lazy-image",
  "description": "A custom image element that lets you load resources on demand",
  "demo": "dist/lazy-image/bower_components/lazy-image/index.html"    
}
```

### Assumptions
For either usage, the following extra assumptions are made:
- running `bower install` in that repo completes successfully
- your element is written using relative paths for the elements it
depends on, rather than using `bower_components` anywhere. See
[PolymerElements/paper-button](https://github.com/PolymerElements/paper-button/blob/master/paper-button.html#L11) for an example.

## Step 2. Do the build dance.
This should take a while:

```
npm install
gulp
```

It's basically doing, for each package in `catalog.json`:
- `git clone` it to `/dist`
- remove the `.git` and `.gitignore` dirs from the clone
- `bower install` in `/dist/${elementName}/bower_components`
- copy the git clone into `/dist/${elementName}/bower_components/${elementName}`,
so that the demo works.

## Step 3. Run it locally

```
python -m SimpleHTTPServer # or your favourite local server
```

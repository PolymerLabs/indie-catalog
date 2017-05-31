# indie-catalog

### Step 1. Configure it
Put the git repos of elements you care about in `catalog.json`. Here's a sample

```
{
  "packages": {
    "paper-input": {
       "git": "https://github.com/polymerelements/paper-input",
       "description": "a less shitty input"
    },
    "paper-button": {
      "git": "https://github.com/polymerelements/paper-button",
      "description": "a defo shittier button"
    }
  }
}
```

This is making some assumptions about your elements:
- they are in bower
- they have a demo folder, in `element-name/demo`
- your element is written using relative paths for the elements it
depends on, rather than using `bower_components` anywhere. See
[PolymerElements/paper-button](https://github.com/PolymerElements/paper-button/blob/master/paper-button.html#L11) for an example.

### Step 2. Do the build dance.
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

### Step 3. Run it locally

```
python -m SimpleHTTPServer # or your favourite local server
```

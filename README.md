# supersets [![Deno CI](https://github.com/octavetoast/supersets/actions/workflows/deno.yml/badge.svg)](https://github.com/octavetoast/supersets/actions/workflows/deno.yml) [![Coverage Status](https://coveralls.io/repos/github/octavetoast/supersets/badge.svg?branch=main)](https://coveralls.io/github/octavetoast/supersets?branch=main)

Useful abstractions over JavaScript's native collections (Map and Set) for Deno, Node.js and browsers.

## Installation

For Deno projects, refer to the usage example below.

For Node.js or webpack projects, install with the NPM package manager:

```Bash
npm install --save supersets
```

For use in the browser without a bundler, include this script tag in your HTML.

```HTML
<script src="https://unpkg.com/supersets@0.0.4/dist/supersets.js"></script>
```

## Usage

```JavaScript

// commonjs module
const { Supermap } = require('supersets')

// esmodules
import { Supermap } from 'supersets'

// deno
import { Supermap } from 'https://deno.land/x/supersets@0.0.4/mod.ts'

// in the browser
const { Supermap } = window.Supersets

/* TODO */

```

## [Documentation](https://doc.deno.land/https/deno.land/x/supersets/mod.ts)

This module has first-class Deno support, documentation will always be available at [doc.deno.land](https://doc.deno.land/https/deno.land/x/supersets/mod.ts).

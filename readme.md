# 🐨

### Setup

To get `Koala` running locally for development,

```sh
npm install
npm link

# Inside a babel project

npm link babel-plugin-koala
```

This will link in the required plugin, you don't need to add the
plugin to your `.babelrc` file, this should be handled for you.

Next, you will need to run the `Koala` watcher - This watches your
files for changes and then recompiles and runs them.

```sh
koala src --out-dir build
```

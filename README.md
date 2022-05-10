# colyseus-schema-experiments
Trying out colyseus schema.  Specifically for https://github.com/colyseus/schema/issues/115

# Usage

```
npm install
npm start
```
# Experiments

Try changing `private doDecode = true;` to true or false and change which of the tests you want to run.

```
server.arrayTest();
// server.filterTest();
// server.mapTest();
```

Note that depending on the value of `doDecode` the results are different meaning that the colyseus schema state isn't recreated faithfully after serialization/deserialization.


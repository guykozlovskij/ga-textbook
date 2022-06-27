# AJAX

AJAX stands for **Asynchronous Javascript And XML** and is a way for us to make HTTP requests directly inside our JavaScript files.

This is really useful for us because it allows us to pull the data from an API directly into our JavaScript and then render that data into the view with jQuery, Angular or React.

## XML and JSON

Back in the day, APIs used to send data in XML format, which is where the X in AJAX comes from. XML is similar to HTML. A cheese represented in XML might look like this:

```xml
<cheese>
  <name>Gouda</name>
  <origin>Netherlands</origin>
  <strength>4</strength>
</cheese>
```

While this was perfectly fine, but because each property of the cheese required an opening _and_ closing tag, the amount of data being transferred was rather large.

As APIs were being consumed more and more by JavaScript applications a more suitable way of transferring data with an API was born: JSON.

JSON stands for **JavaScript Object Notation** and is a string representation of JavaScript objects and arrays. The same cheese represented in JSON might look like this:

```json
{
  "name": "Gouda",
  "origin": "Netherlands",
  "strength": 4
}
```

As you can see, it looks almost identical to a JavaScript object, except that the keys have double quotes and the string values also have double quotes.

The APIs we build on this course will use JSON exclusively.

## Using AJAX

Depending on the library we are using we can make any request (including GET, POST, PUT, PATCH and DELETE)

## Fetch 

`fetch()` allows you to make network requests similar to JavaScript's `XMLHttpRequest`. The main difference is that Fetch uses _promises_, which creates a simpler and cleaner syntax, avoiding callback hell and having to remember the complexities of `XMLHttpRequest`.

We don't need to install the Fetch API as it is in-built in Chrome and Firefox.

| Pros | Cons |
|:-----|:-----|
| Native to Chrome and Firefox | Clunky syntax |
| No installation | Can only handle strings so requires the developer to use `JSON.stringify` before sending data |
| Will likely become standard in all browsers | Two-stage process to get the JSON payload in the response |
| Uses promises | &nbsp; |

#### Example GET request

```js
async function getData() {
  try {
    let res = await fetch('api url')
    let data = await res.json()
    console.log(data)
  } catch (err) {
    console.log(err)
  }
}
```

#### Example POST request

```js
async function postData() {
  try {
    let res = await fetch('api url', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    })
    let data = await res.json()
    console.log(data)
  } catch (err) {
    console.log(err)
  }
}
```

## Further reading

- [AJAX](https://developer.mozilla.org/en-US/docs/Web/Guide/AJAX)
- [Understanding AJAX as a Beginner Web Developer](https://www.codementor.io/sheena/ajax-tutorial-web-development-du107rzaq)
- [JavaScript and AJAX tutorial: What is AJAX?](https://www.youtube.com/watch?v=RDo3hBL1rfA)

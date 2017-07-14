# Giphy Link Preview for Mixmax

This is an open source Mixmax Link Resolver. See <http://developer.mixmax.com/docs/overview-link-resolvers> for more information about how to use this example code in Mixmax.

Modified version of giphy link resolver (https://github.com/mixmaxhq/giphy-example-link-resolver)

## Running locally

1. Install using `npm install`
2. Run using `npm start`

To simulate locally how Mixmax calls the resolver URL (to return HTML that goes into the email), run:

```
curl https://localhost:9146/resolver?url=http%3A%2F%2Fwww.metaweather.com%2F2383660 --insecure
```

Some urls to test
* https://www.metaweather.com/2383660/
* https://www.metaweather.com/2471217/
* https://www.metaweather.com/2488042/

Please update your settings to:
* Description: MetaWeather
* Regular Expression: metaweather.com/[^\/]+([0-9]+)(\/?)$
* Resolver API URL: https://localhost:9146/resolver



## Why do we run it in https locally?

Mixmax slash command APIs are required to be served over https. This is because they are queried directly from the Mixmax client in the browser (using AJAX) that's running on an HTTPS domain. Browsers forbid AJAX requests from https domains to call http APIs, for security. So we must run an https server with a locally-signed certificate.

See [here](http://developer.mixmax.com/docs/integration-api-appendix#local-development-error-neterr_insecure_response) for how to fix the **ERR_INSECURE_RESPONSE** error that you might get in Chrome.

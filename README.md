# WebUI

Website of moggies.io

# Building

```bash
make build-static
```

# Deploy

Deployed with AWS Amplify on push to master.

## PRs

PR previews are available with AWS Amplify - when you create a PR it will be deployed to a custom url where you can visualize and test your changes.

## 👉 Get Started

Install dependencies

```
npm install
```

Update your `.env` file with values for each environment variable

```
API_KEY=AIzaSyBkkFF0XhNZeWuDmOfEhsgdfX1VBG7WTas
etc ...
```

Run the development server

```
npm run dev
```

When the above command completes you'll be able to view your website at `http://localhost:3000`

## 🥞 Stack

This project uses the following libraries and services:

- Framework - [Next.js](https://nextjs.org)
- UI Kit - [Bootstrap](https://react-bootstrap.github.io)
- Authentication - TBD
- Payments - [Stripe](https://stripe.com)
- Newsletter - [Mailchimp](https://mailchimp.com)
- Contact Form - [Amazon SES](https://aws.amazon.com/ses/)
- Analytics - [Google Analytics](https://googleanalytics.com)
- Hosting - TBD

## 📚 Guide

<details> <summary><b>Styles</b></summary> <p> You can edit Bootstrap SASS variables in the global stylesheet located at <code><a href="src/styles/global.scss">src/styles/global.scss</a></code>. Variables allow you to control global styles (like colors and fonts), as well as element specific styles (like button padding). Before overriding Bootstrap elements with custom style check the <a href="https://getbootstrap.com/docs/4.3/getting-started/introduction/">Bootstrap docs</a> to see if you can do what need by tweaking a SASS variable. </p> <p> Custom styles are located in their related component's directory. For example, if any custom style is applied to the Navbar component you'll find it in <code>src/components/Navbar.scss</code>. We ensure custom styles are scoped to their component by prepending the classname with the component name (such as <code>.Navbar__brand</code>). This ensures styles never affect elements in other components. If styles need to be re-used in multiple components consider creating a new component that encapsulates that style and structure and using that component in multiple places. </p> </details>

<details>
<summary><b>Routing</b></summary>
<p>
  This project uses the built-in Next.js router and its convenient <code>useRouter</code> hook. Learn more in the <a target="_blank" href="https://github.com/zeit/next.js/#routing">Next.js docs</a>.

```js
import Link from "next/link";
import { useRouter } from "next/router";

function MyComponent() {
  // Get the router object
  const router = useRouter();

  // Get value from query string (?postId=123) or route param (/:postId)
  console.log(router.query.postId);

  // Get current pathname
  console.log(router.pathname);

  // Navigate with the <Link> component or with router.push()
  return (
    <div>
      <Link href="/about">
        <a>About</a>
      </Link>
      <button onClick={(e) => router.push("/about")}>About</button>
    </div>
  );
}
```

</p>
</details>

<details>
<summary><b>Authentication</b></summary>
<p>
  This project wasn't setup with a particular auth service in mind, but includes a <code>useAuth</code> hook (located in <code><a href="src/util/auth.js">src/util/auth.js</a></code>) that allows you to prototype auth flows. Before moving to production you'll want to edit that file to make calls to an actual authentication provider.

```js
import { useAuth } from "./../util/auth.js";

function MyComponent() {
  // Get the auth object in any component
  const auth = useAuth();

  // Depending on auth state show signin or signout button
  // auth.user will either be an object, null when loading, or false if signed out
  return (
    <div>
      {auth.user ? (
        <button onClick={(e) => auth.signout()}>Signout</button>
      ) : (
        <button onClick={(e) => auth.signin("hello@divjoy.com", "yolo")}>
          Signin
        </button>
      )}
    </div>
  );
}
```

</p>
</details>

<details>
<summary><b>Deployment</b></summary>
<p>
This project wasn't setup with a specific web host in mind. Please follow the Next.js <a href="https://github.com/zeit/next.js/#production-deployment">deployment docs</a> to learn how to deploy your project to various hosts.
</p>
</details>

<details>
<summary><b>Other</b></summary>
<p>
  This project was created using <a href="https://divjoy.com?ref=readme_other">Divjoy</a>, the React codebase generator. You can find more info in the <a href="https://docs.divjoy.com">Divjoy Docs</a>.
</p>
</details>

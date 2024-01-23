## Introduction

- This project is built using Next.js and incorporates various features such as a chat function powered by OpenAI, authentication using Clerk, a profile page implementation, and the generation of new tours with OpenAI. Additionally, we utilize the Unsplash API for handling images, and all data is stored using Prisma.

- GPT-Genius: https://nextjs-gpt-genius.netlify.app

## Installation

- npm install

- Set up the necessary environment variables for OpenAI, Clerk, and Prisma.

```sh
- Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY =
CLERK_SECRET_KEY =
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/chat
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/chat
- OpenAI
OPENAI_API_KEY=
- Unsplash
UNSPLASH_API_KEY=

Put all the necessary environment variables in .env.local

- Prisma (put in .env file)
DATABASE_URL=
```

- npm run dev

## Create Next App

```sh
npx create-next-app@latest appName

```

## Libraries

```sh
npm install @clerk/nextjs@4.26.1 @prisma/client@5.5.2 @tanstack/react-query@5.8.1 @tanstack/react-query-devtools@5.8.1 axios@1.6.1  openai@4.14.2   react-hot-toast@2.4.1 react-icons@4.11.0
```

```sh
npm install -D @tailwindcss/typography@0.5.10  daisyui@3.9.4 prisma@5.5.2
```

## DaisyUI

- remove default code from globals.css
  tailwind.config.js

```js
{
plugins: [require('@tailwindcss/typography'), require('daisyui')],
}
```

## Clerk

(Clerk Docs)[https://clerk.com/]

- create account
- create new application
- complete Next.js setup

```sh
npm install @clerk/nextjs
```

```js
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = your_publishable_key;
CLERK_SECRET_KEY = your_secret_key;
```

Environment variables with this `NEXT_PUBLIC_` prefix are exposed to client-side JavaScript code, while those without the prefix are only accessible on the server-side and are not exposed to the client-side code.

```sh
NEXT_PUBLIC_
```

```js
const apiKey = process.env.NEXT_PUBLIC_API_KEY;
```

layout.js

```js
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

middleware.ts

```js
import { authMiddleware } from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
  publicRoutes: ["/"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

## Custom SignUp and SignIn Pages

- follow the docs and setup custom pages
- use clerk's component

app/sign-up/[[...sign-up]]/page.js

```js
import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <SignUp />
    </div>
  );
};
export default SignUpPage;
```

app/sign-in/[[...sign-in]]/page.js

```js
import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <SignIn />
    </div>
  );
};
export default SignInPage;
```

.env.local

```js
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/chat
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/chat
```

## React Icons

(React Icons )[https://react-icons.github.io/react-icons/]

```sh
npm install react-icons --save
```

```js
import { FaBeer } from 'react-icons/fa';

<FaBeer>

```

## ThemeToggle

- setup themes in tailwind.config.js

tailwind.config.js

```js
{
  daisyui: {
    themes: ['winter', 'dracula'],
  },
}

```

```js
"use client";

import { BsMoonFill, BsSunFill } from "react-icons/bs";
import { useState } from "react";

const themes = {
  winter: "winter",
  dracula: "dracula",
};

const ThemeToggle = () => {
  const [theme, setTheme] = useState(themes.winter);

  const toggleTheme = () => {
    const newTheme = theme === themes.winter ? themes.dracula : themes.winter;
    document.documentElement.setAttribute("data-theme", newTheme);
    setTheme(newTheme);
  };

  return (
    <button onClick={toggleTheme} className="btn btn-sm btn-outline">
      {theme === "winter" ? (
        <BsMoonFill className="h-4 w-4 " />
      ) : (
        <BsSunFill className="h-4 w-4" />
      )}
    </button>
  );
};
export default ThemeToggle;
```

## Add React-Hot-Toast Library

- setup app/providers.js
- import/add Toaster component
- wrap {children} in layout.js

app/providers.jsx

```js
"use client";
import { Toaster } from "react-hot-toast";
export default function Providers({ children }) {
  return (
    <>
      <Toaster position="top-center" />
      {children}
    </>
  );
}
```

app/layout.js

```js
<Providers>{children}</Providers>
```

## React Query

### Install

```sh
npm i @tanstack/react-query @tanstack/react-query-devtools

```

### Setup

```js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // the data will be considered fresh for 1 minute
      staleTime: 60 * 1000,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
```

### UseQuery

```js
const Items = () => {
  const { isPending, isError, data } = useQuery({
    queryKey: ["tasks"],
    // A query function can be literally any function that returns a promise.
    queryFn: () => axios.get("/someUrl"),
  });

  if (isPending) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error...</p>;
  }
  return (
    <div className="items">
      {data.taskList.map((item) => {
        return <SingleItem key={item.id} item={item} />;
      })}
    </div>
  );
};
export default Items;
```

### UseMutation

```js
const { mutate, isPending, data } = useMutation({
  mutationFn: (taskTitle) => axios.post("/", { title: taskTitle }),
  onSuccess: () => {
    // do something
  },
  onError: () => {
    // do something
  },
});

const handleSubmit = (e) => {
  e.preventDefault();
  mutate(newItemName);
};
```

## React Query and Next.js

- WE CAN USE SERVER ACTIONS 🚀🚀🚀🚀🚀🚀

  app/providers.jsx

```js
// In Next.js, this file would be called: app/providers.jsx
"use client";

// We can not useState or useRef in a server component, which is why we are
// extracting this part out into it's own file with 'use client' on top
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
export default function Providers({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 60 * 1000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-center" />
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

## OPENAI API

[Pricing](https://openai.com/pricing)

```sh
npm i openai
```

- create API KEY
- save in .env.local

```js
OPENAI_API_KEY=....
```

## Prompt

- Use shorter prompt for hosting purpose

```js
{
  "tour": {
    ...
   "stops": ["stop name ", "stop name","stop name"]
  }
}
```

```js
const query = `Find a exact ${city} in this exact ${country}.
If ${city} and ${country} exist, create a list of things families can do in this ${city},${country}. 
Once you have a list, create a one-day tour. Response should be  in the following JSON format: 
{
  "tour": {
    "city": "${city}",
    "country": "${country}",
    "title": "title of the tour",
    "description": "short description of the city and tour",
    "stops": ["short paragraph on the stop 1 ", "short paragraph on the stop 2","short paragraph on the stop 3"]
  }
}
"stops" property should include only three stops.
If you can't find info on exact ${city}, or ${city} does not exist, or it's population is less than 1, or it is not located in the following ${country},   return { "tour": null }, with no additional characters.`;
```

## Add Prisma

```sh
npm install prisma --save-dev
npm install @prisma/client
```

```sh
npx prisma init
```

## PlanetScale (use for database hosting)

## Model

```prisma
datasource db {
  provider     = "mysql"
  url          = env("DATABASE_URL")
  relationMode = "prisma"
}

generator client {
  provider = "prisma-client-js"
}

model Tour {
  id String @id @default(uuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  city String
  country String
  title String
  description String @db.Text
  image String? @db.Text
  stops Json
  @@unique([city, country])
}
```

```sh
npx prisma db push
```

```sh
npx prisma studio
```

@db.Text: This attribute is used to specify the type of the column in the underlying database. When you use @db.Text, you're telling Prisma that the particular field should be stored as a text column in the database. Text columns can store large amounts of string data, typically used for long-form text that exceeds the length limits of standard string columns. This is often used for descriptions, comments, JSON-formatted strings, etc.

@@unique: This attribute is used at the model level to enforce the uniqueness of a specific combination of fields within the database. In this case, @@unique([city, country]) ensures that no two rows in the table have the same combination of city and country. This means you can have multiple tours in the same city or country, but not multiple tours with the same city and country combination. It essentially acts as a composite unique constraint on the two fields.

## Setup prisma

utils/db.ts

```js
import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

## Images

- url are valid for 2 hours
- way more expensive than chat
- alternative: Unsplash API

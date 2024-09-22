# Line Me Up

## Description

This is a simple waitlist management system for restaurants, retail stores, or any other business that need visitors to line up for services. It allows visitors to add themselves to a waitlist at a kiosk or on their own mobile device. Multiple staffs can handle the waitlist simultaneously. The system will notify visitors when it's their turn.

Intro video: https://vimeo.com/manage/videos/1011820436

Line Me Up is built with [Supabase](https://supabase.io) as the backend and [refinejs](https://refine.dev) as the frontend.

## Installation

1. Clone the repository.

2. Prepare the backend Supabase. If you just want to test locally, using [Supabase CLI](https://supabase.com/docs/guides/cli):

   - `cd supabase`
   - `supabase start` and note the "API URL" and "anon key". You will need these to configure the frontend in the next step.
   - Open the `Studio URL` in your browser, and do the following: (TODO: automate this)
     - Create the first admin (owner) by going to Authenitcation -> Users -> Add user -> Create new user.
     - Trun on "Realtime" for the following tables: `station`, `visit`, `visitor` in Table Editor.

   A new testing admin will be created for you: `admin@supabase.io` and password: `supabase`.

3. Create a `.env` file (or `.env.local` file) in the root of the project.

   - `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` with the values from the previous step.
   - Optionally you can set `VITE_LOCATION_NAME` and `VITE_LOCATION_ADDRESS` to customize the location name and address displayed in the app.

4. Run `npm install` or `yarn install` to install the dependencies.

5. Run `npm dev` or `yarn dev` to start the frontend.

# FUTURE

- [ ] Add "Service" attribute to a visit (e.g. "Refund & Exchange", "Delivery", "Dinner", "Pickup", etc.)
- [ ] Support SMS
- [ ] CRUD stations
- [ ] Improve CRUD members
- [ ] Analytics

<template>
  <router-view />
</template>

<script>
  import getUser from './composables/getUser';
  import { auth } from './firebase/config';
  import { detect } from 'detect-browser';
  import { useRouter } from 'vue-router';

  export default {
    setup() {
      const router = useRouter();
      const { currentUser } = getUser();

      (() => {
        // === true required as null is evaluated as a satisfactory value
        if (localStorage.getItem('hasShownBrowserWarning') === true) return;

        localStorage.setItem('hasShownBrowserWarning', false);

        const browser = detect();
        const browserVersion = browser.version.split('.')[0];

        if ( browserVersion < 99 &&
          ((browser.name !== 'chrome') ||
            (browser.name !== 'chromium-edge'))
        ) {
          alert('Please use Chrome v99 or Edge v99 or higher for the best experience. ' +
            'This message will only display once');
        }

        localStorage.setItem('hasShownBrowserWarning', true);
      })();


      //global route guard that refreshes the user profile
      //before the router redirects to any new page
      router.beforeResolve( async () => {
        if(!currentUser.value) return;

        //must be called twice
        await auth.currentUser.reload();
        await auth.currentUser.reload();
      });
    }
  };
</script>

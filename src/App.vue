<template>
  <router-view />
</template>

<script>
  import { useRouter } from 'vue-router';
  import { auth } from './firebase/config';
  import getUser from './composables/getUser';

  export default {
    setup() {
      const router = useRouter();
      const { currentUser } = getUser();
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

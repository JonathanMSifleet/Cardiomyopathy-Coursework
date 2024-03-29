<template>
  <PageWrapper>
    <MDBModal
      id="deleteConfirmationModal"
      v-model="deleteConfirmationModal"
      tabindex="-1"
      labelledby="deleteConfirmationModalLabel"
    >
      <MDBModalHeader>
        <div>
          <MDBModalTitle
            id="deleteConfirmationModalLabel"
            :style="{ fontWeight: 'bold' }"
            :class="$style['card-header']"
          >
            Confirmation
          </MDBModalTitle>
        </div>
      </MDBModalHeader>

      <MDBModalBody> Are you sure you want to delete this row? </MDBModalBody>

      <MDBModalFooter>
        <MDBBtn color="primary" @click="deleteConfirmationModal = false">
          No
        </MDBBtn>
        <MDBBtn
          color="primary"
          @click="deleteExperimentalDataDoc(currentDocId)"
        >
          Yes
        </MDBBtn>
      </MDBModalFooter>
    </MDBModal>

    <MDBModal
      id="experimentalDataModal"
      v-model="experimentalDataModal"
      size="xl"
      tabindex="-1"
      labelledby="experimentalDataModalLabel"
      scrollable
      staticBackdrop
    >
      <MDBModalHeader>
        <div class="text-center">
          <MDBModalTitle
            id="experimentalDataModalLabel"
            :style="{ fontWeight: 'bold' }"
            :class="$style['card-header']"
          >
            Experimental Data
          </MDBModalTitle>
          <h4 class="text-muted mt-2" />
        </div>
      </MDBModalHeader>

      <MDBModalBody>
        <MDBTable variant="primary" striped>
          <tbody>
            <tr v-for="key in Object.entries(currentEntity)" :key="key[1]">
              <th scope="row" :style="{ fontWeight: 'bold' }">
                {{ mapKeyToWords(key[0]) }}
              </th>
              <td>
                {{ key[0] === "createdAt" ? key[1].toDate() : key[1] }}
              </td>
            </tr>
          </tbody>
        </MDBTable>
      </MDBModalBody>

      <MDBModalFooter>
        <MDBBtn color="primary" @click="experimentalDataModal = false">
          Close
        </MDBBtn>
      </MDBModalFooter>
    </MDBModal>
    <div
      class="
        login
        w-100
        p-4
        d-flex
        align-items-center
        justify-content-center
        mb-5
      "
      style="height: 70%"
    >
      <MDBCard :class="$style['authentication-card']" text="center">
        <MDBCardHeader :class="[$style['card-header'], 'mt-3']">
          User Profile
        </MDBCardHeader>
        <MDBCardBody>
          <MDBCardText>
            <form @submit.prevent="updateUser">
              <MDBRow>
                <MDBCol md="6">
                  <MDBInput
                    id="form2FirstName"
                    v-model="firstName"
                    type="text"
                    label="First Name"
                    wrapper-class="mb-4"
                    :maxlength="32"
                    :valueDefault="firstName"
                    required
                  />
                </MDBCol>
                <MDBCol md="6">
                  <MDBInput
                    id="form2LastName"
                    v-model="lastName"
                    type="text"
                    label="Last Name"
                    wrapper-class="mb-4"
                    :maxlength="32"
                    :valueDefault="lastName"
                    required
                  />
                </MDBCol>
              </MDBRow>
              <MDBInput
                id="form2Email"
                v-model="email"
                type="email"
                label="Email address"
                wrapper-class="mb-4"
                :maxlength="320"
                :valueDefault="email"
                disabled
              />
              <MDBInput
                id="form2Phone"
                v-model="phoneNumber"
                type="number"
                label="Phone Number"
                wrapper-class="mb-4"
                :maxlength="13"
                :valueDefault="phoneNumber"
                required
              />
              <MDBInput
                id="form2AddressLineOne"
                v-model.trim="addressLineOne"
                type="text"
                label="Address line 1"
                wrapper-class="mb-4"
                :maxlength="35"
                required
              />
              <MDBInput
                id="form2AddressLineTwo"
                v-model.trim="addressLineTwo"
                type="text"
                label="Address line 2"
                wrapper-class="mb-4"
                :maxlength="35"
              />
              <MDBInput
                id="form2city"
                v-model.trim="city"
                type="text"
                label="Town / city"
                wrapper-class="mb-4"
                :maxlength="35"
              />
              <MDBInput
                id="form2postcode"
                v-model.trim="postcode"
                type="text"
                label="Postcode"
                wrapper-class="mb-4"
                :maxlength="8"
              />

              <MDBBtn type="submit" color="primary">
                Update
              </MDBBtn>
            </form>
          </MDBCardText>
        </MDBCardBody>
      </MDBCard>
    </div>
    <MDBRow>
      <MDBCol md="12" class="text-center">
        <MDBBtn
          color="primary"
          :disabled="experimentalData.length === 0"
          @click="showCards"
        >
          <p
            :class="[
              cardsVisible
                ? 'animate__animated animate__flash'
                : 'animate__animated animate__headShake',
            ]"
          >
            {{
              cardsVisible
                ? "Hide Experimental Data"
                : "Display Experimental Data"
            }}
          </p>
        </MDBBtn>
      </MDBCol>
    </MDBRow>
    <MDBRow v-if="showCardContainer" class="ms-5 mt-5">
      <MDBCol
        v-for="entity in experimentalData"
        :key="entity.documentId"
        md="4"
      >
        <MDBCard
          text="center"
          class="mb-5 animate__animated"
          :class="[cardsVisible ? ' animate__bounceInUp' : ' animate__hinge']"
        >
          <MDBCardHeader :style="{ fontWeight: 'bold' }">
            Gene Mutation: {{ entity.GeneMutation }}
          </MDBCardHeader>
          <MDBCardBody>
            <MDBCardText />
            <MDBBtn
              color="primary"
              @click="toggleExperimentalDataModal(entity)"
            >
              View
            </MDBBtn>
            <MDBBtn
              :class="$style['delete-btn']"
              color="danger"
              @click="toggleModal(entity.documentId)"
            >
              <MDBIcon icon="trash" />
            </MDBBtn>
          </MDBCardBody>
          <MDBCardFooter class="text-muted">
            {{ dateTime(entity.createdAt.toDate()) }}
          </MDBCardFooter>
        </MDBCard>
      </MDBCol>
    </MDBRow>
  </PageWrapper>
</template>

<script>
  import PageWrapper from '../../components/PageWrapper/PageWrapper.vue';
  import getUser from '../../composables/getUser';
  import mapKeyToWords from '../../utils/mapKeyToWords';
  import store from '../../services/store';
  import { auth } from '../../firebase/config';
  import { onMounted, ref, watchEffect } from 'vue';
  import { updateProfile } from 'firebase/auth';
  import { useRouter } from 'vue-router';
  import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    updateDoc,
    where
  } from 'firebase/firestore';
  import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardFooter,
    MDBCardHeader,
    MDBCardText,
    MDBCol,
    MDBIcon,
    MDBInput,
    MDBModal,
    MDBModalBody,
    MDBModalFooter,
    MDBModalHeader,
    MDBModalTitle,
    MDBRow,
    MDBTable
  } from 'mdb-vue-ui-kit';

  export default {
    components: {
      MDBBtn,
      MDBCard,
      MDBCardBody,
      MDBCardFooter,
      MDBCardHeader,
      MDBCardText,
      MDBCol,
      MDBIcon,
      MDBInput,
      MDBModal,
      MDBModalBody,
      MDBModalFooter,
      MDBModalHeader,
      MDBModalTitle,
      MDBRow,
      MDBTable,
      PageWrapper
    },
    setup() {
      const addressLineOne = ref('');
      const addressLineTwo = ref(null);
      const cardsVisible = ref(false);
      const city = ref('');
      const currentDocId = ref('');
      const currentEntity = ref([]);
      const deleteConfirmationModal = ref(false);
      const email = ref('');
      const experimentalData = ref([]);
      const experimentalDataModal = ref(false);
      const firstName = ref('');
      const lastName = ref('');
      const phoneNumber = ref('');
      const postcode = ref('');
      const router = useRouter();
      const showCardContainer = ref(false);
      const { currentUser } = getUser();

      onMounted(() => {
        userIdentity();
        getExperimentalDataByUserId();
      });

      const userIdentity = async () => {
        const docRef = doc(await store.database, 'users', currentUser.value.uid);
        getDoc(docRef).then((docSnap) => {
          if (docSnap.exists()) {
            firstName.value = docSnap.data().firstName;
            lastName.value = docSnap.data().lastName;
            addressLineOne.value = docSnap.data().address.addressLineOne;
            addressLineTwo.value = docSnap.data().address.addressLineTwo;
            city.value = docSnap.data().address.city;
            postcode.value = docSnap.data().address.postcode;
            email.value = docSnap.data().email;
            phoneNumber.value = docSnap.data().phone;

            if (process.env.DEVELOPMENT) console.log('Document data:', docSnap.data());
          } else {
            if (process.env.DEVELOPMENT) console.log('No such document!');
          }
        });
      };

      const updateUser = async () => {
        const currentUserRef = doc(
          await store.database,
          'users',
          currentUser.value.uid
        );

        await updateDoc(currentUserRef, {
          firstName: firstName.value,
          lastName: lastName.value,
          address: {
            addressLineOne: addressLineOne.value,
            addressLineTwo: addressLineTwo.value,
            city: city.value,
            postcode: postcode.value
          },
          email: email.value,
          phone: phoneNumber.value
        });

        //set user display name
        try {
          updateProfile(auth.currentUser, {
            displayName: firstName.value
          })
            .then(alert('User profile updated.'))
            .then(() => {
              router.push('/');
            });
        } catch (error) {
          console.error(error);
        }
      };

      const getExperimentalDataByUserId = async () => {
        const firestoreQuery = query(
          collection(await store.database, 'hcmData'),
          where('userId', '==', currentUser.value.uid)
        );

        const querySnapshot = await getDocs(firestoreQuery);
        querySnapshot.forEach((doc) => {
          experimentalData.value.push({ documentId: doc.id, ...doc.data() });
          if (process.env.DEVELOPMENT) console.log(doc.id, ' => ', doc.data());
        });
      };

      const deleteExperimentalDataDoc = async (docId) => {
        //Update the deleted timestamp
        const docRef = doc(await store.database, 'hcmData', docId);

        // Update the timestamp field with the value from the server
        await updateDoc(docRef, {
          deletedAt: serverTimestamp()
        });

        //Delete the document from the database
        await deleteDoc(doc(await store.database, 'hcmData', docId));
        await (alert('Data has been successfully deleted.'), router.push('/'));
      };

      const toggleModal = (docId) => {
        deleteConfirmationModal.value = !deleteConfirmationModal.value;
        currentDocId.value = docId;
      };

      const showCards = () => {
        showCardContainer.value = true;
        cardsVisible.value = !cardsVisible.value;
      };

      const toggleExperimentalDataModal = (entity) => {
        experimentalDataModal.value = !experimentalDataModal.value;
        delete entity.deletedAt;
        delete entity.documentId;
        delete entity.userId;
        delete entity.createdByUser;

        currentEntity.value = entity;
        if (process.env.DEVELOPMENT) console.log(currentEntity.value);
      };

      watchEffect(() => {
        if (!currentUser.value) router.push('/login');
      });

      const dateTime = (value) =>
        new Date(value).toLocaleDateString('en-GB', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

      return { cardsVisible, currentDocId, currentEntity, dateTime, deleteConfirmationModal, deleteExperimentalDataDoc,
               email, experimentalData, experimentalDataModal, firstName, getExperimentalDataByUserId, lastName,
               mapKeyToWords, phoneNumber, addressLineOne, addressLineTwo, city, postcode, showCardContainer, showCards,
               toggleExperimentalDataModal, toggleModal, updateUser, userIdentity };
    }
  };
</script>

<style lang="scss" module scoped>
  @import "../../assets/styles/Authentication.scss";
  @import "./UserProfile.module.scss";
</style>

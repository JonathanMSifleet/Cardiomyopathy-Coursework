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
        <MDBCardHeader>User Profile</MDBCardHeader>
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
                    maxlength="20"
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
                    maxlength="20"
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
                maxlength="30"
                :valueDefault="email"
                disabled
              />
              <MDBInput
                id="form2Phone"
                v-model="phoneNumber"
                type="number"
                label="Phone Number"
                wrapper-class="mb-4"
                maxlength="15"
                :valueDefault="phoneNumber"
                required
              />
              <MDBInput
                id="form2Address"
                v-model="address"
                type="text"
                label="Address"
                wrapper-class="mb-4"
                maxlength="35"
                :valueDefault="address"
                required
              />

              <MDBBtn type="submit" color="primary">
                Update
              </MDBBtn>
            </form>
          </MDBCardText>
        </MDBCardBody>
      </MDBCard>
    </div>

    <div class="d-flex justify-content-center mt-5">
      <MDBRow>
        <MDBCol md="12">
          <MDBBtn
            :class="[showTable ? $style['display-tbl-btn'] : $style['hide-tbl-btn']]"
            color="primary"
            @click="showTable = !showTable"
          >
            {{ showTable ? 'Hide Experimental Data' : 'Display Experimental Data' }}
          </MDBBtn>
        </MDBCol>
      </MDBRow>
    </div>
    <div class="d-flex justify-content-center mt-5">
      <MDBRow>
        <table
          v-if="experimentalData.length > 0 && showTable"
          :class="[$style.Table, $style['styled-table']]"
        >
          <thead>
            <tr>
              <th v-for="header in tableHeaders" :key="header" scope="col">
                {{ mapKeyToWords(header) }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="entity in experimentalData" :key="entity.documentId">
              <td>{{ entity.GeneMutation }}</td>
              <td>{{ entity.ledv == undefined ? "N/A" : entity.ledv }}</td>
              <td>{{ entity.redv == undefined ? "N/A" : entity.redv }}</td>
              <td>{{ entity.lesv == undefined ? "N/A" : entity.lesv }}</td>
              <td>{{ entity.resv == undefined ? "N/A" : entity.resv }}</td>
              <td>{{ entity.lvef == undefined ? "N/A" : entity.lvef }}</td>
              <td>{{ entity.rvef == undefined ? "N/A" : entity.rvef }}</td>
              <td>{{ entity.lvmass == undefined ? "N/A" : entity.lvmass }}</td>
              <td>{{ entity.rvmass == undefined ? "N/A" : entity.rvmass }}</td>
              <td>{{ entity.lsv == undefined ? "N/A" : entity.lsv }}</td>
              <td>{{ entity.rsv == undefined ? "N/A" : entity.rsv }}</td>
              <td>{{ entity.gender == undefined ? "N/A" : entity.gender }}</td>
              <td>
                {{ entity.fibrosis == undefined ? "N/A" : entity.fibrosis }}
              </td>
              <td>
                {{ entity.ageAtMri == undefined ? "N/A" : entity.ageAtMri }}
              </td>
              <td>
                {{ entity.apicalHcm == undefined ? "N/A" : entity.apicalHcm }}
              </td>
              <td>
                {{
                  entity.suddenCardiacDeath == undefined
                    ? "N/A"
                    : entity.suddenCardiacDeath
                }}
              </td>
              <td>
                {{
                  entity.hypertension == undefined ? "N/A" : entity.hypertension
                }}
              </td>
              <td>
                {{ entity.diabetes == undefined ? "N/A" : entity.diabetes }}
              </td>
              <td>
                {{ entity.myectomy == undefined ? "N/A" : entity.myectomy }}
              </td>
              <td>
                {{ entity.createdAt.toDate() }}
              </td>
              <td>
                <MDBBtn
                  :class="$style['delete-btn']"
                  color="danger"
                  @click="toggleModal(entity.documentId)"
                >
                  <MDBIcon icon="trash" />
                </MDBBtn>
              </td>
            </tr>
          </tbody>
        </table>
      </MDBRow>
    </div>
  </PageWrapper>
</template>


<script>
  import PageWrapper from '../../components/PageWrapper/PageWrapper.vue';
  import getUser from '../../composables/getUser';
  import mapKeyToWords from '../../utils/mapKeyToWords';
  import store from '../../services/store';
  import { auth } from '../../firebase/config';
  import { onMounted, reactive, ref, watchEffect } from 'vue';
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
    MDBRow
  } from 'mdb-vue-ui-kit';

  export default {
    components: {
      MDBBtn,
      MDBCard,
      MDBCardBody,
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
      PageWrapper
    },
    setup() {
      const { currentUser } = getUser();
      const firstName = ref('');
      const lastName = ref('');
      const address = ref('');
      const email = ref('');
      const phoneNumber = ref('');
      const experimentalData = ref([]);
      const deleteConfirmationModal = ref(false);
      const currentDocId = ref('');
      const router = useRouter();
      const showTable = ref(false);
      const tableHeaders = reactive([
        'Gene Mutation',
        'ledv',
        'redv',
        'lesv',
        'resv',
        'lvef',
        'rvef',
        'lvmass',
        'lsv',
        'rsv',
        'Gender',
        'Fibrosis',
        'Age at MRI',
        'Apical HCM',
        'Sudden Cardiac Death',
        'Hypertension',
        'Diabetes',
        'Myectomy',
        'Date Created',
        'Actions'
      ]);

      onMounted(() => {
        userIdentity();
        getExperimentalDataByUserId();
      });

      const userIdentity = async () => {
        const docRef = doc(await store.database, 'users', currentUser.value.uid);
        getDoc(docRef).then((docSnap) => {
          if (!docSnap.exists()) return;

          firstName.value = docSnap.data().firstName;
          lastName.value = docSnap.data().lastName;
          address.value = docSnap.data().address;
          email.value = docSnap.data().email;
          phoneNumber.value = docSnap.data().phone;

          console.log('Document data:', docSnap.data());
        });
      };

      const updateUser = async () => {
        const currentUserRef = doc(
          await store.database,
          'users',
          currentUser.value.uid
        );

        // Set the "capital" field of the city 'DC'
        await updateDoc(currentUserRef, {
          firstName: firstName.value,
          lastName: lastName.value,
          address: address.value,
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
          // doc.data() is never undefined for query doc snapshots
          experimentalData.value.push({ documentId: doc.id, ...doc.data() });
          console.log(doc.id, ' => ', doc.data());
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
        await deleteDoc(doc(await store.database, 'hcmData', docId))
          .then(alert('Data has been successfully deleted.'))
          .then(router.push('/'));
      };

      const toggleModal = (docId) => {
        deleteConfirmationModal.value = !deleteConfirmationModal.value;
        currentDocId.value = docId;
      };

      watchEffect(() => {
        if (!currentUser.value) router.push('/login');
      });

      return { address, currentDocId, deleteConfirmationModal, deleteExperimentalDataDoc, email, experimentalData,
               firstName, getExperimentalDataByUserId, lastName, mapKeyToWords, phoneNumber, showTable, tableHeaders,
               toggleModal, updateUser, userIdentity };
    }
  };
</script>

<style lang="scss" module scoped>
  @import "../../assets/styles/Authentication.scss";
  @import "./UserProfile.module.scss";
</style>

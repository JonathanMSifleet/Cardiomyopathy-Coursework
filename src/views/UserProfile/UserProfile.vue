<template>
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
      <MDBBtn color="primary" @click="deleteExperimentalDataDoc(currentDocId)">
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

            <MDBBtn type="submit" color="primary"> Update </MDBBtn>
          </form>
        </MDBCardText>
      </MDBCardBody>
    </MDBCard>
  </div>

  <div class="d-flex justify-content-center mt-5">
    <MDBRow class="mb-5">
      <MDBCol md="12">
        <MDBBtn color="primary" @click="toggleTable"
          >Display Experimental Data</MDBBtn
        >
      </MDBCol>
    </MDBRow>
    <MDBRow>
      <table
        :class="$style['styled-table']"
        v-if="experimentalData.length > 0 && showTable"
      >
        <thead>
          <tr>
            <th scope="col">Gene Mutation</th>
            <th scope="col">LEDV</th>
            <th scope="col">REDV</th>
            <th scope="col">LESV</th>
            <th scope="col">RESV</th>
            <th scope="col">LVEF</th>
            <th scope="col">RVEF</th>
            <th scope="col">LVMASS</th>
            <th scope="col">RVMASS</th>
            <th scope="col">LSV</th>
            <th scope="col">RSV</th>
            <th scope="col">Gender</th>
            <th scope="col">Fibrosis</th>
            <th scope="col">Age at MRI</th>
            <th scope="col">Apical HCM</th>
            <th scope="col">Sudden Cardiac Death</th>
            <th scope="col">Hypertension</th>
            <th scope="col">Diabetes</th>
            <th scope="col">Myectomy</th>
            <th scope="col">Actions</th>
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
              <MDBBtn @click="toggleModal(entity.documentId)" color="danger">
                <!-- <MDBIcon icon="trash" size="5x" /> -->
                Delete
              </MDBBtn>
            </td>
          </tr>
        </tbody>
      </table>
    </MDBRow>
  </div>
</template>


<script>
import { ref } from "vue";
import getUser from "../../composables/getUser";
import { auth } from "../../firebase/config";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import store from "../../services/store";
import { useRouter } from "vue-router";
import {
  MDBModal,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBBtn,
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardFooter,
  MDBTable,
  MDBIcon,
} from "mdb-vue-ui-kit";
export default {
  components: {
    MDBModal,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter,
    MDBRow,
    MDBCol,
    MDBInput,
    MDBBtn,
    MDBCard,
    MDBCardHeader,
    MDBCardBody,
    MDBCardTitle,
    MDBCardText,
    MDBCardFooter,
    MDBTable,
    MDBIcon,
  },
  mounted() {
    this.userIdentity();
    this.getExperimentalDataByUserId();
  },
  setup() {
    const { currentUser } = getUser();
    const firstName = ref("");
    const lastName = ref("");
    const address = ref("");
    const email = ref("");
    const phoneNumber = ref("");
    const experimentalData = ref([]);
    const deleteConfirmationModal = ref(false);
    const currentDocId = ref("");
    const router = useRouter();
    const showTable = ref(false);

    async function userIdentity() {
      const docRef = doc(await store.database, "users", currentUser.value.uid);
      getDoc(docRef).then((docSnap) => {
        if (docSnap.exists()) {
          firstName.value = docSnap.data().firstName;
          lastName.value = docSnap.data().lastName;
          address.value = docSnap.data().address;
          email.value = docSnap.data().email;
          phoneNumber.value = docSnap.data().phone;

          console.log("Document data:", docSnap.data());
        } else {
          console.log("No such document!");
        }
      });
    }

    async function updateUser() {
      const currentUserRef = doc(
        await store.database,
        "users",
        currentUser.value.uid
      );

      // Set the "capital" field of the city 'DC'
      await updateDoc(currentUserRef, {
        firstName: firstName.value,
        lastName: lastName.value,
        address: address.value,
        email: email.value,
        phone: phoneNumber.value,
      });

      //set user display name
      try {
        updateProfile(auth.currentUser, {
          displayName: firstName.value,
        });
      } catch (error) {
        console.log(error);
      }
      alert("User profile updated.");
      router.push("/");
    }

    async function getExperimentalDataByUserId() {
      const q = query(
        collection(await store.database, "hcmData"),
        where("userId", "==", currentUser.value.uid)
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        experimentalData.value.push({ documentId: doc.id, ...doc.data() });
        console.log(doc.id, " => ", doc.data());
      });
    }

    async function deleteExperimentalDataDoc(docId) {
      console.log(docId);
      await deleteDoc(doc(await store.database, "hcmData", docId)).then(alert("Data has been successfully deleted.")).then(router.push('/'));
    }

    const toggleModal = (docId) => {
      deleteConfirmationModal.value = !deleteConfirmationModal.value;
      currentDocId.value = docId;
    };

    const toggleTable = () => {
      showTable.value = !showTable.value;
    };
    return {
      userIdentity,
      updateUser,
      getExperimentalDataByUserId,
      deleteExperimentalDataDoc,
      toggleModal,
      toggleTable,
      deleteConfirmationModal,
      experimentalData,
      firstName,
      lastName,
      email,
      address,
      phoneNumber,
      currentDocId,
      showTable,
    };
  },
};
</script>

<style lang="scss" scoped module>
@import "../../assets/styles/Authentication.scss";
@import "./UserProfile.module.scss";
</style>
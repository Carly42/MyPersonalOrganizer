import { assert } from "chai";
import { shallowMount, mount, createLocalVue } from "@vue/test-utils";
import Participants from "@/components/Participants.vue";
import store from "@/store";
import Vuex from "vuex";

describe("Participants Logic", () => {
  let localVue;
  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(Vuex);
    global.alert = message => {
      console.log(message);
    };
  });
  it("Validate Data with Empty Fields", () => {
    const wrapper = shallowMount(Participants);
    wrapper.vm.$data.name = "";
    wrapper.vm.$data.contactNumber = "";
    const isValid = wrapper.vm._validateFields();
    assert.isFalse(isValid);
  });
  it("Validate Data with Correct Data", () => {
    const wrapper = shallowMount(Participants);
    wrapper.vm.$data.name = "TestValidate";
    wrapper.vm.$data.contactNumber = "70777777";
    const isValid = wrapper.vm._validateFields();
    assert.isTrue(isValid);
  });
  it("Create New Participant with Missing Fields", () => {
    const wrapper = mount(Participants, {
      store,
      localVue
    });
    wrapper.vm.$data.name = "";
    wrapper.vm.$data.contactNumber = "";
    const initialLength = wrapper.vm.$store.state.participants.length;
    wrapper.vm.createNewParticipant();
    assert.equal(initialLength, wrapper.vm.$store.state.participants.length);
  });
  it("Create New Participant with Correct Data", () => {
    const wrapper = mount(Participants, {
      store,
      localVue
    });
    wrapper.vm.$data.name = "TestCreate";
    wrapper.vm.$data.contactNumber = "70777777";
    const initialLength = wrapper.vm.$store.state.participants.length;
    wrapper.vm.createNewParticipant();
    assert.equal(
      initialLength + 1,
      wrapper.vm.$store.state.participants.length
    );
  });
  it("Update Participant", () => {
    const wrapper = mount(Participants, {
      store,
      localVue
    });
    wrapper.vm.$data.name = "TestUpdate";
    wrapper.vm.$data.contactNumber = "70777777";
    wrapper.vm.createNewParticipant();
    const idToUpdate = wrapper.vm.$store.state.participants.find(
      participant => participant.name === "TestUpdate"
    ).participantId;
    const oldParticipant = wrapper.vm.$store.state.participants.find(
      participant => participant.participantId === idToUpdate
    ).name;
    assert.equal(oldParticipant, "TestUpdate");
    wrapper.vm.$data.participantId = idToUpdate;
    wrapper.vm.$data.name = "Updated";
    wrapper.vm.$data.contactNumber = "70777777";
    wrapper.vm.modifyParticipant();
    const updatedParticipant = wrapper.vm.$store.state.participants.find(
      participant => participant.participantId === idToUpdate
    ).name;
    assert.equal(updatedParticipant, "Updated");
  });
  it("Add Participant to an Appointment", () => {
    const wrapper = mount(Participants, {
      store,
      localVue
    });
    let allAppointments = wrapper.vm.$store.state.scheduledAppointments.concat(
      wrapper.vm.$store.state.recursiveAppointments
    );
    wrapper.vm.$data.name = "TestAddingToAppointment";
    wrapper.vm.$data.participantId = "PART-5";
    wrapper.vm.$data.contactNumber = "70777777";
    wrapper.vm.$data.appointmentCode = "SCH-1";
    const actualLength = allAppointments.find(
      appointment => appointment.code === "SCH-1"
    ).participants.length;
    wrapper.vm.pushParticipantToAppointment();
    assert.equal(
      actualLength + 1,
      allAppointments.find(appointment => appointment.code === "SCH-1")
        .participants.length
    );
  });
  it("Remove Participant from Appointment", () => {
    const wrapper = mount(Participants, {
      store,
      localVue
    });
    let allAppointments = wrapper.vm.$store.state.scheduledAppointments.concat(
      wrapper.vm.$store.state.recursiveAppointments
    );
    wrapper.vm.$data.name = "TestDeleteFromAppointment";
    wrapper.vm.$data.participantId = "PART-5";
    wrapper.vm.$data.contactNumber = "70777777";
    wrapper.vm.$data.appointmentCode = "SCH-1";
    const actualLength = allAppointments.find(
      appointment => appointment.code === "SCH-1"
    ).participants.length;
    wrapper.vm.removeParticipantFromAppointment();
    assert.equal(
      actualLength - 1,
      allAppointments.find(appointment => appointment.code === "SCH-1")
        .participants.length
    );
  });
  it("Delete Participant with no Future Appointment", () => {});
  it("Delete Participant with a Future Appointment", () => {});
});

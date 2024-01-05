// REQUIRE
import request from "supertest";
import { expect } from "chai";

// MY URL FOR REQUEST
const app = "http://localhost:3000";

// TEST FOR FRIEND
describe("EVENT", () => {
  let eventId;
  const ownerUser = 1;

  it("créer un event", async () => {
    const response = await request(app)
      .post(`/user/${ownerUser}/events/`)
      .send({
        theme: "Test_theme_name",
        date: "2024-01-01",
        time: "20:30:00",
        place: "Test_place_name",
        nb_people: 2,
        invited_users_ids: [3, 4],
        invited_crews_ids: [2],
      })
      .expect(200);

    const user = response.body;
    eventId = user.event_id;

    // est-ce un objet ?
    expect(user).to.be.an("object");

    // les clefs
    expect(user).to.have.property("event_id");
    expect(user).to.have.property("theme");
    expect(user).to.have.property("date");
    expect(user).to.have.property("event_time");
    expect(user).to.have.property("place");
    expect(user).to.have.property("nb_people");
    expect(user).to.have.property("invited_users");
  });

  it("récupérer un event d'un user", async () => {
    const response = await request(app)
      .get(`/user/${ownerUser}/events/${eventId}`)
      .expect(200);
    const user = response.body;

    // est-ce un objet ?
    expect(user).to.be.an("object");

    // les clefs
    expect(user).to.have.property("event_id");
    expect(user).to.have.property("theme");
    expect(user).to.have.property("date");
    expect(user).to.have.property("event_time");
    expect(user).to.have.property("place");
    expect(user).to.have.property("nb_people");
    expect(user).to.have.property("invited_users");
  });

  it("modifier un event", async () => {
    const response = await request(app)
      .patch(`/user/${ownerUser}/events/${eventId}`)
      .send({
        userId: ownerUser,
        eventId: eventId,
        theme: "Test_theme_name_changed",
        userIds: [1, 2, 3],
      })
      .expect(200);

    const user = response.body;

    // est-ce un objet ?
    expect(user).to.be.an("object");

    // vérification des clefs
    expect(user).to.have.property("event_id");
    expect(user).to.have.property("theme");
    expect(user).to.have.property("date");
    expect(user).to.have.property("event_time");
    expect(user).to.have.property("place");
    expect(user).to.have.property("nb_people");
    expect(user).to.have.property("invited_users");

    // vérification des valeurs
    expect(user.theme).to.equal("Test_theme_name_changed");
  });

  it("récupérer tous les event d'un user", async () => {
    const response = await request(app)
      .get(`/user/${ownerUser}/events/`)
      .expect(200);
    const users = response.body[0];

    // est-ce un objet ?
    expect(users).to.be.an("object");

    // les clefs
    expect(users).to.have.property("event_id");
    expect(users).to.have.property("theme");
    expect(users).to.have.property("date");
    expect(users).to.have.property("event_time");
    expect(users).to.have.property("place");
    expect(users).to.have.property("nb_people");
    expect(users).to.have.property("invited_users");
  });

  it("supprimer un event", async () => {
    const response = await request(app)
      .delete(`/user/${ownerUser}/events`)
      .send({
        userId: ownerUser,
        eventId: eventId,
      });
    expect(response.status).to.equal(200);
  });
});

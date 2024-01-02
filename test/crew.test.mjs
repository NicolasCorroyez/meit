// REQUIRE
import request from "supertest";
import { expect } from "chai";

// MY URL FOR REQUEST
const app = "http://localhost:3000";

// TEST FOR FRIEND
describe("CREW", () => {
  let crewId;
  const ownerUser = 1;

  it("créer un crew", async () => {
    const response = await request(app)
      .post(`/user/${ownerUser}/crews/`)
      .send({
        crew_name: "Test_crew_name",
        crew_picture: "Test_picture_path",
        added_friends: [1, 2, 3, 4],
      })
      .expect(200);

    const user = response.body;
    crewId = user.crew_id;

    // est-ce un objet ?
    expect(user).to.be.an("object");

    // les clefs
    expect(user).to.have.property("crew_id");
    expect(user).to.have.property("crew_name");
    expect(user).to.have.property("crew_picture");
    expect(user).to.have.property("users");
  });

  it("récupérer un crew d'un user", async () => {
    const response = await request(app)
      .get(`/user/${ownerUser}/crews/${crewId}`)
      .expect(200);
    const user = response.body;

    // est-ce un objet ?
    expect(user).to.be.an("object");

    // les clefs
    expect(user).to.have.property("crew_id");
    expect(user).to.have.property("crew_name");
    expect(user).to.have.property("crew_picture");
    expect(user).to.have.property("invited_users");
  });

  it("modifier un crew", async () => {
    const response = await request(app)
      .patch(`/user/${ownerUser}/crews/${crewId}`)
      .send({
        userId: ownerUser,
        crewId: crewId,
        picture: "Test_picture_path_changed",
        name: "Test_crew_name_changed",
        membersId: [1, 2],
      })
      .expect(200);

    const user = response.body;

    // est-ce un objet ?
    expect(user).to.be.an("object");

    // vérification des clefs
    expect(user).to.have.property("crew_id");
    expect(user).to.have.property("name");
    expect(user).to.have.property("picture");
    expect(user).to.have.property("user_id");
    expect(user).to.have.property("members");

    // vérification des valeurs
    expect(user.picture).to.equal("Test_picture_path_changed");
    expect(user.name).to.equal("Test_crew_name_changed");
  });

  it("récupérer tous les crew d'un user", async () => {
    const response = await request(app)
      .get(`/user/${ownerUser}/crews/`)
      .expect(200);
    const users = response.body;

    // est-ce un objet ?
    expect(users[0]).to.be.an("object");

    // les clefs
    expect(users[0]).to.have.property("crew_id");
    expect(users[0]).to.have.property("crew_name");
    expect(users[0]).to.have.property("crew_picture");
    expect(users[0]).to.have.property("users_in_crew");
  });

  it("supprimer un crew", async () => {
    const response = await request(app)
      .delete(`/user/${ownerUser}/crews`)
      .send({
        userId: ownerUser,
        crew_id_param: crewId,
      });
    expect(response.status).to.equal(200);
  });
});

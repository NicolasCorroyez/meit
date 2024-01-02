// REQUIRE
import request from "supertest";
import { expect } from "chai";

// MY URL FOR REQUEST
const app = "http://localhost:3000";

// TEST FOR USER
describe("USER", () => {
  let userId;

  it("créer un user", async () => {
    const response = await request(app)
      .post("/user")
      .send({
        nickname: "Testing_code_nickname",
        firstname: "Testing_code_firstname",
        lastname: "Testing_code_lastname",
        device: "Testing_code_device",
        picture: "Testing_code_picture",
        role: "member",
      })
      .expect(200);

    const user = response.body;
    userId = user.id;

    // est-ce un objet ?
    expect(user).to.be.an("object");

    // les clefs
    expect(user).to.have.property("id");
    expect(user).to.have.property("nickname");
    expect(user).to.have.property("firstname");
    expect(user).to.have.property("lastname");
    expect(user).to.have.property("device");
    expect(user).to.have.property("picture");
    expect(user).to.have.property("role");
  });

  it("récupérer un user", async () => {
    const response = await request(app).get(`/user/${userId}`).expect(200);
    const user = response.body;

    // est-ce un objet ?
    expect(user).to.be.an("object");

    // les clefs
    expect(user).to.have.property("id");
    expect(user).to.have.property("nickname");
    expect(user).to.have.property("firstname");
    expect(user).to.have.property("lastname");
    expect(user).to.have.property("device");
    expect(user).to.have.property("picture");
    expect(user).to.have.property("role");
  });

  it("modifier un user", async () => {
    const response = await request(app)
      .patch(`/user/${userId}`)
      .send({
        id: userId,
        nickname: "Testing_code_changed_nickname",
        firstname: "Testing_code_changed_firstname",
        lastname: "Testing_code_changed_lastname",
        device: "Testing_code_changed_device",
        picture: "Testing_code_changed_picture",
        role: "member",
      })
      .expect(200);

    const user = response.body;

    // est-ce un objet ?
    expect(user).to.be.an("object");

    // vérification des clefs
    expect(user).to.have.property("id");
    expect(user).to.have.property("nickname");
    expect(user).to.have.property("firstname");
    expect(user).to.have.property("lastname");
    expect(user).to.have.property("device");
    expect(user).to.have.property("picture");
    expect(user).to.have.property("role");

    // vérification des valeurs
    expect(user.nickname).to.equal("Testing_code_changed_nickname");
    expect(user.firstname).to.equal("Testing_code_changed_firstname");
    expect(user.device).to.equal("Testing_code_changed_device");
  });

  it("supprimer un user", async () => {
    const response = await request(app).delete(`/user/${userId}`).send({
      id: userId,
    });
    expect(response.status).to.equal(200);
  });
});

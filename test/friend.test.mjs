// REQUIRE
import request from "supertest";
import { expect } from "chai";

// MY URL FOR REQUEST
const app = "http://localhost:3000";

// TEST FOR FRIEND
describe("FRIEND", () => {
  let userId;
  const ownerUser = 1;
  const newFriend = 5;

  it("créer un lien", async () => {
    const response = await request(app)
      .post(`/user/${ownerUser}/friends/`)
      .send({
        friendId: newFriend,
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

  it("récupérer un amis d'un user", async () => {
    const response = await request(app)
      .get(`/user/${ownerUser}/friends/${userId}`)
      .expect(200);
    const user = response.body;

    // est-ce un objet ?
    expect(user).to.be.an("object");

    // les clefs
    expect(user).to.have.property("contact_id");
    expect(user).to.have.property("friend_id");
    expect(user).to.have.property("friend_nickname");
    expect(user).to.have.property("friend_firstname");
    expect(user).to.have.property("friend_lastname");
    expect(user).to.have.property("friend_picture");
  });

  it("récupérer tous les amis d'un user", async () => {
    const response = await request(app)
      .get(`/user/${ownerUser}/friends/`)
      .expect(200);
    const users = response.body;

    // est-ce un objet ?
    expect(users[0]).to.be.an("object");

    // les clefs
    expect(users[0]).to.have.property("friend_id");
    expect(users[0]).to.have.property("friend_nickname");
    expect(users[0]).to.have.property("friend_firstname");
    expect(users[0]).to.have.property("friend_lastname");
    expect(users[0]).to.have.property("friend_picture");
  });

  it("supprimer un lien", async () => {
    const response = await request(app)
      .delete(`/user/${ownerUser}/friends`)
      .send({
        friendId: userId,
      });
    expect(response.status).to.equal(200);
  });
});
